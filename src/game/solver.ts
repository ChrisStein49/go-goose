import { allGooseCells, disconnectionScore, isLevelComplete, pushGoose } from "./board";
import type { Board, Direction } from "./types";

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

function mulberry32(seed: number) {
  let s = seed;
  return function random() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Heuristic best-first search (greedy on `disconnectionScore`, with
 * occasional random moves to escape local minima and random restarts).
 * Not guaranteed optimal or exhaustive, but proves a level IS solvable
 * whenever it finds a path — enough to catch a broken/impossible level.
 */
export function isSolvable(
  board: Board,
  { seed = 1, maxSteps = 300, restarts = 20 }: { seed?: number; maxSteps?: number; restarts?: number } = {},
): boolean {
  const random = mulberry32(seed);

  for (let attempt = 0; attempt < restarts; attempt++) {
    let current = board;
    let stuckCounter = 0;

    for (let step = 0; step < maxSteps; step++) {
      if (isLevelComplete(current)) return true;

      const candidates: Board[] = [];
      for (const [r, c] of allGooseCells(current)) {
        for (const direction of DIRECTIONS) {
          const result = pushGoose(current, r, c, direction);
          if (result.moved) candidates.push(result.board);
        }
      }
      if (candidates.length === 0) break;

      const currentScore = disconnectionScore(current);
      let best: Board[] = [];
      let bestScore = Infinity;
      for (const candidate of candidates) {
        const score = disconnectionScore(candidate);
        if (score < bestScore) {
          bestScore = score;
          best = [candidate];
        } else if (score === bestScore) {
          best.push(candidate);
        }
      }

      const takeRandomMove = bestScore >= currentScore && random() <= 0.15;
      current = takeRandomMove
        ? candidates[Math.floor(random() * candidates.length)]
        : best[Math.floor(random() * best.length)];
      stuckCounter = bestScore >= currentScore ? stuckCounter + 1 : 0;
      if (stuckCounter > 25) break;
    }
  }

  return false;
}
