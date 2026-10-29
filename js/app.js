// App shell: routing + rendering. Vanilla JS, no build step, no network calls — everything
// needed is already loaded via <script> tags in index.html.

let state = loadState();
setSoundEnabled(state.settings.sound);
let route = { name: "home" };
let runner = null;       // active WorkoutRunner (main set) or SequenceRunner (warmup/cooldown)
let activeDay = null;    // { level, week, dayIndex, dayDef }
let lastLog = [];        // exercise log from the most recently finished WorkoutRunner
let elapsedStart = null;
let lastTickKey = null;  // gates full re-render vs. a cheap text-only patch on every 100ms tick

function workoutKey(vm) {
  switch (vm.kind) {
    case "ladder": return `ladder-${vm.exIndex}-${vm.phase}-${vm.rung}-${vm.direction}-${vm.paused}`;
    case "interval": return `interval-${vm.exIndex}-${vm.setIndex}-${vm.phase}-${vm.paused}`;
    case "superset": return `superset-${vm.pairIndex}-${vm.round}-${vm.sub}-${vm.phase}-${vm.paused}`;
    case "tabata": return `tabata-${vm.exIndex}-${vm.round}-${vm.phase}-${vm.paused}`;
    case "stapper": return `stapper-${vm.rounds}-${vm.paused}`;
    default: return "unknown";
  }
}
function seqKey(vm) { return `seq-${vm.index}-${vm.sideLabel}-${vm.paused}`; }

// Cheap per-tick DOM patch (just the countdown text/progress bar) so a render never has to
// happen mid-click — only structural changes (new rep count, new phase, new exercise) do a
// full re-render.
function patchClock(vm) {
  const liveClock = document.getElementById("liveClock");
  if (liveClock) {
    if (vm.kind === "stapper") liveClock.textContent = fmtTime(vm.clock);
    else if (vm.kind === "ladder") liveClock.textContent = fmtTime(vm.restRemaining);
    else if (vm.kind === "interval") liveClock.textContent = fmtTime(vm.setClock);
    else if (vm.kind === "superset") liveClock.textContent = fmtTime(vm.pairClock);
    else if (vm.kind === "tabata") liveClock.textContent = fmtTime(vm.phaseClock);
    else if (vm.step) liveClock.textContent = fmtTime(vm.remaining);
  }
  const exClock = document.getElementById("liveExClock");
  if (exClock && vm.kind === "ladder") exClock.textContent = fmtTime(vm.exerciseClock);
  const prog = document.getElementById("liveProgress");
  if (prog && vm.step) prog.style.width = Math.max(0, 100 - (vm.remaining / vm.step.seconds) * 100) + "%";
}

const app = document.getElementById("app");

function go(name, params) { route = { name, ...params }; lastTickKey = null; render(); }

function levelDay(level, week, dayIndex) {
  const lvl = PROGRAM[level];
  const days = lvl.weeks[week - 1];
  return days[dayIndex];
}

// ---------------- Rendering ----------------
function render() {
  app.innerHTML = renderRoute();
  const live = app.querySelector("[data-live]");
  if (live && runner) live.scrollIntoView({ block: "nearest" });
}

function renderRoute() {
  switch (route.name) {
    case "home": return renderHome();
    case "levels": return renderLevels();
    case "program": return renderProgram();
    case "dayPreview": return renderDayPreview();
    case "warmup": return renderSequence("warmup");
    case "workout": return renderWorkout();
    case "cooldown": return renderSequence("cooldown");
    case "summary": return renderSummary();
    case "history": return renderHistory();
    case "settings": return renderSettings();
    default: return renderHome();
  }
}

function topNav(title, back) {
  return `<div class="topbar">
    ${back ? `<button class="iconbtn" data-action="${back}">&larr;</button>` : `<span></span>`}
    <h1>${title}</h1>
    <button class="iconbtn" data-action="go:settings">&#9881;</button>
  </div>`;
}

