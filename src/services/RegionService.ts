import { useEffect, useState } from "react";
import { getRegions } from "./api-client/ApiClient";
import type { RegionsById } from "../models/region/Region";

export const useRegions = () => {
  const [regions, setRegions] = useState<RegionsById>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const resp = await getRegions({ signal });
        setRegions(resp);
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

  return { regions, loading, error };
};
