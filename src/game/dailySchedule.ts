import { dailyLevels as fallbackLevels } from "./dailyLevels";
import { dailyPool } from "./dailyPool.generated";
import type { Level } from "./types";

const DAY_MS = 86_400_000;
const WEEKDAYS_SMALL = 4; // Mon-Thu use the smaller board, Fri-Sun the larger one

/** Whole days since 1970-01-01 for the player's LOCAL calendar date (so the puzzle flips at local midnight). */
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

/**
 * Today's three puzzles, one per slot, picked from the pre-generated pool
 * (scripts/buildDailyPool.ts). Slots 1 and 2 use a smaller board Mon-Thu and
 * a larger one Fri-Sun; slot 3 is always 5x5. Within each board size the pool
 * is walked sequentially week after week (no gaps, wrapping when it runs out),
 * with a per-slot offset so the three slots don't move in lockstep. If a pool
 * is empty the static fallback puzzle for that slot is used instead.
 */
export function dailyPuzzlesFor(date: Date = new Date()): Level[] {
  const day = localDayNumber(date);
  // 1970-01-01 was a Thursday, so +3 makes Monday = 0.
  const weekday = (day + 3) % 7;
  const week = Math.floor((day + 3) / 7);
  const large = weekday >= WEEKDAYS_SMALL;
  const pickFrom = (poolKey: string, perWeek: number, posInWeek: number, offset: number, slotIndex: number): Level => {
    const pool = dailyPool[poolKey] ?? [];
    if (pool.length === 0) return fallbackLevels[slotIndex];
    return pool[(week * perWeek + posInWeek + offset) % pool.length];
  };
  const smallDays = WEEKDAYS_SMALL;
  const largeDays = 7 - WEEKDAYS_SMALL;
  const perWeek = large ? largeDays : smallDays;
  const pos = large ? weekday - WEEKDAYS_SMALL : weekday;

  return [
    pickFrom(large ? "1-4x4" : "1-3x4", perWeek, pos, 0, 0),
    pickFrom(large ? "2-5x5" : "2-4x5", perWeek, pos, 7, 1),
    pickFrom("3-5x5", 7, weekday, 3, 2),
  ];
}
