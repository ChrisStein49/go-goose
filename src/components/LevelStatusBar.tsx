import { bestMoves } from "../game/bestMoves.generated";
import { useLanguage } from "../i18n/LanguageContext";
import type { Translations } from "../i18n/translations";

interface LevelStatusBarProps {
  levelId: string;
  moveCount: number;
}

export function LevelStatusBar({ levelId, moveCount }: LevelStatusBarProps) {
  const { t } = useLanguage();
  const best = bestMoves[levelId];

  return (
    <span className="status-bar">
      <span className="moves-count">
        {t.movesLabel}
        {moveCount}
      </span>
      {best && (
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
}

export function LevelCompleteBadge({ levelId, moveCount }: LevelCompleteBadgeProps) {
  const { t } = useLanguage();
  const best = bestMoves[levelId];

  return (
    <div className="complete-row">
      <StatusMessage t={t} moveCount={moveCount} best={best} />
    </div>
  );
}

function StatusMessage({
  t,
  moveCount,
  best,
}: {
  t: Translations;
  moveCount: number;
  best: { moves: number; proven: boolean } | undefined;
}) {
  if (!best) return <span className="complete-badge">{t.levelCompletePlain}</span>;

  if (moveCount < best.moves) {
    return <span className="complete-badge new-record">{t.newRecord}</span>;
  }
  if (moveCount === best.moves) {
    return <span className="complete-badge">{t.matchedBest}</span>;
  }
  return <span className="complete-badge">{t.levelCompletePlain}</span>;
}
