import { useEffect, useRef, useState } from "react";
import { boardFromLevel, getIncompleteColors, isLevelComplete, pushGoose } from "../game/board";
import type { Board, Direction, Level } from "../game/types";
import { GooseIcon } from "./GooseIcon";

const SWIPE_THRESHOLD = 24;

interface GameBoardProps {
  level: Level;
  onMoveCountChange?: (count: number) => void;
  onCompleteChange?: (complete: boolean) => void;
}

export function GameBoard({ level, onMoveCountChange, onCompleteChange }: GameBoardProps) {
  const [board, setBoard] = useState<Board>(() => boardFromLevel(level));
  const [history, setHistory] = useState<Board[]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const dragRef = useRef<{
    row: number;
    col: number;
    startX: number;
    startY: number;
    fired: boolean;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    setBoard(boardFromLevel(level));
    setHistory([]);
    setSelected(null);
  }, [level]);

  const incompleteColors = new Set(getIncompleteColors(board));
  const complete = isLevelComplete(board);

  useEffect(() => {
    onMoveCountChange?.(history.length);
  }, [history.length, onMoveCountChange]);

  useEffect(() => {
    onCompleteChange?.(complete);
  }, [complete, onCompleteChange]);

  function applyPush(row: number, col: number, direction: Direction) {
    const result = pushGoose(board, row, col, direction);
    if (!result.moved) return;
    setHistory((h) => [...h, board]);
    setBoard(result.board);
    setSelected(null);
  }

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setBoard(prev);
      return h.slice(0, -1);
    });
    setSelected(null);
  }

  function reset() {
    setBoard(boardFromLevel(level));
    setHistory([]);
    setSelected(null);
  }

  function handlePointerDown(e: React.PointerEvent, row: number, col: number) {
    if (board[row][col].kind !== "goose") return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = {
      row,
      col,
      startX: e.clientX,
      startY: e.clientY,
      fired: false,
      pointerId: e.pointerId,
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || drag.fired) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

    const direction: Direction =
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    drag.fired = true;
    applyPush(drag.row, drag.col, direction);
  }

  function handlePointerUp(e: React.PointerEvent, row: number, col: number) {
    const drag = dragRef.current;
    if (drag && drag.pointerId === e.pointerId && !drag.fired) {
      setSelected((sel) => (sel && sel[0] === row && sel[1] === col ? null : [row, col]));
    }
    dragRef.current = null;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!selected) return;
    const map: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const direction = map[e.key];
    if (!direction) return;
    e.preventDefault();
    applyPush(selected[0], selected[1], direction);
  }

  return (
    <div className="game-board-wrapper">
      <div
        className="game-board"
        style={{ gridTemplateColumns: `repeat(${level.cols}, 1fr)` }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {board.map((rowCells, r) =>
          rowCells.map((cell, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isDead = cell.kind === "dead";
            const isGoose = cell.kind === "goose";
            const isAnchor = cell.kind === "anchor";
            const isDone = (isGoose || isAnchor) && !incompleteColors.has(cell.color);
            return (
              <div
                key={`${r}-${c}`}
                className={[
                  "cell",
                  isDead ? "cell-dead" : "",
                  isGoose ? "cell-goose" : "",
                  isAnchor ? "cell-anchor" : "",
                  isSelected ? "cell-selected" : "",
                  isDone ? "cell-done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onPointerDown={(e) => handlePointerDown(e, r, c)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, r, c)}
              >
                {(isGoose || isAnchor) && <GooseIcon color={cell.color} className="goose-icon" />}
                {isAnchor && <span className="anchor-pin">📌</span>}
              </div>
            );
          }),
        )}
      </div>
      <div className="board-controls">
        <button onClick={undo} disabled={history.length === 0}>
          Undo
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