function renderHome() {
  if (!state.level) return renderLevels();
  const lvl = PROGRAM[state.level];
  const day = levelDay(state.level, state.currentWeek, state.currentDayIndex);
  const streak = currentStreak(state);
  return `
  ${topNav("Own Gym", null)}
  <div class="screen">
    <div class="card">
      <div class="small muted">${lvl.label} &middot; ${lvl.sub}</div>
      <h2>Week ${state.currentWeek} of 10 — ${day.label}</h2>
      <div class="badge">${day.category}</div>
      <div class="badge badge-type">${WORKOUT_TYPE_INFO[day.type].name}</div>
      <p class="muted">${WORKOUT_TYPE_INFO[day.type].blurb}</p>
      <button class="btn btn-primary btn-block" data-action="start:day" data-level="${state.level}" data-week="${state.currentWeek}" data-day="${state.currentDayIndex}">Start Today's Workout</button>
    </div>
    <div class="row">
      <div class="stat"><div class="stat-num">${streak}</div><div class="small muted">day streak</div></div>
      <div class="stat"><div class="stat-num">${state.history.length}</div><div class="small muted">workouts logged</div></div>
    </div>
    <button class="btn btn-block" data-action="go:program">View Full Program</button>
    <button class="btn btn-block" data-action="go:history">History</button>
    <button class="btn btn-block" data-action="go:levels">Change Level</button>
  </div>`;
}

function renderLevels() {
  const items = Object.keys(PROGRAM).map(key => {
    const lvl = PROGRAM[key];
    return `<button class="card card-select" data-action="pick:level" data-level="${key}">
      <h3>${lvl.label}</h3><div class="muted">${lvl.sub}</div>
    </button>`;
  }).join("");
  return `${topNav("Choose your level", state.level ? "go:home" : null)}
  <div class="screen">${items}</div>`;
}

function renderProgram() {
  const lvl = PROGRAM[state.level];
  const weeks = lvl.weeks.map((days, i) => {
    const weekNum = i + 1;
    const blockName = weekNum <= 2 ? "Muscular Endurance (Ladders)" : weekNum <= 4 ? "Strength (Interval Sets)" : weekNum <= 6 ? "Power (Supersets)" : "Undulating";
    const dayChips = days.map((d, di) => `<button class="chip ${weekNum === state.currentWeek && di === state.currentDayIndex ? "chip-active" : ""}" data-action="go:dayPreview" data-week="${weekNum}" data-day="${di}">${d.label.replace("Day ", "D")}: ${d.category}</button>`).join("");
    return `<div class="card">
      <div class="small muted">Week ${weekNum} &middot; ${blockName}</div>
      <div class="chiprow">${dayChips}</div>
    </div>`;
  }).join("");
  return `${topNav(lvl.label, "go:home")}<div class="screen">${weeks}</div>`;
}

function dayBodyHTML(day) {
  if (day.type === "stapper") {
    return `<ul class="exlist">${day.circuit.map(c => `<li><strong>${c.reps}&times;</strong> ${c.ex.display} <span class="muted">— ${resolveExercise(c.ex.base).desc}</span></li>`).join("")}</ul>`;
  }
  if (day.type === "superset") {
    return `<ol class="exlist">${day.pairs.map(p => `<li>${p[0].display} <span class="muted">(1-5 reps)</span> &rarr; ${p[1].display} <span class="muted">(6-12 reps)</span></li>`).join("")}</ol>`;
  }
  return `<ol class="exlist">${day.exercises.map(e => `<li>${e.display} <span class="muted">— ${resolveExercise(e.base).desc}</span></li>`).join("")}</ol>`;
}

