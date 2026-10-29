// Timer engine: drives warm-up/cool-down sequences and the 5 main workout-type flows.
// Each workout type is its own class (they used to be same-named methods on one class,
// which silently clobbered each other in JS — lesson learned) so there's no risk of one
// type's tick/emit logic overwriting another's.

function fmtTime(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// ---------- Sequence runner (warm-up / cool-down): fixed list of timed steps ----------
class SequenceRunner {
  constructor(steps, opts) {
    this.steps = steps;
    this.opts = opts || {};
    this.index = 0;
    this.sideIndex = 0;
    this.remaining = this._stepSeconds();
    this.paused = false;
    this.onUpdate = opts.onUpdate || function () {};
    this.onDone = opts.onDone || function () {};
    this.onStepStart = opts.onStepStart || function () {};
    this._beeped3 = false;
  }
  _stepSeconds() { return this.steps[this.index] ? this.steps[this.index].seconds : 0; }
  currentStep() { return this.steps[this.index]; }
  start() {
    this._announce();
    this._tick();
    this._interval = setInterval(() => this._tick(), 100);
  }
  stop() { clearInterval(this._interval); }
  _announce() {
    const step = this.currentStep();
    if (!step) return;
    const label = step.perSide ? `${step.name}, ${this.sideIndex === 0 ? "first side" : "second side"}` : step.name;
    this.onStepStart(label, step.cue);
  }
  _tick() {
    if (this.paused) return;
    this.remaining -= 0.1;
    if (this.remaining <= 3.3 && this.remaining > 3.0 && !this._beeped3) { this._beeped3 = true; Sound.countdown(); }
    if (this.remaining <= 0) { this._beeped3 = false; this._advance(); }
    this.onUpdate(this._viewModel());
  }
  _advance() {
    const step = this.currentStep();
    if (step && step.perSide && this.sideIndex === 0) {
      this.sideIndex = 1; this.remaining = step.seconds; this._announce(); return;
    }
    this.sideIndex = 0;
    this.index += 1;
    if (this.index >= this.steps.length) { this.stop(); this.onDone(); return; }
    this.remaining = this._stepSeconds();
    this._announce();
  }
  skip() { this.remaining = 0; this._tick(); }
  togglePause() { this.paused = !this.paused; }
  _viewModel() {
    const step = this.currentStep();
    return {
      index: this.index, total: this.steps.length, step,
      remaining: this.remaining, paused: this.paused,
      sideLabel: step && step.perSide ? (this.sideIndex === 0 ? "Side 1" : "Side 2") : null,
    };
  }
}

// ---------- Shared base for the 5 main workout runners ----------
class BaseRunner {
  constructor(day, opts) {
    this.day = day;
    this.opts = opts || {};
    this.onUpdate = opts.onUpdate || function () {};
    this.onFinish = opts.onFinish || function () {};
    this.log = [];
    this.paused = false;
    this._interval = null;
  }
  start() { this._interval = setInterval(() => this._tick(), 100); this._emit(); }
  stop() { clearInterval(this._interval); }
  togglePause() { this.paused = !this.paused; }
  _ensureLogEntry(display) {
    let entry = this.log.find(e => e.display === display);
    if (!entry) { entry = { display, sets: [] }; this.log.push(entry); }
    return entry;
  }
  finalizeLog() { /* subclasses override if they need to record a summary at the end */ }
  _finish() { this.stop(); this.finalizeLog(); Sound.done(); this.onFinish(this.log); }
}

// ----- LADDER -----
class LadderRunner extends BaseRunner {
  constructor(day, opts) {
    super(day, opts);
    this.exIndex = 0; this.rung = 1; this.direction = 1;
    this.phase = "work"; this.exerciseClock = 7.5 * 60; this.restRemaining = 0;
    this.workElapsed = 0; // real time spent on the current rung's reps, measured live
  }
  _tick() {
    if (this.paused) return;
    const exList = this.day.exercises;
    if (this.exIndex >= exList.length) return this._finish();
    this.exerciseClock -= 0.1;
    if (this.phase === "rest") {
      this.restRemaining -= 0.1;
      if (this.restRemaining <= 0) { this.phase = "work"; this.workElapsed = 0; Sound.go(); }
    } else {
      this.workElapsed += 0.1;
    }
    if (this.exerciseClock <= 0) {
      this.exIndex += 1;
      if (this.exIndex >= exList.length) return this._finish();
      this._resetForExercise();
    }
    this._emit();
  }
  _resetForExercise() { this.rung = 1; this.direction = 1; this.phase = "work"; this.exerciseClock = 7.5 * 60; this.workElapsed = 0; }
  repsDone() {
    const ex = this.day.exercises[this.exIndex];
    this._ensureLogEntry(ex.display).sets.push({ reps: this.rung });
    // Book's rule: rest = however long that rung's reps actually took you. We measure it live
    // rather than estimate it, with just a floor (avoid a near-zero rest on a stray tap) and a
    // sanity ceiling (don't let one rung eat the whole 7.5-minute exercise budget).
    this.restRemaining = Math.min(90, Math.max(2, this.workElapsed));
    this.phase = "rest"; Sound.rest();
    if (this.direction === 1) this.rung += 1;
    else { this.rung -= 1; if (this.rung < 1) { this.rung = 1; this.direction = 1; } }
    this._emit();
  }
  tooHard() { this.direction = -1; this.rung = Math.max(1, this.rung - 1); this.workElapsed = 0; this._emit(); }
  skipExercise() {
    this.exIndex += 1;
    if (this.exIndex >= this.day.exercises.length) return this._finish();
    this._resetForExercise(); this._emit();
  }
  _emit() {
    const ex = this.day.exercises[this.exIndex];
    this.onUpdate({
      kind: "ladder", exIndex: this.exIndex, total: this.day.exercises.length, exercise: ex,
      rung: this.rung, direction: this.direction, phase: this.phase,
      restRemaining: this.restRemaining, exerciseClock: this.exerciseClock, paused: this.paused,
    });
  }
}

// ----- INTERVAL SETS -----
class IntervalRunner extends BaseRunner {
  constructor(day, opts) {
    super(day, opts);
    this.exIndex = 0; this.setIndex = 0; this.setClock = 180; this.phase = "work";
  }
  _tick() {
    if (this.paused) return;
    if (this.exIndex >= this.day.exercises.length) return this._finish();
    this.setClock -= 0.1;
    if (this.setClock <= 0) this._nextSet();
    this._emit();
  }
  logReps(reps) {
    const ex = this.day.exercises[this.exIndex];
    this._ensureLogEntry(ex.display).sets.push({ reps });
    this.phase = "rest"; Sound.rest();
    this._emit();
  }
  _nextSet() {
    this.setIndex += 1;
    if (this.setIndex >= 3) {
      this.setIndex = 0; this.exIndex += 1;
      if (this.exIndex >= this.day.exercises.length) return this._finish();
    }
    this.setClock = 180; this.phase = "work"; Sound.go();
  }
  skipSet() { this.setClock = 0; this._tick(); }
  skipExercise() {
    this.exIndex += 1; this.setIndex = 0; this.setClock = 180; this.phase = "work";
    if (this.exIndex >= this.day.exercises.length) return this._finish();
    this._emit();
  }
  _emit() {
    const ex = this.day.exercises[this.exIndex];
    this.onUpdate({
      kind: "interval", exIndex: this.exIndex, total: this.day.exercises.length, exercise: ex,
      setIndex: this.setIndex, setClock: this.setClock, phase: this.phase, paused: this.paused,
    });
  }
}

// ----- SUPERSETS -----
class SupersetRunner extends BaseRunner {
  constructor(day, opts) {
    super(day, opts);
    this.pairIndex = 0; this.round = 0; this.sub = 0;
    this.pairClock = 240; this.phase = "work";
  }
  _tick() {
    if (this.paused) return;
    if (this.pairIndex >= this.day.pairs.length) return this._finish();
    this.pairClock -= 0.1;
    if (this.pairClock <= 0) this._nextRound();
    this._emit();
  }
  logReps(reps) {
    const pair = this.day.pairs[this.pairIndex];
    const ex = pair[this.sub];
    this._ensureLogEntry(ex.display).sets.push({ reps });
    if (this.sub === 0) { this.sub = 1; Sound.go(); }
    else { this.sub = 0; this.phase = "rest"; Sound.rest(); }
    this._emit();
  }
  _nextRound() {
    this.round += 1; this.sub = 0;
    if (this.round >= 2) {
      this.round = 0; this.pairIndex += 1;
      if (this.pairIndex >= this.day.pairs.length) return this._finish();
    }
    this.pairClock = 240; this.phase = "work"; Sound.go();
  }
  skipPair() {
    this.pairIndex += 1; this.round = 0; this.sub = 0; this.pairClock = 240; this.phase = "work";
    if (this.pairIndex >= this.day.pairs.length) return this._finish();
    this._emit();
  }
  _emit() {
    const pair = this.day.pairs[this.pairIndex];
    this.onUpdate({
      kind: "superset", pairIndex: this.pairIndex, total: this.day.pairs.length, pair,
      round: this.round, sub: this.sub, pairClock: this.pairClock, phase: this.phase, paused: this.paused,
    });
  }
}

// ----- TABATA -----
class TabataRunner extends BaseRunner {
  constructor(day, opts) {
    super(day, opts);
    this.exIndex = 0; this.round = 0; this.phase = "work"; this.phaseClock = 20;
  }
  _tick() {
    if (this.paused) return;
    if (this.exIndex >= this.day.exercises.length) return this._finish();
    this.phaseClock -= 0.1;
    if (this.phaseClock <= 2.9 && this.phaseClock > 2.6) Sound.countdown();
    if (this.phaseClock <= 0) this._advance();
    this._emit();
  }
  _advance() {
    if (this.phase === "work") {
      const ex = this.day.exercises[this.exIndex];
      this._ensureLogEntry(ex.display);
      this.phase = "rest"; this.phaseClock = 10; Sound.rest();
    } else {
      this.round += 1;
      if (this.round >= 8) {
        this.round = 0; this.exIndex += 1;
        if (this.exIndex >= this.day.exercises.length) return this._finish();
      }
      this.phase = "work"; this.phaseClock = 20; Sound.go();
    }
  }
  skipExercise() {
    this.exIndex += 1; this.round = 0; this.phase = "work"; this.phaseClock = 20;
    if (this.exIndex >= this.day.exercises.length) return this._finish();
    this._emit();
  }
  _emit() {
    const ex = this.day.exercises[this.exIndex];
    this.onUpdate({
      kind: "tabata", exIndex: this.exIndex, total: this.day.exercises.length, exercise: ex,
      round: this.round, phase: this.phase, phaseClock: this.phaseClock, paused: this.paused,
    });
  }
}

// ----- STAPPER -----
class StapperRunner extends BaseRunner {
  constructor(day, opts) {
    super(day, opts);
    this.clock = 20 * 60; this.rounds = 0;
    this._ensureLogEntry("Circuit");
  }
  _tick() {
    if (this.paused) return;
    this.clock -= 0.1;
    if (this.clock <= 0) return this._finish();
    this._emit();
  }
  addRound() { this.rounds += 1; Sound.tick(); this._emit(); }
  finalizeLog() { this.log[0].sets = [{ reps: this.rounds, isRounds: true }]; }
  _emit() {
    this.onUpdate({ kind: "stapper", circuit: this.day.circuit, clock: this.clock, rounds: this.rounds, paused: this.paused });
  }
}

const RUNNER_BY_TYPE = {
  ladder: LadderRunner, interval: IntervalRunner, superset: SupersetRunner,
  tabata: TabataRunner, stapper: StapperRunner,
};

function createWorkoutRunner(day, opts) {
  const RunnerClass = RUNNER_BY_TYPE[day.type];
  if (!RunnerClass) throw new Error(`Unknown workout type: ${day.type}`);
  return new RunnerClass(day, opts);
}
