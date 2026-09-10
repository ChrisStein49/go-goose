import { describe, expect, it } from "vitest";
import { boardFromLevel } from "./board";
import { allLevels } from "./levels";
import { isSolvable } from "./solver";

describe("shipped levels", () => {
  for (const level of allLevels) {
    it(`${level.id} is solvable`, () => {
      expect(isSolvable(boardFromLevel(level))).toBe(true);
    });
  }
});
