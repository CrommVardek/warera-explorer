export interface MilitaryUnit {
  roles: Roles;
  _id: string;
  user: string;
  region: string;
  name: string;
  members: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  activeUpgradeLevels: ActiveUpgradeLevels;
  avatarUrl: string;
  rankings: Rankings;
}

export interface Roles {
  managers: string[];
  commanders: unknown[];
}

export interface ActiveUpgradeLevels {
  dormitories: number;
}

export interface Rankings {
  muWealth: RankingMetric;
}

export interface RankingMetric {
  value: number;
  rank: number;
  tier: string;
}
