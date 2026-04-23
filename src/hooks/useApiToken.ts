import { useEffect, useState } from "react";

const STORAGE_KEY = "warera_api_token";

type TokenStatus = "loading" | "dialog" | "ready";

export const useApiToken = () => {
    const [status, setStatus] = useState<TokenStatus>("loading");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setToken(stored);
            setStatus("ready");
        } else {
            setStatus("dialog");
        }
    }, []);

    const confirm = (apiToken: string | null) => {
        if (apiToken) {
            localStorage.setItem(STORAGE_KEY, apiToken);
            setToken(apiToken);
        }
        setStatus("ready");
    };

    return {
        token,
        showDialog: status === "dialog",
        ready: status === "ready",
        confirm,
    };
};
