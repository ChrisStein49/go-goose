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
