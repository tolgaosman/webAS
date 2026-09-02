import { createContext, useContext, useEffect, useState } from "react";
import { fetchPortfolio } from "../lib/api";
import type { PortfolioApiResponse } from "../types/api";

export type PortfolioState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: PortfolioApiResponse };

export const PortfolioContext = createContext<PortfolioState>({ status: "loading" });

export function usePortfolioState(): PortfolioState {
  const [state, setState] = useState<PortfolioState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: "error", error: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Reads the loaded portfolio data — must only be called under a `status === "ready"` guard. */
export function usePortfolio(): PortfolioApiResponse {
  const state = useContext(PortfolioContext);
  if (state.status !== "ready") {
    throw new Error("usePortfolio() called before data was ready — guard with usePortfolioStatus()");
  }
  return state.data;
}

export function usePortfolioStatus(): PortfolioState {
  return useContext(PortfolioContext);
}