function renderDayPreview() {
  const week = route.week || state.currentWeek;
  const dayIndex = route.day != null ? route.day : state.currentDayIndex;
  const day = levelDay(state.level, week, dayIndex);
  const warm = pickWarmup(day.category);
  const cool = pickCooldown(day.category);
  return `${topNav(day.label, "go:program")}
  <div class="screen">
    <div class="card">
      <div class="badge">${day.category}</div><div class="badge badge-type">${WORKOUT_TYPE_INFO[day.type].name}</div>
      <p class="muted">${WORKOUT_TYPE_INFO[day.type].blurb}</p>
    </div>
    <div class="card"><h3>Warm-up (~${Math.round(warm.reduce((s, w) => s + w.seconds, 0) / 60)} min)</h3>
      <ul class="exlist small">${warm.map(w => `<li>${w.name}</li>`).join("")}</ul></div>
    <div class="card"><h3>Main set</h3>${dayBodyHTML(day)}</div>
    <div class="card"><h3>Cool-down (~${Math.round(cool.reduce((s, w) => s + w.seconds * (w.perSide ? 2 : 1), 0) / 60)} min)</h3>
      <ul class="exlist small">${cool.map(c => `<li>${c.name}</li>`).join("")}</ul></div>
    <button class="btn btn-primary btn-block" data-action="start:day" data-level="${state.level}" data-week="${week}" data-day="${dayIndex}">Start Workout</button>
  </div>`;
}

// ---------------- Warm-up / Cool-down sequence screen ----------------
function renderSequence(kind) {
  const day = activeDay.dayDef;
  const vm = runner && runner._viewModel ? runner._viewModel() : null;
  if (!vm) return "";
  const pct = vm.step ? Math.max(0, 100 - (vm.remaining / vm.step.seconds) * 100) : 0;
  return `
  <div class="screen timer-screen" data-live>
    <div class="small muted">${kind === "warmup" ? "Warm-up" : "Cool-down"} &middot; ${vm.index + 1} / ${vm.total}</div>
    <h2>${vm.step ? vm.step.name : "Done"}</h2>
    ${vm.sideLabel ? `<div class="badge">${vm.sideLabel}</div>` : ""}
    <div class="big-timer" id="liveClock">${fmtTime(vm.remaining)}</div>
    <div class="progress"><div class="progress-fill" id="liveProgress" style="width:${pct}%"></div></div>
    <p class="muted">${vm.step ? vm.step.cue : ""}</p>
    <div class="row">
      <button class="btn" data-action="seq:pause">${vm.paused ? "Resume" : "Pause"}</button>
      <button class="btn" data-action="seq:skip">Skip</button>
    </div>
    <button class="btn btn-ghost btn-block" data-action="seq:end">${kind === "warmup" ? "Skip Warm-up" : "Finish & Save"}</button>
  </div>`;
}

// ---------------- Main workout screen ----------------
function renderWorkout() {
  const vm = runner.__lastVm;
  if (!vm) return `<div class="screen">Loading…</div>`;
  const day = activeDay.dayDef;
  const header = `<div class="small muted">${day.label} &middot; ${day.category} &middot; ${WORKOUT_TYPE_INFO[day.type].name}</div>`;
  let body = "";
  if (vm.kind === "ladder") body = renderLadder(vm);
  else if (vm.kind === "interval") body = renderInterval(vm);
  else if (vm.kind === "superset") body = renderSuperset(vm);
  else if (vm.kind === "tabata") body = renderTabata(vm);
  else if (vm.kind === "stapper") body = renderStapper(vm);
  return `<div class="screen timer-screen" data-live>${header}${body}
    <button class="btn btn-ghost btn-block" data-action="workout:end">End Workout Early</button>
  </div>`;
}

function exerciseCue(e) { return resolveExercise(e.base).desc; }

function renderLadder(vm) {
  const ex = vm.exercise;
  return `
  <div class="small muted">Exercise ${vm.exIndex + 1} / ${vm.total} &middot; time left <span id="liveExClock">${fmtTime(vm.exerciseClock)}</span></div>
  <h2>${ex.display}</h2>
  <p class="muted">${exerciseCue(ex)}</p>
  ${vm.phase === "work" ? `
    <div class="rung">Rung ${vm.rung} ${vm.direction === 1 ? "&uarr; climbing" : "&darr; descending"}</div>
    <p>Do <strong>${vm.rung}</strong> rep${vm.rung === 1 ? "" : "s"}, then tap Done.</p>
    <div class="row">
      <button class="btn btn-primary btn-block" data-action="ladder:done">Done with this rung</button>
    </div>
    <button class="btn btn-block" data-action="ladder:toohard">That was my limit — start descending</button>
  ` : `
    <div class="big-timer" id="liveClock">${fmtTime(vm.restRemaining)}</div>
    <p class="muted">Resting. Next up: ${vm.rung} rep${vm.rung === 1 ? "" : "s"}.</p>
  `}
  <div class="row">
    <button class="btn" data-action="workout:pause">${vm.paused ? "Resume" : "Pause"}</button>
    <button class="btn" data-action="ladder:skip">Skip Exercise</button>
  </div>`;
}

