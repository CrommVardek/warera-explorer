import { WOODEN_CASE_CONFIG } from "../../../models/wooden-case/WoodenCase";
import {
  expectedCasesPerDay,
  type WoodenCaseProfitability,
} from "../../../services/WoodenCaseService";
import { formatGold, formatPercent } from "./format";

interface WoodenCaseSummaryProps {
  profitability: WoodenCaseProfitability;
  hourlyDropChancePercent: number;
}

const POSITIVE = "#2e7d32";
const NEGATIVE = "#c62828";

const cardStyle: React.CSSProperties = {
  flex: "1 1 180px",
  padding: "16px 20px",
  background: "#fff",
  border: "1px solid #d0d7de",
  borderRadius: "8px",
  textAlign: "left",
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: "0.72em",
  fontWeight: 600,
  color: "#546e7a",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const cardValueStyle: React.CSSProperties = {
  fontSize: "1.55em",
  fontWeight: 700,
  lineHeight: 1.2,
};

const cardHintStyle: React.CSSProperties = {
  fontSize: "0.75em",
  color: "#78909c",
  marginTop: "4px",
};

const Card = ({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: string;
  hint: string;
  color?: string;
}) => (
  <div style={cardStyle}>
    <div style={cardLabelStyle}>{label}</div>
    <div style={{ ...cardValueStyle, color: color ?? "#213547" }}>{value}</div>
    <div style={cardHintStyle}>{hint}</div>
  </div>
);

export const WoodenCaseSummary = ({
  profitability,
  hourlyDropChancePercent,
}: WoodenCaseSummaryProps) => {
  const { expectedValue, casePrice, profit, roi } = profitability;
  const worthOpening = profit > 0;
  const profitColor = worthOpening ? POSITIVE : NEGATIVE;

  const casesPerDay = expectedCasesPerDay(hourlyDropChancePercent);
  const bestPerCase = Math.max(expectedValue, casePrice);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <Card
          label="Expected content"
          value={formatGold(expectedValue)}
          hint="Average value of what one case drops"
        />
        <Card
          label="Case price"
          value={formatGold(casePrice)}
          hint="What one case is worth on the market"
        />
        <Card
          label="Edge per case"
          value={`${profit >= 0 ? "+" : ""}${formatGold(profit)}`}
          hint={
            worthOpening
              ? "Opening beats the case price"
              : "The case is worth more unopened"
          }
          color={profitColor}
        />
        <Card
          label="Return"
          value={`${roi >= 0 ? "+" : ""}${formatPercent(roi, 1)}`}
          hint="Edge relative to the case price"
          color={profitColor}
        />
      </div>

      <div
        style={{
          padding: "14px 20px",
          background: "#fff",
          border: "1px solid #d0d7de",
          borderRadius: "8px",
          textAlign: "left",
          fontSize: "0.9em",
          color: "#37474f",
          lineHeight: 1.7,
        }}
      >
        <strong>{worthOpening ? "Open them." : "Sell them unopened."}</strong>{" "}
        {worthOpening
          ? `Opening and selling the content returns ${formatGold(expectedValue)} per case against ${formatGold(casePrice)} for the case itself.`
          : `The case fetches ${formatGold(casePrice)} while its content is only worth ${formatGold(expectedValue)} on average.`}
        <br />
        At a {hourlyDropChancePercent}% hourly roll you can expect{" "}
        <strong>{casesPerDay.toFixed(1)} cases a day</strong>, worth{" "}
        <strong>{formatGold(casesPerDay * bestPerCase)} a day</strong> taking
        the better of the two options — provided you go and collect them, since
        the roll is skipped while {WOODEN_CASE_CONFIG.maxPerUser} of yours sit
        uncollected and each one expires after {WOODEN_CASE_CONFIG.expiryHours}h.
      </div>
    </div>
  );
};
