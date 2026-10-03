const STORAGE_KEY = "go-goose-progress";

/** Used for levels completed before per-level move tracking existed: keeps
 * them unlocked, but the value can never satisfy a "beat the best known
 * score" comparison, so no star is awarded until the level is replayed. */
const UNKNOWN_MOVES = Number.MAX_SAFE_INTEGER;

/** Level id -> the fewest moves the player has ever solved it in. */
export type LevelProgress = Record<string, number>;

export function loadLevelProgress(): LevelProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      // Legacy format: a plain list of completed level ids, no move count.
      const migrated: LevelProgress = {};
      for (const id of parsed) {
        if (typeof id === "string") migrated[id] = UNKNOWN_MOVES;
      }
      return migrated;
    }
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

/** The recorded fewest-moves for a level, or null if there is none (never completed, or completed before move tracking existed). */
export function knownMoves(value: number | undefined): number | null {
  return value === undefined || value >= UNKNOWN_MOVES ? null : value;
}

export function saveLevelProgress(progress: LevelProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}
