import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FilterBar } from "./FilterBar";
import { CustomTooltip, T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

export const EfficiencyTab = () => {
  const [selectedLocs, setSelectedLocs] = useState(["Atlanta"]);
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);

  const toggleLoc = (loc) =>
    setSelectedLocs((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );

  const filtered = dailyData.filter(
    (d) =>
      selectedLocs.includes(d.location) &&
      d.date >= dateFrom &&
      d.date <= dateTo
  );

  const bestDays = [...filtered]
    .filter((d) => d.leads > 0)
    .sort((a, b) => a.cpl - b.cpl)
    .slice(0, 10);
  const worstDays = [...filtered]
    .filter((d) => d.leads > 0)
    .sort((a, b) => b.cpl - a.cpl)
    .slice(0, 10);

  const effData = filtered
    .map((d) => ({
      ...d,
      efficiency:
        d.spend > 0 ? parseFloat(((d.leads / d.spend) * 100).toFixed(2)) : 0,
      dateShort: d.date.slice(5),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

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
        Spend Efficiency
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Leads per $100 spend — higher is better
      </p>

      <FilterBar
        locations={ALL_LOCATIONS}
        selectedLocs={selectedLocs}
        toggleLoc={toggleLoc}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        accent={ACCENT}
        MAX_DATE={MAX_DATE}
      />

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "24px 16px 12px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: T.muted,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Leads per $100 spend by day
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={effData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="dateShort"
                tick={{ fill: T.faint, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: T.faint, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="efficiency"
                name="Leads per $100"
                radius={[4, 4, 0, 0]}
              >
                {effData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      d.efficiency >= 3
                        ? "#15803d"
                        : d.efficiency >= 1.8
                        ? "#f59e0b"
                        : "#dc2626"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          {
            title: "🏆 Top 10 best days (lowest CPL)",
            data: bestDays,
            bg: "#dcfce7",
            color: "#15803d",
          },
          {
            title: "⚠️ Top 10 worst days (highest CPL)",
            data: worstDays,
            bg: "#fee2e2",
            color: "#dc2626",
          },
        ].map(({ title, data, bg, color }) => (
          <div
            key={title}
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: bg,
                padding: "14px 20px",
                borderBottom: `2px solid ${T.border}`,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 15, color }}>
                {title}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  {["Date", "Geo", "Leads", "CPL"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        color: T.muted,
                        textAlign: "left",
                        fontWeight: 800,
                        fontSize: 11,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: `1px solid ${T.border}`,
                      background: i % 2 === 0 ? T.card : "#f8f5f0",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.muted,
                      }}
                    >
                      {d.date.slice(5)}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 13,
                        fontWeight: 800,
                        color: T.text,
                      }}
                    >
                      {d.location}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: 900,
                        color: T.text,
                      }}
                    >
                      {d.leads}
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: 900,
                        color: cplColor(d.cpl),
                      }}
                    >
                      ${d.cpl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
