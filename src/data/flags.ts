import type { Flag, HealthRecord } from "../types";

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const fmt = (n: number) => Math.round(n * 10) / 10;

/**
 * Simple unusual-change flags: compare the latest record against the
 * astronaut's own average over all previous days (their personal
 * baseline). Every flag explains itself in plain words. This is a
 * noticing aid for the medical team — it never diagnoses anything.
 */
export function computeFlags(history: HealthRecord[]): Flag[] {
  if (history.length < 4) return [];
  const latest = history[history.length - 1];
  const prev = history.slice(0, history.length - 1);
  const flags: Flag[] = [];

  const prevSleep = prev.map((r) => r.sleepHours).filter((v): v is number => v != null);
  if (latest.sleepHours != null && prevSleep.length >= 2) {
    const a = avg(prevSleep);
    if (a - latest.sleepHours >= 1.5) {
      flags.push({
        metric: "Sleep",
        message: `Sleep fell to ${latest.sleepHours} h on day ${latest.day}, well below this astronaut's average over the previous days of ${fmt(a)} h.`,
      });
    }
  }

  const prevFatigue = prev.map((r) => r.fatigue).filter((v): v is number => v != null);
  if (latest.fatigue != null && prevFatigue.length >= 2) {
    const a = avg(prevFatigue);
    if (latest.fatigue - a >= 3) {
      flags.push({
        metric: "Fatigue",
        message: `Fatigue rose to ${latest.fatigue}/10 on day ${latest.day}, compared with an average over the previous days of ${fmt(a)}/10.`,
      });
    }
  }

  const prevHr = prev.map((r) => r.heartRate).filter((v): v is number => v != null);
  if (latest.heartRate != null && prevHr.length >= 2) {
    const a = avg(prevHr);
    if (Math.abs(latest.heartRate - a) >= 12) {
      flags.push({
        metric: "Heart rate",
        message: `Resting heart rate was ${latest.heartRate} bpm on day ${latest.day}, a change of ${Math.round(Math.abs(latest.heartRate - a))} bpm from the average over the previous days of ${Math.round(a)} bpm.`,
      });
    }
  }

  const prevStress = prev.map((r) => r.stress).filter((v): v is number => v != null);
  if (latest.stress != null && prevStress.length >= 2) {
    const a = avg(prevStress);
    if (latest.stress - a >= 3) {
      flags.push({
        metric: "Stress",
        message: `Stress rose to ${latest.stress}/10 on day ${latest.day}, compared with an average over the previous days of ${fmt(a)}/10.`,
      });
    }
  }

  const prevEx = prev.map((r) => r.exerciseMinutes).filter((v): v is number => v != null);
  if (latest.exerciseMinutes != null && prevEx.length >= 2) {
    const a = avg(prevEx);
    if (a - latest.exerciseMinutes >= 45) {
      flags.push({
        metric: "Exercise",
        message: `Exercise dropped to ${latest.exerciseMinutes} min on day ${latest.day}, well below the average over the previous days of ${Math.round(a)} min.`,
      });
    }
  }

  return flags;
}
