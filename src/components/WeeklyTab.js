import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { FilterBar } from "./FilterBar";
import { CustomTooltip, StatusBadge, T, fmt, cplColor } from "./ui";
import { ALL_LOCATIONS, ACCENT, MAX_DATE, buildWeeklyData } from "../data";

export const WeeklyTab = () => {
  const [selectedLocs, setSelectedLocs] = useState([
    "Atlanta",
    "Tampa",
    "Miami",
  ]);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);

  const toggleLoc = (loc) =>
    setSelectedLocs((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  const weeklyData = buildWeeklyData(selectedLocs, dateFrom, dateTo);

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
        Weekly Rollup
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Weekly aggregates — easier for trend analysis
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
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "24px 16px 12px",
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
            Leads by week
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barCategoryGap="30%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: T.faint, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
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
                  dataKey="leads"
                  name="Leads"
                  radius={[5, 5, 0, 0]}
                  fill="#38bdf8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "24px 16px 12px",
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
            CPL by week
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: T.faint, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.faint, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={45}
                  stroke="#15803d"
                  strokeDasharray="4 4"
                  label={{ value: "$45", fill: "#15803d", fontSize: 11 }}
                />
                <ReferenceLine
                  y={55}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{ value: "$55", fill: "#dc2626", fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="cpl"
                  name="CPL $"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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
              {["Week", "Leads", "Spend", "CPL", "Status", "Leads/Day avg"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 20px",
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((w, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: i % 2 === 0 ? T.card : "#f8f5f0",
                }}
              >
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 800,
                    fontSize: 14,
                    color: T.text,
                  }}
                >
                  {w.week}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 900,
                    fontSize: 16,
                    color: T.text,
                  }}
                >
                  {w.leads}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 800,
                    fontSize: 15,
                    color: T.text,
                  }}
                >
                  {fmt(w.spend)}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 900,
                    fontSize: 16,
                    color: cplColor(w.cpl),
                  }}
                >
                  ${w.cpl}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <StatusBadge cpl={w.cpl} />
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 700,
                    fontSize: 14,
                    color: T.muted,
                  }}
                >
                  {(w.leads / 7).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
