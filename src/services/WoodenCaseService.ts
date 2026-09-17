import {
  ITEMS,
  RARITY_ORDER,
  type Item,
  type ItemPrices,
  type ItemRarity,
} from "../models/item/Item";
import { TRAVEL_CONFIG } from "../models/region/Region";
import {
  WOODEN_CASE_CONFIG,
  WOODEN_CASE_ITEM_CODE,
  WOODEN_CASE_RARITY_CHANCES,
  WOODEN_CASE_RESOURCE_POOL,
} from "../models/wooden-case/WoodenCase";

export interface WoodenCaseLootRow {
  item: Item;
  /** Probability of this exact item dropping, between 0 and 1. */
  dropChance: number;
  minQuantity: number;
  maxQuantity: number;
  expectedQuantity: number;
  unitPrice: number;
  /** Value of the drop when it happens. */
  expectedValue: number;
  /** Share of the case value this item accounts for. */
  contribution: number;
  contributionShare: number;
}

export interface WoodenCaseProfitability {
  rows: WoodenCaseLootRow[];
  /** Expected content value of one case. */
  expectedValue: number;
  /** Market value of one case. */
  casePrice: number;
  profit: number;
  /** Profit relative to the case price. */
  roi: number;
}

const quantityFor = (work: number, productionPoints: number): number =>
  work / productionPoints;

/**
 * The work budget is drawn uniformly between the two bounds, so the amount
 * handed out averages out to the mid-budget divided by the unit cost.
 */
const expectedQuantity = (productionPoints: number): number =>
  quantityFor(
    (WOODEN_CASE_CONFIG.minProductionValue +
      WOODEN_CASE_CONFIG.maxProductionValue) /
      2,
    productionPoints,
  );

const itemsByRarity = (): Record<ItemRarity, Item[]> => {
  const grouped = {} as Record<ItemRarity, Item[]>;
  for (const code of WOODEN_CASE_RESOURCE_POOL) {
    const item = ITEMS[code];
    if (!item) continue;
    (grouped[item.rarity] ??= []).push(item);
  }
  return grouped;
};

export const computeWoodenCaseProfitability = (
  prices: ItemPrices,
): WoodenCaseProfitability => {
  const { minProductionValue, maxProductionValue } = WOODEN_CASE_CONFIG;
  const grouped = itemsByRarity();

  const rows: WoodenCaseLootRow[] = [];

  for (const [rarity, items] of Object.entries(grouped) as [
    ItemRarity,
    Item[],
  ][]) {
    // A rarity is rolled first, then one of its items with an equal chance.
    const dropChance = WOODEN_CASE_RARITY_CHANCES[rarity] / items.length;

    for (const item of items) {
      const unitPrice = prices[item.code] ?? 0;
      const expectedComputed = expectedQuantity(item.productionPoints);
      const expected = expectedComputed < 1 ? 1 : expectedComputed;
      const expectedValue = expected * unitPrice;
      const minQuantityComputed = quantityFor(
        minProductionValue,
        item.productionPoints,
      );
      const maxQuantityComputed = quantityFor(
        maxProductionValue,
        item.productionPoints,
      );

      rows.push({
        item,
        dropChance,
        minQuantity: minQuantityComputed < 1 ? 1 : minQuantityComputed,
        maxQuantity: maxQuantityComputed < 1 ? 1 : maxQuantityComputed,
        expectedQuantity: expected,
        unitPrice,
        expectedValue,
        contribution: dropChance * expectedValue,
        contributionShare: 0,
      });
    }
  }

  const expectedValue = rows.reduce((sum, r) => sum + r.contribution, 0);
  for (const row of rows) {
    row.contributionShare = expectedValue
      ? row.contribution / expectedValue
      : 0;
  }
  rows.sort(
    (a, b) =>
      RARITY_ORDER[a.item.rarity] - RARITY_ORDER[b.item.rarity] ||
      a.item.name.localeCompare(b.item.name),
  );

  const casePrice = prices[WOODEN_CASE_ITEM_CODE] ?? 0;
  const profit = expectedValue - casePrice;

  return {
    rows,
    expectedValue,
    casePrice,
    profit,
    roi: casePrice ? profit / casePrice : 0,
  };
};

/**
 * Cases a player can expect per day. The hourly roll is skipped while
 * maxPerUser cases already wait on the map, which only bites if they are left
 * uncollected, so this is the ceiling for a player who collects them.
 */
export const expectedCasesPerDay = (hourlyDropChancePercent: number): number =>
  (24 * hourlyDropChancePercent) / 100;

export interface TravelEconomics {
  /** Regions crossed to bring in one case, once batching is accounted for. */
  regionsPerCase: number;
  casesPerDay: number;
  regionsPerDay: number;
  /** Regions a full day of stamina regeneration pays for. */
  staminaRegionsPerDay: number;
  /** Regions left over, which have to be paid in oil. */
  oilRegionsPerDay: number;
  oilPerDay: number;
  oilPrice: number;
  /** Gold spent on oil to keep collecting, per day and per case. */
  travelCostPerDay: number;
  travelCostPerCase: number;
  /** Regions worth walking for one case before the oil outweighs it. */
  breakEvenRegions: number;
}

export interface TravelEconomicsInput {
  regionsPerCase: number;
  casesPerDay: number;
  oilPrice: number;
  hourlyStaminaRegen: number;
  /** Value of one collected case, whichever of opening or selling is better. */
  caseValue: number;
}

/**
 * Stamina regenerates whether it is used or not, so it is the free part of the
 * budget. Everything it cannot cover is paid in oil, and that is the real cost
 * of collecting cases.
 */
export const computeTravelEconomics = ({
  regionsPerCase,
  casesPerDay,
  oilPrice,
  hourlyStaminaRegen,
  caseValue,
}: TravelEconomicsInput): TravelEconomics => {
  const { staminaPerRegion, oilPerRegion } = TRAVEL_CONFIG;

  const regionsPerDay = regionsPerCase * casesPerDay;
  const staminaRegionsPerDay = (24 * hourlyStaminaRegen) / staminaPerRegion;
  const oilRegionsPerDay = Math.max(0, regionsPerDay - staminaRegionsPerDay);
  const oilPerDay = oilRegionsPerDay * oilPerRegion;
  const travelCostPerDay = oilPerDay * oilPrice;

  const oilCostPerRegion = oilPerRegion * oilPrice;

  return {
    regionsPerCase,
    casesPerDay,
    regionsPerDay,
    staminaRegionsPerDay,
    oilRegionsPerDay,
    oilPerDay,
    oilPrice,
    travelCostPerDay,
    travelCostPerCase: casesPerDay ? travelCostPerDay / casesPerDay : 0,
    breakEvenRegions: oilCostPerRegion ? caseValue / oilCostPerRegion : Infinity,
  };
};
