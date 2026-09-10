import { describe, expect, it } from "vitest";
import { pushGoose, isLevelComplete, getIncompleteColors } from "./board";
import type { Board } from "./types";

const E = { kind: "empty" } as const;
const D = { kind: "dead" } as const;
const g = (color: string) => ({ kind: "goose", color }) as const;

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
