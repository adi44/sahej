import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { YearlyDataPoint } from "../../utils/calculator";
import { formatINR } from "../../utils/calculator";

interface Props {
  data: YearlyDataPoint[];
  years: number;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0E3D20", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 13, minWidth: 190 }}>
      <div style={{ fontWeight: 600, marginBottom: 8, color: "rgba(255,255,255,0.6)" }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{formatINR(p.value)}</span>
        </div>
      ))}
      {payload.length >= 2 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Total</span>
          <span style={{ fontWeight: 700 }}>{formatINR(payload[0].value + payload[1].value)}</span>
        </div>
      )}
    </div>
  );
}

export default function CorpusChart({ data, years }: Props) {
  // Show every label when years <= 15, otherwise thin out
  const tickInterval = years <= 15 ? 0 : Math.floor(years / 8);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 12px 12px" }}>
      <div style={{ paddingLeft: 12, marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Corpus Growth</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
          Year-by-year breakdown of invested amount vs. returns earned
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 20, left: 20, bottom: 4 }}>
          <defs>
            <linearGradient id="gInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1C6B45" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#1C6B45" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gReturns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.65} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
          />
          <YAxis
            tickFormatter={formatINR}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            width={76}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />

          <Area
            type="monotone"
            dataKey="invested"
            name="Amount Invested"
            stroke="#1C6B45"
            strokeWidth={2}
            fill="url(#gInvested)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="returns"
            name="Returns Earned"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#gReturns)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
