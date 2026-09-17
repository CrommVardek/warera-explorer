import { useEffect, useState } from "react";
import { getItemPrices } from "./api-client/ApiClient";
import type { ItemPrices } from "../models/item/Item";

export const useItemPrices = () => {
  const [prices, setPrices] = useState<ItemPrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const resp = await getItemPrices({ signal });
        setPrices(resp);
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

  return { prices, loading, error };
};
