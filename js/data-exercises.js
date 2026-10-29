// Exercise library — original cue text written for this app (not copied from any book),
// based on standard bodyweight-training movement mechanics. Keyed by canonical base name;
// program entries reference a base name + an optional modifier/display string.
const EXERCISES = {
  // ---------- PUSH ----------
  "Push Ups": { cat: "Push", desc: "Plank position, hands under shoulders, body one straight line from heels to head. Bend the elbows to lower your chest to the floor, then press back up. Keep the core braced — no sagging hips.", equip: "None." },
  "Military Press": { cat: "Push", desc: "Pike position (hips high, like downward dog), hands shoulder-width. Bend the elbows to lower your head toward the floor between your hands, then press back up — a bodyweight shoulder press.", equip: "None (elevate hands/feet to change difficulty)." },
  "Overhead Press": { cat: "Push", desc: "Hold a weighted household object (backpack, jug) at chest height. Press it straight overhead until arms lock out, squeeze for a second at the top, then lower under control.", equip: "A weighted household object." },
  "Close Grip Push Ups": { cat: "Push", desc: "Push-up with hands close together (1-2 hand-widths apart) and elbows tucked to your ribs — shifts the load onto the triceps.", equip: "None." },
  "Seated Dips": { cat: "Push", desc: "Sit in front of a knee-to-waist-height surface, hands on the edge behind you, legs out front. Lower by bending only the elbows until upper arms are parallel to the floor, then press back up.", equip: "A knee-to-waist height surface (chair, couch)." },
  "Dips": { cat: "Push", desc: "Hands on two waist-high stable surfaces spaced a couple feet apart, knees bent so your body hangs between them. Lower by bending the elbows, then press back up.", equip: "Two waist-high stable surfaces." },
  "Assisted Dips": { cat: "Push", desc: "Same as Dips, but with legs bent behind you and feet resting on a chair, using your legs to help push up — a regression toward full Dips.", equip: "Two surfaces plus a chair." },
  "Shove Offs": { cat: "Push", desc: "Face a sturdy elevated surface, fall forward catching yourself with straight arms, lower under control until your chest nearly touches it, then push off explosively back to standing.", equip: "A sturdy elevated surface (desk, mantel)." },
  "Dive Bombers": { cat: "Push", desc: "Start like downward-dog (hips high, hands and feet on floor). Sweep your chest down close to the floor in an arc, continue the arc so your back arches and you look forward (upward-dog-like), then reverse the arc back to the start. One continuous flowing motion.", equip: "None." },
  "One-Arm Push Ups": { cat: "Push", desc: "Feet a bit wider than shoulder-width, one hand centered under your chest, other hand behind your back. Lower with shoulders square to the ground, elbow tucked, then press up. Build up via an elevated-surface regression.", equip: "None (elevated surface to regress)." },
  "Handstand Push Ups": { cat: "Push", desc: "Kick up into a wall-supported handstand, hands shoulder-width. Lower under control until your head nearly touches the floor, then press back to full extension.", equip: "A wall." },
  "Bouncing Push Ups": { cat: "Push", desc: "An explosive push-up where your hands leave the ground at the top; land softly and let your arms bend naturally into the next rep.", equip: "None." },
  "Chinese Push Ups": { cat: "Push", desc: "Stand heels together, bend forward, hands on the floor in a diamond shape well in front of your feet, hips bent ~90°. Keeping legs straight, bend only the arms to bring the top of your head near your hands, then push back up.", equip: "None." },
  "Mountain Climbers": { cat: "Push", desc: "From a push-up plank, keep the body rigid and drive one knee to your chest, then quickly swap legs — like running in place in a plank.", equip: "None." },
  "Surface Triceps Extensions": { cat: "Push", desc: "Grip a fixed waist-high surface overhand, arms locked, feet stepped back further than a push-up stance. Keeping the body straight, bend the elbows to lower your head just below the hands, then press back up. Lower surface = harder.", equip: "A fixed surface (chair, railing, table)." },
  "Thumbs Up": { cat: "Push", desc: "Lying face-down, arms straight out to the sides, fists with thumbs up. Lift your head, shoulders and straight arms as high as possible, squeezing your shoulder blades, hold a few seconds.", equip: "None." },
  "Burpees": { cat: "Push", desc: "From standing: hands to floor, kick feet back to plank, do a push-up, jump feet back up into a squat, then jump straight up with arms overhead. Repeat continuously.", equip: "None (elevate hands to ease the push-up)." },

  // ---------- PULL ----------
  "Let Me Ins": { cat: "Pull", desc: "Straddle an open door, grab both doorknobs, feet either side of the door near the hinges' height. Lean back with straight arms, knees bent, spine and thighs locked at ~90°. Pull your chest up to the door, squeezing your shoulder blades, then lower back out under control.", equip: "A door (or a sturdy railing/pole at waist height)." },
  "Let Me Ups": { cat: "Pull", desc: "Lie on your back under a sturdy waist-high bar/pole/table edge just beyond arm's reach. Grab it shoulder-width, palms toward your feet. Keeping your body a rigid line from ankles to shoulders, pull your chest up to the bar, then lower slowly. Bending the knees (feet flat) makes it easier.", equip: "A sturdy waist-high bar, broomstick across two chairs, or a table edge." },
  "Towel Curls": { cat: "Pull", desc: "Back against a wall, hold each end of a towel looped under one raised foot. Pull the towel up with your arms while your leg resists, then let your leg slowly force your hands back down. 5 seconds up, 5 seconds down.", equip: "A towel, a wall to lean on." },
  "Pull Ups": { cat: "Pull", desc: "Open a door halfway, drape a towel over the top edge, grab it shoulder-width apart, hang with knees bent, then pull up until your chin clears the top, lowering slowly. (A pull-up bar, sturdy tree branch, or ledge works the same way.)", equip: "A door + towel, or a pull-up bar/branch/ledge." },
  "Squat Thrusts": { cat: "Legs & Glutes", desc: "Hold a weighted object at chest height, squat down, then stand and press the object straight overhead in one fluid motion; reverse smoothly into the next squat.", equip: "A weighted household object." },

  // ---------- LEGS & GLUTES ----------
  "Squats": { cat: "Legs & Glutes", desc: "Feet shoulder-width, toes forward. Bend the knees and sit the hips back and down until thighs are about parallel to the floor, heels planted, knees tracking over (not past) the toes. Drive back up through the heels.", equip: "None." },
  "Back Lunges": { cat: "Legs & Glutes", desc: "From standing, step one leg backward and bend both knees to ~90° until the trailing knee nearly touches the floor, then push off the front leg back to standing.", equip: "None." },
  "Front Lunges": { cat: "Legs & Glutes", desc: "From standing, step one leg forward and bend both knees to ~90° until the trailing knee nearly touches the floor, front knee over the ankle, then push back to standing.", equip: "None." },
  "Side Lunges": { cat: "Legs & Glutes", desc: "Step wide to one side, shift your weight onto that leg, keep the other leg straight, sit your hips back and down over the bent knee (shin vertical), then push back up through the heel to the start.", equip: "None." },
  "Lunges": { cat: "Legs & Glutes", desc: "Step one leg forward or back and bend both knees to ~90° until the trailing knee nearly touches the floor, then push back to standing.", equip: "None." },
  "Bulgarian Split Squats": { cat: "Legs & Glutes", desc: "Like a lunge, but your rear foot rests elevated behind you on a chair or bed. Lower straight down bending the front knee until the rear knee nearly touches the floor, pushing mainly through the front foot to rise.", equip: "A chair, bed, or similar elevated surface." },
  "1-Legged Squats": { cat: "Legs & Glutes", desc: "Standing on one leg (holding a chair lightly for balance if needed), bend the standing knee and lower until that thigh is parallel to the floor, torso leaning forward, other leg held forward off the ground, then push back up.", equip: "A chair for balance (optional — can be done assisted or unassisted)." },
  "Pistols": { cat: "Legs & Glutes", desc: "The unassisted full-range one-legged squat: no support, other leg extended straight out in front, lowering your hips all the way down to the heel of the working leg with a slow descent and explosive drive back up.", equip: "None (a waist-high platform edge for an easier variant)." },
  "Sissy Squats": { cat: "Legs & Glutes", desc: "Feet shoulder-width, lightly holding something at waist height for balance. Bend only at the knees (torso and thighs stay in one straight line, no hip hinge) and lean back, lowering until the butt nearly touches the heels and you rise onto your toes, then reverse.", equip: "Something to hold near waist height for balance." },
  "1-Legged RDLs": { cat: "Legs & Glutes", desc: "Standing on one leg, hinge forward at the hips (back flat, standing knee softly bent) while the free leg extends straight back behind you, reaching down toward the floor near the standing foot, then return to upright. Switch legs between sets.", equip: "None (a pillow underfoot or a weighted backpack to progress)." },
  "Toyotas": { cat: "Legs & Glutes", desc: "From a full squat with palms on the ground, explode straight up as high as possible, shooting your hands overhead, then land softly and repeat.", equip: "None." },
  "Iron Mikes": { cat: "Legs & Glutes", desc: "Start in the bottom of a lunge. Explode upward off the front foot and scissor-switch your legs in the air, landing with the opposite leg forward in the same lunge position, and repeat continuously.", equip: "None." },
  "Good Mornings": { cat: "Legs & Glutes", desc: "Feet shoulder-width, hands behind your head. Bow forward by hinging only at the waist (back flat, legs nearly straight) until you feel your hamstrings stretch, then return upright.", equip: "None." },
  "Beat Your Boots": { cat: "Legs & Glutes", desc: "Standing with legs together, bend down and grab your ankles, legs as straight as comfortable. Bend the knees until your butt touches your hands, then straighten the knees again, hands staying on the ankles throughout.", equip: "None." },
  "Bam Bams": { cat: "Legs & Glutes", desc: "Lie face-down over the edge of a bed/table, legs hanging off, holding the surface for stability. Spread your legs wide, then lift both (knees only slightly bent) until heels touch at the top, squeeze, then lower while spreading again.", equip: "A bed, table, or sturdy raised edge." },
  "Ham Sandwiches": { cat: "Legs & Glutes", desc: "Kneeling on a pillow with heels hooked under something fixed, start upright with a straight back, then fall forward slowly bending only at the knees, catching yourself with your hands near the floor, then explode back up using your hamstrings.", equip: "A pillow for the knees and something fixed to anchor the heels." },
  "Box Jumps": { cat: "Legs & Glutes", desc: "From a shoulder-width stance, dip into a quarter-to-half squat and explode up onto a stable elevated surface, then step back down.", equip: "A stable platform, stair, or low box." },
  "Side Jumps": { cat: "Legs & Glutes", desc: "Feet closer than shoulder-width, jump sideways back and forth over a low object on the floor, landing in the same stance each time.", equip: "A small object (shoe, pillow) on the floor." },
  "Hip Extensions": { cat: "Legs & Glutes", desc: "Lie on your back, heels resting on an elevated surface, knees bent ~90°. Drive your hips straight up until thighs line up with your torso, squeeze your glutes for a couple seconds, then lower.", equip: "A chair or similar elevated surface for the heels." },
  "Mountain Climbers (legs)": { cat: "Legs & Glutes", desc: "Same move as the push-chapter Mountain Climbers: plank position, alternate driving each knee to your chest quickly.", equip: "None." },
  "Pogo Jumps": { cat: "Legs & Glutes", desc: "Quick, repeated vertical jumps in place, barely bending the knees, landing softly on the balls of the feet and springing straight back up — like jumping rope without the rope.", equip: "None." },

  // ---------- CORE ----------
  "Side Crunches": { cat: "Core", desc: "Lie on your back, knees bent, ankles crossed, hands lightly behind your head. Curl your chest toward your knees with a small range of motion, alternating bringing one elbow toward the opposite knee each rep.", equip: "None." },
  "Leg Lifts": { cat: "Core", desc: "Lie on your back, hands tucked under your glutes, head lifted slightly. Starting with straight legs a few inches off the floor, raise them to about 45°, hold briefly, then lower with control without touching down.", equip: "None." },
  "Hyperextensions": { cat: "Core", desc: "Lie face down. Lift your straight legs (and sometimes upper body, depending on hand position) as high as possible, hold briefly, then lower — focuses more on the lower back than a full Superman.", equip: "None." },
  "Russian Twists": { cat: "Core", desc: "Sit with knees bent, feet lifted off the floor, arms crossed over your chest. Rotate your torso side to side, tapping one elbow toward the floor beside your hip each time, without letting your feet touch down.", equip: "None." },
  "Swimmers": { cat: "Core", desc: "Lie face down, arms stretched overhead. Lift and alternate opposite arm and leg (right arm/left leg, then left arm/right leg) in a steady flutter, like swimming freestyle while lying on the floor.", equip: "None." },
  "V-Ups": { cat: "Core", desc: "Lie flat on your back, arms at your sides. Simultaneously lift your straight legs and chest so your body folds into a V (knees and chest nearly touching), then lower back so shoulders and feet hover just off the ground before repeating.", equip: "None." },
  "Side V-Ups": { cat: "Core", desc: "Lie on your side, bottom arm stretched out in front, top hand behind your head. Keeping legs together and straight, bend at the hips to bring your knees up toward your top elbow, then lower with control without resting.", equip: "None." },
  "Supermans": { cat: "Core", desc: "Lie face down, arms stretched out in front. Lift your straight arms and legs off the ground together as high as you can, hold briefly, then lower.", equip: "None." },
  "Hanging Leg Lifts": { cat: "Core", desc: "Hang from a sturdy overhead bar or ledge, feet off the ground. Bring your knees (or, more advanced, straight legs) up toward your chest without swinging, then lower under control.", equip: "A sturdy overhead bar, door-frame ledge, or branch." },
  "Rocking Chairs": { cat: "Core", desc: "Lie on your back and hug your knees to your chest. Use your abs to rock your upper body forward into a seated balance on your tailbone, then rock back under control and repeat — a momentum-controlled ab curl.", equip: "None." },
  "Beach Scissors": { cat: "Core", desc: "Lie on your side, propped on your forearm, legs stacked and straight. Raise the top leg as high as possible, hold briefly, then lower; switch sides when done.", equip: "None." },
  "Standing Knee Raises": { cat: "Core", desc: "Stand upright. Raise one knee as high as you can and hold briefly, then lower slowly and repeat on the other side.", equip: "None." },
  "Crunch It Ups": { cat: "Core", desc: "Lie on your back, knees bent, feet tucked under something stable, arms crossed over your stomach. Curl your upper body up just enough for your elbows to touch your thighs, then lower back down — small, high-rep range of motion.", equip: "Something to hook your feet under (couch, chair, bed)." },
  "Bicycles": { cat: "Core", desc: "Lie on your back, hands behind your head. Hold one leg straight a few inches up while bringing the other knee toward the opposite elbow, then switch in a slow pedaling motion — fully extend each leg before bringing the next knee in.", equip: "None." },
  "Iron Crosses": { cat: "Core", desc: "Lie on your back, legs pointing straight up, arms flat out to the sides. Lower your legs together to one side just short of the floor, raise back to vertical, then lower to the other side — a windshield-wiper arc. Bent knees = easier.", equip: "None." },
  "Pillow Humpers": { cat: "Core", desc: "Lie face down, feet hooked under something stable, a rolled pillow under your hips, hands behind your head. Lift your upper body as high as possible, squeezing your glutes and lower back at the top.", equip: "A rolled-up pillow; feet anchored under furniture." },
  "Jack Knives": { cat: "Core", desc: "Lie flat on your back, feet a few inches up, arms extended overhead. Simultaneously bring your straight legs and upper body up to meet in the middle, then reverse with control, lowering until shoulders and feet hover just off the ground.", equip: "None." },
  "Flutter Kicks": { cat: "Core", desc: "Lie on your back, hands under your glutes, head lifted, legs straight and a few inches off the floor. Alternate kicking each leg up and back down in a steady flutter.", equip: "None." },
  "Hello Darlings": { cat: "Core", desc: "A glute/hip isolation move from the book's own naming — exact form isn't confirmed from the extracted pages, so treat this one as a controlled, slow hip/glute squeeze movement and check the book if you want the precise technique.", equip: "Unconfirmed." },
};

// Aliases so program-table names resolve to the canonical EXERCISES entry above.
const EXERCISE_ALIASES = {
  "Door Pull Ups": "Pull Ups",
  "Assisted Door Pull Ups": "Pull Ups",
  "1-Arm Push Ups": "One-Arm Push Ups",
  "Alternating 1-Arm Push Ups": "One-Arm Push Ups",
  "1-arm Let Me Ins": "Let Me Ins",
  "Alternating 1-arm Let Me Ins": "Let Me Ins",
  "Alternating 1-Arm Let Me Ins": "Let Me Ins",
  "Overhead Presses": "Overhead Press",
  "Ham Sandwich": "Ham Sandwiches",
  "1-Legged Hip Extensions": "Hip Extensions",
  "Alternating 1-Legged Hip Extensions": "Hip Extensions",
  "One-Legged RDLs": "1-Legged RDLs",
  "Pogo Jump": "Pogo Jumps",
};

function resolveExercise(base) {
  const key = EXERCISE_ALIASES[base] || base;
  return EXERCISES[key] || { cat: "?", desc: "Refer to the book for exact form.", equip: "" };
}
