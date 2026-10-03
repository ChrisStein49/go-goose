// Generators for the three Daily Challenge slots, shared by the pool builder
// (scripts/buildDailyPool.ts) and the Puzzle 3 playtest tool
// (scripts/generateTrickyDaily3.ts). Each `generateSlotN` keeps trying until it
// returns a validated puzzle or its time budget runs out. Recipes (all confirmed
// by Christoph, see memory notes):
//   Slot 1: 3x4 / 4x4, two border-ish dead cells (one per half), geese fill 50-75%
//           of free cells in two flocks, optimal >= 4.
//   Slot 2: 4x5 / 5x5, <3 border dead cells, flock A = 3 non-adjacent anchors + the
//           minimal Steiner-bridge count of scattered geese, flock B = 1 anchor +
//           geese for a 25-50% empty ratio, optimal >= 4 (unproven "+" accepted).
//   Slot 3: 5x5, two fixed colors (2-3 interior anchors, minimum geese), one flexible
//           color (1 anchor, 1-2 geese), 58-70% empty, mostly stop-free targets,
//           proven/best-known optimal >= 13.
import { boardFromLevel, getIncompleteColors } from "../src/game/board";
import { GREEN, ORANGE, PURPLE } from "../src/game/levels";
import { bestKnownSolutionLength, exhaustiveSolve, isSolvable } from "../src/game/solver";
import type { Cell, Level } from "../src/game/types";
import { stopFreeStats } from "./stopFreeStats";

export interface PoolPuzzle {
  level: Level;
  optimal: number;
  proven: boolean;
}

type Pos = [number, number];
const key = (p: Pos) => `${p[0]},${p[1]}`;
const DIRS: Pos[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
export const COLOR_PAIRS: [string, string][] = [
  [ORANGE, GREEN],
  [GREEN, PURPLE],
  [ORANGE, PURPLE],
];

const shuffle = <T>(arr: T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const adjacent = (a: Pos, b: Pos) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
const emptyGrid = (rows: number, cols: number): Cell[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, (): Cell => ({ kind: "empty" })));

/** A goose can only rest in a cell by sliding in from a neighbor: an empty cell whose
 * every in-bounds neighbor is dead/anchor is sealed off for good. */
function hasUnreachableEmptyCell(cells: Cell[][], blockers: ("dead" | "anchor")[]): boolean {
  const rows = cells.length;
  const cols = cells[0].length;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (cells[r][c].kind !== "empty") continue;
      const neighbors = DIRS.map(([dr, dc]): Pos => [r + dr, c + dc]).filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols);
      if (neighbors.length > 0 && neighbors.every(([nr, nc]) => (blockers as string[]).includes(cells[nr][nc].kind))) return true;
    }
  return false;
}

/** Cells of every minimal set of extra cells connecting `anchors` (meeting-point Steiner search). */
function minimalBridges(rows: number, cols: number, blocked: (p: Pos) => boolean, anchors: Pos[]): Set<string>[] {
  const searches = anchors.map((a) => {
    const parent = new Map<string, Pos | null>([[key(a), null]]);
    const queue: Pos[] = [a];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const [dr, dc] of DIRS) {
        const n: Pos = [cur[0] + dr, cur[1] + dc];
        if (n[0] < 0 || n[0] >= rows || n[1] < 0 || n[1] >= cols) continue;
        if (blocked(n) || parent.has(key(n))) continue;
        parent.set(key(n), cur);
        queue.push(n);
      }
    }
    return parent;
  });
  const all: Set<string>[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (!searches.every((s) => s.has(`${r},${c}`))) continue;
      const union = new Set<string>();
      for (const s of searches) {
        let cur: Pos | null = [r, c];
        while (cur) {
          union.add(key(cur));
          cur = s.get(key(cur)) ?? null;
        }
      }
      for (const a of anchors) union.delete(key(a));
      all.push(union);
    }
  if (all.length === 0) return [];
  const min = Math.min(...all.map((s) => s.size));
  return all.filter((s) => s.size === min);
}

// ---------------------------------------------------------------------------
// Slot 1
// ---------------------------------------------------------------------------

