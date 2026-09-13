import { describe, expect, it } from "vitest";
import { isLevelComplete, pushGoose } from "./board";
import { applyReverseMove, findReverseChains, scramble } from "./reverseGenerator";
import { isSolvable } from "./solver";
import type { Board } from "./types";

const E = { kind: "empty" } as const;
const D = { kind: "dead" } as const;
const g = (color: string) => ({ kind: "goose", color }) as const;
const a = (color: string) => ({ kind: "anchor", color }) as const;

function board(rows: Board): Board {
  return rows;
}

describe("findReverseChains", () => {
  it("finds a single goose blocked against a dead cell, with room to shift back", () => {
    const b = board([[E, g("blue"), D]]);
    const chains = findReverseChains(b);
    expect(chains).toHaveLength(1);
    expect(chains[0]).toMatchObject({ blockedDirection: "right", maxShift: 1 });
    expect(chains[0].cells).toEqual([[0, 1]]);
  });

  it("finds a two-goose chain blocked together", () => {
    const b = board([[E, g("blue"), g("blue"), D]]);
    const chains = findReverseChains(b);
    expect(chains).toHaveLength(1);
    expect(chains[0].cells).toEqual([
      [0, 1],
      [0, 2],
    ]);
    expect(chains[0].maxShift).toBe(1);
  });

  it("finds nothing when there is no empty room to shift back into", () => {
    const b = board([[g("blue"), D]]);
    expect(findReverseChains(b)).toEqual([]);
  });

  it("treats an anchor as a blocker but never includes it in the chain", () => {
    const b = board([[E, g("blue"), a("blue")]]);
    const chains = findReverseChains(b);
    expect(chains).toHaveLength(1);
    expect(chains[0].cells).toEqual([[0, 1]]);
  });

  it("is blocked by the board edge too", () => {
    const b = board([[E, g("blue")]]);
    const chains = findReverseChains(b);
    expect(chains).toHaveLength(1);
    expect(chains[0]).toMatchObject({ blockedDirection: "right", maxShift: 1 });
  });
});

describe("applyReverseMove", () => {
  it("is exactly undone by the corresponding forward push", () => {
    const before = board([[E, g("blue"), g("blue"), D]]);
    const [chain] = findReverseChains(before);
    const after = applyReverseMove(before, chain, chain.maxShift);

    // The new back-most cell of the chain is what you'd touch to redo the
    // forward move that (hypothetically) produced `before`.
    const [dr, dc] = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }[chain.blockedDirection];
    const [backR, backC] = chain.cells[0];
    const touchRow = backR - dr * chain.maxShift;
    const touchCol = backC - dc * chain.maxShift;

    const { board: reconstructed, moved } = pushGoose(after, touchRow, touchCol, chain.blockedDirection);
    expect(moved).toBe(true);
    expect(reconstructed).toEqual(before);
  });
});

describe("scramble", () => {
  it("only ever produces boards solvable back to a complete state", () => {
    const solved = board([
      [g("blue"), g("blue"), E, E],
      [E, E, E, E],
      [E, E, a("orange"), g("orange")],
      [E, E, E, E],
    ]);
    expect(isLevelComplete(solved)).toBe(true);

    for (let seed = 1; seed <= 8; seed++) {
      const { board: scrambled, steps } = scramble(solved, 12, seed);
      expect(steps).toBeGreaterThan(0);
      expect(isSolvable(scrambled)).toBe(true);
    }
  });

  it("never lands back on an already-visited state (no degenerate cancellation)", () => {
    // A single goose against a wall, with just enough room to bounce back
    // and forth — a naive generator could easily net-cancel back to the
    // original layout here.
    const solved = board([[E, E, g("blue"), D]]);
    for (let seed = 1; seed <= 10; seed++) {
      const { board: scrambled, steps } = scramble(solved, 10, seed);
      expect(steps).toBeGreaterThan(0);
      expect(scrambled).not.toEqual(solved);
    }
  });
});
