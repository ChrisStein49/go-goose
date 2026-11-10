import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  dateFromKey,
  dateKey,
  loadDailyCompletedToday,
  loadDailyStreak,
  msUntilNextMidnight,
  previousDayKey,
  recordDailyCompletion,
} from "./dailyProgress";

beforeEach(() => {
  // The tests run outside a browser: a tiny in-memory localStorage, fresh for every test.
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  });
});

describe("date helpers", () => {
  it("formats and parses local dates", () => {
    expect(dateKey(new Date(2026, 10, 5, 23, 59))).toBe("2026-11-05");
    expect(dateKey(dateFromKey("2027-01-09"))).toBe("2027-01-09");
  });

  it("finds the previous day across month and year boundaries", () => {
    expect(previousDayKey("2026-11-11")).toBe("2026-11-10");
    expect(previousDayKey("2026-12-01")).toBe("2026-11-30");
    expect(previousDayKey("2027-01-01")).toBe("2026-12-31");
    expect(previousDayKey("2027-03-01")).toBe("2027-02-28");
  });

  it("counts the time until the next local midnight", () => {
    expect(msUntilNextMidnight(new Date(2026, 10, 10, 23, 59, 30))).toBe(30_000);
    expect(msUntilNextMidnight(new Date(2026, 10, 10, 0, 0, 0))).toBe(86_400_000);
  });
});

describe("daily completion record", () => {
  it("starts a streak and ignores a second completion on the same day", () => {
    expect(recordDailyCompletion("2026-11-10")).toBe(1);
    expect(recordDailyCompletion("2026-11-10")).toBe(1);
    expect(loadDailyCompletedToday("2026-11-10")).toBe(true);
  });

  it("extends the streak on consecutive days and restarts it after a gap", () => {
    expect(recordDailyCompletion("2026-11-10")).toBe(1);
    expect(recordDailyCompletion("2026-11-11")).toBe(2);
    expect(recordDailyCompletion("2026-11-13")).toBe(1);
  });

  it("shows the trophy and the streak only for the right day", () => {
    recordDailyCompletion("2026-11-10");
    recordDailyCompletion("2026-11-11");
    expect(loadDailyCompletedToday("2026-11-11")).toBe(true);
    expect(loadDailyCompletedToday("2026-11-12")).toBe(false); // a new day: no trophy yet
    expect(loadDailyStreak("2026-11-12")).toBe(2); // ...but yesterday's streak is still alive
    expect(loadDailyStreak("2026-11-13")).toBe(0); // a missed day breaks it
  });

  it("credits a set finished after midnight to the day it belongs to", () => {
    recordDailyCompletion("2026-11-09");
    // Started on the 10th, finished on the 11th: counts for the 10th, not for the 11th.
    expect(recordDailyCompletion("2026-11-10")).toBe(2);
    expect(loadDailyCompletedToday("2026-11-11")).toBe(false);
    expect(loadDailyStreak("2026-11-11")).toBe(2);
  });

  it("never moves the record backwards", () => {
    recordDailyCompletion("2026-11-11");
    expect(recordDailyCompletion("2026-11-10")).toBe(1); // a late, older set changes nothing
    expect(loadDailyCompletedToday("2026-11-11")).toBe(true);
  });
});
