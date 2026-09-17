export interface Region {
  _id: string;
  code: string;
  name: string;
  country: string;
  countryCode: string;
  neighbors: string[];
  /** [longitude, latitude] */
  position: [number, number];
  biome: string;
  climate: string;
}

export type RegionsById = Record<string, Region>;

/**
 * Travel rules, mirroring the WarEra client configuration. Moving to an
 * adjacent region costs stamina, and oil once stamina runs out.
 */
export const TRAVEL_CONFIG = {
  staminaPerRegion: 10,
  oilPerRegion: 2,
  maxStamina: 100,
  hourlyStaminaRegen: 10,
} as const;
