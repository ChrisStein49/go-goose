import { useEffect, useMemo, useState } from "react";
import { getIncompleteColors, isLevelComplete } from "../game/board";
import { generateLevelCode } from "../game/levelCode";
import { GREEN, ORANGE, PURPLE } from "../game/levels";
import { isSolvable } from "../game/solver";
import type { Cell, Level } from "../game/types";
import { GameBoard } from "./GameBoard";
import { GooseIcon } from "./GooseIcon";

const MIN_SIZE = 2;
const MAX_SIZE = 8;

type Tool = "empty" | "dead" | string;

const TOOLS: { tool: Tool; label: string }[] = [
  { tool: "empty", label: "Empty" },
  { tool: "dead", label: "Blocked" },
  { tool: ORANGE, label: "Orange" },
  { tool: GREEN, label: "Green" },
  { tool: PURPLE, label: "Purple" },
];

function emptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, (): Cell => ({ kind: "empty" })));
}

function cellFromTool(tool: Tool, anchorMode: boolean): Cell {
  if (tool === "empty") return { kind: "empty" };
  if (tool === "dead") return { kind: "dead" };
  return anchorMode ? { kind: "anchor", color: tool } : { kind: "goose", color: tool };
}

interface LevelEditorProps {
  onBack: () => void;
}

export function LevelEditor({ onBack }: LevelEditorProps) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [cells, setCells] = useState<Cell[][]>(() => emptyGrid(4, 5));
  const [tool, setTool] = useState<Tool>(ORANGE);
  const [anchorMode, setAnchorMode] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [testKey, setTestKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [levelId, setLevelId] = useState("w4-l1");

  function resize(newRows: number, newCols: number) {
    newRows = Math.min(MAX_SIZE, Math.max(MIN_SIZE, newRows));
    newCols = Math.min(MAX_SIZE, Math.max(MIN_SIZE, newCols));
    setCells((prev) =>
      Array.from({ length: newRows }, (_, r) =>
        Array.from({ length: newCols }, (_, c): Cell => prev[r]?.[c] ?? { kind: "empty" }),
      ),
    );
    setRows(newRows);
    setCols(newCols);
  }

  function paint(r: number, c: number) {
    const cell = cellFromTool(tool, anchorMode);
    setCells((prev) => prev.map((row, ri) => (ri === r ? row.map((c2, ci) => (ci === c ? cell : c2)) : row)));
  }

  const incompleteColors = getIncompleteColors(cells);
  const complete = isLevelComplete(cells);
  const gooseCount = cells.flat().filter((c) => c.kind === "goose" || c.kind === "anchor").length;

  const [solvable, setSolvable] = useState(true);
  const [checking, setChecking] = useState(false);

  // Debounced: the check below is now exhaustive (exact, not just a
  // heuristic guess), which can take a couple of seconds on a busy board —
  // running it on every single click would make painting feel laggy.
  useEffect(() => {
    if (gooseCount === 0 || complete) {
      setChecking(false);
      setSolvable(true);
      return;
    }
    setChecking(true);
    const board = cells.map((row) => row.map((cell) => ({ ...cell })));
    const handle = setTimeout(() => {
      setSolvable(isSolvable(board, { maxStates: 60_000, restarts: 15, maxSteps: 250 }));
      setChecking(false);
    }, 400);
    return () => clearTimeout(handle);
  }, [cells, complete, gooseCount]);

  const code = useMemo(() => generateLevelCode(cells, levelId || "custom-level"), [cells, levelId]);

  function startTestPlay() {
    setTestKey((k) => k + 1);
    setTestMode(true);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; the textarea below still lets you select + copy manually
    }
  }

  const testLevel: Level = { id: `editor-test-${testKey}`, rows, cols, cells };

  if (testMode) {
    return (
      <div className="level-editor">
        <button onClick={() => setTestMode(false)}>← Back to Editing</button>
        <p className="editor-hint">Test-playing your level. This doesn't save any progress.</p>
        <GameBoard key={testLevel.id} level={testLevel} />
      </div>
    );
  }

  return (
    <div className="level-editor">
      <button onClick={onBack}>← Menu</button>

      <div className="editor-size-controls">
        <label>
          Rows
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={rows}
            onChange={(e) => resize(Number(e.target.value) || MIN_SIZE, cols)}
          />
        </label>
        <label>
          Cols
          <input
            type="number"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={cols}
            onChange={(e) => resize(rows, Number(e.target.value) || MIN_SIZE)}
          />
        </label>
      </div>

      <div className="editor-tools">
        {TOOLS.map(({ tool: t, label }) => (
          <button
            key={label}
            className={["tool-button", tool === t ? "tool-active" : ""].filter(Boolean).join(" ")}
            style={t !== "empty" && t !== "dead" ? { background: t } : undefined}
            onClick={() => setTool(t)}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="editor-anchor-toggle">
        <input
          type="checkbox"
          checked={anchorMode}
          onChange={(e) => setAnchorMode(e.target.checked)}
        />
        📌 Place as fixed anchor (can't move, but still counts for connectivity)
      </label>

      <div className="game-board editor-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={[
                "cell",
                cell.kind === "dead" ? "cell-dead" : "",
                cell.kind === "anchor" ? "cell-anchor" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => paint(r, c)}
            >
              {(cell.kind === "goose" || cell.kind === "anchor") && (
                <GooseIcon color={cell.color} className="goose-icon" />
              )}
              {cell.kind === "anchor" && <span className="anchor-pin">📌</span>}
            </div>
          )),
        )}
      </div>

      <div className="editor-status">
        {gooseCount === 0 && <p>Paint some geese to get started.</p>}
        {gooseCount > 0 && complete && <p className="editor-ok">✓ Already a valid finished state</p>}
        {gooseCount > 0 && !complete && (
          <p>
            {incompleteColors.length} color{incompleteColors.length === 1 ? "" : "s"} not yet connected —{" "}
            {checking ? (
              <span>checking…</span>
            ) : solvable ? (
              <span className="editor-ok">✓ solvable</span>
            ) : (
              <span className="editor-warn">⚠ not solvable — or too complex for this quick check</span>
            )}
          </p>
        )}
        {gooseCount > 0 && !complete && !checking && !solvable && (
          <p className="editor-hint">
            For a very busy board this quick check can time out inconclusive rather than prove it's
            unsolvable — <code>npx vitest run src/game/levels.test.ts</code> uses a much larger search
            budget and is the authoritative check once you've pasted a level into levels.ts.
          </p>
        )}
      </div>

      <button onClick={startTestPlay} disabled={gooseCount === 0}>
        Test Play
      </button>

      <div className="editor-export">
        <h3>Export</h3>
        <label className="editor-id-label">
          Level ID (must be unique across every level)
          <input
            type="text"
            value={levelId}
            onChange={(e) => setLevelId(e.target.value)}
            placeholder="e.g. w4-l1"
          />
        </label>
        <p>Paste this into the <code>levels</code> array of a World in <code>src/game/levels.ts</code>:</p>
        <textarea readOnly value={code} rows={cells.length + 4} />
        <button onClick={copyCode}>{copied ? "Copied!" : "Copy to Clipboard"}</button>
      </div>
    </div>
  );
}
