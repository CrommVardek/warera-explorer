import { useEffect, useState } from "react";
import { getAllMilitaryUnits } from "./api-client/ApiClient";
import type { MilitaryUnit } from "../models/mu/MilitaryUnit";

interface UseMilitaryUnitsOptions {
  enabled?: boolean;
}

export const useMilitaryUnits = ({ enabled = true }: UseMilitaryUnitsOptions = {}) => {
  const [militaryUnits, setMilitaryUnits] = useState<MilitaryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const resp = await getAllMilitaryUnits({ signal });
        setMilitaryUnits(resp);
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
  }, [enabled]);

  return { militaryUnits, loading, error };
};
