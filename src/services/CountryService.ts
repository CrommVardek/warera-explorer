import { useEffect, useState } from "react";
import { getAllCountries } from "./api-client/ApiClient";
import type { Country } from "../models/country/Country";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await getAllCountries();
        setCountries(resp.result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { countries, loading, error };
}