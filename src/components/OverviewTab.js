import React from "react";
import { T, MiniCell, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS } from "../data";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Месяцы, по которым РЕАЛЬНО есть данные (динамически, без хардкода).
// Последний = текущий, предыдущий-с-данными = для сравнения (май пропущен — берётся апрель).
const monthsPresent = [...new Set(dailyData.map((d) => d.date.slice(0, 7)))].sort();
const CUR = monthsPresent[monthsPresent.length - 1] || "";
const PREV = monthsPresent[monthsPresent.length - 2] || "";
const curLabel = CUR ? MONTH_NAMES[Number(CUR.slice(5, 7)) - 1] : "";
const prevLabel = PREV ? MONTH_NAMES[Number(PREV.slice(5, 7)) - 1] : "";

function aggregate(prefix) {
  return ALL_LOCATIONS.map((loc) => {
    const rows = dailyData.filter(
      (d) => d.location === loc && d.date.startsWith(prefix)
    );
    const leads = rows.reduce((s, r) => s + r.leads, 0);
    const spend = rows.reduce((s, r) => s + r.spend, 0);
    return { location: loc, leads, spend, cpl: leads ? Math.round(spend / leads) : 0 };
  });
}

export const OverviewTab = () => {
  const cur = aggregate(CUR);
  const prevByLoc = Object.fromEntries(aggregate(PREV).map((p) => [p.location, p]));

  const totalLeads = cur.reduce((s, r) => s + r.leads, 0);
  const totalSpend = cur.reduce((s, r) => s + r.spend, 0);
  const avgCpl = totalLeads ? Math.round(totalSpend / totalLeads) : 0;

  // Таблица — крупнейшие рынки сверху
  const tableRows = cur.slice().sort((a, b) => b.leads - a.leads);

  // ── Авто-инсайт из реальных цифр текущего месяца ───────────────────────
  const active = cur.filter((r) => r.leads > 0);
  const green = active.filter((r) => r.cpl <= 45);
  const byCpl = active.slice().sort((a, b) => a.cpl - b.cpl);
  const best = byCpl[0];
  const worst = byCpl[byCpl.length - 1];

  let improved = null;
  let improvedDrop = 0;
  active.forEach((r) => {
    const p = prevByLoc[r.location];
    if (p && p.cpl > 0 && r.cpl > 0 && p.cpl - r.cpl > improvedDrop) {
      improvedDrop = p.cpl - r.cpl;
      improved = r.location;
    }
  });

  const notes = [];
  if (green.length) {
    notes.push(
      `${green.length} of ${active.length} active locations are in the green zone (CPL ≤ $45): ${green
        .map((g) => g.location)
        .join(", ")}.`
    );
  }
  if (best) notes.push(`Best efficiency: ${best.location} at $${best.cpl} CPL.`);
  if (improved && prevLabel)
    notes.push(`${improved} improved CPL by $${improvedDrop} vs ${prevLabel}.`);
  if (worst && worst.cpl > 55)
    notes.push(`Watch ${worst.location} — CPL is high at $${worst.cpl}.`);
  if (!notes.length) notes.push("No active locations with data this month yet.");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      <div
        style={{
          background: "#f5f2ec",
          border: "1px solid #c8c0b4",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 18,
            fontWeight: 900,
            color: "#0f172a",
          }}
        >
          Location Performance ({curLabel})
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #c8c0b4" }}>
              {["Location", "Leads", "CPL", "Spend"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 0",
                    textAlign: "left",
                    fontSize: 12,
                    color: "#334155",
                    textTransform: "uppercase",
                    fontWeight: 800,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #c8c0b4" }}>
                <td style={{ padding: "12px 0", fontWeight: 800, fontSize: 14 }}>
                  {s.location}
                </td>
                <td style={{ padding: "12px 0", fontWeight: 900, fontSize: 15 }}>
                  {s.leads}
                </td>
                <td
                  style={{
                    padding: "12px 0",
                    fontWeight: 900,
                    fontSize: 15,
                    color: cplColor(s.cpl),
                  }}
                >
                  ${s.cpl}
                </td>
                <td style={{ padding: "12px 0", color: "#334155", fontSize: 14 }}>
                  {fmt(s.spend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            background: "#f5f2ec",
            border: "1px solid #c8c0b4",
            borderRadius: 14,
            padding: 24,
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 18,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {curLabel} Quick Stats
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <MiniCell label={`Total Leads (${curLabel})`} value={totalLeads} />
            <MiniCell label={`Total Spend (${curLabel})`} value={fmt(totalSpend)} />
            <MiniCell label={`Avg CPL (${curLabel})`} value={`$${avgCpl}`} />
            <MiniCell label="Active Locs" value={active.length} />
          </div>
        </div>
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #c8c0b4",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#334155",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Strategy Note ({curLabel})
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 13,
              color: "#334155",
              lineHeight: 1.6,
            }}
          >
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
