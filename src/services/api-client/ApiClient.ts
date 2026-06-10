import axios, { type AxiosRequestConfig } from "axios";
import type {
  AllianceByIdResponse,
  CountriesResponse,
  MilitaryUnitsReponse,
  UserResponse,
} from "./Types";
import type { Alliance } from "../../models/alliance/Alliance";
import type { MilitaryUnit } from "../../models/mu/MilitaryUnit";
import type { User } from "../../models/user/User";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

export const setApiKey = (apiKey: string | null) => {
  if (apiKey) {
    api.defaults.headers.common["X-API-Key"] = apiKey;
  } else {
    delete api.defaults.headers.common["X-API-Key"];
  }
};

const PAGE_LIMIT = 100;

const BATCH_LIMIT = 100;

export async function getAllCountries(
  config?: AxiosRequestConfig<any> | undefined
): Promise<CountriesResponse> {
  const response = await api.get("/country.getAllCountries", config);
  return response.data as CountriesResponse;
}

export async function getAlliancesByIds(
  ids: string[],
  config?: AxiosRequestConfig<any> | undefined
): Promise<Alliance[]> {
  if (!ids.length) return [];

  const alliances: Alliance[] = [];

  for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
    const batch = ids.slice(i, i + BATCH_LIMIT);
    const procedureCalls = batch.map(() => "alliance.getById").join(",");
    const batchInput = batch.reduce((acc, allianceId, index) => {
      acc[index] = { allianceId };
      return acc;
    }, {} as Record<string, { allianceId: string }>);

    const response = await api.get(`/${procedureCalls}`, {
      ...config,
      params: { batch: 1, input: JSON.stringify(batchInput) },
    });

    const data = response.data as AllianceByIdResponse[];
    alliances.push(...data.map((r) => r.result.data));
  }

  return alliances;
}

export default {
  getAllCountries,
  getAlliancesByIds,
};

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
): Promise<User[]> => {
  const users: User[] = [];

  const batches: string[][] = [];
  for (let i = 0; i < userIds.length; i += BATCH_LIMIT) {
    batches.push(userIds.slice(i, i + BATCH_LIMIT));
  }

  for (const batch of batches) {
    const procedureCalls = batch.map((_) => `user.getUserLite`).join(",");
    const url = `/${procedureCalls}`;

    const batchInput = batch.reduce((acc, userId, index) => {
      acc[index] = { userId };
      return acc;
    }, {} as Record<string, { userId: string }>);

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
