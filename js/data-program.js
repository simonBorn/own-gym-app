// Program data — the 10-week cycle for each of the 4 levels, transcribed from the book's own
// program tables (exercise selection / order / set-scheme only — no descriptive prose).
//
// Workout types and how the timer engine runs them:
//   ladder   - each exercise gets a 7.5-min "ladder": 1 rep, rest, 2 reps, rest, 3... up and back
//              down without repeating the top number. Rest = same length as the work just done.
//   interval - each exercise: 3 sets x 6-12 reps, 3-minute intervals (work, then rest the remainder).
//   superset - exercises paired; harder move (1-5 reps) then easier move (6-12 reps), 2 rounds,
//              4-minute interval per pair.
//   tabata   - each exercise: 8 rounds of 20s work / 10s rest (4 min), fully automatic.
//   stapper  - one continuous 20-minute circuit of the listed exercises+reps, repeated for as
//              many rounds as possible.

function E(base, display) { return { base, display: display || base }; }
function PAIR(a, b) { return [a, b]; }

const BASIC_ENDURANCE = [
  { label: "Day 1", category: "Push/Pull", type: "ladder", exercises: [
    E("Push Ups", "Push Ups w/hands elevated on platform"), E("Let Me Ins"),
    E("Seated Dips", "Seated Dips w/feet on ground"), E("Let Me Ups", "Let Me Ups w/knees bent") ] },
  { label: "Day 2", category: "Legs/Core", type: "ladder", exercises: [
    E("Back Lunges", "Alternating Back Lunges"), E("1-Legged RDLs", "Alternating 1-Legged RDLs"),
    E("Squats"), E("Swimmers") ] },
  { label: "Day 3", category: "Push/Pull", type: "ladder", exercises: [
    E("Push Ups", "Push Ups w/hands elevated on platform"), E("Let Me Ins"),
    E("Seated Dips", "Seated Dips w/feet on ground"), E("Let Me Ups", "Let Me Ups w/knees bent") ] },
  { label: "Day 4", category: "Legs/Core", type: "ladder", exercises: [
    E("Side Lunges"), E("1-Legged RDLs", "Alternating 1-Legged RDLs"),
    E("Squats", "Squats w/1-3 second pause at bottom"), E("Side Crunches") ] },
];
const BASIC_STRENGTH = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [
    E("Push Ups"), E("Military Press", "Military Press w/hands elevated"),
    E("Close Grip Push Ups", "Close Grip Push Ups w/hands elevated"), E("Seated Dips") ] },
  { label: "Day 2", category: "Legs", type: "interval", exercises: [
    E("Bulgarian Split Squats"), E("Side Lunges"),
    E("Squats", "Squats w/1-3 second pause at bottom"), E("1-Legged RDLs", "1-Legged RDLs on pillow") ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [
    E("Let Me Ins"), E("Let Me Ups", "Let Me Ups w/knees bent"),
    E("Let Me Ins", "Let Me Ins w/palms up"), E("Towel Curls") ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [
    E("Leg Lifts"), E("Hyperextensions", "Hyperextensions w/hands under chin"),
    E("Russian Twists"), E("Swimmers") ] },
];
const BASIC_POWER = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("Push Ups", "Push Ups w/feet elevated"), E("Shove Offs")),
    PAIR(E("Military Press"), E("Thumbs Up")),
    PAIR(E("Close Grip Push Ups"), E("Seated Dips")) ] },
  { label: "Day 2", category: "Legs", type: "superset", pairs: [
    PAIR(E("Back Lunges", "Alternating Back Lunges w/4-6s pause at bottom"), E("Toyotas")),
    PAIR(E("Front Lunges", "Alternating Front Lunges w/4-6s pause at bottom"), E("Side Lunges")),
    PAIR(E("1-Legged RDLs", "Alternating 1-Legged RDLs on pillow"), E("Squats", "Squats w/1-3s pause at bottom")) ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Assisted Door Pull Ups"), E("Let Me Ins")),
    PAIR(E("Let Me Ins", "Let Me Ins w/4-6s contraction at top"), E("Towel Curls")),
    PAIR(E("Let Me Ups", "Let Me Ups w/reverse grip and straight legs"), E("Let Me Ins", "Let Me Ins w/palms up")) ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("V-Ups"), E("Russian Twists")),
    PAIR(E("Supermans"), E("Swimmers")),
    PAIR(E("Hanging Leg Lifts", "Hanging Leg Lifts w/knees bent"), E("Leg Lifts")) ] },
];
const BASIC_CIRCUIT = [
  { ex: E("Back Lunges", "Alternating Back Lunges"), reps: 10 },
  { ex: E("Let Me Ins"), reps: 8 },
  { ex: E("Push Ups"), reps: 6 },
];
const BASIC_WEEK7 = [
  { label: "Day 1", category: "Push", type: "ladder", exercises: [
    E("Military Press", "Military Press w/hands elevated"), E("Push Ups", "Push Ups w/hands elevated"),
    E("Close Grip Push Ups", "Close Grip Push Ups w/hands elevated"), E("Seated Dips", "Seated Dips w/knees bent") ] },
  { label: "Day 2", category: "Leg", type: "superset", pairs: [
    PAIR(E("Back Lunges", "Alt. Back Lunges w/4-6s pause"), E("Toyotas")),
    PAIR(E("Front Lunges", "Alt. Front Lunges w/4-6s pause"), E("Side Lunges")),
    PAIR(E("1-Legged RDLs", "Alt. 1-Legged RDLs on pillow + 1-3s pause at middle"), E("Pogo Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [
    E("Let Me Ins"), E("Let Me Ups", "Let Me Ups w/knees bent"), E("Let Me Ins", "Let Me Ins w/palms up"), E("Towel Curls") ] },
  { label: "Day 4", category: "Core", type: "tabata", exercises: [ E("Russian Twists"), E("Beach Scissors"), E("Standing Knee Raises") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: BASIC_CIRCUIT },
];
const BASIC_WEEK8 = [
  { label: "Day 1", category: "Push", type: "tabata", exercises: [
    E("Push Ups", "Push Ups w/hands elevated chest-high"), E("Rocking Chairs"), E("Burpees", "Burpees w/hands elevated waist-high") ] },
  { label: "Day 2", category: "Leg", type: "ladder", exercises: [
    E("Back Lunges", "Alt. Back Lunges"), E("1-Legged RDLs", "Alt. 1-Legged RDLs"),
    E("Squats", "Squats w/1-3s pause"), E("Good Mornings", "Good Mornings w/1-3s pause") ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Assisted Door Pull Ups"), E("Let Me Ins")),
    PAIR(E("Let Me Ins", "Let Me Ins w/4-6s contraction at top"), E("Let Me Ups", "Let Me Ups w/knees bent")),
    PAIR(E("Let Me Ups", "Let Me Ups w/reverse grip+straight legs"), E("Let Me Ins", "Let Me Ins w/palms up")) ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [
    E("Leg Lifts"), E("Hyperextensions", "Hyperextensions w/hands under chin"), E("Russian Twists"), E("Swimmers") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: BASIC_CIRCUIT },
];
const BASIC_WEEK9 = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [
    E("Push Ups"), E("Military Press", "Military Press w/hands elevated"), E("Close Grip Push Ups", "Close Grip Push Ups w/hands elevated") ] },
  { label: "Day 2", category: "Leg", type: "tabata", exercises: [ E("Beat Your Boots"), E("Lunges"), E("Good Mornings") ] },
  { label: "Day 3", category: "Pull", type: "ladder", exercises: [
    E("Let Me Ups", "Let Me Ups w/knees bent"), E("Let Me Ins"),
    E("Let Me Ups", "Let Me Ups w/reverse grip+knees bent"), E("Let Me Ins", "Let Me Ins w/palms up") ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("V-Ups"), E("Russian Twists")), PAIR(E("Supermans"), E("Swimmers")), PAIR(E("Bicycles"), E("Leg Lifts")) ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: BASIC_CIRCUIT },
];
const BASIC_WEEK10 = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("Push Ups", "Push Ups w/feet elevated"), E("Shove Offs")),
    PAIR(E("Military Press"), E("Thumbs Up")),
    PAIR(E("Close Grip Push Ups"), E("Seated Dips", "Seated Dips w/feet on ground")) ] },
  { label: "Day 2", category: "Leg", type: "interval", exercises: [
    E("Bulgarian Split Squats"), E("Side Lunges", "Side Lunges w/4-6s pause"), E("1-Legged RDLs", "1-Legged RDLs on pillow") ] },
  { label: "Day 3", category: "Pull", type: "tabata", exercises: [
    E("Let Me Ins", "Let Me Ins w/feet behind hands (step back from normal stance)"), E("Bam Bams"), E("Towel Curls") ] },
  { label: "Day 4", category: "Core", type: "ladder", exercises: [
    E("Crunch It Ups"), E("Hyperextensions", "Hyperextensions w/arms at side"), E("Leg Lifts"), E("Hyperextensions", "Hyperextensions w/lower body only") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: BASIC_CIRCUIT },
];

