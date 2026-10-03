import { bestMoves } from "./bestMoves.generated";
import { dailyPoolBest } from "./dailyPool.generated";

/** Best-known move counts for every level the app can show: Worlds levels plus the pre-generated Daily pool. */
export const bestKnown: Record<string, { moves: number; proven: boolean }> = { ...bestMoves, ...dailyPoolBest };
