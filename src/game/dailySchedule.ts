import { dailyLevels as fallbackLevels } from "./dailyLevels";
import { dailyPool } from "./dailyPool.generated";
import type { Level } from "./types";

const DAY_MS = 86_400_000;
const WEEKDAYS_SMALL = 4; // Mon-Thu use the smaller board, Fri-Sun the larger one

/** Whole days since 1970-01-01 for the player's LOCAL calendar date (so the puzzle flips at local midnight). */
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

type PlayKind = "small" | "large" | "daily";

/** Running count of the days a pool is played on (consecutive numbers for consecutive plays). */
function playNumber(kind: PlayKind, day: number): number {
  // 1970-01-01 was a Thursday, so +3 makes Monday = 0.
  const weekday = (day + 3) % 7;
  const week = Math.floor((day + 3) / 7);
  if (kind === "small") return week * WEEKDAYS_SMALL + weekday; // Mon-Thu
  if (kind === "large") return week * (7 - WEEKDAYS_SMALL) + (weekday - WEEKDAYS_SMALL); // Fri-Sun
  return day;
}

/**
 * Where each pool's walk stands at a fixed anchor date: on `anchor` (a day this pool is played on)
 * the puzzle at position `index` is shown, and every later play moves one position on. The walk
 * does NOT depend on the pool's size, so appending puzzles to a pool never moves anything that is
 * already scheduled — it only pushes the first repeat further out. Positions are the order of the
 * puzzles in src/game/dailyPool.generated.ts (scripts/buildDailyPool.ts keeps them stable; always
 * give new batches --tag values that sort after the existing ones).
 *
 * Set on 2026-11-10 when the pools were refilled: pools that had not wrapped yet continue where
 * they were, pools that already had wrapped (4x5 and slot 3) jump to their first unseen puzzle.
 * Refilling later: append puzzles BEFORE the walk reaches the end of the pool. If it already
 * wrapped, move that pool's anchor to the deploy date and its index to the first unseen position.
 */
const WALKS: Record<string, { kind: PlayKind; anchor: [number, number, number]; index: number }> = {
  "1-3x4": { kind: "small", anchor: [2026, 11, 11], index: 20 },
  "1-4x4": { kind: "large", anchor: [2026, 11, 13], index: 21 },
  "2-4x5": { kind: "small", anchor: [2026, 11, 11], index: 20 },
  "2-5x5": { kind: "large", anchor: [2026, 11, 13], index: 25 },
  "3-5x5": { kind: "daily", anchor: [2026, 11, 11], index: 30 },
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Today's three puzzles, one per slot, picked from the pre-generated pool
 * (scripts/buildDailyPool.ts). Slots 1 and 2 use a smaller board Mon-Thu and
 * a larger one Fri-Sun; slot 3 is always 5x5. Within each board size the pool
 * is walked sequentially (see WALKS), starting over at the first puzzle only once the
 * whole pool has been used. If a pool is empty the static fallback puzzle for that slot is used.
 */
export function dailyPuzzlesFor(date: Date = new Date()): Level[] {
  const day = localDayNumber(date);
  const weekday = (day + 3) % 7;
  const large = weekday >= WEEKDAYS_SMALL;

  const pick = (poolKey: string, slotIndex: number): Level => {
    const pool = dailyPool[poolKey] ?? [];
    if (pool.length === 0) return fallbackLevels[slotIndex];
    const walk = WALKS[poolKey];
    const anchorDay = localDayNumber(new Date(walk.anchor[0], walk.anchor[1] - 1, walk.anchor[2]));
    return pool[mod(walk.index + playNumber(walk.kind, day) - playNumber(walk.kind, anchorDay), pool.length)];
  };

  return [
    pick(large ? "1-4x4" : "1-3x4", 0),
    pick(large ? "2-5x5" : "2-4x5", 1),
    pick("3-5x5", 2),
  ];
}