function repButtons(min, max, action) {
  const btns = [];
  for (let r = min; r <= max; r++) btns.push(`<button class="chip" data-action="${action}" data-reps="${r}">${r}</button>`);
  return `<div class="chiprow">${btns.join("")}</div>`;
}

function renderInterval(vm) {
  const ex = vm.exercise;
  return `
  <div class="small muted">Exercise ${vm.exIndex + 1} / ${vm.total} &middot; Set ${vm.setIndex + 1} / 3</div>
  <h2>${ex.display}</h2>
  <p class="muted">${exerciseCue(ex)}</p>
  <div class="big-timer" id="liveClock">${fmtTime(vm.setClock)}</div>
  ${vm.phase === "work" ? `<p>Work to failure or ~90s, then log your reps:</p>${repButtons(6, 12, "interval:log")}` : `<p class="muted">Resting until the 3-minute clock runs out.</p>`}
  <div class="row">
    <button class="btn" data-action="workout:pause">${vm.paused ? "Resume" : "Pause"}</button>
    <button class="btn" data-action="interval:skipset">Skip Set</button>
    <button class="btn" data-action="interval:skipex">Skip Exercise</button>
  </div>`;
}

function renderSuperset(vm) {
  const ex = vm.pair[vm.sub];
  const hard = vm.sub === 0;
  return `
  <div class="small muted">Pair ${vm.pairIndex + 1} / ${vm.total} &middot; Round ${vm.round + 1} / 2</div>
  <h2>${ex.display}</h2>
  <p class="muted">${exerciseCue(ex)}</p>
  <div class="big-timer" id="liveClock">${fmtTime(vm.pairClock)}</div>
  ${vm.phase === "work" ? `<p>${hard ? "Harder move — 1-5 reps, controlled." : "Easier move — 6-12 reps, right after."}</p>${repButtons(hard ? 1 : 6, hard ? 5 : 12, "superset:log")}` : `<p class="muted">Resting until the 4-minute clock runs out.</p>`}
  <div class="row">
    <button class="btn" data-action="workout:pause">${vm.paused ? "Resume" : "Pause"}</button>
    <button class="btn" data-action="superset:skip">Skip Pair</button>
  </div>`;
}

function renderTabata(vm) {
  const ex = vm.exercise;
  return `
  <div class="small muted">Exercise ${vm.exIndex + 1} / ${vm.total} &middot; Round ${vm.round + 1} / 8</div>
  <h2>${ex.display}</h2>
  <p class="muted">${exerciseCue(ex)}</p>
  <div class="big-timer ${vm.phase === "work" ? "timer-work" : "timer-rest"}" id="liveClock">${fmtTime(vm.phaseClock)}</div>
  <p>${vm.phase === "work" ? "GO — all out!" : "Rest."}</p>
  <div class="row">
    <button class="btn" data-action="workout:pause">${vm.paused ? "Resume" : "Pause"}</button>
    <button class="btn" data-action="tabata:skip">Skip Exercise</button>
  </div>`;
}

function renderStapper(vm) {
  return `
  <div class="small muted">20-minute circuit</div>
  <h2>Keep cycling the circuit</h2>
  <ul class="exlist">${vm.circuit.map(c => `<li><strong>${c.reps}&times;</strong> ${c.ex.display}</li>`).join("")}</ul>
  <div class="big-timer" id="liveClock">${fmtTime(vm.clock)}</div>
  <div class="small muted">Rounds completed: ${vm.rounds}</div>
  <button class="btn btn-primary btn-block" data-action="stapper:round">+1 Round Completed</button>
  <div class="row">
    <button class="btn" data-action="workout:pause">${vm.paused ? "Resume" : "Pause"}</button>
  </div>`;
}

