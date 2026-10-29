// Warm-up routine specified by the user — used for every workout, regardless of day category.
// Cool-down stretches below remain the original ones, picked by the day's muscle group.

const WARMUP = [
  { name: "Internal/External Arm Rotations", seconds: 20, cue: "Rotate your arms in small circles, alternating palms up and down to work the shoulders in both directions." },
  { name: "Big Arm Circles", seconds: 20, cue: "Big circles forward, then backward, loosening the shoulders." },
  { name: "Bow and Bend", seconds: 25, cue: "Bend over with straight legs to touch the ground, then stand up and bow/arch your back." },
  { name: "Full Body Circles", seconds: 25, cue: "Standing with arms overhead, rotate your torso in a large circle so your fingertips almost touch the ground." },
  { name: "Bent Over Torso Twists", seconds: 25, cue: "With legs wide, bend at the waist and alternate touching your toes with the opposite hand." },
  { name: "Alternating Front Lunges", seconds: 30, cue: "Step forward into a lunge, alternating legs, front knee tracking over the ankle." },
  { name: "Up/Down Planks", seconds: 30, cue: "From a forearm plank, press up to a push-up plank one arm at a time, then back down, alternating the lead arm." },
];

const COOLDOWNS = {
  push: [
    { name: "Doorway chest stretch", seconds: 30, cue: "Forearm on a door frame, step through gently until you feel the chest stretch." },
    { name: "Overhead triceps stretch", seconds: 20, perSide: true, cue: "One arm bent overhead, other hand gently pulls the elbow back." },
    { name: "Cross-body shoulder stretch", seconds: 20, perSide: true, cue: "Pull one straight arm across your chest with the other arm." },
    { name: "Child's pose", seconds: 30, cue: "Knees wide, sit back onto your heels, arms stretched forward, relax the shoulders." },
    { name: "Neck side stretch", seconds: 15, perSide: true, cue: "Ear gently toward shoulder, let it hang." },
  ],
  pull: [
    { name: "Overhead lat stretch", seconds: 20, perSide: true, cue: "Reach one arm up and over, lean gently to the opposite side." },
    { name: "Cross-body shoulder stretch", seconds: 20, perSide: true, cue: "Pull one straight arm across your chest with the other arm." },
    { name: "Doorway bicep stretch", seconds: 20, cue: "Hand on a door frame behind you, palm back, gently rotate away." },
    { name: "Child's pose", seconds: 30, cue: "Knees wide, sit back onto your heels, arms stretched forward, relax the shoulders." },
    { name: "Forearm stretch", seconds: 15, perSide: true, cue: "Arm out, palm up, gently pull fingers back toward you." },
  ],
  legs: [
    { name: "Standing quad stretch", seconds: 20, perSide: true, cue: "Hold your ankle behind you, knees together, gentle pull." },
    { name: "Standing hamstring stretch", seconds: 20, perSide: true, cue: "Heel forward on the ground, hinge at the hips with a flat back." },
    { name: "Calf stretch against a wall", seconds: 20, perSide: true, cue: "Back leg straight, heel down, lean into the wall." },
    { name: "Kneeling hip flexor stretch", seconds: 20, perSide: true, cue: "Back knee down, front knee bent 90°, gently push the hips forward." },
    { name: "Seated figure-4 glute stretch", seconds: 20, perSide: true, cue: "Ankle crossed over the opposite knee, lean forward gently." },
  ],
  core: [
    { name: "Cobra stretch", seconds: 30, cue: "Lying face down, press up through the arms, hips staying down, open the front of the body." },
    { name: "Seated spinal twist", seconds: 20, perSide: true, cue: "Sit tall, rotate your torso toward the back hand on the floor." },
    { name: "Child's pose", seconds: 30, cue: "Knees wide, sit back onto your heels, arms stretched forward, relax the lower back." },
    { name: "Standing side bend", seconds: 15, perSide: true, cue: "Reach one arm overhead and lean gently to the opposite side." },
    { name: "Knees-to-chest stretch", seconds: 20, cue: "Lying on your back, hug both knees in gently." },
  ],
  general: [
    { name: "Child's pose", seconds: 30, cue: "Knees wide, sit back onto your heels, arms stretched forward." },
    { name: "Standing quad stretch", seconds: 20, perSide: true, cue: "Hold your ankle behind you, knees together." },
    { name: "Doorway chest stretch", seconds: 20, cue: "Forearm on a door frame, step through gently." },
    { name: "Seated spinal twist", seconds: 20, perSide: true, cue: "Sit tall, rotate your torso gently." },
    { name: "Standing hamstring stretch", seconds: 20, perSide: true, cue: "Heel forward, hinge at the hips with a flat back." },
  ],
};

function pickWarmup(category) {
  return WARMUP;
}

function pickCooldown(category) {
  const c = category.toLowerCase();
  if (c.includes("leg")) return COOLDOWNS.legs;
  if (c.includes("push")) return COOLDOWNS.push;
  if (c.includes("pull")) return COOLDOWNS.pull;
  if (c.includes("core")) return COOLDOWNS.core;
  return COOLDOWNS.general;
}
