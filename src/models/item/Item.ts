export const ItemRarity = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
} as const;

export type ItemRarity = (typeof ItemRarity)[keyof typeof ItemRarity];

/** Current market value of every tradable item, keyed by item code. */
export type ItemPrices = Record<string, number>;

export interface Item {
  code: string;
  name: string;
  rarity: ItemRarity;
  /** Work points the game charges to produce a single unit of this item. */
  productionPoints: number;
}

/**
 * Item definitions mirroring the WarEra client configuration.
 * Only the items reachable from a case are listed.
 */
export const ITEMS: Record<string, Item> = {
  grain: { code: "grain", name: "Grain", rarity: ItemRarity.COMMON, productionPoints: 1 },
  iron: { code: "iron", name: "Iron", rarity: ItemRarity.COMMON, productionPoints: 1 },
  wood: { code: "wood", name: "Wood", rarity: ItemRarity.COMMON, productionPoints: 1 },
  lead: { code: "lead", name: "Lead", rarity: ItemRarity.COMMON, productionPoints: 1 },
  limestone: { code: "limestone", name: "Limestone", rarity: ItemRarity.COMMON, productionPoints: 1 },
  coca: { code: "coca", name: "Mysterious Plant", rarity: ItemRarity.COMMON, productionPoints: 1 },
  petroleum: { code: "petroleum", name: "Petroleum", rarity: ItemRarity.COMMON, productionPoints: 1 },
  livestock: { code: "livestock", name: "Livestock", rarity: ItemRarity.COMMON, productionPoints: 20 },
  fish: { code: "fish", name: "Fish", rarity: ItemRarity.COMMON, productionPoints: 40 },

  concrete: { code: "concrete", name: "Concrete", rarity: ItemRarity.UNCOMMON, productionPoints: 10 },
  steel: { code: "steel", name: "Steel", rarity: ItemRarity.UNCOMMON, productionPoints: 10 },
  bread: { code: "bread", name: "Bread", rarity: ItemRarity.UNCOMMON, productionPoints: 10 },
  oil: { code: "oil", name: "Oil", rarity: ItemRarity.UNCOMMON, productionPoints: 1 },
  paper: { code: "paper", name: "Paper", rarity: ItemRarity.UNCOMMON, productionPoints: 1 },
  lightAmmo: { code: "lightAmmo", name: "Light Ammo", rarity: ItemRarity.UNCOMMON, productionPoints: 1 },

  ammo: { code: "ammo", name: "Ammo", rarity: ItemRarity.RARE, productionPoints: 4 },
  steak: { code: "steak", name: "Steak", rarity: ItemRarity.RARE, productionPoints: 20 },

  cookedFish: { code: "cookedFish", name: "Cooked Fish", rarity: ItemRarity.EPIC, productionPoints: 40 },
  heavyAmmo: { code: "heavyAmmo", name: "Heavy Ammo", rarity: ItemRarity.EPIC, productionPoints: 16 },
  cocain: { code: "cocain", name: "Pill", rarity: ItemRarity.EPIC, productionPoints: 200 },
};

export const RARITY_LABELS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: "Common",
  [ItemRarity.UNCOMMON]: "Uncommon",
  [ItemRarity.RARE]: "Rare",
  [ItemRarity.EPIC]: "Epic",
};

export const RARITY_COLORS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: "#78909c",
  [ItemRarity.UNCOMMON]: "#2e7d32",
  [ItemRarity.RARE]: "#1565c0",
  [ItemRarity.EPIC]: "#7b1fa2",
};

/** Rarest first, the order the game presents drop tables in. */
export const RARITY_ORDER: Record<ItemRarity, number> = {
  [ItemRarity.EPIC]: 0,
  [ItemRarity.RARE]: 1,
  [ItemRarity.UNCOMMON]: 2,
  [ItemRarity.COMMON]: 3,
};
