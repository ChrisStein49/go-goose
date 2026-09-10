import { bestMoves } from "../game/bestMoves.generated";

interface LevelStatusBarProps {
  levelId: string;
  moveCount: number;
  complete: boolean;
}

export function LevelStatusBar({ levelId, moveCount, complete }: LevelStatusBarProps) {
  const best = bestMoves[levelId];

  return (
    <div className="status-bar">
      <span>Moves: {moveCount}</span>
      {best && (
        <span className="best-known">
          Best known: {best.moves}
          {best.proven ? "" : "+"}
        </span>
      )}
      {complete && <StatusMessage moveCount={moveCount} best={best} />}
    </div>
  );
}

function StatusMessage({
  moveCount,
  best,
}: {
  moveCount: number;
  best: { moves: number; proven: boolean } | undefined;
}) {
  if (!best) return <span className="complete-badge">Level complete!</span>;

  if (moveCount < best.moves) {
    return (
      <span className="complete-badge new-record">
        🏆 New record! Beat the best known score ({best.moves}) with {moveCount}.
      </span>
    );
  }
  if (moveCount === best.moves) {
    return <span className="complete-badge">🏆 Matched the best known score!</span>;
  }
  return (
    <span className="complete-badge">
      Level complete! Best known: {best.moves}
      {best.proven ? "" : "+"} — try again to beat it.
    </span>
  );
}
