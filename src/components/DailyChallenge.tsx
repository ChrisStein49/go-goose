import { useMemo, useRef, useState } from "react";
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
  // Final move count per puzzle, by position. Written by index (not added up), because
  // GameBoard re-reports "complete" on every render and the last board stays on screen.
  const [movesByPuzzle, setMovesByPuzzle] = useState<number[]>([]);
  const [shareCopied, setShareCopied] = useState(false);
  const completionReported = useRef(false);

  const level = dailyLevels[index];
  const isLastPuzzle = index === dailyLevels.length - 1;
  const finished = complete && isLastPuzzle;
  const totalMoves = movesByPuzzle.reduce((sum, moves) => sum + moves, 0);
  const puzzleResults = movesByPuzzle.map((moves, i) => isOptimal(dailyLevels[i].id, moves));

  function recordMoves(puzzleIndex: number, moves: number) {
    setMovesByPuzzle((prev) => {
      if (prev[puzzleIndex] === moves) return prev;
      const next = [...prev];
      next[puzzleIndex] = moves;
      return next;
    });
  }

  function handlePuzzleCompleteChange(isComplete: boolean, moves: number) {
    setComplete(isComplete);
    if (isComplete && isLastPuzzle) {
      recordMoves(index, moves);
      if (!completionReported.current) {
        completionReported.current = true;
        onComplete();
      }
    }
  }

  function goToNextPuzzle() {
    recordMoves(index, moveCount);
    setIndex((i) => i + 1);
    setMoveCount(0);
    setComplete(false);
  }

  function restart() {
    setIndex(0);
    setMoveCount(0);
    setComplete(false);
    setMovesByPuzzle([]);
    completionReported.current = false;
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

  return (
    <div className="daily-challenge">
      <div className="level-bar">
        <span className="level-name">{t.dailyPuzzleOf(index + 1, dailyLevels.length)}</span>
        <LevelStatusBar levelId={level.id} moveCount={moveCount} showBestKnown={false} />
      </div>

      {/* The solved board stays visible after the last puzzle too, with the summary below it. */}
      <GameBoard
        key={level.id}
        level={level}
        onMoveCountChange={setMoveCount}
        onCompleteChange={handlePuzzleCompleteChange}
        onNext={isLastPuzzle ? undefined : goToNextPuzzle}
        nextLabel={t.nextPuzzle}
      />

      {complete && <LevelCompleteBadge levelId={level.id} moveCount={moveCount} />}

      {finished && (
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
      )}
    </div>
  );
}
