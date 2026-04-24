import React from "react";

export function GBPMiniDonut({ platform, size = 60 }) {
  const segs = [
    { p: platform.mobile / 100, c: "#f59e0b" },
    { p: platform.desktop / 100, c: "#0ea5e9" },
    { p: platform.mapsMobile / 100, c: "#ef4444" },
    { p: (platform.mapsDesktop || 0) / 100, c: "#10b981" },
  ];
  const cx = size / 2,
    cy = size / 2,
    R = size * 0.42,
    r = size * 0.22;
  let a = -Math.PI / 2;
  return (
    <svg width={size} height={size}>
      {segs.map((s, i) => {
        const s0 = a;
        a += s.p * 2 * Math.PI;
        const s1 = a;
        const lg = s.p > 0.5 ? 1 : 0;
        const d = `M${cx + R * Math.cos(s0)},${
          cy + R * Math.sin(s0)
        } A${R},${R} 0 ${lg},1 ${cx + R * Math.cos(s1)},${
          cy + R * Math.sin(s1)
        } L${cx + r * Math.cos(s1)},${
          cy + r * Math.sin(s1)
        } A${r},${r} 0 ${lg},0 ${cx + r * Math.cos(s0)},${
          cy + r * Math.sin(s0)
        } Z`;
        return <path key={i} d={d} fill={s.c} stroke="#fff" strokeWidth={1} />;
      })}
    </svg>
  );
}

export function GBPSparkline({ data, color, height = 36, width = 100 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${
          height - (v / max) * height * 0.9 - 2
        }`
    )
    .join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * width}
          cy={height - (v / max) * height * 0.9 - 2}
          r={2.5}
          fill={color}
        />
      ))}
    </svg>
  );
}
