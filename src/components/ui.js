import React from "react";

export const T = {
  bg: "#e8e4dc",
  card: "#f5f2ec",
  border: "#c8c0b4",
  text: "#0f172a",
  muted: "#334155",
  faint: "#64748b",
  header: "#0f172a",
  green: "#15803d",
  red: "#dc2626",
  amber: "#b45309",
};

export const fmt = (n) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`;

export const pct = (a, b) => (a ? (((b - a) / a) * 100).toFixed(1) : "0");

export const arrow = (v) => (+v >= 0 ? "▲" : "▼");

export const cplColor = (c) =>
  c <= 45 ? "#15803d" : c <= 55 ? "#b45309" : "#dc2626";

export const Tag = ({ label, color }) => (
  <span
    style={{
      display: "inline-block",
      background: color + "18",
      color,
      border: `1px solid ${color}55`,
      borderRadius: 6,
      padding: "3px 10px",
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: 0.3,
      textTransform: "uppercase",
    }}
  >
    {label}
  </span>
);

export const Stat = ({ label, value, color, sub }) => (
  <div
    style={{
      background: T.card,
      border: `2px solid ${color}33`,
      borderTop: `3px solid ${color}`,
      borderRadius: 10,
      padding: "16px 20px",
      minWidth: 110,
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1.1 }}>
      {value}
    </div>
    <div
      style={{ fontSize: 12, color: T.muted, marginTop: 5, fontWeight: 700 }}
    >
      {label}
    </div>
    {sub && (
      <div
        style={{ fontSize: 11, color: T.faint, marginTop: 2, fontWeight: 600 }}
      >
        {sub}
      </div>
    )}
  </div>
);

export const MiniCell = ({ label, value, delta, deltaColor, dim }) => (
  <div
    style={{
      background: dim ? "#f8fafc" : T.card,
      border: `1px solid ${dim ? "#e2e8f0" : T.border}`,
      borderRadius: 8,
      padding: "12px 14px",
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: dim ? T.faint : T.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{ fontSize: 20, fontWeight: 900, color: dim ? T.faint : T.text }}
    >
      {value}
    </div>
    {delta && (
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: deltaColor,
          marginTop: 4,
        }}
      >
        {delta}
      </div>
    )}
  </div>
);

export const StatusBadge = ({ cpl }) => {
  const getStatus = (c) =>
    c <= 45
      ? { label: "GOOD", bg: "#dcfce7", color: "#15803d" }
      : c <= 55
      ? { label: "OK", bg: "#fef3c7", color: "#b45309" }
      : { label: "HIGH", bg: "#fee2e2", color: "#dc2626" };
  const s = getStatus(cpl);
  return (
    <span
      style={{
        display: "inline-block",
        background: s.bg,
        color: s.color,
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {s.label}
    </span>
  );
};

export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "12px 18px",
        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          color: T.text,
          fontSize: 14,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 28,
            fontSize: 13,
            marginBottom: 3,
          }}
        >
          <span style={{ color: p.color, fontWeight: 700 }}>{p.name}</span>
          <strong style={{ color: T.text }}>
            {p.name &&
            (p.name.toLowerCase().includes("cpl") ||
              p.name.toLowerCase().includes("$"))
              ? `$${p.value}`
              : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
};
