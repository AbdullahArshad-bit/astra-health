// Logic smoke tests for ASTRA HEALTH — run: npx tsx test/logic.test.ts
// Covers: seed shape, determinism, flag engine (incl. the built-in demo
// story beats), store merge + persistence semantics, TEPC data sanity.

// --- minimal localStorage shim (node has none) ---
const mem = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
};

import { buildSeedRecords } from "../src/data/seed";
import { computeFlags } from "../src/data/flags";
import { allRecords, loadCheckIns, saveCheckIn, resetDemoData, recordsFor, latestFor } from "../src/data/store";
import { ASTRONAUTS, CURRENT_DAY } from "../src/types";
import tepc from "../src/data/tepc.json";

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name} ${detail}`); }
}

console.log("— Seed data —");
const seed = buildSeedRecords();
check("seed has 3 astronauts x (CURRENT_DAY-1) days", seed.length === 3 * (CURRENT_DAY - 1), `got ${seed.length}`);
check("seed is deterministic", JSON.stringify(buildSeedRecords()) === JSON.stringify(seed));
check("every seed record has all core fields", seed.every(r => r.heartRate != null && r.sleepHours != null && r.exerciseMinutes != null && r.fatigue != null && r.stress != null));
check("seed values in sane ranges", seed.every(r => r.heartRate! >= 50 && r.heartRate! <= 100 && r.sleepHours! >= 4 && r.sleepHours! <= 10 && r.fatigue! >= 1 && r.fatigue! <= 10));

console.log("— Flag engine —");
const maya = recordsFor(seed, "AST-002", CURRENT_DAY - 1);
const mayaFlags = computeFlags(maya);
check("Maya (short nights) gets a Sleep flag", mayaFlags.some(f => f.metric === "Sleep"), JSON.stringify(mayaFlags));
check("Maya gets a Fatigue flag", mayaFlags.some(f => f.metric === "Fatigue"));
const samir = recordsFor(seed, "AST-003", CURRENT_DAY - 1);
check("Samir (stress rise) gets a Stress flag", computeFlags(samir).some(f => f.metric === "Stress"));
const alex = recordsFor(seed, "AST-001", CURRENT_DAY - 1);
check("Alex has no sleep/fatigue/stress flags", !computeFlags(alex).some(f => ["Sleep", "Fatigue", "Stress"].includes(f.metric)), JSON.stringify(computeFlags(alex)));
check("flags need >=2 records", computeFlags(seed.slice(0, 1)).length === 0);
check("flags explain themselves (message mentions the day)", mayaFlags.every(f => f.message.includes("day")));

console.log("— Store / localStorage —");
resetDemoData();
check("check-ins start empty", loadCheckIns().length === 0);
saveCheckIn({ astronautId: "AST-001", day: CURRENT_DAY, heartRate: 88, sleepHours: 5.0, fatigue: 8, source: "check-in" });
const after = loadCheckIns();
check("check-in persists to localStorage", after.length === 1 && after[0].heartRate === 88);
const merged = allRecords(after);
const alexLatest = latestFor(merged, "AST-001", CURRENT_DAY);
check("check-in becomes the latest record", alexLatest?.day === CURRENT_DAY && alexLatest?.heartRate === 88 && alexLatest?.source === "check-in");
check("empty fields stay empty (no invented values)", alexLatest?.exerciseMinutes === undefined && alexLatest?.mood === undefined);
saveCheckIn({ astronautId: "AST-001", day: CURRENT_DAY, heartRate: 70, source: "check-in" });
check("re-saving same day replaces, not duplicates", loadCheckIns().length === 1 && loadCheckIns()[0].heartRate === 70);
resetDemoData();
check("reset clears check-ins", loadCheckIns().length === 0);
check("day filter works (day 5 has no day-6+ data)", recordsFor(allRecords([]), "AST-001", 5).every(r => r.day <= 5));

console.log("— TEPC (real NASA data) —");
check("TEPC dataset id", tepc.dataset === "ISS_DOSANL_TEPC");
check("TEPC variable is DOSE with units uGy/min", tepc.variable === "DOSE" && tepc.units === "uGy/min");
check("TEPC has 192 samples", tepc.samples.length === 192, `got ${tepc.samples.length}`);
check("TEPC samples are real numbers in a sane range", tepc.samples.every(s => typeof s.v === "number" && s.v > 0 && s.v < 50));
check("TEPC timestamps parse and ascend", tepc.samples.every((s, i) => !isNaN(Date.parse(s.t)) && (i === 0 || Date.parse(s.t) > Date.parse(tepc.samples[i - 1].t))));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
