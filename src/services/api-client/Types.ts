import type { Country } from "../../models/country/Country";
import type { MilitaryUnit } from "../../models/mu/MilitaryUnit";
import type { User } from "../../models/user/User";

export interface CountriesResponse {
  result: {
    data: Country[];
  };
}

export interface MilitaryUnitsReponse {
  result: {
    data: {
      items: MilitaryUnit[];
      nextCursor?: string | undefined;
    };
  };
}

export interface UserResponse {
  result: {
    data: User;
  };
}
