import { bestMoves } from "./bestMoves.generated";
import { bestMovesOverrides } from "./bestMovesOverrides";
import { dailyPoolBest } from "./dailyPool.generated";

type BestKnown = { moves: number; proven: boolean };

// Hand-entered scores only fill gaps or improve on a worse solver result.
const worldsBest: Record<string, BestKnown> = { ...bestMoves };
for (const [id, override] of Object.entries(bestMovesOverrides)) {
  const solver = worldsBest[id];
  if (!solver || override.moves < solver.moves) worldsBest[id] = override;
}

/** Best-known move counts for every level the app can show: Worlds levels plus the pre-generated Daily pool. */
export const bestKnown: Record<string, BestKnown> = { ...worldsBest, ...dailyPoolBest };
