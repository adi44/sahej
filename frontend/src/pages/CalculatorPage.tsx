import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { fetchSchemeRates } from "../api/schemes";
import { buildYearlyData, type Scheme } from "../utils/calculator";
import SchemePresets from "../components/calculator/SchemePresets";
import InputCard from "../components/calculator/InputCard";
import SummaryCards from "../components/calculator/SummaryCards";
import CorpusChart from "../components/calculator/CorpusChart";
import ComparisonTable from "../components/calculator/ComparisonTable";

export default function CalculatorPage() {
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [selected, setSelected] = useState<Scheme | null>(null);

  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(7.1);

  useEffect(() => {
    fetchSchemeRates()
      .then((s) => {
        setSchemes(s);
        if (s.length) { setSelected(s[0]); setRate(s[0].rate); }
      })
      .finally(() => setLoadingSchemes(false));
  }, []);

  function handleSelectScheme(s: Scheme) {
    setSelected(s);
    setRate(s.rate);
  }

  const chartData = useMemo(() => buildYearlyData(monthly, years, rate), [monthly, years, rate]);
  const last = chartData[chartData.length - 1] ?? { invested: 0, returns: 0, total: 0 };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 268, display: "flex", flexDirection: "column", background: "#0E3D20", color: "#fff", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={36} />
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px" }}>Sahej</span>
          </div>
        </div>

        <div style={{ padding: "12px 12px 8px" }}>
          <button
            onClick={() => navigate("/chat")}
            style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textAlign: "left", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          >
            ← Back to Chat
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <SchemePresets
            schemes={schemes}
            selected={selected}
            onSelect={handleSelectScheme}
            loading={loadingSchemes}
          />
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
          Rates fetched live. Returns are illustrative — actual results may vary.
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Investment Calculator</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              See how your savings grow — powered by live scheme rates
            </div>
          </div>
          {selected && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--primary-light)", borderRadius: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>{selected.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: selected.safe ? "#059669" : "#D97706" }}>
                {selected.safe ? "● Safe" : "◆ Market"}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <InputCard label="Monthly Investment" prefix="₹" value={monthly} onChange={setMonthly} min={100} max={500000} step={500} />
            <InputCard label="Duration" suffix=" yrs" value={years} onChange={setYears} min={1} max={40} step={1} />
            <InputCard label="Annual Return Rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.1} />
          </div>

          {/* Summary cards */}
          <SummaryCards
            invested={last.invested}
            returns={last.returns}
            total={last.total}
            years={years}
          />

          {/* Chart */}
          <CorpusChart data={chartData} years={years} />

          {/* Comparison table */}
          {schemes.length > 0 && (
            <ComparisonTable
              schemes={schemes}
              selected={selected}
              monthly={monthly}
              years={years}
              onSelect={handleSelectScheme}
            />
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}