function renderSummary() {
  const rows = lastLog.map(e => {
    if (e.sets[0] && e.sets[0].isRounds) return `<li><strong>${e.display}</strong>: ${e.sets[0].reps} round${e.sets[0].reps === 1 ? "" : "s"} completed</li>`;
    if (!e.sets.length) return `<li><strong>${e.display}</strong>: no sets logged</li>`;
    return `<li><strong>${e.display}</strong>: ${e.sets.map(s => s.reps).join(", ")} reps</li>`;
  }).join("");
  return `${topNav("Workout Complete", null)}
  <div class="screen">
    <div class="card"><h2>Nice work 💪</h2>
    <ul class="exlist">${rows || "<li>Logged.</li>"}</ul></div>
    <button class="btn btn-primary btn-block" data-action="go:home">Done</button>
  </div>`;
}

function renderHistory() {
  const rows = state.history.map(h => `<li><strong>${new Date(h.date).toLocaleDateString()}</strong> — ${PROGRAM[h.level].label}, Week ${h.week} ${h.dayLabel} (${h.category})</li>`).join("");
  return `${topNav("History", "go:home")}<div class="screen"><ul class="exlist">${rows || "<li class='muted'>No workouts logged yet.</li>"}</ul></div>`;
}

function renderSettings() {
  return `${topNav("Settings", "go:home")}
  <div class="screen">
    <div class="card">
      <label class="switch-row"><span>Sound cues</span><input type="checkbox" data-action="toggle:sound" ${state.settings.sound ? "checked" : ""}></label>
      <label class="switch-row"><span>Spoken cues (voice)</span><input type="checkbox" data-action="toggle:voice" ${state.settings.voice ? "checked" : ""}></label>
      <label class="switch-row"><span>Keep screen awake during workouts</span><input type="checkbox" data-action="toggle:keepAwake" ${state.settings.keepAwake ? "checked" : ""}></label>
    </div>
    <div class="card">
      <h3>Backup</h3>
      <p class="muted small">Everything is stored on this device only. Export a backup file whenever you like and save it anywhere (Drive, email, USB).</p>
      <button class="btn btn-block" data-action="backup:export">Export Backup (.json)</button>
      <label class="btn btn-block file-btn">Import Backup<input type="file" accept="application/json" id="importFile" style="display:none"></label>
    </div>
    <div class="card">
      <h3>Reset</h3>
      <button class="btn btn-block btn-danger" data-action="reset:all">Erase All Progress</button>
    </div>
  </div>`;
}

// ---------------- Actions ----------------
function endSequenceAndContinue(kind) {
  if (runner) runner.stop();
  releaseWakeLock();
  if (kind === "warmup") startMainWorkout();
  else finishWorkoutFlow();
}

function startSequence(kind) {
  const day = activeDay.dayDef;
  const steps = kind === "warmup" ? pickWarmup(day.category) : pickCooldown(day.category);
  if (state.settings.keepAwake) requestWakeLock();
  lastTickKey = null;
  runner = new SequenceRunner(steps, {
    onUpdate: (vm) => {
      const key = seqKey(vm);
      if (key !== lastTickKey) { lastTickKey = key; render(); } else patchClock(vm);
    },
    onStepStart: (label, cue) => { speak(label, state.settings.voice); },
    onDone: () => endSequenceAndContinue(kind),
  });
  route = { name: kind };
  runner.start();
  render();
}

function startMainWorkout() {
  const day = activeDay.dayDef;
  if (state.settings.keepAwake) requestWakeLock();
  lastTickKey = null;
  runner = createWorkoutRunner(day, {
    onUpdate: (vm) => {
      runner.__lastVm = vm;
      const key = workoutKey(vm);
      if (key !== lastTickKey) { lastTickKey = key; render(); } else patchClock(vm);
    },
    onFinish: (log) => { lastLog = log; finishWorkoutFlow(); },
  });
  route = { name: "workout" };
  runner.start();
  render();
}

