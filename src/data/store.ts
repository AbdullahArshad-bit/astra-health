import type { HealthRecord } from "../types";
import { buildSeedRecords } from "./seed";

const KEY = "astra-health-checkins-v1";

/** User-submitted check-ins, persisted in the browser (localStorage). */
export function loadCheckIns(): HealthRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCheckIn(rec: HealthRecord): HealthRecord[] {
  const existing = loadCheckIns().filter(
    (r) => !(r.astronautId === rec.astronautId && r.day === rec.day)
  );
  const next = [...existing, rec];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function resetDemoData() {
  localStorage.removeItem(KEY);
}

/** Seed (fictional demo) records merged with user check-ins.
 *  A check-in for the same astronaut + day replaces the seed record. */
export function allRecords(checkIns: HealthRecord[]): HealthRecord[] {
  const map = new Map<string, HealthRecord>();
  for (const r of buildSeedRecords()) map.set(`${r.astronautId}|${r.day}`, r);
  for (const r of checkIns) map.set(`${r.astronautId}|${r.day}`, r);
  return [...map.values()].sort(
    (a, b) => a.astronautId.localeCompare(b.astronautId) || a.day - b.day
  );
}

export function recordsFor(
  records: HealthRecord[],
  astronautId: string,
  upToDay: number
): HealthRecord[] {
  return records
    .filter((r) => r.astronautId === astronautId && r.day <= upToDay)
    .sort((a, b) => a.day - b.day);
}

export function latestFor(
  records: HealthRecord[],
  astronautId: string,
  upToDay: number
): HealthRecord | undefined {
  const list = recordsFor(records, astronautId, upToDay);
  return list[list.length - 1];
}
