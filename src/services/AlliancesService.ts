import { useEffect, useMemo, useState } from "react";
import { getAlliancesByIds } from "./api-client/ApiClient";
import type { Alliance } from "../models/alliance/Alliance";
import type { Country } from "../models/country/Country";

export const useAlliances = (countries: Country[]) => {
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const allianceIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of countries) {
      if (c.allianceId) ids.add(c.allianceId);
    }
    return [...ids];
  }, [countries]);

  const idsKey = allianceIds.join(",");

  useEffect(() => {
    if (!allianceIds.length) {
      setAlliances([]);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);

    (async () => {
      try {
        const result = await getAlliancesByIds(allianceIds, { signal });
        setAlliances(result);
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
      controller.abort();
    };
  }, [idsKey]);

  return { alliances, loading, error };
};
