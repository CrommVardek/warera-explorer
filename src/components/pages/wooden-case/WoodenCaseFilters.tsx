interface WoodenCaseFiltersProps {
  hourlyDropChancePercent: number;
  onHourlyDropChanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.75em",
  fontWeight: 600,
  color: "#546e7a",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: "4px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "90px",
  padding: "6px 10px",
  border: "1px solid #b0bec5",
  borderRadius: "6px",
  fontSize: "0.95em",
  color: "#213547",
  background: "#fff",
  outline: "none",
};

export const WoodenCaseFilters = ({
  hourlyDropChancePercent,
  onHourlyDropChanceChange,
}: WoodenCaseFiltersProps) => (
  <div
    style={{
      marginBottom: "24px",
      padding: "14px 20px",
      background: "#f5f7fa",
      border: "1px solid #d0d7de",
      borderLeft: "4px solid rgba(23, 30, 34, 0.85)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: "20px",
    }}
  >
    <span
      style={{
        fontSize: "0.8em",
        fontWeight: 700,
        color: "rgba(23, 30, 34, 0.85)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        alignSelf: "center",
        paddingRight: "8px",
        borderRight: "1px solid #d0d7de",
      }}
    >
      Settings
    </span>

    <div>
      <label htmlFor="dropChance" style={labelStyle}>
        Hourly drop %
      </label>
      <input
        type="number"
        id="dropChance"
        value={hourlyDropChancePercent}
        onChange={onHourlyDropChanceChange}
        min={0}
        max={100}
        step={1}
        style={inputStyle}
      />
    </div>

    <p
      style={{
        flex: "1 1 320px",
        margin: 0,
        fontSize: "0.8em",
        color: "#546e7a",
        textAlign: "left",
        lineHeight: 1.5,
      }}
    >
      25% base, roughly doubling at maximum Luck. Everything is valued at the
      current average market price, before any market tax.
    </p>
  </div>
);
