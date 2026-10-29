// Original warm-up / cool-down routines written for this app (the book doesn't prescribe
// specific ones) — generic, sensible dynamic warm-up and static cool-down stretches,
// picked by which muscle groups the day's category targets.

const WARMUPS = {
  upper: [
    { name: "Arm circles", seconds: 30, cue: "Small circles forward, then backward — loosen the shoulders." },
    { name: "Jumping jacks", seconds: 30, cue: "Steady pace, get the heart rate up." },
    { name: "Shoulder rolls", seconds: 20, cue: "Roll shoulders up, back, and down, slow and full." },
    { name: "Wrist & forearm circles", seconds: 20, cue: "Circle wrists both directions — you'll be loading them soon." },
    { name: "Bodyweight squats", seconds: 30, cue: "Easy pace, full range, wake up the legs too." },
    { name: "Slow push-up to downward dog", seconds: 30, cue: "A couple of easy push-ups flowing into downward dog to open the shoulders." },
    { name: "Torso twists", seconds: 20, cue: "Hands on hips, rotate side to side." },
    { name: "Jumping jacks", seconds: 30, cue: "One more round to finish warm." },
  ],
  lower: [
    { name: "Jumping jacks", seconds: 30, cue: "Steady pace, get the heart rate up." },
    { name: "Bodyweight squats", seconds: 30, cue: "Easy pace, full range of motion." },
    { name: "Walking lunges", seconds: 30, cue: "Slow and controlled, knees tracking over toes." },
    { name: "Hip circles", seconds: 20, cue: "Hands on hips, big circles each direction." },
    { name: "Leg swings", seconds: 30, cue: "Hold a wall, swing each leg forward-back then side-side." },
    { name: "High knees", seconds: 30, cue: "Quick, light steps, knees up toward the chest." },
    { name: "Ankle circles", seconds: 20, cue: "Each ankle, both directions." },
    { name: "Bodyweight squats", seconds: 20, cue: "One more easy set to finish warm." },
  ],
};

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
  return /leg|circuit/i.test(category) ? WARMUPS.lower : WARMUPS.upper;
}

function pickCooldown(category) {
  const c = category.toLowerCase();
  if (c.includes("leg")) return COOLDOWNS.legs;
  if (c.includes("push")) return COOLDOWNS.push;
  if (c.includes("pull")) return COOLDOWNS.pull;
  if (c.includes("core")) return COOLDOWNS.core;
  return COOLDOWNS.general;
}
