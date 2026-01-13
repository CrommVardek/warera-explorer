import axios, { type AxiosRequestConfig } from "axios";
import type {
  CountriesResponse,
  MilitaryUnitsReponse,
  UserResponse,
} from "./Types";
import type { MilitaryUnit } from "../../models/mu/MilitaryUnit";
import type { User } from "../../models/user/User";

const api = axios.create({
  baseURL: "https://api2.warera.io/trpc",
  timeout: 10000,
});

const PAGE_LIMIT = 100;

const BATCH_LIMIT = 100;

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

/**
 * Fetch all Users with a valid userId from Warera API
 * @param userIds Array of user IDs to fetch
 */
export const getUsers = async (
  userIds: string[],
  config?: AxiosRequestConfig<any> | undefined
): Promise<User[]> => {
  const users: User[] = [];

  // Split userIds into batches of BATCH_LIMIT
  const batches: string[][] = [];
  for (let i = 0; i < userIds.length; i += BATCH_LIMIT) {
    batches.push(userIds.slice(i, i + BATCH_LIMIT));
  }

  // Process each batch
  for (const batch of batches) {
    // Construct the URL with multiple user.getUserLite calls
    const procedureCalls = batch.map((_) => `user.getUserLite`).join(",");
    const url = `/${procedureCalls}`;

    // Construct the input object for the batch
    const batchInput = batch.reduce((acc, userId, index) => {
      acc[index] = { userId };
      return acc;
    }, {} as Record<string, { userId: string }>);

    // Send the batched request
    const response = await api.get(url, {
      ...config,
      params: {
        batch: 1,
        input: JSON.stringify(batchInput),
      },
    });

    const dataResponse = response.data as unknown as UserResponse[];

    users.push(...dataResponse.map((u) => u.result.data));
  }

  return users;
};
