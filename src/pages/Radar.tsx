import { EdaChart, radlabMeta, radlabSeriesMeta, edaMeta } from "../components/RadarChart";
import radlab from "../data/radlab.json";
import { Kpi } from "../components/ui";
import { IconAlert } from "../components/icons";

const utc = (t: string) => new Date(t.includes("T") ? `${t}Z` : `${t.replace(" ", "T")}Z`).toUTCString();

export default function Radar() {
  const rl = radlabMeta();
  const dostel = radlabSeriesMeta("dostel1-2018-01-01");
  const ivtepc = radlabSeriesMeta("ivtepc-nod2pd3-daily");
  const eda = edaMeta();
  const dostelSeries = radlab.series.find((s) => s.id === "dostel1-2018-01-01")!;
  const tableRows = dostelSeries.samples.filter((_, i) => i % 16 === 0);

  return (
    <div>
      <div className="row spread mb">
        <div>
          <h2 style={{ margin: 0, fontSize: 26 }}>ASTRA RADAR – temperature, humidity and CO₂</h2>
          <div className="muted small">
            Historical measurements from NASA Environmental Data App (EDA) — Open Science Data Repository
            (OSDR) · Mission: Rodent Research-1 (RR-1) · Retrieved 2026-11-14 ·{" "}
            <a href={eda.sourceUrl} target="_blank" rel="noreferrer">Open EDA at NASA OSDR</a> ·{" "}
            <a href={eda.dashboardUrl} target="_blank" rel="noreferrer">Open the RR-1 dashboard</a>
          </div>
        </div>
        <span className="chip nasa">Real NASA data</span>
      </div>

      <div className="glass pad mb" style={{ borderLeft: "3px solid var(--accent)" }}>
        <div className="eyebrow">Historical NASA data — separate from the crew demo</div>
        <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
          The Astronaut and Medical Team pages of this app show <b>fictional demonstration data</b> for three
          invented crew members. This page is different: every reading below is a <b>genuine historical NASA
          measurement</b> from instruments flown on the ISS, retrieved from NASA's RadLab and Environmental
          Data App (EDA) on {rl.retrieved}. The readings are years old, are shown exactly as published, and
          no astronaut in this app is linked to any of them.
        </p>
      </div>

      <div className="grid kpi-grid mb">
        <Kpi label="ISS CO₂ average (EDA)" value={eda.co2.avg} unit="ppm" sub="Rodent Research-1 habitat, 1–3 Oct 2014" />
      </div>

      <div className="glass pad mb">
        <div className="eyebrow">EDA · Rodent Research-1 · ISS habitat</div>
        <h3 style={{ margin: "0 0 4px" }}>Inside the station — temperature, humidity and CO₂</h3>
        <p className="muted small mb">
          Environmental telemetry from NASA's Environmental Data App (EDA) for the Rodent Research-1
          mission (SpaceX-4): the habitat hardware's own sensors aboard the ISS, 1–3 October 2014 —
          after the animals had been transferred to the station. Recorded every 5 minutes; the chart
          shows every 6th record. Temperature and relative humidity use the left axis, CO₂ the right axis.
        </p>
        <EdaChart height={240} />
        <p className="muted small mt">
          Source: {eda.source} · Mission: {eda.mission} · Retrieved {eda.retrieved} ·{" "}
          <a href={eda.sourceUrl} target="_blank" rel="noreferrer">Open EDA at NASA OSDR</a> ·{" "}
          <a href={eda.dashboardUrl} target="_blank" rel="noreferrer">Open the RR-1 dashboard</a>
        </p>
      </div>

      <div className="grid two-col mb">
        <div className="glass pad">
          <h3 style={{ margin: "0 0 8px", display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "var(--warn)", display: "flex" }}><IconAlert /></span> What this data is — and is not</h3>
          <p style={{ fontSize: 14, lineHeight: 1.65 }}>
            RadLab collects <b>environmental radiation measurements from instruments aboard the ISS</b> —
            not the personal dose of any individual astronaut, and not a live feed: the newest reading on
            this page is from 2018. Units are each source's own: RadLab publishes absorbed dose rate in{" "}
            <b>μGy/hour</b>, while the CDAWeb TEPC page of this app uses uGy/min (1 uGy/min = 60 μGy/hour).
            The EDA readings come from one experiment's habitat sensors, not from whole-station
            life-support monitoring.
          </p>
        </div>
        <div className="glass pad">
          <h3 style={{ margin: "0 0 8px" }}>How these samples were prepared</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.65 }}>
            DosTel1: {dostel.retrieved.toLocaleString()} genuine readings for 1 Jan 2018; {dostel.thinning}{" "}
            IV-TEPC: {ivtepc.thinning} EDA: {eda.window.recordsRetrieved.toLocaleString()} genuine readings
            ({eda.cadence}); {eda.thinning} Values and timestamps are exactly as published by NASA —
            nothing was averaged, interpolated or invented. Full method: RADLAB-NOTES.md in the project.
          </p>
        </div>
      </div>

      <div className="glass pad">
        <h3 style={{ margin: "0 0 10px" }}>Sample of the measurements — DosTel1, 1 Jan 2018</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date &amp; time (UTC)</th><th>Instrument</th><th>Variable</th><th>Value</th><th>Units</th></tr></thead>
            <tbody>
              {tableRows.map((s, i) => (
                <tr key={i}>
                  <td>{utc(s.t)}</td>
                  <td>DosTel1</td>
                  <td>absorbed_dose_rate</td>
                  <td><b>{Number(s.v.toFixed(3))}</b></td>
                  <td>{dostel.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small mt">Showing every 16th of the {dostel.count} charted points. Full method and variable list: RADLAB-NOTES.md and SCIENTIFIC_REFERENCES.md in the project.</p>
      </div>
    </div>
  );
}
