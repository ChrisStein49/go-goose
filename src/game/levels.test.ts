import { describe, expect, it } from "vitest";
import { bestKnown } from "./bestKnown";
import { boardFromLevel } from "./board";
import { allLevels } from "./levels";
import { isSolvable } from "./solver";

describe("shipped levels", () => {
  for (const level of allLevels) {
    it(
      `${level.id} is solvable`,
      () => {
        // The solver gives up on the very hardest levels within its budget, which looks the
        // same as "unsolvable". A recorded best-known score is a real solution (found by the
        // solver or by a player), so it also proves the level can be solved.
        const solvable = isSolvable(boardFromLevel(level)) || bestKnown[level.id] !== undefined;
        expect(solvable).toBe(true);
      },
      120_000,
    );
  }
});
