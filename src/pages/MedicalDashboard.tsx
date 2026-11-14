import { ASTRONAUTS, type HealthRecord } from "../types";
import { recordsFor, latestFor } from "../data/store";
import { computeFlags } from "../data/flags";
import { FlagList, MultiTrend } from "../components/ui";
import TepcChart, { tepcMeta } from "../components/TepcChart";
import { IconHeart, IconMoon, IconActivity, IconBattery, IconAlert, IconCheck } from "../components/icons";

export default function MedicalDashboard({
  records, day, onOpenProfile, onOpenResearch,
}: {
  records: HealthRecord[];
  day: number;
  onOpenProfile: (id: string) => void;
  onOpenResearch: () => void;
}) {
  const meta = tepcMeta();
  return (
    <div>
      <div className="row spread mb">
        <div>
          <div className="eyebrow" style={{ marginBottom: 4, maxWidth: 340 }}>Flight Medicine · Whole Crew</div>
          <h2 style={{ margin: 0, fontSize: 26 }}>Mission overview</h2>
          <div className="muted small">All crew · showing records up to mission day {day}</div>
        </div>
        <span className="chip demo">Crew data is fictional demo data</span>
      </div>

      <div className="grid three-col mb">
        {ASTRONAUTS.map((a) => {
          const history = recordsFor(records, a.id, day);
          const latest = latestFor(records, a.id, day);
          const flags = computeFlags(history);
          const trend = history.map((r) => ({ day: r.day, sleep: r.sleepHours, fatigue: r.fatigue }));
          return (
            <div key={a.id} className="glass pad clickable" onClick={() => onOpenProfile(a.id)}>
              <div className="row">
                <div className="avatar" style={{ background: `linear-gradient(135deg, ${a.accent}, #2563eb)` }}>{a.initials}</div>
                <div>
                  <div className="row" style={{ gap: 7 }}>
                    <span className={`status-dot ${flags.length > 0 ? "warn" : "ok"}`} />
                    <span style={{ fontWeight: 700, fontSize: 16.5 }}>{a.name}</span>
                  </div>
                  <div className="muted small">{a.role} · {a.id}</div>
                </div>
              </div>
              {latest ? (
                <>
                  <div className="row mt" style={{ gap: 14 }}>
                    <span className="small" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><IconHeart /> <b>{latest.heartRate ?? "—"}</b> bpm</span>
                    <span className="small" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><IconMoon /> <b>{latest.sleepHours ?? "—"}</b> h</span>
                    <span className="small" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><IconActivity /> <b>{latest.exerciseMinutes ?? "—"}</b> min</span>
                    <span className="small" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><IconBattery /> <b>{latest.fatigue ?? "—"}</b>/10 fatigue</span>
                  </div>
                  <div className="muted small mt">
                    Mood {latest.mood ?? "—"} · Stress {latest.stress ?? "—"}/10 · Day {latest.day}
                  </div>
                  <div className="mt">
                    <div className="muted small mb">Sleep &amp; fatigue trend</div>
                    <MultiTrend data={trend} height={110} series={[
                      { key: "sleep", color: "#a78bfa", name: "Sleep (h)" },
                      { key: "fatigue", color: "#fbbf24", name: "Fatigue (/10)" },
                    ]} />
                  </div>
                  <div className="mt">
                    {flags.length > 0
                      ? <span className="chip demo"><IconAlert /> {flags.length} unusual change{flags.length > 1 ? "s" : ""} — open profile</span>
                      : <span className="chip live"><IconCheck /> No unusual changes</span>}
                  </div>
                </>
              ) : (
                <p className="muted small mt">No records up to day {day}.</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid two-col">
        <div className="glass pad">
          <h3 style={{ margin: "0 0 10px" }}>Unusual changes to review</h3>
          <div className="grid" style={{ gap: 16 }}>
            {ASTRONAUTS.map((a) => {
              const flags = computeFlags(recordsFor(records, a.id, day));
              return (
                <div key={a.id}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{a.name} <span className="muted small">({a.id})</span></div>
                  <FlagList flags={flags} emptyText={`no unusual changes for ${a.name.split(" ")[0]} up to day ${day}.`} />
                </div>
              );
            })}
          </div>
          <p className="muted small mt">
            Flags compare each astronaut with their own recent records. They are a prompt to check in — never a diagnosis.
          </p>
        </div>

        <div className="glass pad clickable" onClick={onOpenResearch}>
          <div className="row spread">
            <h3 style={{ margin: 0 }}>ISS radiation — NASA TEPC</h3>
            <span className="chip nasa">Real NASA data</span>
          </div>
          <p className="muted small" style={{ margin: "6px 0 8px" }}>
            {meta.variableDescription} ({meta.variable}) in {meta.units}, measured by the Tissue Equivalent
            Proportional Counter aboard the ISS. Sample: {meta.count} genuine measurements,
            Jan 2018 · average {meta.avg} {meta.units}, peak {meta.max} {meta.units}.
          </p>
          <TepcChart height={150} />
          <span className="small" style={{ color: "var(--accent)", fontWeight: 600 }}>Open the full NASA research page →</span>
        </div>
      </div>
    </div>
  );
}