function finishWorkoutFlow() {
  if (runner) runner.stop();
  releaseWakeLock();
  const { level, week, dayIndex, dayDef } = activeDay;
  const record = {
    date: new Date().toISOString(), level, week, dayIndex,
    dayLabel: dayDef.label, category: dayDef.category, type: dayDef.type,
    log: lastLog,
  };
  recordWorkout(state, record);
  if (level === state.level && week === state.currentWeek && dayIndex === state.currentDayIndex) {
    advanceDay(state, PROGRAM[level].weeks[week - 1].length);
  }
  runner = null;
  go("summary");
}

function handleAction(el) {
  const action = el.getAttribute("data-action");
  if (!action) return;
  const [cmd, arg] = action.split(":");

  if (cmd === "go") {
    const params = {};
    if (el.hasAttribute("data-week")) params.week = Number(el.getAttribute("data-week"));
    if (el.hasAttribute("data-day")) params.day = Number(el.getAttribute("data-day"));
    if (el.hasAttribute("data-level")) params.level = el.getAttribute("data-level");
    return go(arg, params);
  }
  if (cmd === "pick" && arg === "level") {
    state.level = el.getAttribute("data-level");
    state.currentWeek = 1; state.currentDayIndex = 0; saveState(state);
    return go("home");
  }
  if (cmd === "start" && arg === "day") {
    activeDay = {
      level: el.getAttribute("data-level"),
      week: Number(el.getAttribute("data-week")),
      dayIndex: Number(el.getAttribute("data-day")),
    };
    activeDay.dayDef = levelDay(activeDay.level, activeDay.week, activeDay.dayIndex);
    return startSequence("warmup");
  }
  if (cmd === "seq") {
    if (arg === "pause") { runner.togglePause(); return render(); }
    if (arg === "skip") { runner.skip(); return; }
    if (arg === "end") {
      const kind = route.name;
      return endSequenceAndContinue(kind);
    }
  }
  if (cmd === "workout") {
    if (arg === "pause") { runner.togglePause(); return render(); }
    if (arg === "end") { runner.finalizeLog(); lastLog = runner.log; return finishWorkoutFlow(); }
  }
  if (cmd === "ladder") {
    if (arg === "done") return runner.repsDone();
    if (arg === "toohard") return runner.tooHard();
    if (arg === "skip") return runner.skipExercise();
  }
  if (cmd === "interval") {
    if (arg === "log") return runner.logReps(Number(el.getAttribute("data-reps")));
    if (arg === "skipset") return runner.skipSet();
    if (arg === "skipex") return runner.skipExercise();
  }
  if (cmd === "superset") {
    if (arg === "log") return runner.logReps(Number(el.getAttribute("data-reps")));
    if (arg === "skip") return runner.skipPair();
  }
  if (cmd === "tabata" && arg === "skip") return runner.skipExercise();
  if (cmd === "stapper" && arg === "round") return runner.addRound();
  if (cmd === "backup" && arg === "export") return exportBackup(state);
  if (cmd === "reset" && arg === "all") {
    if (confirm("This erases all saved progress on this device. Continue?")) {
      state = defaultState(); saveState(state); return go("home");
    }
    return;
  }
}

app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (el && el.tagName !== "INPUT") handleAction(el);
});
app.addEventListener("change", (e) => {
  const el = e.target;
  if (el.id === "importFile" && el.files[0]) {
    importBackup(el.files[0], (err, merged) => {
      if (err) return alert("Could not read that backup file.");
      state = merged; render(); alert("Backup imported.");
    });
    return;
  }
  const action = el.getAttribute && el.getAttribute("data-action");
  if (!action) return;
  const [cmd, key] = action.split(":");
  if (cmd === "toggle") {
    state.settings[key] = el.checked;
    saveState(state);
    if (key === "sound") setSoundEnabled(el.checked);
  }
});

render();
