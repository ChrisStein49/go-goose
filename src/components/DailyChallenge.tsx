import { useState } from "react";
import { dailyLevels } from "../game/dailyLevels";
import { useLanguage } from "../i18n/LanguageContext";
import { GameBoard } from "./GameBoard";
import { LevelStatusBar } from "./LevelStatusBar";

interface DailyChallengeProps {
  onComplete: () => void;
}

/**
 * Today's Challenge: a fixed sequence of puzzles played back to back,
 * separate from the Worlds progression — completing one doesn't touch
 * src/game/progress.ts's unlock state.
 */
export function DailyChallenge({ onComplete }: DailyChallengeProps) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [complete, setComplete] = useState(false);

  const level = dailyLevels[index];
  const isLastPuzzle = index === dailyLevels.length - 1;

  function handlePuzzleCompleteChange(isComplete: boolean) {
    setComplete(isComplete);
    if (isComplete && isLastPuzzle) onComplete();
  }

  function goToNextPuzzle() {
    setIndex((i) => i + 1);
    setMoveCount(0);
    setComplete(false);
  }

  function restart() {
    setIndex(0);
    setMoveCount(0);
    setComplete(false);
  }

  if (complete && isLastPuzzle) {
    return (
      <div className="daily-challenge">
        <section>
          <h2>{t.dailyCompleteTitle}</h2>
          <p className="complete-badge">{t.dailySolvedAll(dailyLevels.length)}</p>
          <p>{t.dailyCompleteBody}</p>
          <button onClick={restart}>{t.playAgain}</button>
        </section>
      </div>
    );
  }

  return (
    <div className="daily-challenge">
      <div className="level-bar">
        <span className="level-name">
          <span className="world-name">{t.dailyChallenge}</span>
          {t.levelBarSeparator}
          {t.puzzleOf(index + 1, dailyLevels.length)}
        </span>
        <LevelStatusBar levelId={level.id} moveCount={moveCount} complete={complete} />
      </div>

      <GameBoard
        key={level.id}
        level={level}
        onMoveCountChange={setMoveCount}
        onCompleteChange={handlePuzzleCompleteChange}
      />

      {complete && !isLastPuzzle && (
        <button className="next-level-button" onClick={goToNextPuzzle}>
          {t.nextPuzzle}
        </button>
      )}
    </div>
  );
}
