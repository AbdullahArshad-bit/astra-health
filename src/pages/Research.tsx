import TepcChart, { tepcMeta } from "../components/TepcChart";
import tepc from "../data/tepc.json";
import { Kpi } from "../components/ui";
import { IconAlert } from "../components/icons";

export default function Research() {
  const meta = tepcMeta();
  const tableRows = tepc.samples.filter((_, i) => i % 16 === 0);
  return (
    <div>
      <div className="row spread mb">
        <div>
          <h2 style={{ margin: 0, fontSize: 26 }}>NASA research — ISS radiation (TEPC)</h2>
          <div className="muted small">Genuine measurements from NASA's CDAWeb archive — nothing on this page is simulated.</div>
        </div>
        <span className="chip nasa">Real NASA data</span>
      </div>

      <div className="grid kpi-grid mb">
        <Kpi label="Average dose rate" value={meta.avg} unit={meta.units} sub={`${meta.count} measurements`} />
        <Kpi label="Peak dose rate" value={meta.max} unit={meta.units} sub="Highest single reading in sample" />
        <Kpi label="Lowest dose rate" value={meta.min} unit={meta.units} sub="Lowest single reading in sample" />
        <Kpi label="Sample window" value="Jan 1–4" unit="2018" sub="Dataset coverage: 2010–2018" />
      </div>

      <div className="glass pad mb">
        <h3 style={{ margin: "0 0 4px" }}>{meta.variableDescription} — variable {meta.variable} ({meta.units})</h3>
        <p className="muted small mb">
          The Tissue Equivalent Proportional Counter (TEPC) is an instrument aboard the International Space
          Station that measures the radiation environment inside the station. Readings rise and fall as the
          station orbits — for example when it passes through the South Atlantic Anomaly, where Earth's
          magnetic shield is weaker.
        </p>
        <TepcChart height={250} />
        <p className="muted small mt">
          Source: {meta.source} · Dataset: {meta.datasetLabel} (ISS_DOSANL_TEPC) · Retrieved {meta.retrieved} ·{" "}
          <a href={meta.sourceUrl} target="_blank" rel="noreferrer">Open the dataset at NASA CDAWeb</a>
        </p>
      </div>

      <div className="grid two-col mb">
        <div className="glass pad">
          <h3 style={{ margin: "0 0 8px", display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "var(--warn)", display: "flex" }}><IconAlert /></span> What this data is — and is not</h3>
          <p style={{ fontSize: 14, lineHeight: 1.65 }}>
            This dataset measures the <b>environmental radiation around and inside the ISS</b> — it is{" "}
            <b>not</b> the personal radiation exposure of any individual astronaut. No astronaut in this app
            is linked to these readings. Personal dose monitoring uses separate instruments worn by crew
            members, which are not part of this dataset.
          </p>
        </div>
        <div className="glass pad">
          <h3 style={{ margin: "0 0 8px" }}>How this sample was prepared</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.65 }}>
            The dataset records one measurement every minute ({meta.cadence}). Our sample covers{" "}
            {new Date(meta.window.start).toUTCString()} to {new Date(meta.window.end).toUTCString()} —{" "}
            {meta.window.recordsRetrieved.toLocaleString()} genuine records, of which every 30th is shown
            ({meta.count} points). {meta.thinning} Values and timestamps are exactly as published by NASA.
          </p>
        </div>
      </div>

      <div className="glass pad">
        <h3 style={{ margin: "0 0 10px" }}>Sample of the measurements</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date &amp; time (UTC)</th><th>Variable</th><th>Value</th><th>Units</th></tr></thead>
            <tbody>
              {tableRows.map((s, i) => (
                <tr key={i}>
                  <td>{new Date(s.t).toUTCString()}</td>
                  <td>{meta.variable}</td>
                  <td><b>{s.v}</b></td>
                  <td>{meta.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small mt">Showing every 16th of the {meta.count} charted points. Full method and variable list: SCIENTIFIC_REFERENCES.md in the project.</p>
      </div>
    </div>
  );
}
