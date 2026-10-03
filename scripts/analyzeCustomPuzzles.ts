// Quick statistics for hand-built Daily Puzzle 3 examples (Christoph's two
// "anchors in the middle" prototypes), for comparison with the references.
//   Grid legend: . empty  # dead  o/g/p goose  O/G/P anchor
import { boardFromLevel } from "../src/game/board";
import { GREEN, ORANGE, PURPLE } from "../src/game/levels";
import { bestKnownSolutionLength } from "../src/game/solver";
import type { Cell, Level } from "../src/game/types";

type Pos = [number, number];
const key = (p: Pos) => `${p[0]},${p[1]}`;
const DIRS: Pos[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
const COLOR: Record<string, string> = { o: ORANGE, g: GREEN, p: PURPLE };
const SHORT: Record<string, string> = { [ORANGE]: "O", [GREEN]: "G", [PURPLE]: "P" };

function parse(id: string, rows: string[]): Level {
  const cells: Cell[][] = rows.map((row) =>
    [...row].map((ch): Cell => {
      if (ch === ".") return { kind: "empty" };
      if (ch === "#") return { kind: "dead" };
      const color = COLOR[ch.toLowerCase()];
      return ch === ch.toUpperCase() ? { kind: "anchor", color } : { kind: "goose", color };
    }),
  );
  return { id, rows: cells.length, cols: cells[0].length, cells };
}

const puzzles: Level[] = [
  parse("image 1", [".Op.P", ".....", ".OG.G", ".....", "o.#.g"]),
  parse("image 1 w/o block", [".Op.P", ".....", ".OG.G", ".....", "o...g"]),
  parse("image 2", [".Og.o", "....p", ".OG.G", ".....", "P.G.g"]),
];

function stats(level: Level) {
  const { rows, cols, cells } = level;
  const inBounds = (p: Pos) => p[0] >= 0 && p[0] < rows && p[1] >= 0 && p[1] < cols;
  const staticBlocked = (p: Pos) => !inBounds(p) || cells[p[0]][p[1]].kind === "dead" || cells[p[0]][p[1]].kind === "anchor";
  const stopsAt = (p: Pos) => DIRS.filter(([dr, dc]) => staticBlocked([p[0] + dr, p[1] + dc]) && !staticBlocked([p[0] - dr, p[1] - dc])).length;

  const flat = cells.flat();
  const dead = flat.filter((c) => c.kind === "dead").length;
  const anchors = flat.filter((c) => c.kind === "anchor").length;
  const geese = flat.filter((c) => c.kind === "goose").length;
  const nonDead = rows * cols - dead;

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
    const blockedFor = (p: Pos) => !inBounds(p) || cells[p[0]][p[1]].kind === "dead" || (cells[p[0]][p[1]].kind === "anchor" && (cells[p[0]][p[1]] as { color: string }).color !== color);
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
    const best = Math.min(...sets.filter((s) => s.size === min).map((s) => [...s].filter((k) => stopsAt(k.split(",").map(Number) as Pos) === 0).length));
    fixed += min;
    stopFree += best;
    parts.push(`${SHORT[color]}:${best}/${min}`);
  }
  return { dead, anchors, geese, empty: Math.round(((nonDead - anchors - geese) / nonDead) * 100), parts: parts.join(" "), stopFree, fixed };
}

for (const level of puzzles) {
  const s = stats(level);
  const t = Date.now();
  const best = bestKnownSolutionLength(boardFromLevel(level), { maxStates: 3_000_000 });
  const result = best ? `${best.moves}${best.proven ? "" : "+"}` : "no solution found in budget";
  console.log(
    `${level.id.padEnd(18)} dead ${s.dead} anchors ${s.anchors} geese ${s.geese} empty ${s.empty}%  stop-free ${s.stopFree}/${s.fixed} (${s.parts})  optimal ${result}  [${Math.round((Date.now() - t) / 100) / 10}s]`,
  );
}
