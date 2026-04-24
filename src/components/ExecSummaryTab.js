import React from "react";
import { T, fmt, pct, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT } from "../data";

export const ExecSummaryTab = () => {
  const insights = [];

  ALL_LOCATIONS.forEach((loc) => {
    const mar = dailyData.filter(
      (d) => d.location === loc && d.date.startsWith("2026-03")
    );
    const apr = dailyData.filter(
      (d) => d.location === loc && d.date.startsWith("2026-04")
    );
    if (!mar.length || !apr.length) return;

    const marLeads = mar.reduce((s, r) => s + r.leads, 0);
    const aprLeads = apr.reduce((s, r) => s + r.leads, 0);
    const marSpend = mar.reduce((s, r) => s + r.spend, 0);
    const aprSpend = apr.reduce((s, r) => s + r.spend, 0);
    const marCpl = marLeads ? Math.round(marSpend / marLeads) : 0;
    const aprCpl = aprLeads ? Math.round(aprSpend / aprLeads) : 0;

    const cplDiff = marCpl
      ? (((aprCpl - marCpl) / marCpl) * 100).toFixed(0)
      : 0;
    const leadsDiff = marLeads
      ? (((aprLeads - marLeads) / marLeads) * 100).toFixed(0)
      : 0;

    if (aprCpl <= 45)
      insights.push({
        type: "good",
        loc,
        text: `CPL at $${aprCpl} — hitting target`,
        detail: `Target is ≤$45. Current CPL is $${aprCpl}.`,
      });
    else if (aprCpl > 65)
      insights.push({
        type: "bad",
        loc,
        text: `CPL at $${aprCpl} — significantly above target`,
        detail: `Target is ≤$55. Overspending by $${aprCpl - 55} per lead.`,
      });
    else if (aprCpl > 55)
      insights.push({
        type: "warn",
        loc,
        text: `CPL at $${aprCpl} — above target`,
        detail: `CPL is in the HIGH zone (>$55). Worth investigating.`,
      });

    if (+leadsDiff > 30)
      insights.push({
        type: "good",
        loc,
        text: `Leads up ${leadsDiff}% vs March`,
        detail: `${marLeads} leads in Mar → ${aprLeads} in Apr.`,
      });
    if (+leadsDiff < -30)
      insights.push({
        type: "bad",
        loc,
        text: `Leads down ${Math.abs(leadsDiff)}% vs March`,
        detail: `${marLeads} leads in Mar → ${aprLeads} in Apr. Significant drop.`,
      });
    if (+cplDiff <= -10)
      insights.push({
        type: "good",
        loc,
        text: `CPL improved ${Math.abs(cplDiff)}% vs March`,
        detail: `Was $${marCpl} in Mar, now $${aprCpl} in Apr.`,
      });
    if (+cplDiff >= 20)
      insights.push({
        type: "bad",
        loc,
        text: `CPL rose ${cplDiff}% vs March`,
        detail: `Was $${marCpl} in Mar, now $${aprCpl} in Apr.`,
      });
  });

  insights.sort((a, b) => {
    const order = { bad: 0, warn: 1, good: 2 };
    return order[a.type] - order[b.type];
  });

  const typeStyle = (type) =>
    ({
      good: {
        bg: "#f0fdf4",
        border: "#86efac",
        icon: "✅",
        label: "GOOD",
        labelColor: "#15803d",
        textColor: "#14532d",
      },
      bad: {
        bg: "#fef2f2",
        border: "#fca5a5",
        icon: "🔴",
        label: "ACTION",
        labelColor: "#dc2626",
        textColor: "#7f1d1d",
      },
      warn: {
        bg: "#fffbeb",
        border: "#fcd34d",
        icon: "⚠️",
        label: "WATCH",
        labelColor: "#b45309",
        textColor: "#78350f",
      },
    }[type]);

  const calcTotal = (prefix) => {
    const rows = dailyData.filter((d) => d.date.startsWith(prefix));
    const leads = rows.reduce((s, r) => s + r.leads, 0);
    const spend = rows.reduce((s, r) => s + r.spend, 0);
    return { leads, spend, cpl: leads ? Math.round(spend / leads) : 0 };
  };

  const totMar = calcTotal("2026-03");
  const totApr = calcTotal("2026-04");
  const totFeb = calcTotal("2026-02");

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
        Auto-Summary
      </h2>
      <p
        style={{
          margin: "0 0 24px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        April insights vs March baseline.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Apr Leads (1–21)",
            value: totApr.leads,
            sub: `vs Mar: ${totMar.leads} (${
              +pct(totMar.leads, totApr.leads) >= 0 ? "▲" : "▼"
            }${Math.abs(pct(totMar.leads, totApr.leads))}%)`,
            color: "#38bdf8",
          },
          {
            label: "Apr Blended CPL",
            value: `$${totApr.cpl}`,
            sub: `vs Mar: $${totMar.cpl}`,
            color: cplColor(totApr.cpl),
          },
          {
            label: "Apr Spend",
            value: fmt(totApr.spend),
            sub: `vs Mar: ${fmt(totMar.spend)}`,
            color: "#a78bfa",
          },
          {
            label: "Mar Blended CPL",
            value: `$${totMar.cpl}`,
            sub: `baseline`,
            color: cplColor(totMar.cpl),
          },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            style={{
              background: T.card,
              border: `2px solid ${color}33`,
              borderTop: `3px solid ${color}`,
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <div
              style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1.1 }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.muted,
                marginTop: 5,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.faint,
                marginTop: 3,
                fontWeight: 600,
              }}
            >
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {insights.map((ins, i) => {
          const s = typeStyle(ins.type);
          const locIdx = ALL_LOCATIONS.indexOf(ins.loc);
          return (
            <div
              key={i}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderLeft: `5px solid ${s.border}`,
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 18, marginTop: 1 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: ACCENT[locIdx],
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: 14,
                      color: s.textColor,
                    }}
                  >
                    {ins.loc}
                  </span>
                  <span
                    style={{
                      background: s.border,
                      color: s.labelColor,
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: s.textColor }}
                >
                  {ins.text}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: s.textColor,
                    opacity: 0.75,
                    marginTop: 3,
                  }}
                >
                  {ins.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
