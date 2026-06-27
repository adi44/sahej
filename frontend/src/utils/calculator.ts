export interface Scheme {
  id: string;
  label: string;
  rate: number;
  tag: string;
  safe: boolean;
}

export interface YearlyDataPoint {
  year: string;
  invested: number;
  returns: number;
  total: number;
}

export function sipFV(monthly: number, years: number, annualRate: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

export function buildYearlyData(monthly: number, years: number, rate: number): YearlyDataPoint[] {
  return Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const invested = monthly * y * 12;
    const total = sipFV(monthly, y, rate);
    return {
      year: `Yr ${y}`,
      invested: Math.round(invested),
      returns: Math.round(total - invested),
      total: Math.round(total),
    };
  });
}

export function formatINR(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
