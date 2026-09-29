const STORAGE_KEY = "go-goose-daily-progress";

interface DailyProgressState {
  lastCompletedDate: string | null;
  streak: number;
}

/** YYYY-MM-DD in the player's local time zone, `offsetDays` days from today. */
function dateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

/** Whether the full daily challenge has already been completed today (for the trophy badge). */
export function loadDailyCompletedToday(): boolean {
  return loadState().lastCompletedDate === dateString();
}

/** Current streak. A missed day reads as broken here even before the next completion rewrites storage. */
export function loadDailyStreak(): number {
  const state = loadState();
  if (state.lastCompletedDate === dateString() || state.lastCompletedDate === dateString(-1)) {
    return state.streak;
  }
  return 0;
}

/** Call once the full daily challenge (all puzzles) is completed. Returns the updated streak. */
export function recordDailyCompletion(): number {
  const state = loadState();
  const today = dateString();
  if (state.lastCompletedDate === today) return state.streak;

  const streak = state.lastCompletedDate === dateString(-1) ? state.streak + 1 : 1;
  saveState({ lastCompletedDate: today, streak });
  return streak;
}
