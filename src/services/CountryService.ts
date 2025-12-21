import { useEffect, useState } from "react";
import { getAllCountries } from "./api-client/ApiClient";
import type { Country } from "../models/country/Country";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const resp = await getAllCountries({ signal });
        setCountries(resp.result.data);
      } catch (err) {
        if (!signal.aborted) {
          setError(err);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort(); // cancel requests
    };
  }, []);

  return { countries, loading, error };
}
