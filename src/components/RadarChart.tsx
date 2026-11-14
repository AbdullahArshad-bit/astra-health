import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import radlab from "../data/radlab.json";
import eda from "../data/eda.json";

const tooltipStyle = {
  background: "rgba(8, 20, 42, 0.92)", border: "1px solid rgba(160,210,255,.25)",
  borderRadius: 10, color: "#eaf3ff", fontSize: 12.5,
};
const axisTick = { fontSize: 11.5, fill: "#93a7c9" };

export interface RadlabSeriesMeta {
  id: string; instrumentId: string; instrument: string; module: string;
  variableDescription: string; units: string; cadence: string; queryUrl: string;
  count: number; retrieved: number; min: number; max: number; avg: number;
  windowStart: string; windowEnd: string; thinning: string;
}

export function radlabSeriesMeta(id: string): RadlabSeriesMeta {
  const s = radlab.series.find((x) => x.id === id)!;
  const vals = s.samples.map((x) => x.v);
  return {
    id: s.id, instrumentId: s.instrumentId, instrument: s.instrument, module: s.module,
    variableDescription: s.variableDescription, units: s.units, cadence: s.cadence,
    queryUrl: s.queryUrl, count: vals.length, retrieved: s.window.recordsRetrieved,
    min: Math.round(Math.min(...vals) * 1000) / 1000, max: Math.round(Math.max(...vals) * 1000) / 1000,
    avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100,
    windowStart: s.window.start, windowEnd: s.window.end, thinning: s.thinning,
  };
}

export function radlabMeta() {
  return { source: radlab.source, sourceUrl: radlab.sourceUrl, apiDocUrl: radlab.apiDocUrl, retrieved: radlab.retrieved };
}

export function edaMeta() {
  const vals = (k: "temp" | "rh" | "co2") => eda.samples.map((s) => s[k]);
  const stat = (k: "temp" | "rh" | "co2") => {
    const v = vals(k);
    return {
      min: Math.min(...v), max: Math.max(...v),
      avg: Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100,
    };
  };
  return {
    source: eda.source, sourceUrl: eda.sourceUrl, dashboardUrl: eda.dashboardUrl,
    mission: eda.mission, retrieved: eda.retrieved, context: eda.context,
    variables: eda.variables, cadence: eda.cadence, thinning: eda.thinning,
    window: eda.window, count: eda.samples.length,
    temp: stat("temp"), rh: stat("rh"), co2: stat("co2"),
  };
}

const fmtTime = (t: string) =>
  new Date(t.replace(" ", "T") + (t.includes("T") ? "" : "Z")).toLocaleString("en-GB", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
const fmtDay = (t: string) =>
  new Date(t).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "2-digit" });

export function DostelChart({ height = 250 }: { height?: number }) {
  const meta = radlabSeriesMeta("dostel1-2018-01-01");
  const s = radlab.series.find((x) => x.id === "dostel1-2018-01-01")!;
  const data = s.samples.map((x) => ({ t: fmtTime(x.t), dose: x.v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -6 }}>
        <defs>
          <linearGradient id="g-dostel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(160,210,255,.09)" vertical={false} />
        <XAxis dataKey="t" tick={axisTick} tickLine={false} axisLine={false} minTickGap={60} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toFixed(2)} ${meta.units}`, "Dose rate"]} />
        <Area type="monotone" dataKey="dose" stroke="#fbbf24" strokeWidth={2} fill="url(#g-dostel)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TepcDailyChart({ height = 220 }: { height?: number }) {
  const meta = radlabSeriesMeta("ivtepc-nod2pd3-daily");
  const s = radlab.series.find((x) => x.id === "ivtepc-nod2pd3-daily")!;
  const data = s.samples.map((x) => ({ t: fmtDay(x.t), dose: x.v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -6 }}>
        <defs>
          <linearGradient id="g-ivtepc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(160,210,255,.09)" vertical={false} />
        <XAxis dataKey="t" tick={axisTick} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toFixed(2)} ${meta.units}`, "Daily dose rate"]} />
        <Area type="monotone" dataKey="dose" stroke="#22d3ee" strokeWidth={2} fill="url(#g-ivtepc)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const edaUnits: Record<string, string> = { Temperature: "°C", "Relative humidity": "%", "Carbon dioxide": "ppm" };

export function EdaChart({ height = 240 }: { height?: number }) {
  const data = eda.samples.map((s) => ({
    t: fmtTime(s.t), Temperature: s.temp, "Relative humidity": s.rh, "Carbon dioxide": s.co2,
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: -14 }}>
        <CartesianGrid stroke="rgba(160,210,255,.09)" vertical={false} />
        <XAxis dataKey="t" tick={axisTick} tickLine={false} axisLine={false} minTickGap={60} />
        <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v, name) => [`${v} ${edaUnits[name as string] ?? ""}`, name]}
        />
        <Legend wrapperStyle={{ fontSize: 12.5 }} />
        <Line yAxisId="left" type="monotone" dataKey="Temperature" stroke="#fb923c" strokeWidth={2} dot={false} />
        <Line yAxisId="left" type="monotone" dataKey="Relative humidity" stroke="#38bdf8" strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="Carbon dioxide" stroke="#a78bfa" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
