import React, { useState } from "react";
import { T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

export const ComparePeriodsTab = () => {
  const [aFrom, setAFrom] = useState("2026-02-01");
  const [aTo, setATo] = useState("2026-02-14");
  const [bFrom, setBFrom] = useState("2026-03-01");
  const [bTo, setBTo] = useState("2026-03-14");

  const calcPeriod = (from, to) => {
    const result = {};
    ALL_LOCATIONS.forEach((loc) => {
      const rows = dailyData.filter(
        (d) => d.location === loc && d.date >= from && d.date <= to
      );
      const leads = rows.reduce((s, r) => s + r.leads, 0);
      const spend = rows.reduce((s, r) => s + r.spend, 0);
      result[loc] = {
        leads,
        spend,
        cpl: leads ? Math.round(spend / leads) : 0,
        days: rows.length,
      };
    });
    return result;
  };

  const A = calcPeriod(aFrom, aTo);
  const B = calcPeriod(bFrom, bTo);

  const diffColor = (val, inverse) => {
    if (val === 0) return T.muted;
    if (inverse) return val > 0 ? T.red : T.green;
    return val > 0 ? T.green : T.red;
  };

  const fmtDiff = (a, b) => {
    if (!a) return "—";
    const d = (((b - a) / a) * 100).toFixed(1);
    return `${+d >= 0 ? "▲" : "▼"} ${Math.abs(d)}%`;
  };

  return (
    <div>
      <h2
        style={{
          margin: "0 0 6px",
          fontSize: 24,
          fontWeight: 900,
          color: T.text,
        }}
      >
        Compare Periods
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Compare any two date ranges across all locations
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Period A",
            from: aFrom,
            to: aTo,
            setFrom: setAFrom,
            setTo: setATo,
            color: "#0ea5e9",
          },
          {
            label: "Period B",
            from: bFrom,
            to: bTo,
            setFrom: setBFrom,
            setTo: setBTo,
            color: "#f97316",
          },
        ].map((p) => (
          <div
            key={p.label}
            style={{
              background: T.card,
              border: `2px solid ${p.color}44`,
              borderTop: `4px solid ${p.color}`,
              borderRadius: 14,
              padding: "18px 22px",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: p.color,
                marginBottom: 14,
              }}
            >
              {p.label}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                ["From", p.from, p.setFrom],
                ["To", p.to, p.setTo],
              ].map(([lbl, val, setter]) => (
                <div key={lbl}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: T.faint,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    {lbl}
                  </div>
                  <input
                    type="date"
                    value={val}
                    min="2026-01-01"
                    max={MAX_DATE}
                    onChange={(e) => setter(e.target.value)}
                    style={{
                      border: `2px solid ${p.color}66`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: T.text,
                      background: "#fff",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th
                style={{
                  padding: "14px 18px",
                  color: T.muted,
                  textAlign: "left",
                  fontWeight: 800,
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                Location
              </th>
              {[
                "Leads A",
                "Leads B",
                "Δ Leads",
                "CPL A",
                "CPL B",
                "Δ CPL",
                "Spend A",
                "Spend B",
                "Δ Spend",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 12px",
                    color: T.muted,
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: 11,
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_LOCATIONS.map((loc, i) => {
              const a = A[loc],
                b = B[loc];
              return (
                <tr
                  key={loc}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: i % 2 === 0 ? T.card : "#f8f5f0",
                  }}
                >
                  <td style={{ padding: "14px 18px", fontWeight: 800 }}>
                    {loc}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: "#0ea5e9",
                      fontWeight: 900,
                    }}
                  >
                    {a.leads}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: "#f97316",
                      fontWeight: 900,
                    }}
                  >
                    {b.leads}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: diffColor(b.leads - a.leads, false),
                    }}
                  >
                    {fmtDiff(a.leads, b.leads)}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 900 }}>
                    ${a.cpl}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 900 }}>
                    ${b.cpl}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      color: diffColor(b.cpl - a.cpl, true),
                    }}
                  >
                    {fmtDiff(a.cpl, b.cpl)}
                  </td>
                  <td style={{ textAlign: "center" }}>{fmt(a.spend)}</td>
                  <td style={{ textAlign: "center" }}>{fmt(b.spend)}</td>
                  <td
                    style={{
                      textAlign: "center",
                      color: diffColor(b.spend - a.spend, false),
                    }}
                  >
                    {fmtDiff(a.spend, b.spend)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
