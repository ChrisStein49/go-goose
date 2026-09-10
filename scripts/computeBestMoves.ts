// Precomputes the "best known" minimum move count for every shipped level.
// Run this whenever levels.ts changes (levels added, removed, or edited):
//   npm run compute-best-moves
// It regenerates src/game/bestMoves.generated.ts, which the app imports to
// show players a target to beat. This can take a while (up to a minute or
// so per tricky level) since it's an offline/precomputation step, not
// something that runs live during play.

import { writeFileSync } from "node:fs";
import { boardFromLevel } from "../src/game/board";
import { allLevels } from "../src/game/levels";
import { bestKnownSolutionLength } from "../src/game/solver";

const entries: [string, { moves: number; proven: boolean }][] = [];

for (const level of allLevels) {
  const start = Date.now();
  const result = bestKnownSolutionLength(boardFromLevel(level));
  const elapsed = Date.now() - start;
  if (result === null) {
    console.warn(`${level.id}: could not determine a best-known move count (skipped)`);
    continue;
  }
  console.log(`${level.id}: ${result.moves} moves${result.proven ? " (proven)" : " (unproven)"} — ${elapsed}ms`);
  entries.push([level.id, result]);
}

entries.sort((a, b) => a[0].localeCompare(b[0]));

const body = entries
  .map(([id, { moves, proven }]) => `  ${JSON.stringify(id)}: { moves: ${moves}, proven: ${proven} },`)
  .join("\n");

const output = `// GENERATED FILE — do not edit by hand.
// Regenerate with: npm run compute-best-moves

export interface BestKnownMoves {
  moves: number;
  proven: boolean;
}

export const bestMoves: Record<string, BestKnownMoves> = {
${body}
};
`;

writeFileSync(new URL("../src/game/bestMoves.generated.ts", import.meta.url), output);
console.log(`\nWrote ${entries.length} entries to src/game/bestMoves.generated.ts`);
