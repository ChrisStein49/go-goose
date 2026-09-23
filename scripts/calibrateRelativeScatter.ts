import { boardFromLevel, relativeScatterScore, scatterScore } from "../src/game/board";
import { allLevels } from "../src/game/levels";
import { bestMoves } from "../src/game/bestMoves.generated";

const ids = [
  "world-007-1",
  "world-007-2",
  "world-007-3",
  "world-007-4",
  "world-007-5",
  "world-022-1",
  "world-022-2",
  "world-022-3",
  "world-022-4",
  "world-022-5",
  "world-023-1",
  "world-023-2",
  "world-023-3",
  "world-023-4",
  "world-023-5",
];

interface Row {
  id: string;
  moves: number;
  proven: boolean;
  emptyCells: number;
  totalCells: number;
  rawScatter: number;
  avgRelative: number;
  maxRelative: number;
}

const rows: Row[] = [];

for (const id of ids) {
  const level = allLevels.find((l) => l.id === id)!;
  const board = boardFromLevel(level);
  const raw = scatterScore(board).total;
  const relative = relativeScatterScore(board);
  const ratios = Object.values(relative.perColor);
  const avgRelative = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const maxRelative = Math.max(...ratios);
  const emptyCells = board.flat().filter((c) => c.kind === "empty").length;
  const totalCells = board.length * board[0].length;
  const best = bestMoves[id];
  rows.push({ id, moves: best.moves, proven: best.proven, emptyCells, totalCells, rawScatter: raw, avgRelative, maxRelative });
}

rows.sort((a, b) => a.moves - b.moves);

console.log(
  "id            moves  proven  empty/total  rawScatter  avgRelative  maxRelative",
);
for (const r of rows) {
  console.log(
    `${r.id.padEnd(13)} ${String(r.moves).padStart(5)}  ${String(r.proven).padEnd(6)}  ${`${r.emptyCells}/${r.totalCells}`.padStart(9)}  ${String(r.rawScatter).padStart(10)}  ${r.avgRelative.toFixed(2).padStart(11)}  ${r.maxRelative.toFixed(2).padStart(11)}`,
  );
}
