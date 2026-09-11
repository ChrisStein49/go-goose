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
  { maxStates = 1_500_000, heuristicWeight = 5 }: { maxStates?: number; heuristicWeight?: number } = {},
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

/**
 * Same search as `exhaustiveSolve`, but returns the move-count at which a
 * complete state was found (or null if the queue ran dry or `maxStates` was
 * hit without finding one). This is a fast UPPER BOUND on the true shortest
 * solution — the heuristic guidance that makes it fast also means it can
 * (and often does) overshoot the actual minimum.
 */
function bestFirstPathLength(
  board: Board,
  { maxStates = 300_000, heuristicWeight = 5 }: { maxStates?: number; heuristicWeight?: number } = {},
): number | null {
  if (isLevelComplete(board)) return 0;

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
        if (isLevelComplete(result.board)) return depth + 1;
        if (seen.size > maxStates) return null;
        const nextDepth = depth + 1;
        queue.push(nextDepth + disconnectionScore(result.board) * heuristicWeight, {
          board: result.board,
          depth: nextDepth,
        });
      }
    }
  }
  return null;
}

type BoundedBfsResult =
  | { kind: "found"; depth: number }
  | { kind: "noneWithinBound" } // exhaustive: proven no solution at or under maxDepth
  | { kind: "capped" }; // gave up early: inconclusive

/** Plain BFS, but gives up (rather than digging deeper) past `maxDepth` — used to
 * cheaply check "is there a solution shorter than the best one found so far?". */
function boundedBfs(board: Board, maxDepth: number, maxStates: number): BoundedBfsResult {
  if (maxDepth <= 0) return isLevelComplete(board) ? { kind: "found", depth: 0 } : { kind: "noneWithinBound" };
  if (isLevelComplete(board)) return { kind: "found", depth: 0 };

  const seen = new Set<string>([serialize(board)]);
  let frontier: Board[] = [board];

  for (let depth = 1; depth <= maxDepth; depth++) {
    const next: Board[] = [];
    for (const current of frontier) {
      for (const [r, c] of allGooseCells(current)) {
        for (const direction of DIRECTIONS) {
          const result = pushGoose(current, r, c, direction);
          if (!result.moved) continue;
          const key = serialize(result.board);
          if (seen.has(key)) continue;
          seen.add(key);
          if (isLevelComplete(result.board)) return { kind: "found", depth };
          next.push(result.board);
        }
      }
      if (seen.size > maxStates) return { kind: "capped" };
    }
    if (next.length === 0) return { kind: "noneWithinBound" };
    frontier = next;
  }
  return { kind: "noneWithinBound" };
}

export interface BestKnownResult {
  moves: number;
  /** true iff bounded BFS proved no shorter solution exists (not just "didn't happen to find one"). */
  proven: boolean;
}

// Lower weights bias the search toward shorter paths and are cheap, but can
// fail to find any solution at all on the trickiest boards; higher weights
// find *a* solution more reliably but often a long, meandering one. Try
// cheap/short first, only reach for the expensive/long fallback if needed.
const UPPER_BOUND_WEIGHTS = [1, 2, 3, 5, 8, 12];

function initialUpperBound(board: Board, maxStates: number): number | null {
  for (const heuristicWeight of UPPER_BOUND_WEIGHTS) {
    const length = bestFirstPathLength(board, { heuristicWeight, maxStates });
    if (length !== null) return length;
  }
  return null;
}

/**
 * "Best known" minimum move count: gets a fast upper bound from the
 * heuristic best-first search, then repeatedly asks bounded BFS "is there
 * anything shorter?" — each check only searches up to the current best
 * depth, which is far cheaper than an unbounded shortest-path search from
 * scratch. Stops improving once bounded BFS proves the current best is
 * optimal, or once it can no longer finish a check within `maxStates`
 * (in which case the best bound found so far is returned unproven).
 * Meant for offline/precomputation use (see scripts/computeBestMoves.ts),
 * not anything running live during play.
 */
export function bestKnownSolutionLength(
  board: Board,
  { maxStates = 300_000 }: { maxStates?: number } = {},
): BestKnownResult | null {
  let best = initialUpperBound(board, maxStates);
  if (best === null) return null;

  for (;;) {
    if (best === 0) return { moves: 0, proven: true };
    const result = boundedBfs(board, best - 1, maxStates);
    if (result.kind === "found") {
      best = result.depth;
      continue;
    }
    if (result.kind === "noneWithinBound") return { moves: best, proven: true };
    return { moves: best, proven: false }; // capped: budget spent, keep the best bound we have
  }
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
