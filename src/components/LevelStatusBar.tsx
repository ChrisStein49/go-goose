import { bestKnown } from "../game/bestKnown";
import { useLanguage } from "../i18n/LanguageContext";
import type { Translations } from "../i18n/translations";

interface LevelStatusBarProps {
  levelId: string;
  moveCount: number;
  showBestKnown?: boolean;
}

export function LevelStatusBar({ levelId, moveCount, showBestKnown = true }: LevelStatusBarProps) {
  const { t } = useLanguage();
  const best = bestKnown[levelId];

  return (
    <span className="status-bar">
      <span className="moves-count">
        {t.movesLabel}
        {moveCount}
      </span>
      {showBestKnown && best && (
        <span className="best-known">
          {t.bestKnownLabel}
          {best.moves}
          {best.proven ? "" : "+"}
        </span>
      )}
    </span>
  );
}

interface LevelCompleteBadgeProps {
  levelId: string;
  moveCount: number;
  /** Worlds levels only: the player's fewest moves BEFORE this run (null = none yet).
   * Leave undefined (Daily Challenge) to skip the personal-best wording. */
  previousBest?: number | null;
}

export function LevelCompleteBadge({ levelId, moveCount, previousBest }: LevelCompleteBadgeProps) {
  const { t } = useLanguage();
  const best = bestKnown[levelId];

  return (
    <div className="complete-row">
      <StatusMessage t={t} moveCount={moveCount} best={best} previousBest={previousBest} />
    </div>
  );
}

function StatusMessage({
  t,
  moveCount,
  best,
  previousBest,
}: {
  t: Translations;
  moveCount: number;
  best: { moves: number; proven: boolean } | undefined;
  previousBest: number | null | undefined;
}) {
  if (!best) return <span className="complete-badge">{t.levelCompletePlain}</span>;

  if (moveCount < best.moves) {
    return <span className="complete-badge new-record">{t.newRecord}</span>;
  }
  if (moveCount === best.moves) {
    return <span className="complete-badge">{t.matchedBest}</span>;
  }
  if (previousBest !== undefined) {
    // Not at the best known score yet: show the player's best against the target to nudge a replay.
    const improved = previousBest !== null && moveCount < previousBest;
    const yours = previousBest === null ? moveCount : Math.min(previousBest, moveCount);
    return (
      <span className="complete-badge">
        {improved ? t.personalBestNew(yours, best.moves, best.proven) : t.personalBestKept(yours, best.moves, best.proven)}
      </span>
    );
  }
  return <span className="complete-badge">{t.levelCompletePlain}</span>;
}
