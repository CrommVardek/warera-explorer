import { WOODEN_CASE_CONFIG } from "../../../models/wooden-case/WoodenCase";
import type {
  TravelEconomics,
  WoodenCaseProfitability,
} from "../../../services/WoodenCaseService";
import { formatGold, formatPercent } from "./format";

interface WoodenCaseSummaryProps {
  profitability: WoodenCaseProfitability;
  travel: TravelEconomics;
  /** Longest walk the map can demand, for context on the break-even. */
  mapWidthInRegions: number;
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
  travel,
  mapWidthInRegions,
}: WoodenCaseSummaryProps) => {
  const { expectedValue, casePrice, profit } = profitability;
  const worthOpening = profit > 0;

  // The case has to be walked to either way, so travel does not change the
  // open-or-sell call — only whether collecting is worth the trip at all.
  const grossPerCase = Math.max(expectedValue, casePrice);
  const netPerCase = grossPerCase - travel.travelCostPerCase;
  const netPerDay = netPerCase * travel.casesPerDay;
  const travelShare = grossPerCase ? travel.travelCostPerCase / grossPerCase : 0;
  const netColor = netPerCase > 0 ? POSITIVE : NEGATIVE;

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
          label="Travel cost"
          value={`−${formatGold(travel.travelCostPerCase)}`}
          hint={`${travel.regionsPerCase.toFixed(1)} regions per case, ${formatPercent(travelShare, 0)} of its value`}
          color={NEGATIVE}
        />
        <Card
          label="Net per case"
          value={`${netPerCase >= 0 ? "+" : ""}${formatGold(netPerCase)}`}
          hint="Best of opening or selling, once the walk is paid for"
          color={netColor}
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
        Either way you have to walk to it. A case lands on a random region,{" "}
        <strong>{travel.regionsPerCase.toFixed(1)} regions away on average</strong>{" "}
        when {WOODEN_CASE_CONFIG.maxPerUser} are collected in one trip, which at{" "}
        {((travel.casesPerDay / 24) * 100).toFixed(0)}% hourly comes to{" "}
        {travel.regionsPerDay.toFixed(0)} regions a day. Stamina regeneration
        pays for {travel.staminaRegionsPerDay.toFixed(0)} of them; the remaining{" "}
        {travel.oilRegionsPerDay.toFixed(0)} cost{" "}
        {travel.oilPerDay.toFixed(0)} oil, or{" "}
        <strong>{formatGold(travel.travelCostPerCase)} per case</strong>. A case
        stops being worth the walk past{" "}
        {Number.isFinite(travel.breakEvenRegions)
          ? travel.breakEvenRegions.toFixed(0)
          : "∞"}{" "}
        regions, against a map whose furthest two regions are{" "}
        {mapWidthInRegions} apart.
        <br />
        That leaves{" "}
        <strong style={{ color: netColor }}>
          {formatGold(netPerCase)} net per case
        </strong>{" "}
        and{" "}
        <strong style={{ color: netColor }}>{formatGold(netPerDay)} a day</strong>{" "}
        — provided you go and collect them: the roll is skipped while{" "}
        {WOODEN_CASE_CONFIG.maxPerUser} of yours sit uncollected, and each one
        expires after {WOODEN_CASE_CONFIG.expiryHours}h.
      </div>
    </div>
  );
};
