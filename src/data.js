import { dailyData } from "./data/index";

export { dailyData };
export const ACCENT = [
  "#0ea5e9",
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];
export const ALL_LOCATIONS = [
  "Atlanta",
  "Tampa",
  "Charlotte",
  "Charlotte NEW",
  "Miami",
  "Jacksonville",
  "Philadelphia",
];
export const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MAX_DATE = "2026-06-29";
export function calcSummary(loc, month) {
  const prefixes = {
    1: "2026-01",
    2: "2026-02",
    3: "2026-03",
    4: "2026-04",
    5: "2026-05",
    6: "2026-06",
  };
  const prefix = prefixes[month] || "2026-06";
  const rows = dailyData.filter(
    (d) => d.location === loc && d.date.startsWith(prefix)
  );
  const leads = rows.reduce((sum, row) => sum + row.leads, 0);
  const spend = rows.reduce((sum, row) => sum + row.spend, 0);
  return { leads, spend, cpl: leads ? Math.round(spend / leads) : 0 };
}
export const summary = ALL_LOCATIONS.map((loc) => {
  const jan = calcSummary(loc, 1);
  const feb = calcSummary(loc, 2);
  const mar = calcSummary(loc, 3);
  const apr = calcSummary(loc, 4);
  const jun = calcSummary(loc, 6);
  return {
    location: loc,
    leadsJan: jan.leads,
    spendJan: jan.spend,
    cplJan: jan.cpl,
    leadsFeb: feb.leads,
    spendFeb: feb.spend,
    cplFeb: feb.cpl,
    leadsMar: mar.leads,
    spendMar: mar.spend,
    cplMar: mar.cpl,
    leadsApr: apr.leads,
    spendApr: apr.spend,
    cplApr: apr.cpl,
    leadsJun: jun.leads,
    spendJun: jun.spend,
    cplJun: jun.cpl,
  };
});
export function buildWeeklyData(locs, from, to) {
  const filtered = dailyData.filter(
    (d) => locs.includes(d.location) && d.date >= from && d.date <= to
  );
  const weeks = {};
  filtered.forEach((d) => {
    const dObj = new Date(d.date + "T12:00:00");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const wk = `${monthNames[dObj.getMonth()]} W${Math.ceil(
      dObj.getDate() / 7
    )}`;
    if (!weeks[wk]) weeks[wk] = { week: wk, leads: 0, spend: 0 };
    weeks[wk].leads += d.leads;
    weeks[wk].spend += d.spend;
  });
  return Object.values(weeks).map((w) => ({
    ...w,
    cpl: w.leads ? Math.round(w.spend / w.leads) : 0,
  }));
}
