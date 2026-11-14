export interface Astronaut {
  id: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
}

/** One daily health record. Numeric fields are optional: an empty
 *  check-in field stays empty — values are never invented. */
export interface HealthRecord {
  astronautId: string;
  day: number; // mission day 1..30
  heartRate?: number; // bpm
  sleepHours?: number; // hours
  exerciseMinutes?: number; // minutes
  fatigue?: number; // 1..10
  pain?: string; // None | Mild | Moderate | Severe
  condition?: string; // Excellent | Good | Fair | Poor
  mood?: string; // Great | Good | Okay | Low | Bad
  stress?: number; // 1..10
  loneliness?: number; // 1..10
  motivation?: string; // High | Steady | Low | Very low
  source: "demo-seed" | "check-in";
}

export interface Flag {
  metric: string;
  message: string;
}

export const ASTRONAUTS: Astronaut[] = [
  { id: "AST-001", name: "Alex Morgan", role: "Mission Commander", initials: "AM", accent: "#38bdf8" },
  { id: "AST-002", name: "Maya Chen", role: "Flight Engineer", initials: "MC", accent: "#a78bfa" },
  { id: "AST-003", name: "Samir Khan", role: "Medical & Science Officer", initials: "SK", accent: "#34d399" },
];

export const MISSION_DAYS = 30;
export const CURRENT_DAY = 21; // "today" inside the simulated mission
