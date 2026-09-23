import { describe, expect, it } from "vitest";
import { pushGoose, isLevelComplete, getIncompleteColors, allGooseCells, scatterScore, relativeScatterScore } from "./board";
import type { Board } from "./types";

const E = { kind: "empty" } as const;
const D = { kind: "dead" } as const;
const g = (color: string) => ({ kind: "goose", color }) as const;
const a = (color: string) => ({ kind: "anchor", color }) as const;

function board(rows: Board): Board {
  return rows;
}

describe("pushGoose", () => {
  it("slides a single goose across empty cells until the edge", () => {
    const b = board([[g("blue"), E, E, E]]);
    const { board: next, moved } = pushGoose(b, 0, 0, "right");
    expect(moved).toBe(true);
    expect(next[0]).toEqual([E, E, E, g("blue")]);
  });

  it("carries a contiguous chain of geese together", () => {
    const b = board([[g("blue"), g("blue"), E, E]]);
    const { board: next } = pushGoose(b, 0, 0, "right");
    expect(next[0]).toEqual([E, E, g("blue"), g("blue")]);
  });

  it("does not move when blocked by the board edge", () => {
    const b = board([[g("blue"), g("blue")]]);
    const { board: next, moved } = pushGoose(b, 0, 0, "right");
    expect(moved).toBe(false);
    expect(next).toBe(b);
  });

  it("does not move when blocked by a dead cell", () => {
    const b = board([[g("blue"), D, E]]);
    const { moved } = pushGoose(b, 0, 0, "right");
    expect(moved).toBe(false);
  });

  it("does not move geese behind the touched goose", () => {
    const b = board([[g("blue"), g("blue"), E, E]]);
    const { board: next } = pushGoose(b, 0, 1, "right");
    // only the touched goose (col 1) and anything ahead of it move; col 0 stays put
    expect(next[0]).toEqual([g("blue"), E, E, g("blue")]);
  });

  it("is a no-op on an empty or dead cell", () => {
    const b = board([[E, D, g("blue")]]);
    expect(pushGoose(b, 0, 0, "right").moved).toBe(false);
    expect(pushGoose(b, 0, 1, "right").moved).toBe(false);
  });
});

describe("isLevelComplete", () => {
  it("is false when a single color is split into two groups", () => {
    const b = board([
      [g("blue"), g("blue"), E, g("blue"), g("blue")],
    ]);
    expect(isLevelComplete(b)).toBe(false);
    expect(getIncompleteColors(b)).toEqual(["blue"]);
  });

  it("is true when all geese of a color are one connected group", () => {
    const b = board([
      [g("blue"), g("blue")],
      [E, g("blue")],
    ]);
    expect(isLevelComplete(b)).toBe(true);
  });

  it("checks each color independently", () => {
    const b = board([
      [g("blue"), g("blue"), E, g("pink"), g("pink")],
      [E, E, E, E, E],
      [g("orange"), E, E, g("orange"), E],
    ]);
    // blue connected, pink connected, orange split -> incomplete
    expect(getIncompleteColors(b).sort()).toEqual(["orange"]);
    expect(isLevelComplete(b)).toBe(false);
  });

  it("does not require different colors to be separated", () => {
    const b = board([[g("blue"), g("pink"), g("blue")]]);
    // blue geese are NOT adjacent to each other (pink sits between them) -> blue incomplete
    expect(getIncompleteColors(b)).toEqual(["blue"]);
  });
});

describe("anchors (fixed geese)", () => {
  it("can never be pushed", () => {
    const b = board([[a("blue"), E, E]]);
    expect(pushGoose(b, 0, 0, "right").moved).toBe(false);
  });

  it("blocks a push like a dead cell would", () => {
    const b = board([[g("blue"), a("blue"), E]]);
    const { moved } = pushGoose(b, 0, 0, "right");
    expect(moved).toBe(false);
  });

  it("counts toward its color's connectivity requirement", () => {
    const b = board([[g("blue"), a("blue")]]);
    expect(isLevelComplete(b)).toBe(true);
  });

  it("is incomplete when a movable goose hasn't reached its anchor yet", () => {
    const b = board([[g("blue"), E, a("blue")]]);
    expect(isLevelComplete(b)).toBe(false);
  });

  it("is excluded from the list of pushable geese", () => {
    const b = board([[g("blue"), E, a("blue")]]);
    expect(allGooseCells(b)).toEqual([[0, 0]]);
  });
});

describe("scatterScore", () => {
  it("is 0 for a single-cell color", () => {
    const b = board([[g("blue"), E, E]]);
    expect(scatterScore(b).perColor.blue).toBe(0);
  });

  it("sums pairwise Manhattan distance for a color with more than one cell", () => {
    const b = board([
      [g("blue"), E, E],
      [E, E, E],
      [E, E, g("blue")],
    ]);
    // (0,0) to (2,2): |0-2| + |0-2| = 4
    expect(scatterScore(b).perColor.blue).toBe(4);
  });

  it("grows with distance apart, even when disconnectionScore would be identical", () => {
    const near = board([[g("blue"), E, g("blue")]]);
    const far = board([[g("blue"), E, E, E, E, E, E, g("blue")]]);
    expect(scatterScore(far).perColor.blue).toBeGreaterThan(scatterScore(near).perColor.blue);
  });

  it("counts anchors alongside geese, matching how connectivity is judged", () => {
    const b = board([[g("blue"), E, a("blue")]]);
    expect(scatterScore(b).perColor.blue).toBe(2);
  });

  it("scores each color independently and sums them into a total", () => {
    const b = board([[g("blue"), g("pink"), E, g("blue"), E, g("pink")]]);
    const result = scatterScore(b);
    // blue at cols 0,3 -> 3; pink at cols 1,5 -> 4
    expect(result.perColor).toEqual({ blue: 3, pink: 4 });
    expect(result.total).toBe(7);
  });
});

describe("relativeScatterScore", () => {
  it("scores a clustered color below 1 and a spread-out color above 1 on the same board", () => {
    const b = board([
      [g("blue"), g("blue"), E, g("pink")],
      [E, E, E, E],
      [g("pink"), E, E, E],
    ]);
    const result = relativeScatterScore(b);
    expect(result.perColor.blue).toBeLessThan(1); // adjacent pair
    expect(result.perColor.pink).toBeGreaterThan(1); // opposite corners — the board's maximum possible distance
  });

  it("stays close to the board's own baseline for a color that fills most of a packed board, unlike the raw scatterScore which spikes", () => {
    // Only one empty cell on this board — any color occupying most of it is
    // "scattered" merely because there's nowhere else to go, not because of
    // deliberate design.
    const packed = board([
      [g("blue"), g("blue"), g("blue")],
      [g("blue"), D, g("blue")],
      [g("blue"), g("blue"), E],
    ]);
    expect(relativeScatterScore(packed).perColor.blue).toBeCloseTo(1, 1);
  });

  it("excludes dead cells from the board baseline", () => {
    const b = board([[g("blue"), D, D, D, g("blue")]]);
    // Only the two blue cells are non-dead, so the baseline equals their own
    // distance and the ratio is exactly 1.
    expect(relativeScatterScore(b).perColor.blue).toBeCloseTo(1, 5);
  });
});
