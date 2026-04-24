import React from "react";
import { T } from "./ui";

const MONTH_PRESETS = [
  { label: "Jan", from: "2026-01-01", to: "2026-01-31" },
  { label: "Feb", from: "2026-02-01", to: "2026-02-28" },
  { label: "Mar", from: "2026-03-01", to: "2026-03-31" },
  { label: "Apr", from: "2026-04-01", to: "2026-04-21" },
  { label: "All", from: "2026-01-01", to: "2026-04-21" },
];

export const FilterBar = ({
  metric,
  setMetric,
  locations,
  selectedLocs,
  toggleLoc,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  accent,
  MAX_DATE,
}) => (
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
    {/* Метрики */}
    {setMetric && (
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: T.faint,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 10,
          }}
        >
          Metric
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            ["cpl", "CPL"],
            ["leads", "Leads"],
            ["spend", "Spend"],
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
                fontFamily: "inherit",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>
    )}
    {/* Локации */}
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: T.faint,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 10,
        }}
      >
        Locations
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {locations.map((loc, i) => {
          const active = selectedLocs.includes(loc);
          return (
            <button
              key={loc}
              onClick={() => toggleLoc(loc)}
              style={{
                background: active ? accent[i] : "transparent",
                border: `2px solid ${accent[i]}`,
                borderRadius: 8,
                color: active ? "#fff" : accent[i],
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {loc}
            </button>
          );
        })}
      </div>
    </div>
    {/* Даты */}
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
      {[
        ["From", dateFrom, setDateFrom],
        ["To", dateTo, setDateTo],
      ].map(([label, val, setter]) => (
        <div key={label}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: T.faint,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            {label}
          </div>
          <input
            type="date"
            value={val}
            min="2026-01-01"
            max={MAX_DATE}
            onChange={(e) => setter(e.target.value)}
            style={{
              border: `2px solid ${T.border}`,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 14,
              fontWeight: 700,
              color: T.text,
              background: "#fff",
              fontFamily: "inherit",
            }}
          />
        </div>
      ))}
    </div>
    {/* Пресеты */}
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        {MONTH_PRESETS.map(({ label, from, to }) => (
          <button
            key={label}
            onClick={() => {
              setDateFrom(from);
              setDateTo(to);
            }}
            style={{
              background:
                dateFrom === from && dateTo === to ? T.text : "transparent",
              border: `2px solid ${T.border}`,
              borderRadius: 8,
              color: dateFrom === from && dateTo === to ? "#fff" : T.muted,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  </div>
);
