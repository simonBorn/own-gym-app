// Warm-up and cool-down routines specified by the user — each used for every workout,
// regardless of day category.

const WARMUP = [
  { name: "Internal/External Arm Rotations", seconds: 20, cue: "Rotate your arms in small circles, alternating palms up and down to work the shoulders in both directions." },
  { name: "Big Arm Circles", seconds: 20, cue: "Big circles forward, then backward, loosening the shoulders." },
  { name: "Bow and Bend", seconds: 25, cue: "Bend over with straight legs to touch the ground, then stand up and bow/arch your back." },
  { name: "Full Body Circles", seconds: 25, cue: "Standing with arms overhead, rotate your torso in a large circle so your fingertips almost touch the ground." },
  { name: "Bent Over Torso Twists", seconds: 25, cue: "With legs wide, bend at the waist and alternate touching your toes with the opposite hand." },
  { name: "Alternating Front Lunges", seconds: 30, cue: "Step forward into a lunge, alternating legs, front knee tracking over the ankle." },
  { name: "Up/Down Planks", seconds: 30, cue: "From a forearm plank, press up to a push-up plank one arm at a time, then back down, alternating the lead arm." },
];

const COOLDOWN = [
  { name: "Standing Quad Stretch", seconds: 60, perSide: true, cue: "Pull your heel toward your glute while standing, stretching the front of the thigh." },
  { name: "Wide-Leg Forward Fold", seconds: 60, perSide: true, cue: "Legs wide, bend at the waist and lean over one leg, hands reaching toward the ground." },
  { name: "Kneeling Lat/Side Stretch", seconds: 60, perSide: true, cue: "On hands and knees, walk your hands out to one side at a 45° angle and press your upper body down toward the floor to stretch the lat and shoulder." },
];

function pickWarmup(category) {
  return WARMUP;
}

function pickCooldown(category) {
  return COOLDOWN;
}
