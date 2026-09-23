import type { Board, Cell, Direction, Level } from "./types";

export const DELTA: Record<Direction, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export function boardFromLevel(level: Level): Board {
  return level.cells.map((row) => row.map((cell) => ({ ...cell })));
}

export function inBounds(board: Board, r: number, c: number): boolean {
  return r >= 0 && r < board.length && c >= 0 && c < board[0].length;
}

/** The color this cell counts toward for connectivity, if any (both movable geese and fixed anchors). */
function gooseColor(cell: Cell): string | undefined {
  return cell.kind === "goose" || cell.kind === "anchor" ? cell.color : undefined;
}

export interface PushResult {
  board: Board;
  moved: boolean;
}

/**
 * Pushes the goose at (row, col) in `direction`, carrying along any
 * contiguous chain of geese immediately ahead of it. The chain slides as
 * far as the run of empty cells beyond it allows, stopping at the board
 * edge, a dead cell, or an anchor (a fixed goose). Returns the same board
 * reference (moved: false) when the push has no effect.
 */
export function pushGoose(
  board: Board,
  row: number,
  col: number,
  direction: Direction,
): PushResult {
  if (board[row][col].kind !== "goose") return { board, moved: false };

  const [dr, dc] = DELTA[direction];
  const chain: [number, number][] = [];
  let r = row;
  let c = col;
  while (inBounds(board, r, c) && board[r][c].kind === "goose") {
    chain.push([r, c]);
    r += dr;
    c += dc;
  }

  if (!inBounds(board, r, c) || board[r][c].kind === "dead" || board[r][c].kind === "anchor") {
    return { board, moved: false };
  }

  let slide = 0;
  let er = r;
  let ec = c;
  while (inBounds(board, er, ec) && board[er][ec].kind === "empty") {
    slide++;
    er += dr;
    ec += dc;
  }

  if (slide === 0) return { board, moved: false };

  const newBoard = board.map((rowCells) => rowCells.map((cell) => ({ ...cell })));
  for (const [cr, cc] of chain) {
    newBoard[cr][cc] = { kind: "empty" };
  }
  for (const [cr, cc] of chain) {
    newBoard[cr + dr * slide][cc + dc * slide] = { ...board[cr][cc] };
  }

  return { board: newBoard, moved: true };
}

function findGooseGroups(board: Board): Map<string, [number, number][]> {
  const groups = new Map<string, [number, number][]>();
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const color = gooseColor(board[r][c]);
      if (color !== undefined) {
        const list = groups.get(color) ?? [];
        list.push([r, c]);
        groups.set(color, list);
      }
    }
  }
  return groups;
}

/** Number of separate orthogonally-connected components within `cells` (all same color; geese and anchors both count). */
function countComponents(board: Board, cells: [number, number][]): number {
  if (cells.length <= 1) return cells.length;
  const color = gooseColor(board[cells[0][0]][cells[0][1]]);
  const key = (r: number, c: number) => `${r},${c}`;
  const remaining = new Set(cells.map(([r, c]) => key(r, c)));
  let components = 0;

  while (remaining.size > 0) {
    components++;
    const [startKey] = remaining;
    const [sr, sc] = startKey.split(",").map(Number);
    remaining.delete(startKey);
    const stack: [number, number][] = [[sr, sc]];

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        const nk = key(nr, nc);
        if (!remaining.has(nk)) continue;
        if (gooseColor(board[nr][nc]) !== color) continue;
        remaining.delete(nk);
        stack.push([nr, nc]);
      }
    }
  }

  return components;
}

/** Returns the colors whose geese are NOT yet all mutually connected. */
export function getIncompleteColors(board: Board): string[] {
  const groups = findGooseGroups(board);
  const incomplete: string[] = [];
  for (const [color, cells] of groups) {
    if (countComponents(board, cells) > 1) incomplete.push(color);
  }
  return incomplete;
}

