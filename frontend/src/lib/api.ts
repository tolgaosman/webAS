import type { PortfolioApiResponse } from "../types/api";
import { mockPortfolio } from "./mockPortfolio";

/**
 * GET /api/portfolio — the public site's only network request for its
 * entire lifetime (§Faz 5-7: no query library, one useEffect+useState
 * in a root provider). In mock mode (`npm run dev:mock`) this resolves
 * a local fixture instead, so the whole UI is visually verifiable
 * without PHP/MySQL running (see migration plan §Faz 8 verification).
 */
export async function fetchPortfolio(): Promise<PortfolioApiResponse> {
  if (__MOCK_API__) {
    await new Promise((r) => setTimeout(r, 150)); // simulate latency so loading states are visible
    return structuredClone(mockPortfolio);
  }

  const res = await fetch("/api/portfolio");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<PortfolioApiResponse>;
}
