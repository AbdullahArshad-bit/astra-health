import { useState } from "react";
import { ASTRONAUTS, CURRENT_DAY, type HealthRecord } from "../types";

const numOrUndef = (v: string) => (v.trim() === "" ? undefined : Number(v));

export default function CheckInForm({
  astronautId, onSave, onCancel,
}: {
  astronautId: string;
  onSave: (rec: HealthRecord) => void;
  onCancel: () => void;
}) {
  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!;
  const [heartRate, setHeartRate] = useState("");
  const [sleep, setSleep] = useState("");
  const [exercise, setExercise] = useState("");
  const [fatigue, setFatigue] = useState(5);
  const [pain, setPain] = useState("None");
  const [condition, setCondition] = useState("Good");
  const [mood, setMood] = useState("Good");
  const [stress, setStress] = useState(4);
  const [loneliness, setLoneliness] = useState(3);
  const [motivation, setMotivation] = useState("Steady");
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      astronautId,
      day: CURRENT_DAY,
      heartRate: numOrUndef(heartRate),
      sleepHours: numOrUndef(sleep),
      exerciseMinutes: numOrUndef(exercise),
      fatigue, pain, condition, mood, stress, loneliness, motivation,
      source: "check-in",
    });
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="glass pad" style={{ textAlign: "center", padding: 44 }}>
        <div style={{ fontSize: 40 }}>✅</div>
        <h2>Check-in saved</h2>
        <p className="muted">Day {CURRENT_DAY} check-in for {astronaut.name} is stored in this browser and now shows on the dashboards.</p>
        <button className="btn btn-primary btn-big mt" onClick={onCancel}>Back to dashboard</button>
      </div>
    );
  }

  return (
    <form className="glass pad" onSubmit={submit}>
      <h2 style={{ margin: "0 0 4px" }}>Daily check-in — {astronaut.name}</h2>
      <p className="muted small mb">Mission day {CURRENT_DAY} · Leave a field empty if it was not measured — empty fields are never filled in for you.</p>

      <h3 style={{ margin: "18px 0 10px" }}>Physical health</h3>
      <div className="form-grid">
        <div>
          <label className="field" htmlFor="hr">Heart rate (bpm)</label>
          <input id="hr" type="number" min={30} max={220} placeholder="e.g. 68" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
        </div>
        <div>
          <label className="field" htmlFor="sleep">Sleep duration (hours)</label>
          <input id="sleep" type="number" min={0} max={24} step={0.1} placeholder="e.g. 7.2" value={sleep} onChange={(e) => setSleep(e.target.value)} />
        </div>
        <div>
          <label className="field" htmlFor="ex">Exercise duration (minutes)</label>
          <input id="ex" type="number" min={0} max={600} placeholder="e.g. 90" value={exercise} onChange={(e) => setExercise(e.target.value)} />
        </div>
        <div>
          <label className="field" htmlFor="fat">Fatigue — {fatigue}/10</label>
          <input id="fat" type="range" min={1} max={10} value={fatigue} onChange={(e) => setFatigue(Number(e.target.value))} />
        </div>
        <div>
          <label className="field" htmlFor="pain">Muscle / joint pain</label>
          <select id="pain" value={pain} onChange={(e) => setPain(e.target.value)}>
            <option>None</option><option>Mild</option><option>Moderate</option><option>Severe</option>
          </select>
        </div>
        <div>
          <label className="field" htmlFor="cond">Overall physical condition</label>
          <select id="cond" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
          </select>
        </div>
      </div>

      <h3 style={{ margin: "22px 0 10px" }}>Mental wellbeing</h3>
      <div className="form-grid">
        <div>
          <label className="field" htmlFor="mood">Mood</label>
          <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
            <option>Great</option><option>Good</option><option>Okay</option><option>Low</option><option>Bad</option>
          </select>
        </div>
        <div>
          <label className="field" htmlFor="stress">Stress — {stress}/10</label>
          <input id="stress" type="range" min={1} max={10} value={stress} onChange={(e) => setStress(Number(e.target.value))} />
        </div>
        <div>
          <label className="field" htmlFor="lone">Loneliness — {loneliness}/10</label>
          <input id="lone" type="range" min={1} max={10} value={loneliness} onChange={(e) => setLoneliness(Number(e.target.value))} />
        </div>
        <div>
          <label className="field" htmlFor="mot">Motivation</label>
          <select id="mot" value={motivation} onChange={(e) => setMotivation(e.target.value)}>
            <option>High</option><option>Steady</option><option>Low</option><option>Very low</option>
          </select>
        </div>
      </div>

      <div className="row mt" style={{ gap: 10 }}>
        <button type="submit" className="btn btn-primary btn-big">Save check-in</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
