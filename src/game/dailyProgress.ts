const STORAGE_KEY = "go-goose-daily-completed";

// Kept separate from progress.ts's Worlds-completion Set on purpose — the
// daily challenge doesn't participate in the Worlds unlock system. Currently
// just a plain flag since the challenge itself isn't date-rotated yet; once
// it is, this should key off the current day so the badge resets daily.
export function loadDailyCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveDailyCompleted(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(completed));
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}
