import React, { useState } from "react";
import { T } from "../ui";
import { GBP_DATA, ALL_GBP } from "../../gbpdata/gbpData";
import { GBPMiniDonut, GBPSparkline } from "./GBPCharts";

export function GBPTab() {
  const [view, setView] = useState("overview");
  const [sel, setSel] = useState(null);

  const tot = (k) => ALL_GBP.reduce((s, d) => s + d[k], 0);
  const cr = (d) => (d.views ? ((d.calls / d.views) * 100).toFixed(1) : "0");
  const xr = (d) => (d.views ? ((d.clicks / d.views) * 100).toFixed(1) : "0");
  const rc = (r) => (+r >= 8 ? "#15803d" : +r >= 4 ? "#b45309" : "#dc2626");

  const tI = tot("interactions"),
    tC = tot("calls"),
    tCl = tot("clicks"),
    tV = tot("views");

  const insights = [];
  ALL_GBP.forEach((d) => {
    const r = +cr(d);
    if (r < 4)
      insights.push({
        type: "warn",
        loc: d.loc,
        color: d.color,
        text: `Call rate ${r}% — Low Visibility`,
        detail: `Only ${d.calls} calls from ${d.views.toLocaleString()} views.`,
      });
    if (r >= 8)
      insights.push({
        type: "good",
        loc: d.loc,
        color: d.color,
        text: `Strong Call Rate ${r}%`,
        detail: `${d.calls} calls from ${d.views.toLocaleString()} views.`,
      });
    if (
      d.topQueries.some(
        (q) => !q.q.includes("bozman") && !q.q.includes("neighbor") && q.n >= 50
      )
    )
      insights.push({
        type: "good",
        loc: d.loc,
        color: d.color,
        text: `Organic Traffic Signal`,
        detail: `Non-branded queries are driving real impressions.`,
      });
    if (d.searches < 100 && d.loc !== "NV Philadelphia")
      insights.push({
        type: "warn",
        loc: d.loc,
        color: d.color,
        text: `Low Search Volume (${d.searches})`,
        detail: `Needs more reviews or updated service area.`,
      });
  });

  const IS = (t) =>
    ({
      good: { bg: "#f0fdf4", border: "#86efac", icon: "✅", color: "#15803d" },
      warn: { bg: "#fffbeb", border: "#fcd34d", icon: "⚠️", color: "#b45309" },
    }[t]);

  const Card = ({ d }) => (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderTop: `4px solid ${d.color}`,
        borderRadius: 12,
        padding: 18,
        cursor: "pointer",
      }}
      onClick={() => {
        setSel(d.loc);
        setView("detail");
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: T.text }}>
            {d.loc}
          </div>
          <div style={{ fontSize: 11, color: T.faint, fontWeight: 600 }}>
            {d.views.toLocaleString()} views
          </div>
        </div>
        <GBPMiniDonut platform={d.platform} size={48} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {[
          { l: "Inter.", v: d.interactions, c: "#38bdf8" },
          { l: "Calls", v: d.calls, c: "#10b981" },
          { l: "Clicks", v: d.clicks, c: "#f59e0b" },
        ].map(({ l, v, c }) => (
          <div
            key={l}
            style={{
              background: "#f8fafc",
              borderRadius: 7,
              padding: "8px 6px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 900, color: c }}>{v}</div>
            <div
              style={{
                fontSize: 9,
                color: T.faint,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: T.faint }}>
          Call rate
        </span>
        <span style={{ fontWeight: 900, fontSize: 13, color: rc(cr(d)) }}>
          {cr(d)}%
        </span>
      </div>
      <GBPSparkline
        data={d.trend.calls}
        color={d.color}
        width={220}
        height={28}
      />
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 24,
              fontWeight: 900,
              color: T.text,
            }}
          >
            Google Business Profile
          </h2>
          <p
            style={{ margin: 0, color: T.muted, fontSize: 13, fontWeight: 600 }}
          >
            Nov 2025 – Apr 2026 · All Locations
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            ["overview", "📊 Overview"],
            ["detail", "🔍 Detail"],
            ["queries", "🔎 Queries"],
            ["insights", "💡 Insights"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                background: view === v ? T.text : "transparent",
                border: `2px solid ${T.border}`,
                borderRadius: 8,
                color: view === v ? "#fff" : T.muted,
                padding: "7px 13px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            l: "Interactions",
            v: tI.toLocaleString(),
            c: "#38bdf8",
            s: "Calls + Clicks",
          },
          {
            l: "Calls",
            v: tC.toLocaleString(),
            c: "#10b981",
            s: `${((tC / tI) * 100).toFixed(0)}% of interactions`,
          },
          {
            l: "Web Clicks",
            v: tCl.toLocaleString(),
            c: "#f59e0b",
            s: `${((tCl / tI) * 100).toFixed(0)}% of interactions`,
          },
          {
            l: "Profile Views",
            v: tV.toLocaleString(),
            c: "#a78bfa",
            s: `${((tC / tV) * 100).toFixed(1)}% call rate`,
          },
        ].map(({ l, v, c, s }) => (
          <div
            key={l}
            style={{
              background: T.card,
              border: `2px solid ${c}33`,
              borderTop: `3px solid ${c}`,
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, color: c }}>{v}</div>
            <div
              style={{
                fontSize: 11,
                color: T.muted,
                marginTop: 4,
                fontWeight: 700,
              }}
            >
              {l}
            </div>
            <div
              style={{
                fontSize: 10,
                color: T.faint,
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      {view === "overview" && (
        <div>
          {[
            { title: "ClientA", data: GBP_DATA.ClientA },
            { title: "ClientB", data: GBP_DATA.ClientB },
          ].map(({ title, data }) => (
            <div key={title} style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ height: 2, flex: 1, background: T.border }} />
                {title}
                <div style={{ height: 2, flex: 1, background: T.border }} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                  gap: 12,
                }}
              >
                {data.map((d) => (
                  <Card key={d.loc} d={d} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "queries" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
              gap: 14,
            }}
          >
            {ALL_GBP.map((d) => (
              <div
                key={d.loc}
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: d.color,
                    padding: "10px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontWeight: 900, fontSize: 14, color: "#fff" }}
                  >
                    {d.loc}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}
                  >
                    {d.searches} searches
                  </span>
                </div>
                <div style={{ padding: "10px 0" }}>
                  {d.topQueries.map((q, i) => {
                    const branded =
                      q.q.includes("bozman") || q.q.includes("neighbor");
                    return (
                      <div
                        key={i}
                        style={{
                          padding: "7px 16px",
                          borderBottom:
                            i < d.topQueries.length - 1
                              ? `1px solid ${T.border}`
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: T.text,
                              flex: 1,
                            }}
                          >
                            {q.q}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {branded && (
                              <span
                                style={{
                                  fontSize: 8,
                                  fontWeight: 800,
                                  background: "#dbeafe",
                                  color: "#1d4ed8",
                                  padding: "1px 5px",
                                  borderRadius: 3,
                                  textTransform: "uppercase",
                                }}
                              >
                                brand
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 900,
                                color: q.n >= 15 ? d.color : T.faint,
                              }}
                            >
                              {q.n >= 15 ? q.n : "<15"}
                            </span>
                          </div>
                        </div>
                        {q.n >= 15 && (
                          <div
                            style={{
                              height: 3,
                              background: "#e2e8f0",
                              borderRadius: 2,
                            }}
                          >
                            <div
                              style={{
                                width: `${(q.n / d.topQueries[0].n) * 100}%`,
                                height: "100%",
                                background: d.color,
                                borderRadius: 2,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#1d4ed8",
            }}
          >
            💡 Jacksonville is the only city where "appliance repair near me"
            (101 searches) outpaces branded queries. Real organic demand signal
            here.
          </div>
        </div>
      )}

      {view === "insights" && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {insights.map((ins, i) => {
              const s = IS(ins.type);
              return (
                <div
                  key={i}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderLeft: `5px solid ${s.border}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{s.icon}</span>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: ins.color,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: 12,
                          color: s.color,
                        }}
                      >
                        {ins.loc}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: s.color }}
                    >
                      {ins.text}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: s.color,
                        opacity: 0.75,
                        marginTop: 2,
                      }}
                    >
                      {ins.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: "18px 22px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: T.text,
                marginBottom: 12,
              }}
            >
              📋 Action Items
            </div>
            {[
              {
                loc: "All Locations",
                action: "Weekly GBP posts — Google rewards active profiles.",
                priority: "HIGH",
              },
              {
                loc: "NV Philadelphia",
                action:
                  "Only 11 interactions — needs full optimization: photos, services, Q&A.",
                priority: "HIGH",
              },
              {
                loc: "Charlotte & Miami",
                action:
                  "Near-zero organic queries — add keywords to descriptions.",
                priority: "MED",
              },
              {
                loc: "Jacksonville",
                action:
                  "Strong organic traffic — double down on reviews and geo-posts.",
                priority: "LOW",
              },
            ].map(({ loc, action, priority }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 900,
                    padding: "2px 7px",
                    borderRadius: 4,
                    height: "fit-content",
                    background:
                      priority === "HIGH"
                        ? "#fee2e2"
                        : priority === "MED"
                        ? "#fef3c7"
                        : "#dcfce7",
                    color:
                      priority === "HIGH"
                        ? "#dc2626"
                        : priority === "MED"
                        ? "#b45309"
                        : "#15803d",
                  }}
                >
                  {priority}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: T.text,
                      marginBottom: 1,
                    }}
                  >
                    {loc}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted }}>{action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
