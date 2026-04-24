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
import { Stat, StatusBadge, CustomTooltip, T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

export const DatesTab = () => {
  const [selectedLocs, setSelectedLocs] = useState(["Atlanta"]);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("asc");

  const toggleLoc = (loc) =>
    setSelectedLocs((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );

  const filtered = dailyData
    .filter(
      (d) =>
        selectedLocs.includes(d.location) &&
        d.date >= dateFrom &&
        d.date <= dateTo
    )
    .sort((a, b) => {
      let av = a[sortField],
        bv = b[sortField];
      if (sortField === "date" || sortField === "location")
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const totals = filtered.reduce(
    (acc, d) => ({ leads: acc.leads + d.leads, spend: acc.spend + d.spend }),
    { leads: 0, spend: 0 }
  );
  const avgCpl = totals.leads ? totals.spend / totals.leads : 0;

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIcon = (field) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕";

  const cplTrendData = {};
  filtered.forEach((d) => {
    if (!cplTrendData[d.date])
      cplTrendData[d.date] = {
        date: d.date.slice(5),
        totalLeads: 0,
        totalSpend: 0,
      };
    cplTrendData[d.date].totalLeads += d.leads;
    cplTrendData[d.date].totalSpend += d.spend;
  });

  const cplChartData = Object.values(cplTrendData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      date: d.date,
      cpl: d.totalLeads ? Math.round(d.totalSpend / d.totalLeads) : 0,
      leads: d.totalLeads,
    }));

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
        Daily Breakdown
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Detailed daily performance and trends
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

      {filtered.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <Stat
            label={`Leads (${filtered.length} days)`}
            value={totals.leads}
            color="#38bdf8"
          />
          <Stat label="Total Spend" value={fmt(totals.spend)} color="#a78bfa" />
          <Stat
            label="Avg CPL"
            value={`$${Math.round(avgCpl)}`}
            color={cplColor(avgCpl)}
          />
          <Stat
            label="Status"
            value={<StatusBadge cpl={Math.round(avgCpl)} />}
            color={cplColor(avgCpl)}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "20px 16px 8px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: T.muted,
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            CPL trend
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cplChartData}>
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
                />
                <YAxis
                  tick={{ fill: T.faint, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cpl"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "20px 16px 8px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: T.muted,
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            Leads by day
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cplChartData}>
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
                />
                <YAxis
                  tick={{ fill: T.faint, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="leads" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
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
              {[
                ["Date", "date"],
                ["Location", "location"],
                ["Leads", "leads"],
                ["Spend", "spend"],
                ["CPL", "cpl"],
                ["Status", null],
              ].map(([label, field]) => (
                <th
                  key={label}
                  onClick={() => field && handleSort(field)}
                  style={{
                    padding: "14px 20px",
                    color: T.muted,
                    textAlign: "left",
                    fontWeight: 800,
                    fontSize: 12,
                    textTransform: "uppercase",
                    borderBottom: `2px solid ${T.border}`,
                    cursor: field ? "pointer" : "default",
                  }}
                >
                  {label}
                  {field ? sortIcon(field) : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: i % 2 === 0 ? T.card : "#f8f5f0",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    fontWeight: 700,
                    fontSize: 14,
                    color: T.muted,
                  }}
                >
                  {row.date}
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    fontWeight: 800,
                    fontSize: 14,
                    color: T.text,
                  }}
                >
                  {row.location}
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  {row.leads}
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {fmt(row.spend)}
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    fontWeight: 900,
                    fontSize: 16,
                    color: cplColor(row.cpl),
                  }}
                >
                  ${row.cpl}
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <StatusBadge cpl={row.cpl} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr
              style={{
                background: "#f1f5f9",
                borderTop: `2px solid ${T.border}`,
              }}
            >
              <td
                colSpan={2}
                style={{
                  padding: "14px 20px",
                  fontWeight: 900,
                  color: T.muted,
                }}
              >
                TOTAL ({filtered.length} days)
              </td>
              <td
                style={{ padding: "14px 20px", fontWeight: 900, fontSize: 16 }}
              >
                {totals.leads}
              </td>
              <td
                style={{ padding: "14px 20px", fontWeight: 900, fontSize: 15 }}
              >
                {fmt(totals.spend)}
              </td>
              <td
                style={{
                  padding: "14px 20px",
                  fontWeight: 900,
                  fontSize: 16,
                  color: cplColor(avgCpl),
                }}
              >
                ${Math.round(avgCpl)}
              </td>
              <td style={{ padding: "14px 20px" }}>
                <StatusBadge cpl={Math.round(avgCpl)} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
