import { ItemRarity } from "../item/Item";

export const WOODEN_CASE_ITEM_CODE = "woodenCase";

/** Wooden case rules, mirroring the WarEra client configuration. */
export const WOODEN_CASE_CONFIG = {
  /** Base chance, in percent, of a case dropping on the hourly roll. */
  lootChancePercent: 25,
  /** Cases waiting on the map above which the hourly roll is skipped. */
  maxPerUser: 5,
  /** Lifetime of an uncollected case. */
  expiryHours: 48,
  /** Work budget a case is handed, drawn uniformly between both bounds. */
  minProductionValue: 20,
  maxProductionValue: 80,
} as const;

/** Chance of each rarity being rolled when a wooden case is opened. */
export const WOODEN_CASE_RARITY_CHANCES: Record<ItemRarity, number> = {
  [ItemRarity.COMMON]: 0.65,
  [ItemRarity.UNCOMMON]: 0.2,
  [ItemRarity.RARE]: 0.13,
  [ItemRarity.EPIC]: 0.02,
};

/** Resources a wooden case can hand out. A rarity is rolled first, then one of its items, uniformly. */
export const WOODEN_CASE_RESOURCE_POOL = [
  "grain",
  "livestock",
  "limestone",
  "fish",
  "iron",
  "coca",
  "lead",
  "petroleum",
  "wood",
  "concrete",
  "steel",
  "bread",
  "steak",
  "cookedFish",
  "cocain",
  "lightAmmo",
  "ammo",
  "heavyAmmo",
  "oil",
  "paper",
];
