import { ASTRONAUTS, CURRENT_DAY, type HealthRecord } from "../types";
import { recordsFor, latestFor } from "../data/store";
import { Kpi, TrendChart } from "../components/ui";

export default function AstronautDashboard({
  records, astronautId, day, onSelectAstronaut, onCheckIn,
}: {
  records: HealthRecord[];
  astronautId: string;
  day: number;
  onSelectAstronaut: (id: string) => void;
  onCheckIn: () => void;
}) {
  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!;
  const history = recordsFor(records, astronautId, day);
  const latest = latestFor(records, astronautId, day);
  const chartData = history.map((r) => ({ day: r.day, heartRate: r.heartRate, sleepHours: r.sleepHours }));
  const recent = [...history].slice(-7).reverse();

  return (
    <div>
      <div className="glass pad mb">
        <div className="row spread">
          <div className="row">
            <div className="avatar" style={{ background: `linear-gradient(135deg, ${astronaut.accent}, #2563eb)`, width: 58, height: 58, fontSize: 20 }}>
              {astronaut.initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 24 }}>{astronaut.name}</h2>
              <div className="muted small">{astronaut.role} · {astronaut.id} · Mission day {day} of 30</div>
            </div>
          </div>
          <button className="btn btn-primary btn-big" onClick={onCheckIn}>
            ✚ Daily Check-in {day < CURRENT_DAY ? `(for day ${CURRENT_DAY})` : ""}
          </button>
        </div>
        <div className="row mt">
          <span className="small muted">Demo profile:</span>
          {ASTRONAUTS.map((a) => (
            <button key={a.id} className={`btn ${a.id === astronautId ? "btn-primary" : ""}`} onClick={() => onSelectAstronaut(a.id)}>
              {a.name}
            </button>
          ))}
          <span className="chip demo">Fictional demonstration data</span>
        </div>
      </div>

      {latest ? (
        <>
          <div className="grid kpi-grid mb">
            <Kpi label="Heart rate" value={latest.heartRate ?? "—"} unit="bpm" sub={`Day ${latest.day}`} />
            <Kpi label="Sleep" value={latest.sleepHours ?? "—"} unit="hrs" sub={`Night before day ${latest.day}`} />
            <Kpi label="Exercise" value={latest.exerciseMinutes ?? "—"} unit="min" sub={`Day ${latest.day}`} />
            <Kpi label="Fatigue" value={latest.fatigue ?? "—"} unit="/ 10" sub={`Day ${latest.day}`} />
          </div>

          <div className="glass pad mb">
            <div className="row" style={{ gap: 8 }}>
              <span className="chip">Mood: <b>&nbsp;{latest.mood ?? "—"}</b></span>
              <span className="chip">Stress: <b>&nbsp;{latest.stress ?? "—"}/10</b></span>
              <span className="chip">Loneliness: <b>&nbsp;{latest.loneliness ?? "—"}/10</b></span>
              <span className="chip">Motivation: <b>&nbsp;{latest.motivation ?? "—"}</b></span>
              <span className="chip">Condition: <b>&nbsp;{latest.condition ?? "—"}</b></span>
              <span className="chip">Pain: <b>&nbsp;{latest.pain ?? "—"}</b></span>
            </div>
          </div>

          <div className="grid two-col mb">
            <div className="glass pad">
              <h3 style={{ margin: "0 0 6px" }}>Heart rate trend</h3>
              <div className="muted small mb">Resting heart rate (bpm), days 1–{day}</div>
              <TrendChart data={chartData} dataKey="heartRate" color="#38bdf8" unit="bpm" />
            </div>
            <div className="glass pad">
              <h3 style={{ margin: "0 0 6px" }}>Sleep trend</h3>
              <div className="muted small mb">Hours of sleep per night, days 1–{day}</div>
              <TrendChart data={chartData} dataKey="sleepHours" color="#a78bfa" unit="hrs" />
            </div>
          </div>

          <div className="glass pad">
            <h3 style={{ margin: "0 0 10px" }}>Recent check-ins</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Day</th><th>Heart rate</th><th>Sleep</th><th>Exercise</th><th>Fatigue</th><th>Mood</th><th>Stress</th><th>Source</th></tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.day}>
                      <td><b>Day {r.day}</b></td>
                      <td>{r.heartRate ?? "—"} bpm</td>
                      <td>{r.sleepHours ?? "—"} h</td>
                      <td>{r.exerciseMinutes ?? "—"} min</td>
                      <td>{r.fatigue ?? "—"}/10</td>
                      <td>{r.mood ?? "—"}</td>
                      <td>{r.stress ?? "—"}/10</td>
                      <td>{r.source === "check-in" ? <span className="chip live">Your check-in</span> : <span className="muted small">Demo seed</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="glass pad">No records yet for this astronaut up to day {day}.</div>
      )}
    </div>
  );
}
