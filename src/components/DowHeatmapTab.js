import React, { useState } from "react";
import { T } from "./ui";
import { dailyData, ALL_LOCATIONS, DOW_LABELS, ACCENT } from "../data";

export const DowHeatmapTab = () => {
  const [metric, setMetric] = useState("cpl");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const monthFilter =
    selectedMonth === "all"
      ? "2026"
      : selectedMonth === "4"
      ? "2026-04"
      : `2026-0${selectedMonth}`;
  const filtered = dailyData.filter((d) => d.date.startsWith(monthFilter));

  const matrix = {};
  ALL_LOCATIONS.forEach((loc) => {
    matrix[loc] = {};
    DOW_LABELS.forEach((d) => {
      matrix[loc][d] = { leads: 0, spend: 0, days: 0 };
    });
  });

  filtered.forEach((d) => {
    const dObj = new Date(d.date + "T12:00:00");
    const dow = dObj.getDay();
    const label = DOW_LABELS[dow === 0 ? 6 : dow - 1];
    if (matrix[d.location] && matrix[d.location][label]) {
      matrix[d.location][label].leads += d.leads;
      matrix[d.location][label].spend += d.spend;
      matrix[d.location][label].days += 1;
    }
  });

  const getValue = (loc, dow) => {
    const cell = matrix[loc][dow];
    if (!cell || !cell.days) return null;
    if (metric === "cpl")
      return cell.leads ? Math.round(cell.spend / cell.leads) : null;
    if (metric === "leads") return Math.round(cell.leads / cell.days);
    return Math.round(cell.spend / cell.days);
  };

  const allVals = ALL_LOCATIONS.flatMap((loc) =>
    DOW_LABELS.map((d) => getValue(loc, d))
  ).filter((v) => v !== null);
  const minV = allVals.length ? Math.min(...allVals) : 0;
  const maxV = allVals.length ? Math.max(...allVals) : 1;
  const norm = (v) => (v - minV) / (maxV - minV || 1);

  const cellColor = (v) => {
    if (v === null) return "#f1f5f9";
    const n = norm(v);
    if (metric === "cpl") {
      const r = Math.round(220 * n + 21 * (1 - n));
      const g = Math.round(38 * n + 128 * (1 - n));
      return `rgb(${r},${g},50)`;
    }
    return `rgba(14,165,233,${0.15 + 0.7 * n})`;
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
        Day-of-Week Heatmap
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Performance patterns by weekday
      </p>

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "20px 24px",
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: T.faint,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Metric
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              ["cpl", "CPL"],
              ["leads", "Avg Leads"],
              ["spend", "Avg Spend"],
            ].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setMetric(val)}
                style={{
                  background: metric === val ? T.text : "transparent",
                  border: `2px solid ${T.border}`,
                  borderRadius: 8,
                  color: metric === val ? "#fff" : T.muted,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: T.faint,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Month
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              ["all", "All"],
              ["1", "Jan"],
              ["2", "Feb"],
              ["3", "Mar"],
              ["4", "Apr"],
            ].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setSelectedMonth(val)}
                style={{
                  background: selectedMonth === val ? T.text : "transparent",
                  border: `2px solid ${T.border}`,
                  borderRadius: 8,
                  color: selectedMonth === val ? "#fff" : T.muted,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th
                style={{
                  padding: "14px 20px",
                  color: T.muted,
                  textAlign: "left",
                  fontWeight: 800,
                  fontSize: 12,
                  textTransform: "uppercase",
                  borderBottom: `2px solid ${T.border}`,
                }}
              >
                Location
              </th>
              {DOW_LABELS.map((d) => (
                <th
                  key={d}
                  style={{
                    padding: "14px 12px",
                    color: T.muted,
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: 12,
                    textTransform: "uppercase",
                    borderBottom: `2px solid ${T.border}`,
                  }}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_LOCATIONS.map((loc, li) => (
              <tr key={loc} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "12px 20px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: ACCENT[li],
                      }}
                    />
                    <span
                      style={{ fontWeight: 800, fontSize: 14, color: T.text }}
                    >
                      {loc}
                    </span>
                  </div>
                </td>
                {DOW_LABELS.map((dow) => {
                  const v = getValue(loc, dow);
                  return (
                    <td
                      key={dow}
                      style={{ padding: "10px 6px", textAlign: "center" }}
                    >
                      <div
                        style={{
                          background: cellColor(v),
                          color: v !== null && norm(v) > 0.6 ? "#fff" : T.text,
                          borderRadius: 8,
                          padding: "10px 4px",
                          fontWeight: 900,
                          fontSize: 14,
                          minWidth: 52,
                        }}
                      >
                        {v === null ? "—" : metric === "cpl" ? `$${v}` : v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