const FIRST_ENDURANCE = [
  { label: "Day 1", category: "Push/Pull", type: "ladder", exercises: [ E("Push Ups"), E("Let Me Ups"), E("Military Press"), E("Let Me Ins") ] },
  { label: "Day 2", category: "Legs/Core", type: "ladder", exercises: [
    E("Back Lunges", "Alt. Back Lunges w/1-3s pause at bottom"), E("1-Legged RDLs", "Alt. 1-Legged RDLs"),
    E("Toyotas", "Toyotas w/1-3s pause at bottom"), E("Hyperextensions", "Hyperextensions w/arms at side") ] },
  { label: "Day 3", category: "Push/Pull", type: "ladder", exercises: [ E("Push Ups"), E("Let Me Ups"), E("Military Press"), E("Let Me Ins") ] },
  { label: "Day 4", category: "Legs/Core", type: "ladder", exercises: [
    E("Side Lunges", "Alt. Side Lunges w/1-3s pause at bottom"), E("1-Legged RDLs", "Alt. 1-Legged RDLs"),
    E("Toyotas", "Toyotas w/1-3s pause at bottom"), E("Russian Twists") ] },
];
const FIRST_STRENGTH = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [
    E("Push Ups", "Push Ups w/feet elevated"), E("Military Press"), E("Close Grip Push Ups"),
    E("Assisted Dips", "Assisted Dips (legs bent behind, feet on chair)") ] },
  { label: "Day 2", category: "Legs", type: "interval", exercises: [
    E("Bulgarian Split Squats", "Bulgarian Split Squat w/1-3s pause at bottom"), E("Side Lunges", "Side Lunges w/4-6s pause at bottom"),
    E("Toyotas", "Toyotas w/4-6s pause at bottom"), E("1-Legged RDLs", "1-Legged RDLs on pillow") ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [ E("Pull Ups", "Assisted Door Pull Ups"), E("Let Me Ups"), E("Let Me Ins"), E("Towel Curls") ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [ E("Leg Lifts", "Leg Lifts w/hands on chest"), E("Supermans"), E("Bicycles"), E("Hyperextensions", "Hyperextensions w/hands under chin") ] },
];
const FIRST_POWER = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("Push Ups", "Push Ups w/feet elevated & 1-3s pause"), E("Shove Offs")),
    PAIR(E("Military Press", "Military Press w/feet elevated"), E("Thumbs Up")),
    PAIR(E("Close Grip Push Ups", "Close Grip Push Ups w/feet elevated"), E("Assisted Dips")) ] },
  { label: "Day 2", category: "Legs", type: "superset", pairs: [
    PAIR(E("1-Legged Squats", "Alt. 1-Legged Squats (holding chairs both hands)"), E("Toyotas", "Toyotas w/4-6s pause")),
    PAIR(E("Side Lunges", "Alt. Side Lunges w/4-6s pause"), E("Back Lunges", "Alt. Back Lunges w/1-3s pause")),
    PAIR(E("1-Legged RDLs", "Alt. 1-Legged RDLs on pillow w/1-3s pause"), E("Box Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Door Pull Ups"), E("Let Me Ins")),
    PAIR(E("Let Me Ins", "Let Me Ins w/4-6s contraction at top"), E("Let Me Ups")),
    PAIR(E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated"), E("Let Me Ins", "Let Me Ins w/palms up")) ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("Hanging Leg Lifts", "Hanging Leg Lifts w/knees bent"), E("Iron Crosses", "Iron Crosses w/knees bent")),
    PAIR(E("Hip Extensions", "Alt. 1-Legged Hip Extensions"), E("Supermans")),
    PAIR(E("V-Ups"), E("Russian Twists")) ] },
];
const FIRST_CIRCUIT = [
  { ex: E("Let Me Ups", "Let Me Ups w/knees bent"), reps: 6 },
  { ex: E("Side Lunges", "Alternating Side Lunges"), reps: 12 },
  { ex: E("Push Ups"), reps: 8 },
];
const FIRST_WEEK7 = [
  { label: "Day 1", category: "Push", type: "ladder", exercises: [ E("Chinese Push Ups"), E("Push Ups"), E("Close Grip Push Ups"), E("Seated Dips") ] },
  { label: "Day 2", category: "Leg", type: "superset", pairs: [
    PAIR(E("1-Legged Squats", "Alt. 1-Legged Squats (2 chairs)"), E("Toyotas", "Toyotas w/4-6s")),
    PAIR(E("Side Lunges", "Alt. Side Lunges w/4-6s"), E("Back Lunges", "Alt. Back Lunges w/1-3s")),
    PAIR(E("1-Legged RDLs", "Alt. 1-Legged RDLs on pillow w/1-3s"), E("Box Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [ E("Pull Ups", "Assisted Door Pull Ups"), E("Let Me Ups"), E("Let Me Ins"), E("Towel Curls") ] },
  { label: "Day 4", category: "Core", type: "tabata", exercises: [ E("Russian Twists"), E("Flutter Kicks"), E("Squats") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: FIRST_CIRCUIT },
];
const FIRST_WEEK8 = [
  { label: "Day 1", category: "Push", type: "tabata", exercises: [ E("Push Ups", "Push Ups w/hands elevated"), E("Seated Dips", "Seated Dips w/feet on ground"), E("Squats") ] },
  { label: "Day 2", category: "Leg", type: "ladder", exercises: [
    E("Back Lunges", "Alt. Back Lunges w/1-3s"), E("Side Lunges", "Alt. Side Lunges"), E("Toyotas", "Toyotas w/1-3s"), E("1-Legged RDLs", "Alt. 1-Legged RDLs") ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Door Pull Ups"), E("Let Me Ins")),
    PAIR(E("Let Me Ins", "Let Me Ins w/4-6s top"), E("Let Me Ups")),
    PAIR(E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated"), E("Let Me Ins", "Let Me Ins w/palms up")) ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [ E("Leg Lifts"), E("Supermans"), E("Bicycles"), E("Hyperextensions", "Hyperextensions w/hands under chin") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: FIRST_CIRCUIT },
];
const FIRST_WEEK9 = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [
    E("Push Ups"), E("Chinese Push Ups", "Chinese Push Ups w/hands elevated"), E("Close Grip Push Ups", "Close Grip Push Ups w/hands elevated"), E("Assisted Dips") ] },
  { label: "Day 2", category: "Leg", type: "tabata", exercises: [ E("Iron Mikes"), E("Side Jumps"), E("Squats") ] },
  { label: "Day 3", category: "Pull", type: "ladder", exercises: [ E("Let Me Ups"), E("Let Me Ins"), E("Let Me Ups", "Let Me Ups w/reverse grip"), E("Let Me Ins", "Let Me Ins w/palms up") ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("Hanging Leg Lifts", "Hanging Leg Lifts w/knees bent"), E("Iron Crosses")),
    PAIR(E("Hip Extensions", "Alt. 1-Legged Hip Extensions"), E("Supermans")),
    PAIR(E("V-Ups"), E("Russian Twists")) ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: FIRST_CIRCUIT },
];
const FIRST_WEEK10 = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("Push Ups", "Push Ups w/feet elevated"), E("Shove Offs")),
    PAIR(E("Military Press", "Military Press w/feet elevated"), E("Overhead Press", "Overhead Presses")),
    PAIR(E("Close Grip Push Ups", "Close Grip Push Ups w/feet elevated"), E("Assisted Dips")) ] },
  { label: "Day 2", category: "Leg", type: "interval", exercises: [
    E("Bulgarian Split Squats", "Bulgarian Split Squat w/1-3s"), E("Side Lunges", "Side Lunges w/4-6s"),
    E("Toyotas", "Toyotas w/4-6s"), E("1-Legged RDLs", "1-Legged RDLs on pillow") ] },
  { label: "Day 3", category: "Pull", type: "tabata", exercises: [ E("Let Me Ups"), E("Let Me Ins"), E("Squats") ] },
  { label: "Day 4", category: "Core", type: "ladder", exercises: [ E("Bicycles"), E("Hyperextensions", "Hyperextensions w/hands under chin"), E("Hello Darlings"), E("Swimmers") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: FIRST_CIRCUIT },
];

const MASTER_ENDURANCE = [
  { label: "Day 1", category: "Push/Pull", type: "ladder", exercises: [
    E("One-Arm Push Ups", "Alternating 1-Arm Push Ups w/hands elevated"), E("Pull Ups", "Assisted Door Pull Ups"),
    E("Military Press", "Military Press w/feet elevated"), E("Let Me Ups") ] },
  { label: "Day 2", category: "Legs/Core", type: "ladder", exercises: [
    E("1-Legged Squats", "Alt. 1-Legged Squats (assisted or off platform)"), E("Back Lunges", "Alt. Back Lunges w/4-6s pause"),
    E("Hip Extensions"), E("Supermans") ] },
  { label: "Day 3", category: "Push/Pull", type: "ladder", exercises: [
    E("One-Arm Push Ups", "Alternating 1-Arm Push Ups w/hands elevated"), E("Pull Ups", "Assisted Door Pull Ups"),
    E("Military Press", "Military Press w/feet elevated"), E("Let Me Ins") ] },
  { label: "Day 4", category: "Legs/Core", type: "ladder", exercises: [
    E("1-Legged Squats", "Alt. 1-Legged Squats (assisted or off platform)"), E("Side Lunges", "Alt. Side Lunges w/1-3s pause"),
    E("1-Legged RDLs", "Alt. 1-Legged RDLs on pillow"), E("Iron Crosses", "Iron Crosses w/knees bent") ] },
];
const MASTER_STRENGTH = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [ E("One-Arm Push Ups", "1-Arm Push Ups"), E("Dive Bombers"), E("Military Press", "Military Press w/feet elevated"), E("Dips") ] },
  { label: "Day 2", category: "Legs", type: "interval", exercises: [
    E("1-Legged Squats", "1-Legged Squats (assisted or off a platform)"), E("Bulgarian Split Squats", "Bulgarian Split Squat w/4-6s pause at bottom"),
    E("Side Lunges", "Side Lunges w/4-6s pause at bottom"), E("Hip Extensions", "1-Legged Hip Extensions") ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [ E("Pull Ups", "Door Pull Ups"), E("Let Me Ins", "Let Me Ins w/1-3s contraction at top"), E("Let Me Ups"), E("Let Me Ups", "Let Me Ups w/reverse grip") ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [ E("Hanging Leg Lifts", "Hanging Leg-raises (bringing legs parallel to ground)"), E("Pillow Humpers"), E("V-Ups"), E("Supermans") ] },
];
const MASTER_POWER = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("One-Arm Push Ups", "1-Arm Push Ups"), E("Bouncing Push Ups")),
    PAIR(E("Military Press", "Military Press w/feet elevated"), E("Dive Bombers")),
    PAIR(E("Surface Triceps Extensions", "Surface Tricep Extensions"), E("Shove Offs")) ] },
  { label: "Day 2", category: "Legs", type: "superset", pairs: [
    PAIR(E("Pistols"), E("Box Jumps")), PAIR(E("Sissy Squats"), E("Iron Mikes")), PAIR(E("Ham Sandwiches"), E("Side Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Door Pull Ups"), E("Let Me Ups")),
    PAIR(E("Let Me Ins", "1-arm Let Me Ins"), E("Let Me Ups", "Let Me Ups w/reverse grip")),
    PAIR(E("Let Me Ins", "Let Me Ins w/reverse grip+4-6s pause at top"), E("Towel Curls")) ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("Hanging Leg Lifts"), E("Bicycles")), PAIR(E("Pillow Humpers"), E("Supermans")), PAIR(E("V-Ups"), E("Iron Crosses", "Iron Crosses w/knees bent")) ] },
];
const MASTER_CIRCUIT = [
  { ex: E("1-Legged Squats", "Assisted Alt. 1-Legged Squats (or Box Jumps)"), reps: 12 },
  { ex: E("Dive Bombers"), reps: 6 },
  { ex: E("Let Me Ups"), reps: 8 },
];
const MASTER_WEEK7 = [
  { label: "Day 1", category: "Push", type: "ladder", exercises: [ E("One-Arm Push Ups", "1-Arm Push Ups w/hands on knee-high surface"), E("Dive Bombers"), E("Dips"), E("Seated Dips") ] },
  { label: "Day 2", category: "Leg", type: "superset", pairs: [ PAIR(E("Pistols"), E("Sissy Squats")), PAIR(E("Box Jumps"), E("Iron Mikes")), PAIR(E("Ham Sandwiches"), E("Side Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [ E("Pull Ups", "Door Pull Ups"), E("Let Me Ins", "Let Me Ins w/1-3s contraction at top"), E("Let Me Ups"), E("Let Me Ups", "Let Me Ups w/reverse grip") ] },
  { label: "Day 4", category: "Core", type: "tabata", exercises: [ E("Side V-Ups", "Side V-Ups (4 sets/side)"), E("Flutter Kicks", "Flutter Kicks w/hands on chest"), E("Squats") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: MASTER_CIRCUIT },
];
const MASTER_WEEK8 = [
  { label: "Day 1", category: "Push", type: "tabata", exercises: [ E("Push Ups"), E("Shove Offs"), E("Squats") ] },
  { label: "Day 2", category: "Leg", type: "ladder", exercises: [ E("1-Legged Squats", "Assisted 1-Legged Squats"), E("Sissy Squats"), E("Side Lunges", "Side Lunges w/1-3s pause at bottom"), E("Hip Extensions") ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Door Pull Ups"), E("Let Me Ups")),
    PAIR(E("Let Me Ins", "1-arm Let Me Ins"), E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated")),
    PAIR(E("Let Me Ins", "Let Me Ins w/reverse grip"), E("Towel Curls")) ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [ E("Hanging Leg Lifts", "Hanging Leg Lifts (bringing straight legs parallel to ground)"), E("Pillow Humpers"), E("V-Ups"), E("Supermans") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: MASTER_CIRCUIT },
];
const MASTER_WEEK9 = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [ E("One-Arm Push Ups", "1-Arm Push Ups w/hands elevated"), E("Dive Bombers"), E("Military Press", "Military Press w/feet elevated"), E("Dips") ] },
  { label: "Day 2", category: "Leg", type: "tabata", exercises: [ E("Iron Mikes"), E("Side Jumps"), E("Squats") ] },
  { label: "Day 3", category: "Pull", type: "ladder", exercises: [ E("Pull Ups", "Assisted Door Pull Ups"), E("Let Me Ups"), E("Let Me Ups", "Let Me Ups w/reverse grip"), E("Let Me Ins") ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [ PAIR(E("Hanging Leg Lifts"), E("Bicycles")), PAIR(E("Pillow Humpers"), E("Supermans")), PAIR(E("V-Ups"), E("Iron Crosses", "Iron Crosses w/knees bent")) ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: MASTER_CIRCUIT },
];
const MASTER_WEEK10 = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("One-Arm Push Ups", "1-Arm Push Ups"), E("Bouncing Push Ups")),
    PAIR(E("Military Press", "Military Press w/feet elevated"), E("Dive Bombers")),
    PAIR(E("Surface Triceps Extensions"), E("Shove Offs")) ] },
  { label: "Day 2", category: "Leg", type: "interval", exercises: [ E("1-Legged Squats"), E("Bulgarian Split Squats", "Bulgarian Split Squat w/overhead backpack press"), E("Iron Mikes"), E("Ham Sandwiches") ] },
  { label: "Day 3", category: "Pull", type: "tabata", exercises: [ E("Let Me Ups"), E("Let Me Ins"), E("Squats") ] },
  { label: "Day 4", category: "Core", type: "ladder", exercises: [ E("Side V-Ups", "Side V-Ups w/bent legs"), E("Bam Bams"), E("Leg Lifts", "Leg Lifts w/hands on chest"), E("Hyperextensions", "Hyperextensions w/hands under chin") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: MASTER_CIRCUIT },
];

const CHIEF_ENDURANCE = [
  { label: "Day 1", category: "Push/Pull", type: "ladder", exercises: [
    E("One-Arm Push Ups", "Alternating 1-Arm Push Ups w/hands elevated"), E("Pull Ups", "Door Pull Ups"), E("Dive Bombers"), E("Let Me Ups", "Let Me Ups w/feet elevated") ] },
  { label: "Day 2", category: "Legs/Core", type: "ladder", exercises: [ E("Pistols", "Alternating Pistols"), E("Iron Mikes"), E("Hip Extensions", "Alt. 1-Legged Hip Extensions"), E("Pillow Humpers") ] },
  { label: "Day 3", category: "Push/Pull", type: "ladder", exercises: [
    E("One-Arm Push Ups", "Alternating 1-Arm Push Ups w/hands elevated"), E("Pull Ups", "Door Pull Ups"), E("Military Press", "Military Press w/feet elevated"), E("Let Me Ins", "Alternating 1-Arm Let Me Ins") ] },
  { label: "Day 4", category: "Legs/Core", type: "ladder", exercises: [ E("1-Legged Squats", "Alternating 1-Legged Squats"), E("Box Jumps"), E("Sissy Squats"), E("Iron Crosses") ] },
];
const CHIEF_STRENGTH = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [ E("One-Arm Push Ups", "1-Arm Push Ups"), E("Handstand Push Ups"), E("Dive Bombers"), E("Surface Triceps Extensions", "Surface Triceps Ext. (hip-height)") ] },
  { label: "Day 2", category: "Legs", type: "interval", exercises: [ E("Pistols"), E("Bulgarian Split Squats", "Bulgarian Split Squat w/4-6s pause"), E("Sissy Squats"), E("Iron Mikes") ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [ E("Pull Ups", "Door Pull Ups w/1-3s pause at top"), E("Let Me Ins", "1-arm Let Me Ins"), E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated"), E("Let Me Ins", "Let Me Ins w/4-6s contraction at top") ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [ E("Hanging Leg Lifts", "Hanging Leg Lifts (all the way up)"), E("Pillow Humpers"), E("Jack Knives"), E("Supermans") ] },
];
const CHIEF_POWER = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("One-Arm Push Ups", "1-Arm Push Ups w/feet elevated"), E("Bouncing Push Ups")),
    PAIR(E("Handstand Push Ups", "Handstand Push Ups w/1-3s pause"), E("Dive Bombers")),
    PAIR(E("Surface Triceps Extensions", "Surface Tricep Ext. (knee-height)"), E("Shove Offs")) ] },
  { label: "Day 2", category: "Legs", type: "superset", pairs: [
    PAIR(E("Pistols", "Alt. Pistols w/1-3s pause"), E("Box Jumps")),
    PAIR(E("Sissy Squats", "Sissy Squats w/1-3s"), E("Iron Mikes")),
    PAIR(E("Ham Sandwiches"), E("Side Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Door Pull Ups w/4-6s pause at top"), E("Let Me Ups", "Let Me Ups w/feet elevated")),
    PAIR(E("Let Me Ins", "1-arm Let Me Ins w/1-3s contraction"), E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated")),
    PAIR(E("Pull Ups", "Pull Ups (touching sternum)"), E("Let Me Ins", "Let Me Ins w/reverse grip+4-6s contraction")) ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("Hanging Leg Lifts", "Hanging Leg Lifts w/4-6s pause (feet to hands)"), E("Bicycles", "Bicycles (2s/knee)")),
    PAIR(E("Pillow Humpers"), E("Supermans")), PAIR(E("Jack Knives"), E("Iron Crosses")) ] },
];
const CHIEF_CIRCUIT = [
  { ex: E("Pistols", "Alternating Pistols (or 24 Iron Mikes, jumping as high as possible)"), reps: 12 },
  { ex: E("Handstand Push Ups"), reps: 6 },
  { ex: E("Pull Ups", "Door Pull Ups"), reps: 8 },
];
const CHIEF_WEEK7 = [
  { label: "Day 1", category: "Push", type: "ladder", exercises: [ E("One-Arm Push Ups", "1-Arm Push Ups"), E("Handstand Push Ups"), E("Dive Bombers"), E("Dips", "Dips w/1-3s pause") ] },
  { label: "Day 2", category: "Leg", type: "superset", pairs: [
    PAIR(E("Pistols", "Alt. Pistols w/1-3s"), E("Box Jumps")),
    PAIR(E("Sissy Squats", "Sissy Squats w/1-3s"), E("Iron Mikes")),
    PAIR(E("Ham Sandwiches", "Ham Sandwiches (no hands)"), E("Side Jumps")) ] },
  { label: "Day 3", category: "Pull", type: "interval", exercises: [
    E("Pull Ups", "Door Pull Ups w/1-3s pause at top"), E("Let Me Ins", "1-arm Let Me Ins"),
    E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated"), E("Let Me Ins", "Let Me Ins w/reverse grip, 4-6s contraction at top") ] },
  { label: "Day 4", category: "Core", type: "tabata", exercises: [ E("V-Ups"), E("Side V-Ups", "Side-V-Ups (4 sets/side)"), E("Mountain Climbers"), E("Squats") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: CHIEF_CIRCUIT },
];
const CHIEF_WEEK8 = [
  { label: "Day 1", category: "Push", type: "tabata", exercises: [ E("Push Ups"), E("Shove Offs"), E("Mountain Climbers"), E("Burpees") ] },
  { label: "Day 2", category: "Leg", type: "ladder", exercises: [ E("1-Legged Squats"), E("Sissy Squats"), E("Iron Mikes"), E("Hip Extensions", "1-Legged Hip Extensions") ] },
  { label: "Day 3", category: "Pull", type: "superset", pairs: [
    PAIR(E("Pull Ups", "Door Pull Ups w/4-6s pause at top"), E("Let Me Ups", "Let Me Ups w/feet elevated")),
    PAIR(E("Let Me Ins", "1-arm Let Me Ins w/1-3s contraction at top"), E("Let Me Ups", "Let Me Ups w/reverse grip+feet elevated")),
    PAIR(E("Pull Ups", "Pull Ups (touching sternum)"), E("Let Me Ins", "Let Me Ins w/reverse grip+4-6s contraction at top")) ] },
  { label: "Day 4", category: "Core", type: "interval", exercises: [ E("Hanging Leg Lifts", "Hanging Leg Lifts (all the way up)"), E("Pillow Humpers"), E("Jack Knives"), E("Supermans") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: CHIEF_CIRCUIT },
];
const CHIEF_WEEK9 = [
  { label: "Day 1", category: "Push", type: "interval", exercises: [ E("One-Arm Push Ups", "1-Arm Push Ups"), E("Handstand Push Ups"), E("Dive Bombers"), E("Surface Triceps Extensions", "Surface Tricep Ext. (hip-height)") ] },
  { label: "Day 2", category: "Leg", type: "tabata", exercises: [ E("Iron Mikes"), E("Side Jumps"), E("Squat Thrusts"), E("Squats") ] },
  { label: "Day 3", category: "Pull", type: "ladder", exercises: [ E("Pull Ups", "Door Pull Ups"), E("Let Me Ups"), E("Let Me Ups", "Let Me Ups w/reverse grip"), E("Let Me Ins", "Alt. 1-arm Let Me Ins") ] },
  { label: "Day 4", category: "Core", type: "superset", pairs: [
    PAIR(E("Hanging Leg Lifts", "Hanging Leg Lifts (feet to hands), 4-6s pause"), E("Bicycles", "Bicycles (12/side, slow)")),
    PAIR(E("Pillow Humpers"), E("Supermans")),
    PAIR(E("Jack Knives"), E("Iron Crosses", "Iron Crosses (6/side, slow)")) ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: CHIEF_CIRCUIT },
];
const CHIEF_WEEK10 = [
  { label: "Day 1", category: "Push", type: "superset", pairs: [
    PAIR(E("One-Arm Push Ups", "1-Arm Push Ups w/feet elevated"), E("Bouncing Push Ups")),
    PAIR(E("Handstand Push Ups"), E("Dive Bombers", "Dive Bombers (pause mid-rep)")),
    PAIR(E("Surface Triceps Extensions", "Surface Tricep Ext. (knee-height)"), E("Shove Offs")) ] },
  { label: "Day 2", category: "Leg", type: "interval", exercises: [ E("1-Legged Squats"), E("Bulgarian Split Squats", "Bulgarian Split Squat w/overhead backpack press"), E("Iron Mikes"), E("Ham Sandwiches") ] },
  { label: "Day 3", category: "Pull", type: "tabata", exercises: [ E("Pull Ups", "Assisted Door Pull Ups"), E("Let Me Ups"), E("Let Me Ins"), E("Mountain Climbers") ] },
  { label: "Day 4", category: "Core", type: "ladder", exercises: [ E("Jack Knives"), E("Pillow Humpers"), E("Side V-Ups", "Alt. Side V-Ups (legs straight)"), E("Supermans") ] },
  { label: "Day 5", category: "Circuit", type: "stapper", circuit: CHIEF_CIRCUIT },
];

function buildLevel(label, sub, endurance, strength, power, w7, w8, w9, w10) {
  return { label, sub, weeks: [endurance, endurance, strength, strength, power, power, w7, w8, w9, w10] };
}

const PROGRAM = {
  basic: buildLevel("Basic Program", "for Beginners", BASIC_ENDURANCE, BASIC_STRENGTH, BASIC_POWER, BASIC_WEEK7, BASIC_WEEK8, BASIC_WEEK9, BASIC_WEEK10),
  first: buildLevel("1st Class Program", "for Intermediate trainees", FIRST_ENDURANCE, FIRST_STRENGTH, FIRST_POWER, FIRST_WEEK7, FIRST_WEEK8, FIRST_WEEK9, FIRST_WEEK10),
  master: buildLevel("Master Class", "for Advanced trainees", MASTER_ENDURANCE, MASTER_STRENGTH, MASTER_POWER, MASTER_WEEK7, MASTER_WEEK8, MASTER_WEEK9, MASTER_WEEK10),
  chief: buildLevel("Chief Class", "for the Elite", CHIEF_ENDURANCE, CHIEF_STRENGTH, CHIEF_POWER, CHIEF_WEEK7, CHIEF_WEEK8, CHIEF_WEEK9, CHIEF_WEEK10),
};

const WORKOUT_TYPE_INFO = {
  ladder: { name: "Ladders", blurb: "Climb reps each round (1, 2, 3…) until it gets hard, then climb back down. Rest = however long the last round took you." },
  interval: { name: "Interval Sets", blurb: "3 sets, 6-12 reps each, 3-minute clock per set — work, then rest out whatever's left." },
  superset: { name: "Supersets", blurb: "Paired moves: a harder lift (1-5 reps) then an easier one (6-12 reps), back to back. 2 rounds, 4-minute clock per pair." },
  tabata: { name: "Tabata", blurb: "8 rounds of 20 seconds all-out, 10 seconds rest — 4 minutes per exercise." },
  stapper: { name: "Stappers", blurb: "One continuous 20-minute circuit — as many rounds as you can get through." },
};
