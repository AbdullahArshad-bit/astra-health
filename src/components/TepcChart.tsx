import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import tepc from "../data/tepc.json";

export interface TepcMeta {
  datasetLabel: string; variable: string; variableDescription: string; units: string;
  source: string; sourceUrl: string; retrieved: string; cadence: string; thinning: string;
  window: { start: string; end: string; recordsRetrieved: number };
  count: number; min: number; max: number; avg: number;
}

export function tepcMeta(): TepcMeta {
  const vals = tepc.samples.map((s) => s.v);
  return {
    datasetLabel: tepc.datasetLabel, variable: tepc.variable,
    variableDescription: tepc.variableDescription, units: tepc.units,
    source: tepc.source, sourceUrl: tepc.sourceUrl, retrieved: tepc.retrieved,
    cadence: tepc.cadence, thinning: tepc.thinning, window: tepc.window,
    count: vals.length,
    min: Math.min(...vals), max: Math.max(...vals),
    avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 1000) / 1000,
  };
}

export function tepcChartData() {
  return tepc.samples.map((s) => ({
    t: new Date(s.t).toLocaleString("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    dose: s.v,
  }));
}

export default function TepcChart({ height = 190 }: { height?: number }) {
  const meta = tepcMeta();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={tepcChartData()} margin={{ top: 8, right: 10, bottom: 0, left: -6 }}>
        <defs>
          <linearGradient id="g-tepc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(160,210,255,.09)" vertical={false} />
        <XAxis dataKey="t" tick={{ fontSize: 11, fill: "#93a7c9" }} tickLine={false} axisLine={false} minTickGap={60} />
        <YAxis tick={{ fontSize: 11.5, fill: "#93a7c9" }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "rgba(8, 20, 42, 0.92)", border: "1px solid rgba(160,210,255,.25)", borderRadius: 10, color: "#eaf3ff", fontSize: 12.5 }}
          formatter={(v) => [`${v} ${meta.units}`, "Dose rate"]}
        />
        <Area type="monotone" dataKey="dose" stroke="#22d3ee" strokeWidth={2} fill="url(#g-tepc)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
