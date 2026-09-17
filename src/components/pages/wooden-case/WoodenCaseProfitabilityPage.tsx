import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { TRAVEL_CONFIG } from "../../../models/region/Region";
import { WOODEN_CASE_CONFIG } from "../../../models/wooden-case/WoodenCase";
import { useItemPrices } from "../../../services/ItemPriceService";
import { useRegions } from "../../../services/RegionService";
import {
  averageRegionsPerBatchedCase,
  buildRegionGraph,
  maxRegionsAcross,
} from "../../../services/TravelService";
import {
  computeTravelEconomics,
  computeWoodenCaseProfitability,
  expectedCasesPerDay,
} from "../../../services/WoodenCaseService";
import { describeApiError } from "../../../utils/errorUtils";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { WoodenCaseFilters } from "./WoodenCaseFilters";
import { WoodenCaseLootTable } from "./WoodenCaseLootTable";
import { WoodenCaseSummary } from "./WoodenCaseSummary";

/** Starting regions sampled when averaging the walk across the whole map. */
const START_SAMPLE_STEP = 20;
const ROUTES_PER_START = 80;

export const WoodenCaseProfitabilityPage = () => {
  const { prices, loading: pricesLoading, error } = useItemPrices();
  const { regions, loading: regionsLoading } = useRegions();

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

  const graph = useMemo(
    () => (Object.keys(regions).length ? buildRegionGraph(regions) : null),
    [regions]
  );

  /**
   * How far a case is on average, for a player who lets a full batch pile up
   * and then walks the best route through them. Cases land anywhere and players
   * stand anywhere, so both ends are averaged over the map.
   */
  const regionsPerCase = useMemo(() => {
    if (!graph) return 0;
    const starts = graph.ids.filter(
      (_, index) => index % START_SAMPLE_STEP === 0
    );
    const total = starts.reduce(
      (sum, start) =>
        sum +
        averageRegionsPerBatchedCase(
          graph,
          start,
          WOODEN_CASE_CONFIG.maxPerUser,
          ROUTES_PER_START
        ),
      0
    );
    return starts.length ? total / starts.length : 0;
  }, [graph]);

  const travel = useMemo(
    () =>
      computeTravelEconomics({
        regionsPerCase,
        casesPerDay: expectedCasesPerDay(hourlyDropChancePercent),
        oilPrice: prices.oil ?? 0,
        hourlyStaminaRegen: TRAVEL_CONFIG.hourlyStaminaRegen,
        caseValue: Math.max(
          profitability.expectedValue,
          profitability.casePrice
        ),
      }),
    [regionsPerCase, hourlyDropChancePercent, prices.oil, profitability]
  );

  if (pricesLoading || regionsLoading) return <LoadingSpinner />;

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
        {WOODEN_CASE_CONFIG.maxProductionValue} points buys. It also has to be
        walked to, at {TRAVEL_CONFIG.staminaPerRegion} stamina or{" "}
        {TRAVEL_CONFIG.oilPerRegion} oil per region crossed. Prices and map come
        live from WarEra.
      </p>

      {error ? (
        <p style={{ color: "#c62828" }}>
          {describeApiError(error, "Market prices are unavailable.")}
        </p>
      ) : (
        <div style={{ width: "100%", maxWidth: "1180px" }}>
          <WoodenCaseFilters
            hourlyDropChancePercent={hourlyDropChancePercent}
            onHourlyDropChanceChange={handleHourlyDropChanceChange}
          />
          <WoodenCaseSummary
            profitability={profitability}
            travel={travel}
            mapWidthInRegions={graph ? maxRegionsAcross(graph) : 0}
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
