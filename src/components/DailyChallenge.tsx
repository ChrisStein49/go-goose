import { useMemo, useState } from "react";
import { bestKnown } from "../game/bestKnown";
import { dailyPuzzlesFor } from "../game/dailySchedule";
import { useLanguage } from "../i18n/LanguageContext";
import { GameBoard } from "./GameBoard";
import { LevelCompleteBadge, LevelStatusBar } from "./LevelStatusBar";

interface DailyChallengeProps {
  onComplete: () => void;
  streak: number;
}

function isOptimal(levelId: string, moves: number): boolean {
  const best = bestKnown[levelId];
  return best !== undefined && moves <= best.moves;
}

/**
 * Today's Challenge: a fixed sequence of puzzles played back to back,
 * separate from the Worlds progression — completing one doesn't touch
 * src/game/progress.ts's unlock state.
 */
export function DailyChallenge({ onComplete, streak }: DailyChallengeProps) {
  const { t } = useLanguage();
  // Picked once per visit, from the player's local date.
  const dailyLevels = useMemo(() => dailyPuzzlesFor(), []);
  const [index, setIndex] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);
  const [puzzleResults, setPuzzleResults] = useState<boolean[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  const level = dailyLevels[index];
  const isLastPuzzle = index === dailyLevels.length - 1;

  function handlePuzzleCompleteChange(isComplete: boolean, moves: number) {
    setComplete(isComplete);
    if (isComplete && isLastPuzzle) {
      setTotalMoves((t) => t + moves);
      setPuzzleResults((r) => [...r, isOptimal(level.id, moves)]);
      onComplete();
    }
  }

  function goToNextPuzzle() {
    setTotalMoves((t) => t + moveCount);
    setPuzzleResults((r) => [...r, isOptimal(level.id, moveCount)]);
    setIndex((i) => i + 1);
    setMoveCount(0);
    setComplete(false);
  }

  function restart() {
    setIndex(0);
    setMoveCount(0);
    setComplete(false);
    setTotalMoves(0);
    setPuzzleResults([]);
  }

  async function handleShare() {
    const emojis = puzzleResults.map((optimal) => (optimal ? "⭐" : "✓")).join("");
    const text = [
      `${t.appTitle} — ${t.dailyChallenge}`,
      emojis,
      t.dailySolvedAll(dailyLevels.length, totalMoves),
      t.dailyStreak(streak),
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ text, url: window.location.origin });
      } catch {
        // user cancelled or share failed; nothing to do
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.origin}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing more we can do
    }
  }

  if (complete && isLastPuzzle) {
    return (
      <div className="daily-challenge">
        <div className="level-bar">
          <span className="level-name">{t.dailyPuzzleOf(index + 1, dailyLevels.length)}</span>
          <LevelStatusBar levelId={level.id} moveCount={moveCount} showBestKnown={false} />
        </div>

        <LevelCompleteBadge levelId={level.id} moveCount={moveCount} />

        <section>
          <h2>{t.dailyCompleteTitle}</h2>
          <p className="complete-badge">{t.dailySolvedAll(dailyLevels.length, totalMoves)}</p>
          <p className="daily-streak">{t.dailyStreak(streak)}</p>
          <p>{t.dailyCompleteBody}</p>
          <div className="daily-complete-actions">
            <button onClick={handleShare}>{t.shareResult}</button>
            <button onClick={restart}>{t.playAgain}</button>
          </div>
          {shareCopied && <p className="share-copied">{t.shareCopiedMessage}</p>}
        </section>
      </div>
    );
  }

  return (
    <div className="daily-challenge">
      <div className="level-bar">
        <span className="level-name">{t.dailyPuzzleOf(index + 1, dailyLevels.length)}</span>
        <LevelStatusBar levelId={level.id} moveCount={moveCount} showBestKnown={false} />
      </div>

      <GameBoard
        key={level.id}
        level={level}
        onMoveCountChange={setMoveCount}
        onCompleteChange={handlePuzzleCompleteChange}
        onNext={goToNextPuzzle}
        nextLabel={t.nextPuzzle}
      />

      {complete && <LevelCompleteBadge levelId={level.id} moveCount={moveCount} />}
    </div>
  );
}
