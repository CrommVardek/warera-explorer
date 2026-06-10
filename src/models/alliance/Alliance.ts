export interface AllianceMember {
  country: string;
  coreDevelopment: number;
  averageDevelopment: number;
  suspended: boolean;
}

export interface AllianceRankingDetails {
  value: number;
  rank: number;
  tier: string;
}

export interface AllianceRankings {
  allianceInitialDevelopment: AllianceRankingDetails;
  allianceDevelopment: AllianceRankingDetails;
  allianceWeeklyDamages: AllianceRankingDetails;
  allianceDamages: AllianceRankingDetails;
  alliancePopulation: AllianceRankingDetails;
}

export interface Alliance {
  _id: string;
  name: string;
  scheme: string;
  mapAccent: string;
  leader: string;
  memberCountries: AllianceMember[];
  currentDevelopment: number;
  coreDevelopment: number;
  averageDevelopment: number;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  rankings: AllianceRankings;
  disbandedAt?: string;
}
