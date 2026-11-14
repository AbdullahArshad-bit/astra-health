import { ASTRONAUTS, type HealthRecord } from "../types";
import { recordsFor } from "../data/store";
import { computeFlags } from "../data/flags";
import { FlagList, MultiTrend, TrendChart } from "../components/ui";

export default function AstronautProfile({
  records, astronautId, day, onBack,
}: {
  records: HealthRecord[];
  astronautId: string;
  day: number;
  onBack: () => void;
}) {
  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!;
  const history = recordsFor(records, astronautId, day);
  const flags = computeFlags(history);
  const trend = history.map((r) => ({ day: r.day, sleep: r.sleepHours, fatigue: r.fatigue, stress: r.stress }));
  const rows = [...history].reverse();

  return (
    <div>
      <button className="btn mb" onClick={onBack}>← Back to mission overview</button>
      <div className="glass pad mb">
        <div className="row">
          <div className="avatar" style={{ background: `linear-gradient(135deg, ${astronaut.accent}, #2563eb)`, width: 58, height: 58, fontSize: 20 }}>
            {astronaut.initials}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 24 }}>{astronaut.name}</h2>
            <div className="muted small">{astronaut.role} · {astronaut.id} · history up to mission day {day}</div>
          </div>
          <span className="chip demo" style={{ marginLeft: "auto" }}>Fictional demonstration data</span>
        </div>
      </div>

      <div className="glass pad mb">
        <h3 style={{ margin: "0 0 10px" }}>Unusual-change flags</h3>
        <FlagList flags={flags} emptyText="nothing unusual compared with this astronaut's own recent records." />
      </div>

      <div className="grid two-col mb">
        <div className="glass pad">
          <h3 style={{ margin: "0 0 6px" }}>Sleep &amp; fatigue</h3>
          <MultiTrend data={trend} series={[
            { key: "sleep", color: "#a78bfa", name: "Sleep (h)" },
            { key: "fatigue", color: "#fbbf24", name: "Fatigue (/10)" },
          ]} />
        </div>
        <div className="glass pad">
          <h3 style={{ margin: "0 0 6px" }}>Heart rate</h3>
          <TrendChart data={history.map((r) => ({ day: r.day, heartRate: r.heartRate }))} dataKey="heartRate" color="#38bdf8" unit="bpm" height={200} />
        </div>
      </div>

      <div className="glass pad">
        <h3 style={{ margin: "0 0 10px" }}>Full check-in history</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Day</th><th>HR</th><th>Sleep</th><th>Exercise</th><th>Fatigue</th><th>Pain</th><th>Condition</th><th>Mood</th><th>Stress</th><th>Lonely</th><th>Motivation</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.day}>
                  <td><b>{r.day}</b></td>
                  <td>{r.heartRate ?? "—"}</td>
                  <td>{r.sleepHours ?? "—"}</td>
                  <td>{r.exerciseMinutes ?? "—"}</td>
                  <td>{r.fatigue ?? "—"}</td>
                  <td>{r.pain ?? "—"}</td>
                  <td>{r.condition ?? "—"}</td>
                  <td>{r.mood ?? "—"}</td>
                  <td>{r.stress ?? "—"}</td>
                  <td>{r.loneliness ?? "—"}</td>
                  <td>{r.motivation ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
