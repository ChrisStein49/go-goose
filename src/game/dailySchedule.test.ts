import { describe, expect, it } from "vitest";
import { dailyPuzzlesFor } from "./dailySchedule";

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
// First day of the refilled schedule (see WALKS in dailySchedule.ts). Fixed dates keep these tests
// independent of today's date.
const FIRST = new Date(2026, 10, 11);

describe("daily schedule", () => {
  it("uses the smaller boards Mon-Thu and the larger ones Fri-Sun, never the static fallback", () => {
    for (let i = 0; i < 400; i++) {
      const date = addDays(FIRST, i);
      const [one, two, three] = dailyPuzzlesFor(date);
      const large = [5, 6, 0].includes(date.getDay()); // Fri, Sat, Sun
      expect([one.rows, one.cols]).toEqual(large ? [4, 4] : [3, 4]);
      expect([two.rows, two.cols]).toEqual(large ? [5, 5] : [4, 5]);
      expect([three.rows, three.cols]).toEqual([5, 5]);
      for (const level of [one, two, three]) expect(level.id.startsWith("d")).toBe(true);
    }
  });

  it("does not show the same puzzle twice within 90 days, in any slot", () => {
    for (let slot = 0; slot < 3; slot++) {
      const ids = new Set<string>();
      for (let i = 0; i < 90; i++) ids.add(dailyPuzzlesFor(addDays(FIRST, i))[slot].id);
      expect(ids.size, `slot ${slot + 1} repeats a puzzle within 90 days`).toBe(90);
    }
  });

  it("gives everyone the same puzzles on the same day", () => {
    const a = dailyPuzzlesFor(new Date(2026, 11, 24, 0, 5)).map((l) => l.id);
    const b = dailyPuzzlesFor(new Date(2026, 11, 24, 23, 55)).map((l) => l.id);
    expect(a).toEqual(b);
  });

  it("keeps what was already scheduled when the pools were refilled", () => {
    // Pools that had not wrapped yet continue where they were...
    expect(dailyPuzzlesFor(new Date(2026, 10, 11))[0].id).toBe("d1-3x4-021");
    expect(dailyPuzzlesFor(new Date(2026, 10, 13))[0].id).toBe("d1-4x4-022");
    expect(dailyPuzzlesFor(new Date(2026, 10, 13))[1].id).toBe("d2-5x5-026");
    // ...and the pools that had wrapped continue with their first brand-new puzzle.
    expect(dailyPuzzlesFor(new Date(2026, 10, 11))[1].id).toBe("d2-4x5-021");
    expect(dailyPuzzlesFor(new Date(2026, 10, 11))[2].id).toBe("d3-5x5-031");
  });
});
