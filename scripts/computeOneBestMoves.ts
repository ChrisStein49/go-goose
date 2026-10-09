// Computes the best-known move count for a single level with a custom solver
// budget — for levels that scripts/computeBestMoves.ts skipped at its default
// budget. Prints one result line; add it to src/game/bestMoves.generated.ts.
//   npx tsx scripts/computeOneBestMoves.ts world-020-2 4000000
import { boardFromLevel } from "../src/game/board";
import { allLevels } from "../src/game/levels";
import { bestKnownSolutionLength } from "../src/game/solver";

const [id, budget = "4000000"] = process.argv.slice(2);
const level = allLevels.find((l) => l.id === id);
if (!level) throw new Error(`Unknown level id: ${id}`);

const start = Date.now();
const result = bestKnownSolutionLength(boardFromLevel(level), { maxStates: Number(budget) });
const seconds = Math.round((Date.now() - start) / 1000);
console.log(
  result
    ? `RESULT ${id}: { moves: ${result.moves}, proven: ${result.proven} } (${seconds}s, budget ${budget})`
    : `RESULT ${id}: none found (${seconds}s, budget ${budget})`,
);
