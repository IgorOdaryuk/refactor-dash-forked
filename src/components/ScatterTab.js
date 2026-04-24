import React, { useState } from "react";
import { T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

const PresetButtons = ({ dateFrom, dateTo, setDateFrom, setDateTo }) => {
  const presets = [
    { label: "Jan", from: "2026-01-01", to: "2026-01-31" },
    { label: "Feb", from: "2026-02-01", to: "2026-02-28" },
    { label: "Mar", from: "2026-03-01", to: "2026-03-31" },
    { label: "Apr", from: "2026-04-01", to: "2026-04-21" },
    { label: "All", from: "2026-01-01", to: MAX_DATE },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {presets.map((p) => (
        <button
          key={p.label}
          onClick={() => {
            setDateFrom(p.from);
            setDateTo(p.to);
          }}
          style={{
            background:
              dateFrom === p.from && dateTo === p.to ? T.text : "transparent",
            border: `2px solid ${T.border}`,
            borderRadius: 8,
            color: dateFrom === p.from && dateTo === p.to ? "#fff" : T.muted,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

export const ScatterTab = () => {
  const [selectedLocs, setSelectedLocs] = useState([
    "Atlanta",
    "Tampa",
    "Miami",
  ]);
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);
  const [hovered, setHovered] = useState(null);
  const toggleLoc = (loc) =>
    setSelectedLocs((p) =>
      p.includes(loc) ? p.filter((l) => l !== loc) : [...p, loc]
    );

  const points = dailyData.filter(
    (d) =>
      selectedLocs.includes(d.location) &&
      d.date >= dateFrom &&
      d.date <= dateTo &&
      d.leads > 0
  );
  const maxSpend = Math.max(...points.map((p) => p.spend), 1);
  const maxLeads = Math.max(...points.map((p) => p.leads), 1);

  const W = 600,
    H = 340,
    padL = 52,
    padB = 40,
    padT = 20,
    padR = 20;
  const toX = (spend) => padL + (spend / maxSpend) * (W - padL - padR);
  const toY = (leads) => padT + (1 - leads / maxLeads) * (H - padT - padB);
  const isolines = [30, 45, 55, 80];

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
        Spend vs Leads Scatter
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Each dot = one day. Dots above the $45 line = efficient days.
      </p>
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "16px 24px",
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
              letterSpacing: 0.8,
              marginBottom: 10,
            }}
          >
            Locations
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ALL_LOCATIONS.map((loc, i) => {
              const active = selectedLocs.includes(loc);
              return (
                <button
                  key={loc}
                  onClick={() => toggleLoc(loc)}
                  style={{
                    background: active ? ACCENT[i] : "transparent",
                    border: `2px solid ${ACCENT[i]}`,
                    borderRadius: 8,
                    color: active ? "#fff" : ACCENT[i],
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
        <div>
          <div style={{ fontSize: 11, color: "transparent", marginBottom: 8 }}>
            ·
          </div>
          <PresetButtons
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
          />
        </div>
      </div>
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "20px 16px",
          position: "relative",
          overflowX: "auto",
        }}
      >
        <svg
          width={W}
          height={H}
          style={{ display: "block", margin: "0 auto" }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line
                x1={padL}
                y1={padT + t * (H - padT - padB)}
                x2={W - padR}
                y2={padT + t * (H - padT - padB)}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <text
                x={padL - 6}
                y={padT + t * (H - padT - padB) + 4}
                textAnchor="end"
                style={{ fontSize: 10, fill: T.faint }}
              >
                {Math.round(maxLeads * (1 - t))}
              </text>
              <line
                x1={padL + t * (W - padL - padR)}
                y1={padT}
                x2={padL + t * (W - padL - padR)}
                y2={H - padB}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <text
                x={padL + t * (W - padL - padR)}
                y={H - padB + 14}
                textAnchor="middle"
                style={{ fontSize: 10, fill: T.faint }}
              >
                {fmt(Math.round(maxSpend * t))}
              </text>
            </g>
          ))}
          <text
            x={W / 2}
            y={H - 2}
            textAnchor="middle"
            style={{ fontSize: 11, fill: T.muted, fontWeight: 700 }}
          >
            Daily Spend
          </text>
          <text
            x={12}
            y={H / 2}
            textAnchor="middle"
            transform={`rotate(-90,12,${H / 2})`}
            style={{ fontSize: 11, fill: T.muted, fontWeight: 700 }}
          >
            Leads
          </text>
          {isolines.map((cplVal) => {
            const lineColor =
              cplVal === 45 ? "#15803d" : cplVal === 55 ? "#dc2626" : "#94a3b8";
            return (
              <g key={cplVal}>
                <line
                  x1={toX(0)}
                  y1={toY(0)}
                  x2={toX(Math.min(cplVal * maxLeads, maxSpend))}
                  y2={toY(Math.min(maxLeads, maxSpend / cplVal))}
                  stroke={lineColor}
                  strokeWidth={cplVal === 45 || cplVal === 55 ? 2 : 1}
                  strokeDasharray={
                    cplVal === 45 || cplVal === 55 ? "6 3" : "3 3"
                  }
                />
                <text
                  x={toX(Math.min(cplVal * maxLeads * 0.7, maxSpend * 0.7)) + 4}
                  y={
                    toY(Math.min(maxLeads * 0.7, (maxSpend / cplVal) * 0.7)) - 4
                  }
                  style={{ fontSize: 10, fill: lineColor, fontWeight: 700 }}
                >
                  ${cplVal}
                </text>
              </g>
            );
          })}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={toX(p.spend)}
              cy={toY(p.leads)}
              r={hovered === i ? 9 : 5}
              fill={ACCENT[ALL_LOCATIONS.indexOf(p.location)]}
              fillOpacity={0.85}
              stroke="#fff"
              strokeWidth={hovered === i ? 2 : 1}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {hovered !== null &&
            (() => {
              const p = points[hovered];
              const idx = ALL_LOCATIONS.indexOf(p.location);
              const bx = toX(p.spend),
                by = toY(p.leads);
              const tx = bx > W * 0.7 ? bx - 130 : bx + 12;
              const ty = by < 80 ? by + 10 : by - 70;
              return (
                <g>
                  <rect
                    x={tx}
                    y={ty}
                    width={120}
                    height={62}
                    rx={6}
                    fill="#fff"
                    stroke={T.border}
                    strokeWidth={1}
                    style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.12))" }}
                  />
                  <text
                    x={tx + 8}
                    y={ty + 16}
                    style={{ fontSize: 11, fill: ACCENT[idx], fontWeight: 800 }}
                  >
                    {p.location}
                  </text>
                  <text
                    x={tx + 8}
                    y={ty + 30}
                    style={{ fontSize: 11, fill: T.muted }}
                  >
                    {p.date.slice(5)}
                  </text>
                  <text
                    x={tx + 8}
                    y={ty + 44}
                    style={{ fontSize: 11, fill: T.text, fontWeight: 700 }}
                  >
                    Leads: {p.leads} · CPL: ${p.cpl}
                  </text>
                  <text
                    x={tx + 8}
                    y={ty + 58}
                    style={{ fontSize: 11, fill: T.faint }}
                  >
                    Spend: {fmt(p.spend)}
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>
    </div>
  );
};
