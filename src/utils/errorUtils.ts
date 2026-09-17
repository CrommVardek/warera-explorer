import axios from "axios";

/**
 * Turns a failed API call into something worth showing. A missing record and a
 * rejected request are very different problems, so they must not read alike.
 */
export const describeApiError = (error: unknown, notFound: string): string => {
  if (!axios.isAxiosError(error)) return "Something went wrong.";

  const status = error.response?.status;
  const payload = error.response?.data as
    | { message?: string; error?: { message?: string } }
    | undefined;
  const message = payload?.error?.message ?? payload?.message;

  if (status === 404 || message?.includes("not found")) return notFound;
  if (status === 401 || status === 403) {
    return message
      ? `The API rejected the request: ${message}`
      : "The API rejected the request. Check your API token.";
  }
  if (status === 429) return "Rate-limited by the API. Try again shortly.";
  return message ?? `The API call failed${status ? ` (HTTP ${status})` : ""}.`;
};
