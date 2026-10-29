// Local-first progress storage. Everything lives in localStorage so the app works fully
// offline. Export/Import let you back the data up anywhere you like (Drive, email, USB —
// whatever "remote" means to you) until a live sync target is wired up later.

const STORAGE_KEY = "yayog_progress_v1";

function defaultState() {
  return {
    level: null,              // 'basic' | 'first' | 'master' | 'chief'
    currentWeek: 1,           // 1-10
    currentDayIndex: 0,       // index into that week's days array
    settings: { sound: true, voice: false, keepAwake: true },
    history: [],              // completed workout records
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  } catch (e) {
    console.error("Failed to load progress, starting fresh.", e);
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function recordWorkout(state, record) {
  state.history.unshift(record);
  saveState(state);
}

function advanceDay(state, daysInWeek) {
  state.currentDayIndex += 1;
  if (state.currentDayIndex >= daysInWeek) {
    state.currentDayIndex = 0;
    state.currentWeek += 1;
    if (state.currentWeek > 10) state.currentWeek = 1; // loop the 10-week cycle
  }
  saveState(state);
}

function currentStreak(state) {
  if (!state.history.length) return 0;
  const days = new Set(state.history.map(h => h.date.slice(0, 10)));
  let streak = 0;
  let d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else if (streak === 0 && key === new Date().toISOString().slice(0, 10)) { d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

function exportBackup(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `own-gym-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importBackup(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const merged = Object.assign(defaultState(), parsed);
      saveState(merged);
      onDone(null, merged);
    } catch (e) {
      onDone(e);
    }
  };
  reader.onerror = () => onDone(reader.error);
  reader.readAsText(file);
}
