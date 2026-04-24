import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { FilterBar } from "./FilterBar";
import { CustomTooltip, StatusBadge, T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

export const GeoComparisonTab = () => {
  const [metric, setMetric] = useState("cpl");
  const [selectedLocs, setSelectedLocs] = useState([
    "Atlanta",
    "Tampa",
    "Miami",
  ]);
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);

  const toggleLoc = (loc) =>
    setSelectedLocs((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );

  const allDates = [
    ...new Set(
      dailyData
        .filter(
          (d) =>
            d.date >= dateFrom &&
            d.date <= dateTo &&
            selectedLocs.includes(d.location)
        )
        .map((d) => d.date)
    ),
  ].sort();
  const chartData = allDates.map((date) => {
    const point = { date: date.slice(5) };
    selectedLocs.forEach((loc) => {
      const row = dailyData.find((d) => d.date === date && d.location === loc);
      point[loc] = row
        ? metric === "cpl"
          ? row.cpl
          : metric === "leads"
          ? row.leads
          : row.spend
        : null;
    });
    return point;
  });

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
        Geo Comparison
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Compare locations side by side on one chart
      </p>

      <FilterBar
        metric={metric}
        setMetric={setMetric}
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

      {metric === "cpl" && (
        <div
          style={{
            background: "#fef9ed",
            border: "1px solid #fcd34d",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 600,
            color: "#92400e",
          }}
        >
          🟢 CPL ≤ $45 = Good &nbsp;&nbsp; 🟡 $46–$55 = OK &nbsp;&nbsp; 🔴 &gt;
          $55 = High
        </div>
      )}

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "24px 16px 12px",
          marginBottom: 24,
        }}
      >
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: T.faint, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: T.faint, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  metric === "spend" ? fmt(v) : metric === "cpl" ? `$${v}` : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  color: T.muted,
                  fontSize: 13,
                  fontWeight: 700,
                  paddingTop: 12,
                }}
              />
              {metric === "cpl" && (
                <ReferenceLine
                  y={45}
                  stroke="#15803d"
                  strokeDasharray="4 4"
                  label={{ value: "$45", fill: "#15803d", fontSize: 11 }}
                />
              )}
              {metric === "cpl" && (
                <ReferenceLine
                  y={55}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{ value: "$55", fill: "#dc2626", fontSize: 11 }}
                />
              )}
              {selectedLocs.map((loc) => {
                const idx = ALL_LOCATIONS.indexOf(loc);
                return (
                  <Line
                    key={loc}
                    type="monotone"
                    dataKey={loc}
                    stroke={ACCENT[idx]}
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                    activeDot={{ r: 5 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
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
              {["Location", "Leads", "Spend", "CPL", "Status"].map((h) => (
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
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedLocs.map((loc, i) => {
              const rows = dailyData.filter(
                (d) =>
                  d.location === loc && d.date >= dateFrom && d.date <= dateTo
              );
              const leads = rows.reduce((s, r) => s + r.leads, 0);
              const spend = rows.reduce((s, r) => s + r.spend, 0);
              const cpl = leads ? Math.round(spend / leads) : 0;
              const idx = ALL_LOCATIONS.indexOf(loc);
              return (
                <tr
                  key={loc}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: i % 2 === 0 ? T.card : "#f8f5f0",
                  }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: ACCENT[idx],
                        }}
                      />
                      <span
                        style={{ fontWeight: 800, fontSize: 15, color: T.text }}
                      >
                        {loc}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontWeight: 900,
                      fontSize: 16,
                      color: T.text,
                    }}
                  >
                    {leads}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontWeight: 800,
                      fontSize: 15,
                      color: T.text,
                    }}
                  >
                    {fmt(spend)}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontWeight: 900,
                      fontSize: 16,
                      color: cplColor(cpl),
                    }}
                  >
                    ${cpl}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <StatusBadge cpl={cpl} />
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
