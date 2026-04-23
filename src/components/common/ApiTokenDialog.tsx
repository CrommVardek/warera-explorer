import { useState } from "react";

interface ApiTokenDialogProps {
  onConfirm: (token: string | null) => void;
}

export const ApiTokenDialog = ({ onConfirm }: ApiTokenDialogProps) => {
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          width: "440px",
          maxWidth: "90vw",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "rgba(23, 30, 34, 1)",
            color: "rgba(225, 225, 225, 1)",
            padding: "16px 24px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.05em",
              letterSpacing: "0.02em",
            }}
          >
            API Token
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          <p
            style={{
              fontSize: "0.9em",
              color: "#546e7a",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            This page fetches a large amount of data from the Warera API.
            Providing an API token removes rate-limiting and ensures all data
            loads correctly. You can create an API Token from your WarEra
            profile, in settings section.
          </p>

          <label
            style={{
              fontSize: "0.75em",
              fontWeight: 600,
              color: "#546e7a",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "6px",
            }}
          >
            API Token
          </label>
          <input
            type="password"
            placeholder="Paste your API token here…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
            }}
            autoFocus
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #b0bec5",
              borderRadius: "6px",
              fontSize: "0.95em",
              color: "#213547",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            <button
              onClick={() => onConfirm(null)}
              style={{
                padding: "8px 18px",
                border: "1px solid #b0bec5",
                borderRadius: "6px",
                background: "#fff",
                color: "#546e7a",
                fontSize: "0.9em",
                cursor: "pointer",
              }}
            >
              Skip
            </button>
            <button
              onClick={() => onConfirm(value.trim() || null)}
              disabled={!value.trim()}
              style={{
                padding: "8px 18px",
                border: "none",
                borderRadius: "6px",
                background: value.trim() ? "rgba(23, 30, 34, 0.9)" : "#b0bec5",
                color: "#fff",
                fontSize: "0.9em",
                cursor: value.trim() ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
