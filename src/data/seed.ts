import { type HealthRecord, ASTRONAUTS, CURRENT_DAY } from "../types";

/** Deterministic pseudo-random generator so the fictional demo data is
 *  identical on every load (no flicker, no surprises for judges). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const MOODS = ["Great", "Good", "Good", "Okay", "Good", "Great"];
const CONDITIONS = ["Excellent", "Good", "Good", "Good", "Fair"];
const PAINS = ["None", "None", "None", "Mild", "None", "Mild"];
const MOTIVATIONS = ["High", "High", "Steady", "High", "Steady"];

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * Fictional demonstration records for mission days 1..CURRENT_DAY-1.
 * Two gentle story beats are built in so the medical team's
 * unusual-change flags have something honest to show:
 *  - Maya Chen's sleep declines over the last three days and is very
 *    short on the final day, with fatigue at 9/10.
 *  - Samir Khan's stress rises late in week 3.
 * These are fictional demo values, clearly labelled as such in the UI.
 */
export function buildSeedRecords(): HealthRecord[] {
  const out: HealthRecord[] = [];
  ASTRONAUTS.forEach((a, ai) => {
    const rand = rng(1234 + ai * 777);
    const baseHr = [68, 71, 66][ai];
    const baseSleep = [7.4, 7.1, 7.6][ai];
    const baseExercise = [95, 110, 85][ai];
    for (let day = 1; day < CURRENT_DAY; day++) {
      const r = rand();
      let sleep = baseSleep + (r - 0.5) * 1.1;
      let fatigue = 3 + Math.round(rand() * 2);
      let stress = 3 + Math.round(rand() * 2);
      let hr = baseHr + Math.round((rand() - 0.5) * 8);
      let exercise = baseExercise + Math.round((rand() - 0.5) * 40);
      if (a.id === "AST-002" && day >= CURRENT_DAY - 3 && day < CURRENT_DAY - 1) {
        // Maya: two short nights in a row before the final day.
        sleep = 5.7 + rand() * 0.3;
        fatigue = 7;
        hr = baseHr + 6 + Math.round(rand() * 4);
      }
      if (a.id === "AST-002" && day === CURRENT_DAY - 1) {
        // Maya: a very short night and high fatigue on the latest day.
        sleep = 4.6 + rand() * 0.4;
        fatigue = 9;
        hr = baseHr + 9 + Math.round(rand() * 3);
      }
      if (a.id === "AST-003" && day === CURRENT_DAY - 2) {
        stress = 7;
      }
      if (a.id === "AST-003" && day === CURRENT_DAY - 1) {
        stress = 8;
      }
      out.push({
        astronautId: a.id,
        day,
        heartRate: hr,
        sleepHours: Math.round(sleep * 10) / 10,
        exerciseMinutes: Math.max(30, exercise),
        fatigue,
        pain: pick(rand, PAINS),
        condition: pick(rand, CONDITIONS),
        mood: pick(rand, MOODS),
        stress,
        loneliness: 2 + Math.round(rand() * 3),
        motivation: pick(rand, MOTIVATIONS),
        source: "demo-seed",
      });
    }
  });
  return out;
}
