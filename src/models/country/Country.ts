export interface Country {
  _id: string;
  name: string;
  code: string;

  development: number;
  currentDevelopment: number;
  coreDevelopment: number;
  averageDevelopment: number;

  money: number;
  currentPopulation?: number;

  taxes: TaxInfo;
  unrest?: UnrestInfo;

  orgs: string[];
  allies: string[];
  defensivePacts?: string[];
  warsWith: string[];

  allianceId?: string;
  enemy?: string;
  rulingParty?: string;

  specializedItem?: string;
  nonAggressionUntil?: Record<string, string>;

  scheme: string;
  mapAccent: string;

  rankings: CountryRankings;
  strategicResources?: StrategicResources;

  currentBattleOrder?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface TaxInfo {
  income: number;
  market: number;
  selfWork: number;
}

export interface UnrestInfo {
  bar: number;
  barMax: number;
}

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
}

export interface StrategicBonuses {
  productionPercent: number;
  developmentPercent: number;
}

export interface CountryRankings {
  countryRegionDiff: RankingDetails;
  countryDamages: RankingDetails;
  weeklyCountryDamages: RankingDetails;
  weeklyCountryDamagesPerCitizen?: RankingDetails;
  countryDevelopment: RankingDetails;
  countryActivePopulation: RankingDetails;
  countryWealth: RankingDetails;
  countryBounty?: RankingDetails;
  countryProductionBonus: RankingDetails;
}

export interface RankingDetails {
  value: number;
  rank: number;
  tier: string;
}
