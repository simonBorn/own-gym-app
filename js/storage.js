// Local-first progress storage. Everything lives in localStorage so the app works fully
// offline. Export/Import let you back the data up anywhere you like (Drive, email, USB —
// whatever "remote" means to you) until a live sync target is wired up later.
//
// Updating the app (new HTML/CSS/JS, a new service-worker cache version) can NEVER touch this
// data: localStorage is a separate browser storage API, origin-scoped, that app-code updates
// and the Cache Storage API the service worker uses don't read or write. The only things that
// can erase it are: clearing this site's browser data, the "Erase All Progress" button below,
// or opening the app from a different URL/file path (a different origin = different storage).
// NEVER change STORAGE_KEY casually — that would orphan everyone's existing data under the old
// key. If the saved shape ever needs to change, add fields and merge them in below rather than
// replacing the key or overwriting unrecognized/missing fields with defaults.

const STORAGE_KEY = "yayog_progress_v1";

function defaultState() {
  return {
    level: null,              // 'basic' | 'first' | 'master' | 'chief'
    currentWeek: 1,           // 1-10
    currentDayIndex: 0,       // index into that week's days array
    settings: { sound: true, voice: false, keepAwake: true, theme: "system" }, // theme: 'system' | 'light' | 'dark'
    history: [],              // completed workout records
  };
}

// Merges saved/imported data onto a fresh default shape, field by field, so that a future app
// update which adds a new field (e.g. a new setting) never loses existing data, and old saved
// data never loses a newly-added default just because it didn't have that key yet.
function mergeIntoDefaults(parsed) {
  const base = defaultState();
  return {
    ...base,
    ...parsed,
    settings: { ...base.settings, ...(parsed && parsed.settings) },
    history: Array.isArray(parsed && parsed.history) ? parsed.history : base.history,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return mergeIntoDefaults(JSON.parse(raw));
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
      const merged = mergeIntoDefaults(parsed);
      saveState(merged);
      onDone(null, merged);
    } catch (e) {
      onDone(e);
    }
  };
  reader.onerror = () => onDone(reader.error);
  reader.readAsText(file);
}
