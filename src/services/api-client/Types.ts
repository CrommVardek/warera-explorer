import type { Country } from "../../models/country/Country";

export interface CountriesResponse {
  result: {
    data: Country[];
  };
}