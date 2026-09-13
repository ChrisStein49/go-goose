import { useEffect, useMemo, useState } from "react";
import { getIncompleteColors, isLevelComplete } from "../game/board";
import { generateLevelCode } from "../game/levelCode";
import { GREEN, ORANGE, PURPLE } from "../game/levels";
import { scramble } from "../game/reverseGenerator";
import { bestKnownSolutionLength, type BestKnownResult } from "../game/solver";
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

interface ScrambleState {
  cells: Cell[][];
  steps: number;
  requested: number;
}

interface ReverseEditorProps {
  onBack: () => void;
}

/**
 * Alternative level-authoring tool: instead of painting the starting board
 * directly, you paint the SOLVED target arrangement, and this generates a
 * starting puzzle by applying random "reverse moves" — each one undoes a
 * hypothetical forward push, so the result is guaranteed solvable by
 * construction (no search/verification needed to prove it, unlike the
 * paint-the-start approach in the main Level Editor).
 */
export function ReverseEditor({ onBack }: ReverseEditorProps) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [targetCells, setTargetCells] = useState<Cell[][]>(() => emptyGrid(4, 5));
  const [tool, setTool] = useState<Tool>(ORANGE);
  const [anchorMode, setAnchorMode] = useState(false);
  const [steps, setSteps] = useState(15);
  const [seed, setSeed] = useState(1);
  const [scrambled, setScrambled] = useState<ScrambleState | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [testKey, setTestKey] = useState(0);
  const [levelId, setLevelId] = useState("w-generated-1");
  const [copied, setCopied] = useState(false);
  const [bestKnown, setBestKnown] = useState<BestKnownResult | null>(null);
  const [checkingBestKnown, setCheckingBestKnown] = useState(false);

  // Applying N reverse moves only proves the puzzle is solvable in AT MOST N
  // moves — it says nothing about whether a shortcut exists. Only the real
  // solver can answer that, so check it every time a new puzzle is generated.
  useEffect(() => {
    if (!scrambled) {
      setBestKnown(null);
      setCheckingBestKnown(false);
      return;
    }
    setCheckingBestKnown(true);
    const board = scrambled.cells.map((row) => row.map((cell) => ({ ...cell })));
    const handle = setTimeout(() => {
      setBestKnown(bestKnownSolutionLength(board, { maxStates: 150_000 }));
      setCheckingBestKnown(false);
    }, 50);
    return () => clearTimeout(handle);
  }, [scrambled]);

  function resize(newRows: number, newCols: number) {
    newRows = Math.min(MAX_SIZE, Math.max(MIN_SIZE, newRows));
    newCols = Math.min(MAX_SIZE, Math.max(MIN_SIZE, newCols));
    setTargetCells((prev) =>
      Array.from({ length: newRows }, (_, r) =>
        Array.from({ length: newCols }, (_, c): Cell => prev[r]?.[c] ?? { kind: "empty" }),
      ),
    );
    setRows(newRows);
    setCols(newCols);
    setScrambled(null);
  }

  function paint(r: number, c: number) {
    const cell = cellFromTool(tool, anchorMode);
    setTargetCells((prev) => prev.map((row, ri) => (ri === r ? row.map((c2, ci) => (ci === c ? cell : c2)) : row)));
    setScrambled(null);
  }

  const incompleteColors = getIncompleteColors(targetCells);
  const targetComplete = isLevelComplete(targetCells);
  const gooseCount = targetCells.flat().filter((c) => c.kind === "goose" || c.kind === "anchor").length;

  function generate() {
    const result = scramble(targetCells, steps, seed);
    setScrambled({ cells: result.board, steps: result.steps, requested: steps });
    setSeed((s) => s + 1);
  }

  const code = useMemo(
    () => (scrambled ? generateLevelCode(scrambled.cells, levelId || "generated-level") : ""),
    [scrambled, levelId],
  );

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

  if (testMode && scrambled) {
    const testLevel: Level = { id: `reverse-test-${testKey}`, rows, cols, cells: scrambled.cells };
    return (
      <div className="level-editor">
        <button onClick={() => setTestMode(false)}>← Back to Generator</button>
        <p className="editor-hint">Test-playing the generated puzzle. This doesn't save any progress.</p>
        <GameBoard key={testLevel.id} level={testLevel} />
      </div>
    );
  }

  return (
    <div className="level-editor">
      <button onClick={onBack}>← Menu</button>
      <p className="editor-hint">
        Paint the <strong>solved</strong> arrangement below, then generate a puzzle from it by undoing
        random moves — the result is guaranteed solvable, since reversing those exact moves reconstructs
        your target.
      </p>

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
        <input type="checkbox" checked={anchorMode} onChange={(e) => setAnchorMode(e.target.checked)} />
        📌 Place as fixed anchor (can't move, but still counts for connectivity)
      </label>

      <div className="game-board editor-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {targetCells.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={["cell", cell.kind === "dead" ? "cell-dead" : "", cell.kind === "anchor" ? "cell-anchor" : ""]
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
        {gooseCount === 0 && <p>Paint the solved target to get started.</p>}
        {gooseCount > 0 && !targetComplete && (
          <p className="editor-warn">
            ⚠ {incompleteColors.length} color{incompleteColors.length === 1 ? "" : "s"} not yet connected — the
            target must be a fully solved state before generating.
          </p>
        )}
        {gooseCount > 0 && targetComplete && <p className="editor-ok">✓ Target is a valid solved state</p>}
      </div>

      <div className="editor-scramble-controls">
        <label>
          Reverse moves to apply
          <input
            type="number"
            min={1}
            max={300}
            value={steps}
            onChange={(e) => setSteps(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <button onClick={generate} disabled={!targetComplete}>
          {scrambled ? "Re-generate" : "Generate Puzzle"}
        </button>
      </div>

      {scrambled && (
        <div className="editor-generated">
          <h3>
            Generated puzzle — {scrambled.steps} reverse move{scrambled.steps === 1 ? "" : "s"} applied
            {scrambled.steps < scrambled.requested ? " (ran out of new positions before reaching the requested count)" : ""}
          </h3>

          <div className="editor-status">
            {checkingBestKnown && <p>Checking for shortcuts…</p>}
            {!checkingBestKnown && bestKnown === null && (
              <p className="editor-hint">
                Couldn't determine a best-known length within this quick check's budget — inconclusive, not
                proof there's no shortcut.
              </p>
            )}
            {!checkingBestKnown && bestKnown !== null && bestKnown.moves >= scrambled.steps && (
              <p className="editor-ok">
                ✓ No shortcut found — best known is {bestKnown.moves}
                {bestKnown.proven ? "" : "+"} moves, matching your {scrambled.steps}-move scramble.
              </p>
            )}
            {!checkingBestKnown && bestKnown !== null && bestKnown.moves < scrambled.steps && (
              <p className="editor-warn">
                ⚠ Shortcut found — this solves in as few as {bestKnown.moves}
                {bestKnown.proven ? "" : "+"} moves, even though {scrambled.steps} reverse moves were applied to
                build it. It's less scrambled than the step count suggests.
              </p>
            )}
          </div>
          <div className="game-board editor-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {scrambled.cells.map((row, r) =>
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
                >
                  {(cell.kind === "goose" || cell.kind === "anchor") && (
                    <GooseIcon color={cell.color} className="goose-icon" />
                  )}
                  {cell.kind === "anchor" && <span className="anchor-pin">📌</span>}
                </div>
              )),
            )}
          </div>

          <button onClick={startTestPlay}>Test Play</button>

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
            <p>
              Paste this into the <code>levels</code> array of a World in <code>src/game/levels.ts</code>:
            </p>
            <textarea readOnly value={code} rows={scrambled.cells.length + 4} />
            <button onClick={copyCode}>{copied ? "Copied!" : "Copy to Clipboard"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
