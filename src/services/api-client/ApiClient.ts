import axios, { type AxiosRequestConfig } from "axios";
import type { CountriesResponse, MilitaryUnitsReponse } from "./Types";
import type { MilitaryUnit } from "../../models/mu/MilitaryUnit";

const api = axios.create({
  baseURL: "https://api2.warera.io/trpc",
  timeout: 10000,
});

interface tRpcResponse<T> {
  data: T;
}

const PAGE_LIMIT = 100;

/**
 * Fetch all countries from Warera API
 */
export async function getAllCountries(
  config?: AxiosRequestConfig<any> | undefined
): Promise<CountriesResponse> {
  const response = await api.get("/country.getAllCountries", config);

  // TRPC embeds the result under .data.result.data
  return response.data as CountriesResponse;
}

export default {
  getAllCountries,
};

/**
 * Fetch all MU from Warera API
 */
export const getAllMilitaryUnits = async (
  config?: AxiosRequestConfig<any> | undefined
): Promise<MilitaryUnit[]> => {
  let cursor: string | undefined = undefined;
  const militaryUnits: MilitaryUnit[] = [];

  do {
    const response = await api.get("/mu.getManyPaginated", {
      ...config,
      params: {
        input: JSON.stringify({
          limit: PAGE_LIMIT,
          ...(cursor && { cursor }),
        }),
      },
    });

    const dataResponse = response.data as unknown as MilitaryUnitsReponse;

    militaryUnits.push(...dataResponse.result.data.items);

    cursor = dataResponse.result.data.nextCursor;
  } while (cursor);

  return militaryUnits;
};

export const getUsers = async (
  userIds: string[],
  config?: AxiosRequestConfig<any> | undefined
): Promise<any> => {
    userIds.forEach(async (userId) => {
      const response = await api.get("/user.getUserLite", {
      ...config,
      params: {
        input: JSON.stringify({
          userId,
        }),
      },
      });
      console.log(response);
    });
  return;
}