export function isLevelComplete(board: Board): boolean {
  return getIncompleteColors(board).length === 0;
}

/** Total "extra" connected components across all colors; 0 exactly when the level is complete. */
export function disconnectionScore(board: Board): number {
  const groups = findGooseGroups(board);
  let score = 0;
  for (const cells of groups.values()) {
    score += countComponents(board, cells) - 1;
  }
  return score;
}

export interface ScatterScore {
  /** Sum of every color's score. */
  total: number;
  /** Each color's sum of pairwise Manhattan distances between its cells (geese and anchors). */
  perColor: Record<string, number>;
}

/**
 * A cheap, obstacle-blind proxy for how spread out each color's pieces are:
 * the sum of pairwise Manhattan distances between all of a color's cells
 * (geese and anchors both, matching how connectivity is judged elsewhere).
 * Unlike `disconnectionScore` — which only counts how many separate groups a
 * color is split into — this also captures HOW FAR apart those groups are,
 * so two same-color geese sitting just out of reach of each other score much
 * lower than two sitting in opposite corners, even though both count as "1
 * disconnected group." It ignores dead cells and anchors blocking the actual
 * route, so it's a fast pre-filter for candidate puzzles, not a substitute
 * for an actual move-count check.
 */
export function scatterScore(board: Board): ScatterScore {
  const groups = findGooseGroups(board);
  const perColor: Record<string, number> = {};
  let total = 0;

  for (const [color, cells] of groups) {
    let sum = 0;
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const [r1, c1] = cells[i];
        const [r2, c2] = cells[j];
        sum += Math.abs(r1 - r2) + Math.abs(c1 - c2);
      }
    }
    perColor[color] = sum;
    total += sum;
  }

  return { total, perColor };
}

function averagePairwiseDistance(cells: [number, number][]): number {
  if (cells.length < 2) return 0;
  let sum = 0;
  let pairs = 0;
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      sum += Math.abs(cells[i][0] - cells[j][0]) + Math.abs(cells[i][1] - cells[j][1]);
      pairs++;
    }
  }
  return sum / pairs;
}

export interface RelativeScatterScore {
  /** Average pairwise Manhattan distance between every pair of non-dead cells on this board — a board-intrinsic baseline for how far apart two cells typically are here. */
  boardBaseline: number;
  /** Each color's own average pairwise distance divided by `boardBaseline`. Above 1 means that color is spread out more than a random/typical placement on this board would be; below 1 means it's more clustered than that. */
  perColor: Record<string, number>;
}

/**
 * `scatterScore`'s raw sum conflates two very different situations: pieces
 * that are deliberately spread across a spacious board, and pieces that
 * merely LOOK spread out because the board is packed almost solid and there
 * was nowhere else to put them (e.g. a level with only one empty cell out of
 * twenty will force a high raw scatter regardless of design intent). This
 * divides each color's average pairwise distance by the board's OWN average
 * pairwise distance (measured across all its non-dead cells), so the result
 * says "more/less scattered than a typical placement on THIS board," not
 * just "more/less scattered than some other board." Still obstacle-blind —
 * a cheap pre-filter, not a substitute for an actual move-count check.
 */
export function relativeScatterScore(board: Board): RelativeScatterScore {
  const nonDeadCells: [number, number][] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].kind !== "dead") nonDeadCells.push([r, c]);
    }
  }
  const boardBaseline = averagePairwiseDistance(nonDeadCells);

  const groups = findGooseGroups(board);
  const perColor: Record<string, number> = {};
  for (const [color, cells] of groups) {
    perColor[color] = boardBaseline > 0 ? averagePairwiseDistance(cells) / boardBaseline : 0;
  }

  return { boardBaseline, perColor };
}

/** Cells holding a movable goose — deliberately excludes anchors, which can never be pushed. */
export function allGooseCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].kind === "goose") cells.push([r, c]);
    }
  }
  return cells;
}
