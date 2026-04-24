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
import { CustomTooltip, T, fmt } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

export const MovingAvgTab = () => {
  const [selectedLocs, setSelectedLocs] = useState(["Atlanta", "Tampa"]);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);
  const [windowSize, setWindowSize] = useState(7);

  const toggleLoc = (loc) =>
    setSelectedLocs((p) =>
      p.includes(loc) ? p.filter((l) => l !== loc) : [...p, loc]
    );

  const buildMA = (loc) => {
    const rows = dailyData
      .filter(
        (d) => d.location === loc && d.date >= dateFrom && d.date <= dateTo
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    return rows.map((r, i) => {
      const window = rows.slice(Math.max(0, i - windowSize + 1), i + 1);
      const totalLeads = window.reduce((s, x) => s + x.leads, 0);
      const totalSpend = window.reduce((s, x) => s + x.spend, 0);
      const ma = totalLeads ? Math.round(totalSpend / totalLeads) : null;
      return { date: r.date.slice(5), ma };
    });
  };

  const allDates = [
    ...new Set(
      dailyData
        .filter(
          (d) =>
            selectedLocs.includes(d.location) &&
            d.date >= dateFrom &&
            d.date <= dateTo
        )
        .map((d) => d.date)
    ),
  ].sort();

  const maByLoc = {};
  selectedLocs.forEach((loc) => {
    const series = buildMA(loc);
    series.forEach((r) => {
      maByLoc[`${r.date}___${loc}`] = r.ma;
    });
  });

  const chartData = allDates.map((date) => {
    const dShort = date.slice(5);
    const point = { date: dShort };
    selectedLocs.forEach((loc) => {
      point[`${loc} MA`] = maByLoc[`${dShort}___${loc}`] ?? null;
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
        CPL Moving Average
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Smoothed CPL trend — filters out daily noise
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
          padding: "16px 24px",
          marginBottom: 24,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: T.faint,
            textTransform: "uppercase",
          }}
        >
          Window (days):
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[3, 5, 7, 14].map((w) => (
            <button
              key={w}
              onClick={() => setWindowSize(w)}
              style={{
                background: windowSize === w ? T.text : "transparent",
                border: `2px solid ${T.border}`,
                borderRadius: 8,
                color: windowSize === w ? "#fff" : T.muted,
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

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
        $55 = High &nbsp;&nbsp; · &nbsp;&nbsp; Lines show {windowSize}-day
        rolling average
      </div>

      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "24px 16px 12px",
        }}
      >
        <div style={{ height: 420 }}>
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
                tickFormatter={(v) => `$${v}`}
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
              <ReferenceLine y={45} stroke="#15803d" strokeDasharray="4 4" />
              <ReferenceLine y={55} stroke="#dc2626" strokeDasharray="4 4" />
              {selectedLocs.map((loc) => {
                const idx = ALL_LOCATIONS.indexOf(loc);
                return (
                  <Line
                    key={loc}
                    type="monotone"
                    dataKey={`${loc} MA`}
                    stroke={ACCENT[idx]}
                    strokeWidth={3}
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
    </div>
  );
};
