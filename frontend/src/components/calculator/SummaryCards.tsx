import { formatINR } from "../../utils/calculator";

interface Props {
  invested: number;
  returns: number;
  total: number;
  years: number;
}

export default function SummaryCards({ invested, returns, total, years }: Props) {
  const multiplier = invested > 0 ? (total / invested).toFixed(2) : "—";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      <Card
        label="Total Invested"
        value={formatINR(invested)}
        sub="your contributions"
        bg="var(--surface)"
        border="var(--border)"
        valueColor="#6B7280"
      />
      <Card
        label="Returns Earned"
        value={formatINR(returns)}
        sub="wealth created"
        bg="#FEF9C3"
        border="#FDE68A"
        valueColor="#D97706"
      />
      <Card
        label="Maturity Amount"
        value={formatINR(total)}
        sub={`after ${years} year${years !== 1 ? "s" : ""}`}
        bg="var(--primary)"
        border="var(--primary)"
        valueColor="#fff"
        labelColor="rgba(255,255,255,0.7)"
        subColor="rgba(255,255,255,0.5)"
        big
      />
      <Card
        label="Wealth Multiplier"
        value={`${multiplier}×`}
        sub="times your money"
        bg="var(--surface)"
        border="var(--border)"
        valueColor="#059669"
      />
    </div>
  );
}

interface CardProps {
  label: string;
  value: string;
  sub: string;
  bg: string;
  border: string;
  valueColor: string;
  labelColor?: string;
  subColor?: string;
  big?: boolean;
}

function Card({ label, value, sub, bg, border, valueColor, labelColor, subColor, big }: CardProps) {
  return (
    <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: labelColor ?? "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: big ? 26 : 22, fontWeight: 800, color: valueColor, lineHeight: 1.1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: subColor ?? "var(--text-muted)" }}>
        {sub}
      </div>
    </div>
  );
}
