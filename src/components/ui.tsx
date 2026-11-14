import type { ReactNode } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from "recharts";
import type { Flag } from "../types";

export function Kpi({ label, value, unit, sub }: { label: string; value: ReactNode; unit?: string; sub?: string }) {
  return (
    <div className="glass kpi">
      <div className="label">{label}</div>
      <div className="value">{value}{unit && <span className="unit">{unit}</span>}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export function FlagList({ flags, emptyText }: { flags: Flag[]; emptyText: string }) {
  if (flags.length === 0) {
    return <div className="ok-note"><b>✓ Steady</b> — {emptyText}</div>;
  }
  return (
    <div className="grid" style={{ gap: 10 }}>
      {flags.map((f, i) => (
        <div className="flag" key={i}>
          <span aria-hidden>⚠</span>
          <span><b>{f.metric}:</b> {f.message}</span>
        </div>
      ))}
    </div>
  );
}

const axisStyle = { fontSize: 11.5, fill: "#93a7c9" };
const tooltipStyle = {
  background: "rgba(8, 20, 42, 0.92)", border: "1px solid rgba(160,210,255,.25)",
  borderRadius: 10, color: "#eaf3ff", fontSize: 12.5,
};

export function TrendChart({
  data, dataKey, color, unit, height = 180,
}: {
  data: Record<string, unknown>[]; dataKey: string; color: string; unit: string; height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(160,210,255,.09)" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(d: number) => `D${d}`} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(d) => `Mission day ${d}`} formatter={(v) => [`${v} ${unit}`, ""]} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.4} fill={`url(#g-${dataKey})`} dot={false} connectNulls />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiTrend({
  data, series, height = 200,
}: {
  data: Record<string, unknown>[]; series: { key: string; color: string; name: string }[]; height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -18 }}>
        <CartesianGrid stroke="rgba(160,210,255,.09)" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(d: number) => `D${d}`} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(d) => `Mission day ${d}`} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.2} dot={false} connectNulls />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
