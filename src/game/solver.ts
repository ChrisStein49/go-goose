import { allGooseCells, disconnectionScore, isLevelComplete, pushGoose } from "./board";
import type { Board, Cell, Direction } from "./types";

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

function serialize(board: Board): string {
  return board
    .map((row) =>
      row
        .map((cell: Cell) => (cell.kind === "goose" ? `g${cell.color}` : cell.kind[0]))
        .join(","),
    )
    .join("|");
}

/** Minimal binary min-heap, ordered by `priority` (lower first). */
class MinHeap<T> {
  private items: { priority: number; value: T }[] = [];

  get size(): number {
    return this.items.length;
  }

  push(priority: number, value: T): void {
    const items = this.items;
    items.push({ priority, value });
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent].priority <= items[i].priority) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  pop(): T | undefined {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop()!;
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const left = i * 2 + 1;
        const right = i * 2 + 2;
        let smallest = i;
        if (left < items.length && items[left].priority < items[smallest].priority) smallest = left;
        if (right < items.length && items[right].priority < items[smallest].priority) smallest = right;
        if (smallest === i) break;
        [items[smallest], items[i]] = [items[i], items[smallest]];
        i = smallest;
      }
    }
    return top.value;
  }
}

/**
 * Exhaustive best-first search: explores states ordered by
 * `movesSoFar + disconnectionScore * weight`, so it tries the most-promising
 * (closest to fully connected) states first instead of blindly expanding
 * breadth-first. This finds solutions far faster than plain BFS for these
 * connectivity puzzles, while remaining exhaustive — if the queue empties
 * without ever reaching a complete state, that's a real proof there is none.
 * Returns `null` only if `maxStates` is hit first (search space too large
 * to finish; genuinely inconclusive, not a proof either way).
 */
export function exhaustiveSolve(
  board: Board,
  { maxStates = 300_000, heuristicWeight = 5 }: { maxStates?: number; heuristicWeight?: number } = {},
): boolean | null {
  if (isLevelComplete(board)) return true;

  const seen = new Set<string>([serialize(board)]);
  const queue = new MinHeap<{ board: Board; depth: number }>();
  queue.push(disconnectionScore(board) * heuristicWeight, { board, depth: 0 });

  while (queue.size > 0) {
    const { board: current, depth } = queue.pop()!;

    for (const [r, c] of allGooseCells(current)) {
      for (const direction of DIRECTIONS) {
        const result = pushGoose(current, r, c, direction);
        if (!result.moved) continue;
        const key = serialize(result.board);
        if (seen.has(key)) continue;
        seen.add(key);
        if (isLevelComplete(result.board)) return true;
        if (seen.size > maxStates) return null;
        const nextDepth = depth + 1;
        queue.push(nextDepth + disconnectionScore(result.board) * heuristicWeight, {
          board: result.board,
          depth: nextDepth,
        });
      }
    }
  }

  return false; // queue exhausted without finding a complete state — truly unsolvable
}

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
 * Heuristic best-first search with random restarts, used only as a last
 * resort when `exhaustiveSolve` can't finish. A "false" here is not proof
 * of unsolvability the way `exhaustiveSolve`'s is — it just means this
 * particular randomized search didn't happen to find a path.
 */
function heuristicSolve(
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

/**
 * True iff the level can be solved. Tries an exhaustive best-first search
 * first (exact, for both yes and no); only falls back to a heuristic search
 * if the board is too large to exhaust, in which case a "false" just means
 * the heuristic didn't happen to find a path, not a proof there isn't one.
 */
export function isSolvable(
  board: Board,
  options: {
    seed?: number;
    maxSteps?: number;
    restarts?: number;
    maxStates?: number;
    heuristicWeight?: number;
  } = {},
): boolean {
  const exact = exhaustiveSolve(board, options);
  if (exact !== null) return exact;
  return heuristicSolve(board, options);
}
