import React, { useState } from "react";
import { T, fmt, cplColor } from "./ui";
import { dailyData, ALL_LOCATIONS, ACCENT, MAX_DATE } from "../data";

export const NotesTab = () => {
  const [notes, setNotes] = useState({});
  const [selectedLoc, setSelectedLoc] = useState("Atlanta");
  const [dateFrom, setDateFrom] = useState("2026-03-01");
  const [dateTo, setDateTo] = useState(MAX_DATE);
  const [editingKey, setEditingKey] = useState(null);
  const [draft, setDraft] = useState("");

  const filtered = dailyData
    .filter(
      (d) =>
        d.location === selectedLoc && d.date >= dateFrom && d.date <= dateTo
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const key = (d) => `${d.date}__${d.location}`;

  const startEdit = (d) => {
    setEditingKey(key(d));
    setDraft(notes[key(d)] || "");
  };

  const saveNote = () => {
    if (editingKey) setNotes((p) => ({ ...p, [editingKey]: draft }));
    setEditingKey(null);
    setDraft("");
  };

  const noteCount = Object.values(notes).filter(Boolean).length;

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
        Day Notes
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          color: T.muted,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Add context to any day — budget changes, technical issues, or holidays
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
              marginBottom: 10,
            }}
          >
            Location
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ALL_LOCATIONS.map((loc, i) => (
              <button
                key={loc}
                onClick={() => setSelectedLoc(loc)}
                style={{
                  background: selectedLoc === loc ? ACCENT[i] : "transparent",
                  border: `2px solid ${ACCENT[i]}`,
                  borderRadius: 8,
                  color: selectedLoc === loc ? "#fff" : ACCENT[i],
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {loc}
              </button>
            ))}
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
      </div>

      {noteCount > 0 && (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 600,
            color: "#1d4ed8",
          }}
        >
          📝 {noteCount} note{noteCount > 1 ? "s" : ""} saved
        </div>
      )}

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
              {["Date", "Leads", "Spend", "CPL", "Note", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 18px",
                    color: T.muted,
                    textAlign: "left",
                    fontWeight: 800,
                    fontSize: 12,
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
            {filtered.map((row, i) => {
              const k = key(row);
              const note = notes[k];
              const isEditing = editingKey === k;
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: note
                      ? "#fffbeb"
                      : i % 2 === 0
                      ? T.card
                      : "#f8f5f0",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 18px",
                      fontWeight: 700,
                      fontSize: 13,
                      color: T.muted,
                    }}
                  >
                    {row.date.slice(5)}
                  </td>
                  <td
                    style={{
                      padding: "12px 18px",
                      fontWeight: 900,
                      fontSize: 15,
                    }}
                  >
                    {row.leads}
                  </td>
                  <td
                    style={{
                      padding: "12px 18px",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {fmt(row.spend)}
                  </td>
                  <td
                    style={{
                      padding: "12px 18px",
                      fontWeight: 900,
                      fontSize: 15,
                      color: cplColor(row.cpl),
                    }}
                  >
                    ${row.cpl}
                  </td>
                  <td style={{ padding: "12px 18px", maxWidth: 300 }}>
                    {isEditing ? (
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveNote()}
                        style={{
                          width: "100%",
                          border: `2px solid #38bdf8`,
                          borderRadius: 6,
                          padding: "6px 10px",
                          fontSize: 13,
                          outline: "none",
                        }}
                        autoFocus
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: 13,
                          color: note ? T.amber : T.faint,
                          fontWeight: note ? 700 : 400,
                          fontStyle: note ? "normal" : "italic",
                        }}
                      >
                        {note || "No note"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <button
                      onClick={() => (isEditing ? saveNote() : startEdit(row))}
                      style={{
                        background: isEditing ? "#15803d" : "transparent",
                        color: isEditing ? "#fff" : "#38bdf8",
                        border: isEditing ? "none" : `1px solid #38bdf8`,
                        borderRadius: 6,
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {isEditing ? "Save" : note ? "Edit" : "+ Add"}
                    </button>
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
