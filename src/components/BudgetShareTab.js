import React, { useState } from "react";
import { T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT } from "../data";

export const BudgetShareTab = () => {
  const [selectedMonth, setSelectedMonth] = useState("4");
  const prefix =
    selectedMonth === "1"
      ? "2026-01"
      : selectedMonth === "2"
      ? "2026-02"
      : selectedMonth === "3"
      ? "2026-03"
      : "2026-04";

  const data = ALL_LOCATIONS.map((loc, i) => {
    const rows = dailyData.filter(
      (d) => d.location === loc && d.date.startsWith(prefix)
    );
    const spend = rows.reduce((s, r) => s + r.spend, 0);
    const leads = rows.reduce((s, r) => s + r.leads, 0);
    return { loc, spend, leads, color: ACCENT[i] };
  }).filter((d) => d.spend > 0);

  const totalSpend = data.reduce((s, d) => s + d.spend, 0);
  const totalLeads = data.reduce((s, d) => s + d.leads, 0);

  data.forEach((d) => {
    d.pct = totalSpend ? d.spend / totalSpend : 0;
  });

  const cx = 160,
    cy = 160,
    R = 130,
    r = 72;
  let angle = -Math.PI / 2;
  const slices = data.map((d) => {
    const pct = d.spend / totalSpend;
    const startAngle = angle;
    angle += pct * 2 * Math.PI;
    const endAngle = angle;
    const x1 = cx + R * Math.cos(startAngle),
      y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle),
      y2 = cy + R * Math.sin(endAngle);
    const xi1 = cx + r * Math.cos(startAngle),
      yi1 = cy + r * Math.sin(startAngle);
    const xi2 = cx + r * Math.cos(endAngle),
      yi2 = cy + r * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    const path = `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${large},0 ${xi1},${yi1} Z`;
    return { ...d, path };
  });

  const monthLabel =
    selectedMonth === "1"
      ? "January"
      : selectedMonth === "2"
      ? "February"
      : selectedMonth === "3"
      ? "March"
      : "April";

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
        Budget Share
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        How ad spend is distributed across locations
      </p>
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "16px 24px",
          marginBottom: 24,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: T.faint,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginRight: 8,
          }}
        >
          Month:
        </div>
        {[
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
              fontFamily: "inherit",
            }}
          >
            {lbl}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: T.muted,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Spend share — {monthLabel}
          </div>
          <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 320 }}>
            {slices.map((s, i) => (
              <path
                key={i}
                d={s.path}
                fill={s.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
            <text
              x={cx}
              y={cy - 12}
              textAnchor="middle"
              style={{ fontSize: 13, fill: T.faint, fontWeight: 700 }}
            >
              Total Spend
            </text>
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              style={{ fontSize: 22, fill: T.text, fontWeight: 900 }}
            >
              {fmt(totalSpend)}
            </text>
            <text
              x={cx}
              y={cy + 34}
              textAnchor="middle"
              style={{ fontSize: 12, fill: T.faint, fontWeight: 600 }}
            >
              {totalLeads} leads
            </text>
          </svg>
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
                {["Location", "Spend", "Share", "Leads", "CPL"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 18px",
                      color: T.muted,
                      textAlign: "left",
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      borderBottom: `2px solid ${T.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data]
                .sort((a, b) => b.spend - a.spend)
                .map((d, i) => {
                  const cpl = d.leads ? Math.round(d.spend / d.leads) : 0;
                  return (
                    <tr
                      key={d.loc}
                      style={{
                        borderBottom: `1px solid ${T.border}`,
                        background: i % 2 === 0 ? T.card : "#f8f5f0",
                      }}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 3,
                              background: d.color,
                            }}
                          />
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              color: T.text,
                            }}
                          >
                            {d.loc}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          fontWeight: 900,
                          fontSize: 15,
                          color: T.text,
                        }}
                      >
                        {fmt(d.spend)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 80,
                              height: 8,
                              background: "#e2e8f0",
                              borderRadius: 4,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${(d.pct * 100).toFixed(1)}%`,
                                height: "100%",
                                background: d.color,
                                borderRadius: 4,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 13,
                              color: T.muted,
                            }}
                          >
                            {(d.pct * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          fontWeight: 800,
                          fontSize: 15,
                          color: T.text,
                        }}
                      >
                        {d.leads}
                      </td>
                      <td
                        style={{
                          padding: "14px 18px",
                          fontWeight: 900,
                          fontSize: 15,
                          color: cplColor(cpl),
                        }}
                      >
                        ${cpl}
                      </td>
                    </tr>
                  );
                })}
              <tr
                style={{
                  background: "#f1f5f9",
                  borderTop: `2px solid ${T.border}`,
                }}
              >
                <td
                  style={{
                    padding: "12px 18px",
                    fontWeight: 900,
                    fontSize: 13,
                    color: T.muted,
                    textTransform: "uppercase",
                  }}
                >
                  TOTAL
                </td>
                <td
                  style={{
                    padding: "12px 18px",
                    fontWeight: 900,
                    fontSize: 15,
                    color: T.text,
                  }}
                >
                  {fmt(totalSpend)}
                </td>
                <td
                  style={{
                    padding: "12px 18px",
                    fontWeight: 800,
                    fontSize: 13,
                    color: T.muted,
                  }}
                >
                  100%
                </td>
                <td
                  style={{
                    padding: "12px 18px",
                    fontWeight: 900,
                    fontSize: 15,
                    color: T.text,
                  }}
                >
                  {totalLeads}
                </td>
                <td
                  style={{
                    padding: "12px 18px",
                    fontWeight: 900,
                    fontSize: 15,
                    color: cplColor(
                      totalLeads ? Math.round(totalSpend / totalLeads) : 0
                    ),
                  }}
                >
                  ${totalLeads ? Math.round(totalSpend / totalLeads) : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
