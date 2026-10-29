// Fully offline audio cues: beeps via Web Audio API (no sound files), optional speech via the
// browser's built-in speechSynthesis (also offline — no network calls).

let soundEnabled = true;
function setSoundEnabled(v) { soundEnabled = v; }

let audioCtx = null;
function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function beep(freq = 880, durationMs = 120, volume = 0.2) {
  if (!soundEnabled) return;
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain).connect(c.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationMs / 1000);
    osc.stop(c.currentTime + durationMs / 1000 + 0.02);
  } catch (e) { /* audio not available, ignore */ }
}

const Sound = {
  tick: () => beep(660, 60, 0.08),
  go: () => beep(880, 160, 0.25),
  rest: () => beep(440, 160, 0.2),
  countdown: () => beep(740, 90, 0.18),
  done: () => { beep(660, 120, 0.2); setTimeout(() => beep(990, 180, 0.22), 140); },
};

function speak(text, enabled) {
  if (!enabled || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  } catch (e) { /* speech not available, ignore */ }
}

let wakeLockRef = null;
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) wakeLockRef = await navigator.wakeLock.request("screen");
  } catch (e) { /* not supported or denied, ignore */ }
}
function releaseWakeLock() {
  if (wakeLockRef) { wakeLockRef.release().catch(() => {}); wakeLockRef = null; }
}
