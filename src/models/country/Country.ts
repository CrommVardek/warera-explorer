/** Represents a single country */
export interface Country {
  _id: string;
  name: string;
  code: string;

  money: number;

  taxes: TaxInfo;

  orgs: string[];
  allies: string[];
  warsWith: string[];

  scheme: string;
  mapAccent: string;

  rankings: CountryRankings;

  strategicResources?: StrategicResources;

  updatedAt: string;
  enemy?: string;
  currentBattleOrder?: string;
  createdAt?: string;
}

/** Tax structure of a country */
export interface TaxInfo {
  income: number;
  market: number;
  selfWork: number;
}

/** Strategic resources available to a country */
export interface StrategicResources {
  resources: ResourceMap;
  bonuses: StrategicBonuses;
}

export interface ResourceMap {
  lithium?: string[];
  uranium?: string[];
  diamonds?: string[];
  coal?: string[];
  gold?: string[];
  rareEarths?: string[];

  // If more resource types exist, add them here
}

/** Bonuses granted by strategic resources */
export interface StrategicBonuses {
  productionPercent: number;
  developmentPercent: number;
}

/** Rankings of a country across various metrics */
export interface CountryRankings {
  countryRegionDiff: RankingDetails;
  countryDamages: RankingDetails;
  weeklyCountryDamages: RankingDetails;
  weeklyCountryDamagesPerCitizen?: RankingDetails;
  countryDevelopment: RankingDetails;
  countryActivePopulation: RankingDetails;
  countryWealth: RankingDetails;
  countryProductionBonus: RankingDetails;
}

/** A generic ranking category (value + rank + tier) */
export interface RankingDetails {
  value: number;
  rank: number;
  tier: string;
}
