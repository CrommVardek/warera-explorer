import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { WOODEN_CASE_CONFIG } from "../../../models/wooden-case/WoodenCase";
import { useItemPrices } from "../../../services/ItemPriceService";
import { computeWoodenCaseProfitability } from "../../../services/WoodenCaseService";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { WoodenCaseFilters } from "./WoodenCaseFilters";
import { WoodenCaseLootTable } from "./WoodenCaseLootTable";
import { WoodenCaseSummary } from "./WoodenCaseSummary";

export const WoodenCaseProfitabilityPage = () => {
  const { prices, loading, error } = useItemPrices();

  const [hourlyDropChancePercent, setHourlyDropChancePercent] = useState<number>(
    WOODEN_CASE_CONFIG.lootChancePercent
  );

  const handleHourlyDropChanceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHourlyDropChancePercent(
        Math.min(100, Math.max(0, Number(e.target.value)))
      );
    },
    []
  );

  const profitability = useMemo(
    () => computeWoodenCaseProfitability(prices),
    [prices]
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 24px 48px",
      }}
    >
      <h1>Wooden Case Profitability</h1>
      <p
        style={{
          maxWidth: "820px",
          margin: "8px 0 24px",
          color: "#546e7a",
          fontSize: "0.92em",
          lineHeight: 1.6,
        }}
      >
        A wooden case rolls a rarity, picks one resource of that rarity at
        random, then hands out as much of it as a work budget of{" "}
        {WOODEN_CASE_CONFIG.minProductionValue}–
        {WOODEN_CASE_CONFIG.maxProductionValue} points buys. Prices come live
        from the WarEra market.
      </p>

      {error ? (
        <p style={{ color: "#c62828" }}>
          Market prices could not be loaded. Try again in a moment.
        </p>
      ) : (
        <div style={{ width: "100%", maxWidth: "1180px" }}>
          <WoodenCaseFilters
            hourlyDropChancePercent={hourlyDropChancePercent}
            onHourlyDropChanceChange={handleHourlyDropChanceChange}
          />
          <WoodenCaseSummary
            profitability={profitability}
            hourlyDropChancePercent={hourlyDropChancePercent}
          />
          <h2
            style={{
              fontSize: "1.1em",
              textAlign: "left",
              margin: "28px 0 12px",
              color: "#37474f",
            }}
          >
            Loot table
          </h2>
          <WoodenCaseLootTable rows={profitability.rows} />
        </div>
      )}
    </div>
  );
};