function slot1Candidate(rows: number, cols: number, colors: [string, string]): Cell[][] | null {
  const topRows = rows >= 2 ? [0, 1] : [0];
  const bottomRows = rows >= 4 ? [2, 3] : [rows - 1];
  const deadA: Pos = [pick(topRows), Math.floor(Math.random() * cols)];
  const deadB: Pos = [pick(bottomRows), Math.floor(Math.random() * cols)];
  const cells = emptyGrid(rows, cols);
  cells[deadA[0]][deadA[1]] = { kind: "dead" };
  cells[deadB[0]][deadB[1]] = { kind: "dead" };

  const free = rows * cols - 2;
  const k = Math.floor((0.5 + Math.random() * 0.25) * free);
  const flockA = Math.ceil(k / 2);
  const open: Pos[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (cells[r][c].kind === "empty") open.push([r, c]);
  shuffle(open)
    .slice(0, k)
    .forEach(([r, c], i) => (cells[r][c] = { kind: "goose", color: i < flockA ? colors[0] : colors[1] }));
  return hasUnreachableEmptyCell(cells, ["dead"]) ? null : cells;
}

export function generateSlot1(rows: number, cols: number, colors: [string, string], deadlineMs: number): PoolPuzzle | null {
  const end = Date.now() + deadlineMs;
  while (Date.now() < end) {
    const cells = slot1Candidate(rows, cols, colors);
    if (!cells) continue;
    const level: Level = { id: "gen", rows, cols, cells };
    const board = boardFromLevel(level);
    if (!isSolvable(board)) continue;
    const best = bestKnownSolutionLength(board);
    if (!best || best.moves < 4) continue;
    return { level, optimal: best.moves, proven: best.proven };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Slot 2
// ---------------------------------------------------------------------------

function slot2Candidate(rows: number, cols: number, colors: [string, string]): Cell[][] | null {
  const allCells: Pos[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) allCells.push([r, c]);
  const border = allCells.filter(([r, c]) => r === 0 || r === rows - 1 || c === 0 || c === cols - 1);
  const dead = shuffle(border).slice(0, 1 + Math.floor(Math.random() * 2));
  const occupied = new Set(dead.map(key));
  const isDead = (p: Pos) => dead.some((d) => d[0] === p[0] && d[1] === p[1]);

  const anchorsA: Pos[] = [];
  for (const p of shuffle(allCells)) {
    if (anchorsA.length >= 3) break;
    if (occupied.has(key(p)) || anchorsA.some((a) => adjacent(a, p))) continue;
    anchorsA.push(p);
    occupied.add(key(p));
  }
  if (anchorsA.length < 3) return null;

  // The bridge only decides HOW MANY geese flock A gets — they are scattered, never placed on it.
  const bridges = minimalBridges(rows, cols, isDead, anchorsA);
  if (bridges.length === 0) return null;
  const bridgeCount = bridges[0].size;

  const anchorB = pick(allCells.filter((p) => !occupied.has(key(p))));
  if (!anchorB) return null;
  occupied.add(key(anchorB));

  const nonDead = rows * cols - dead.length;
  const usedSoFar = 3 + bridgeCount + 1;
  const emptyCount = Math.round((0.25 + Math.random() * 0.25) * nonDead);
  const geeseB = nonDead - usedSoFar - emptyCount;
  if (geeseB < 1) return null;

  const remaining = shuffle(allCells.filter((p) => !occupied.has(key(p))));
  if (remaining.length < bridgeCount + geeseB) return null;

  const cells = emptyGrid(rows, cols);
  for (const [r, c] of dead) cells[r][c] = { kind: "dead" };
  for (const [r, c] of anchorsA) cells[r][c] = { kind: "anchor", color: colors[0] };
  for (const [r, c] of remaining.slice(0, bridgeCount)) cells[r][c] = { kind: "goose", color: colors[0] };
  cells[anchorB[0]][anchorB[1]] = { kind: "anchor", color: colors[1] };
  for (const [r, c] of remaining.slice(bridgeCount, bridgeCount + geeseB)) cells[r][c] = { kind: "goose", color: colors[1] };
  return hasUnreachableEmptyCell(cells, ["dead", "anchor"]) ? null : cells;
}

export function generateSlot2(rows: number, cols: number, colors: [string, string], deadlineMs: number): PoolPuzzle | null {
  const end = Date.now() + deadlineMs;
  while (Date.now() < end) {
    const cells = slot2Candidate(rows, cols, colors);
    if (!cells) continue;
    const level: Level = { id: "gen", rows, cols, cells };
    const board = boardFromLevel(level);
    if (!isSolvable(board, { maxStates: 4_000_000 })) continue;
    const best = bestKnownSolutionLength(board, { maxStates: 2_000_000 });
    if (!best || best.moves < 4) continue;
    return { level, optimal: best.moves, proven: best.proven };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Slot 3
// ---------------------------------------------------------------------------

const ROWS3 = 5;
const COLS3 = 5;
const COLORS = [ORANGE, GREEN, PURPLE];
const isInterior = (p: Pos) => p[0] >= 1 && p[0] <= ROWS3 - 2 && p[1] >= 1 && p[1] <= COLS3 - 2;

function slot3Board(): Cell[][] | null {
  const cells = emptyGrid(ROWS3, COLS3);
  const allCells: Pos[] = [];
  for (let r = 0; r < ROWS3; r++) for (let c = 0; c < COLS3; c++) allCells.push([r, c]);

  const order = shuffle([0, 1, 2]); // [fixed, fixed, flexible]
  const flexColor = order[2];
  const anchorsByColor: Pos[][] = [[], [], []];
  const occupied = new Set<string>();
  for (const ci of order) {
    const n = ci === flexColor ? 1 : pick([2, 2, 3]);
    const placed: Pos[] = [];
    for (let k = 0; k < n; k++) {
      const preferInterior = ci !== flexColor && Math.random() < 0.85;
      const options = allCells.filter((p) => !occupied.has(key(p)) && !placed.some((a) => adjacent(a, p)) && (!preferInterior || isInterior(p)));
      if (options.length === 0) return null;
      const p = pick(options);
      placed.push(p);
      occupied.add(key(p));
    }
    anchorsByColor[ci] = placed;
  }
  anchorsByColor.forEach((list, ci) => list.forEach(([r, c]) => (cells[r][c] = { kind: "anchor", color: COLORS[ci] })));

  const gooseCounts = [0, 0, 0];
  for (const ci of order.slice(0, 2)) {
    const own = new Set(anchorsByColor[ci].map(key));
    const bridges = minimalBridges(ROWS3, COLS3, (p) => occupied.has(key(p)) && !own.has(key(p)), anchorsByColor[ci]);
    if (bridges.length === 0) return null;
    const size = bridges[0].size;
    if (size < 1 || size > 2) return null;
    gooseCounts[ci] = size; // the minimum
  }
  gooseCounts[flexColor] = pick([1, 1, 1, 2]);

  const free = shuffle(allCells.filter((p) => !occupied.has(key(p))));
  for (const ci of order)
    for (let n = 0; n < gooseCounts[ci]; n++) {
      const p = free.pop();
      if (!p) return null;
      cells[p[0]][p[1]] = { kind: "goose", color: COLORS[ci] };
    }
  return cells;
}

/** Ratio / sealed / stop-free / pre-solved checks, no solver. */
function slot3StaticOk(cells: Cell[][]): boolean {
  const level: Level = { id: "gen", rows: ROWS3, cols: COLS3, cells };
  const stats = stopFreeStats(level);
  if (stats.sealed || stats.empty < 0.58 || stats.empty > 0.7) return false;
  if (stats.fixed < 2 || stats.stopFree / stats.fixed < 0.6) return false;
  return getIncompleteColors(boardFromLevel(level)).length === 3;
}

export function generateSlot3(deadlineMs: number, minMoves = 13): PoolPuzzle | null {
  const end = Date.now() + deadlineMs;
  while (Date.now() < end) {
    const base = slot3Board();
    if (!base) continue;
    // Plain board first, then a single dead cell in a few random places (only matters if unsolvable).
    const variants: Cell[][][] = [base];
    const empties: Pos[] = [];
    for (let r = 0; r < ROWS3; r++) for (let c = 0; c < COLS3; c++) if (base[r][c].kind === "empty") empties.push([r, c]);
    for (const p of shuffle(empties).slice(0, 4)) {
      const copy = base.map((row) => row.slice());
      copy[p[0]][p[1]] = { kind: "dead" };
      variants.push(copy);
    }
    for (const cells of variants) {
      if (!slot3StaticOk(cells)) continue;
      const board = boardFromLevel({ id: "gen", rows: ROWS3, cols: COLS3, cells });
      // Cheap exact check first: unsolvable boards otherwise burn minutes in the multi-weight upper-bound search.
      if (exhaustiveSolve(board, { maxStates: 150_000 }) !== true) continue;
      const best = bestKnownSolutionLength(board, { maxStates: 400_000 });
      if (!best) continue;
      if (best.moves < minMoves) break; // a dead cell rarely lengthens a short solution; new layout
      return { level: { id: "gen", rows: ROWS3, cols: COLS3, cells }, optimal: best.moves, proven: best.proven };
    }
  }
  return null;
}
