const STORAGE_KEY = "go-goose-daily-progress";

interface DailyProgressState {
  lastCompletedDate: string | null;
  streak: number;
}

/** YYYY-MM-DD in the player's local time zone. */
export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The local date (at midnight) for a YYYY-MM-DD key. */
export function dateFromKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The key of the day before `key`. */
export function previousDayKey(key: string): string {
  const date = dateFromKey(key);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

/** Milliseconds from `now` until the next local midnight. */
export function msUntilNextMidnight(now: Date): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
}

const todayKey = () => dateKey(new Date());

function loadState(): DailyProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          lastCompletedDate: typeof parsed.lastCompletedDate === "string" ? parsed.lastCompletedDate : null,
          streak: typeof parsed.streak === "number" ? parsed.streak : 0,
        };
      }
    }
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
  return { lastCompletedDate: null, streak: 0 };
}

function saveState(state: DailyProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}

/** Whether the full daily challenge has already been completed on `today` (for the trophy badge). */
export function loadDailyCompletedToday(today: string = todayKey()): boolean {
  return loadState().lastCompletedDate === today;
}

/** Current streak. A missed day reads as broken here even before the next completion rewrites storage. */
export function loadDailyStreak(today: string = todayKey()): number {
  const state = loadState();
  if (state.lastCompletedDate === today || state.lastCompletedDate === previousDayKey(today)) {
    return state.streak;
  }
  return 0;
}

/**
 * Call once the full daily challenge (all puzzles) is completed. `day` is the day the puzzles
 * belong to, which is not necessarily today: a set started before midnight and finished after
 * counts for the day it was picked for. Never moves the record backwards. Returns the streak.
 */
export function recordDailyCompletion(day: string = todayKey()): number {
  const state = loadState();
  // Already recorded for this day, or a later day is already on record: nothing to change.
  if (state.lastCompletedDate !== null && state.lastCompletedDate >= day) return state.streak;

  const streak = state.lastCompletedDate === previousDayKey(day) ? state.streak + 1 : 1;
  saveState({ lastCompletedDate: day, streak });
  return streak;
}
