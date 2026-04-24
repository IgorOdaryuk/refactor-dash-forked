import React from "react";
import { T, MiniCell, fmt, cplColor } from "./ui";
import { summary, ALL_LOCATIONS } from "../data";

export const OverviewTab = ({ totals }) => {
  const totalLeadsQ1 = totals.leadsJan + totals.leadsFeb + totals.leadsMar;
  const totalSpendQ1 = totals.spendJan + totals.spendFeb + totals.spendMar;
  const avgCplQ1 = totalLeadsQ1 ? Math.round(totalSpendQ1 / totalLeadsQ1) : 0;

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
          Location Performance (Apr)
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
            {summary.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #c8c0b4" }}>
                <td
                  style={{ padding: "12px 0", fontWeight: 800, fontSize: 14 }}
                >
                  {s.location}
                </td>
                <td
                  style={{ padding: "12px 0", fontWeight: 900, fontSize: 15 }}
                >
                  {s.leadsApr}
                </td>
                <td
                  style={{
                    padding: "12px 0",
                    fontWeight: 900,
                    fontSize: 15,
                    color: cplColor(s.cplApr),
                  }}
                >
                  ${s.cplApr}
                </td>
                <td
                  style={{ padding: "12px 0", color: "#334155", fontSize: 14 }}
                >
                  {fmt(s.spendApr)}
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
            Q1 Quick Stats
          </h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <MiniCell label="Total Leads Q1" value={totalLeadsQ1} />
            <MiniCell label="Total Spend Q1" value={fmt(totalSpendQ1)} />
            <MiniCell label="Avg CPL Q1" value={`$${avgCplQ1}`} />
            <MiniCell label="Active Locs" value={ALL_LOCATIONS.length} />
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
            Strategy Note
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#334155",
              lineHeight: 1.5,
            }}
          >
            Focus on locations with CPL below $45 (Green). Charlotte showing
            strong improvement in April.
          </p>
        </div>
      </div>
    </div>
  );
};
