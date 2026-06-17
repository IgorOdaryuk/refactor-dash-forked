import React, { useState } from "react";
import { OverviewTab } from "./components/OverviewTab";
import { ExecSummaryTab } from "./components/ExecSummaryTab";
import { GeoComparisonTab } from "./components/GeoComparisonTab";
import { WeeklyTab } from "./components/WeeklyTab";
import { EfficiencyTab } from "./components/EfficiencyTab";
import { DatesTab } from "./components/DatesTab";
import { DowHeatmapTab } from "./components/DowHeatmapTab";
import { MovingAvgTab } from "./components/MovingAvgTab";
import { BudgetShareTab } from "./components/BudgetShareTab";
import { ScatterTab } from "./components/ScatterTab";
import { NotesTab } from "./components/NotesTab";
import { ComparePeriodsTab } from "./components/ComparePeriodsTab";
import { Stat, T, pct, arrow, fmt } from "./components/ui";
import { summary } from "./data";

export default function App() {
  const [tab, setTab] = useState("overview");

  const totals = {
    leadsJan: summary.reduce((s, d) => s + d.leadsJan, 0),
    leadsFeb: summary.reduce((s, d) => s + d.leadsFeb, 0),
    leadsMar: summary.reduce((s, d) => s + d.leadsMar, 0),
    leadsApr: summary.reduce((s, d) => s + d.leadsApr, 0),
    leadsJun: summary.reduce((s, d) => s + d.leadsJun, 0),
    spendJan: summary.reduce((s, d) => s + d.spendJan, 0),
    spendFeb: summary.reduce((s, d) => s + d.spendFeb, 0),
    spendMar: summary.reduce((s, d) => s + d.spendMar, 0),
    spendApr: summary.reduce((s, d) => s + d.spendApr, 0),
    spendJun: summary.reduce((s, d) => s + d.spendJun, 0),
  };

  const cplJun = totals.leadsJun
    ? Math.round(totals.spendJun / totals.leadsJun)
    : 0;
  const cplApr = totals.leadsApr
    ? Math.round(totals.spendApr / totals.leadsApr)
    : 0;
  const cplJunColor =
    cplJun <= 45 ? "#34d399" : cplJun <= 55 ? "#f59e0b" : "#f87171";
  const totalLeadsAll =
    totals.leadsJan + totals.leadsFeb + totals.leadsMar + totals.leadsApr + totals.leadsJun;
  const totalSpendAll =
    totals.spendJan + totals.spendFeb + totals.spendMar + totals.spendApr + totals.spendJun;

  const navItem = (id, label) => (
    <button
      onClick={() => setTab(id)}
      style={{
        background: tab === id ? T.bg : "transparent",
        border: "none",
        borderRadius: "8px 8px 0 0",
        color: tab === id ? T.text : "#94a3b8",
        padding: "12px 16px",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 12,
        textTransform: "uppercase",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        fontFamily: "sans-serif",
        color: T.text,
      }}
    >
      <div style={{ background: T.header, padding: "32px 40px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
              color: "#f8fafc",
            }}
          >
            ClientA <span style={{ color: "#38bdf8" }}>×</span> ClientB
          </h1>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Stat
              label="Leads Jun"
              value={totals.leadsJun}
              color="#34d399"
              sub={`${arrow(pct(totals.leadsApr, totals.leadsJun))} ${Math.abs(
                pct(totals.leadsApr, totals.leadsJun)
              )}% vs Apr`}
            />
            <Stat
              label="Spend Jun"
              value={fmt(totals.spendJun)}
              color="#f87171"
              sub={`vs Apr: ${fmt(totals.spendApr)}`}
            />
            <Stat
              label="CPL Jun"
              value={`$${cplJun}`}
              color={cplJunColor}
              sub={`vs Apr: $${cplApr}`}
            />
            <Stat
              label="Total Q1+Apr+Jun"
              value={totalLeadsAll}
              color="#a78bfa"
              sub={`Spend: ${fmt(totalSpendAll)}`}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {navItem("overview", "Overview")}
          {navItem("exec", "Insights")}
          {navItem("geo", "Geo")}
          {navItem("weekly", "Weekly")}
          {navItem("efficiency", "Efficiency")}
          {navItem("dates", "Daily")}
          {navItem("heatmap", "Heatmap")}
          {navItem("movavg", "Moving Avg")}
          {navItem("share", "Share")}
          {navItem("scatter", "Scatter")}
          {navItem("notes", "Notes")}
          {navItem("compare", "Compare")}
        </div>
      </div>
      <div style={{ padding: "40px" }}>
        {tab === "overview" && <OverviewTab totals={totals} />}
        {tab === "exec" && <ExecSummaryTab />}
        {tab === "geo" && <GeoComparisonTab />}
        {tab === "weekly" && <WeeklyTab />}
        {tab === "efficiency" && <EfficiencyTab />}
        {tab === "dates" && <DatesTab />}
        {tab === "heatmap" && <DowHeatmapTab />}
        {tab === "movavg" && <MovingAvgTab />}
        {tab === "share" && <BudgetShareTab />}
        {tab === "scatter" && <ScatterTab />}
        {tab === "notes" && <NotesTab />}
        {tab === "compare" && <ComparePeriodsTab />}
      </div>
    </div>
  );
}
