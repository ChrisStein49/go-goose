// Shared static analysis for Daily Puzzle 3 work: piece counts, empty ratio and
// the "stop-free target" metric (see analyzeStopFreeTargets.ts for the idea).
// A color with 2+ anchors whose movable geese equal the minimal bridge between
// those anchors is "fixed": its targets are the cells of the minimal bridge that
// has the fewest stop-free cells (the player-friendliest). Anything else
// (single anchor, or extra geese) is "flex".
import { GREEN, ORANGE, PURPLE } from "../src/game/levels";
import type { Level } from "../src/game/types";

type Pos = [number, number];
const key = (p: Pos) => `${p[0]},${p[1]}`;
const DIRS: Pos[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
export const SHORT: Record<string, string> = { [ORANGE]: "O", [GREEN]: "G", [PURPLE]: "P" };

export interface StopFreeStats {
  dead: number;
  anchors: number;
  geese: number;
  empty: number; // empty cells as a fraction of non-dead cells
  parts: string;
  stopFree: number;
  fixed: number;
  sealed: boolean; // some empty cell has no passable neighbor (permanently unreachable)
}

export function stopFreeStats(level: Level): StopFreeStats {
  const { rows, cols, cells } = level;
  const inBounds = (p: Pos) => p[0] >= 0 && p[0] < rows && p[1] >= 0 && p[1] < cols;
  const kindAt = (p: Pos) => cells[p[0]][p[1]].kind;
  const staticBlocked = (p: Pos) => !inBounds(p) || kindAt(p) === "dead" || kindAt(p) === "anchor";
  const stopsAt = (p: Pos) => DIRS.filter(([dr, dc]) => staticBlocked([p[0] + dr, p[1] + dc]) && !staticBlocked([p[0] - dr, p[1] - dc])).length;

  const flat = cells.flat();
  const dead = flat.filter((c) => c.kind === "dead").length;
  const anchors = flat.filter((c) => c.kind === "anchor").length;
  const geese = flat.filter((c) => c.kind === "goose").length;
  const nonDead = rows * cols - dead;

  let sealed = false;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (staticBlocked([r, c])) continue;
      if (DIRS.every(([dr, dc]) => staticBlocked([r + dr, c + dc]))) sealed = true;
    }

  const parts: string[] = [];
  let fixed = 0;
  let stopFree = 0;
  for (const color of [ORANGE, GREEN, PURPLE]) {
    const anchorPos: Pos[] = [];
    let movable = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const cell = cells[r][c];
        if (cell.kind === "anchor" && cell.color === color) anchorPos.push([r, c]);
        if (cell.kind === "goose" && cell.color === color) movable++;
      }
    const blockedFor = (p: Pos) => {
      if (!inBounds(p)) return true;
      const cell = cells[p[0]][p[1]];
      return cell.kind === "dead" || (cell.kind === "anchor" && cell.color !== color);
    };
    const searches = anchorPos.map((a) => {
      const parent = new Map<string, Pos | null>([[key(a), null]]);
      const queue: Pos[] = [a];
      while (queue.length) {
        const cur = queue.shift()!;
        for (const [dr, dc] of DIRS) {
          const n: Pos = [cur[0] + dr, cur[1] + dc];
          if (blockedFor(n) || parent.has(key(n))) continue;
          parent.set(key(n), cur);
          queue.push(n);
        }
      }
      return parent;
    });
    const sets: Set<string>[] = [];
    if (anchorPos.length >= 2)
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const q: Pos = [r, c];
          if (!searches.every((s) => s.has(key(q)))) continue;
          const union = new Set<string>();
          for (const s of searches) {
            let cur: Pos | null = q;
            while (cur) {
              union.add(key(cur));
              cur = s.get(key(cur)) ?? null;
            }
          }
          for (const a of anchorPos) union.delete(key(a));
          sets.push(union);
        }
    if (sets.length === 0) {
      parts.push(`${SHORT[color]}:flex(${anchorPos.length}a,${movable}g)`);
      continue;
    }
    const min = Math.min(...sets.map((s) => s.size));
    if (movable > min) {
      parts.push(`${SHORT[color]}:flex(${anchorPos.length}a,${movable}g,min ${min})`);
      continue;
    }
    const best = Math.min(
      ...sets.filter((s) => s.size === min).map((s) => [...s].filter((k) => stopsAt(k.split(",").map(Number) as Pos) === 0).length),
    );
    fixed += min;
    stopFree += best;
    parts.push(`${SHORT[color]}:${best}/${min}`);
  }
  return { dead, anchors, geese, empty: (nonDead - anchors - geese) / nonDead, parts: parts.join(" "), stopFree, fixed, sealed };
}
