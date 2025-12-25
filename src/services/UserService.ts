import { useEffect, useState } from "react";
import { getUsers } from "./api-client/ApiClient";
import type { User } from "../models/user/User";

export const useUsers = (userIds: string[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const resp = await getUsers(userIds, { signal });
        setUsers(resp);
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
  }, [userIds]);

  return { users, loading, error };
};
