import { bestMoves } from "../game/bestMoves.generated";
import { useLanguage } from "../i18n/LanguageContext";
import type { Translations } from "../i18n/translations";

interface LevelStatusBarProps {
  levelId: string;
  moveCount: number;
  complete: boolean;
}

export function LevelStatusBar({ levelId, moveCount, complete }: LevelStatusBarProps) {
  const { t } = useLanguage();
  const best = bestMoves[levelId];

  return (
    <div className="status-bar">
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
      {complete && <StatusMessage t={t} moveCount={moveCount} best={best} />}
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
    // Any strictly-lower count beats the recorded value even if it's just an
    // unproven upper bound, so no "+" here — that's only meaningful when
    // showing the target as still-standing, in the branch below.
    return (
      <span className="complete-badge new-record">{t.newRecord(String(best.moves), moveCount)}</span>
    );
  }
  if (moveCount === best.moves) {
    return <span className="complete-badge">{t.matchedBest}</span>;
  }
  return <span className="complete-badge">{t.completeTryBeat(`${best.moves}${best.proven ? "" : "+"}`)}</span>;
}
