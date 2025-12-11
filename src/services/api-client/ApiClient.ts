import axios from "axios";
import type { CountriesResponse } from "./Types";

const api = axios.create({
  baseURL: "https://api2.warera.io/trpc",
  timeout: 10000,
});

/**
 * Fetch all countries from Warera API
 */
export async function getAllCountries(): Promise<CountriesResponse> {
  const response = await api.get("/country.getAllCountries");

  // TRPC embeds the result under .data.result.data
  return response.data as CountriesResponse;
}

export default {
  getAllCountries,
};
