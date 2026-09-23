import { useEffect, useMemo, useState } from "react";
import { DELTA, getIncompleteColors, isLevelComplete } from "../game/board";
import { generateLevelCode } from "../game/levelCode";
import { GREEN, ORANGE, PURPLE } from "../game/levels";
import { applyReverseMove, findReverseChains, scramble, type ReverseChain } from "../game/reverseGenerator";
import { bestKnownSolutionLength, type BestKnownResult } from "../game/solver";
import type { Cell, Direction, Level } from "../game/types";
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

// Arrow shown for a candidate's reverse shift, which travels opposite the
// direction it's currently blocked in (e.g. blocked "up" means it arrived by
// being pushed up, so reversing it slides it back down).
const REVERSE_ARROW: Record<Direction, string> = { up: "↓", down: "↑", left: "→", right: "←" };

function emptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, (): Cell => ({ kind: "empty" })));
}

function cloneCells(cells: Cell[][]): Cell[][] {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

function cellFromTool(tool: Tool, anchorMode: boolean): Cell {
  if (tool === "empty") return { kind: "empty" };
  if (tool === "dead") return { kind: "dead" };
  return anchorMode ? { kind: "anchor", color: tool } : { kind: "goose", color: tool };
}

function renderPuzzleGrid(
  cells: Cell[][],
  cols: number,
  cellClassName?: (row: number, col: number, cell: Cell) => string,
) {
  return (
    <div className="game-board editor-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {cells.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={[
              "cell",
              cell.kind === "dead" ? "cell-dead" : "",
              cell.kind === "anchor" ? "cell-anchor" : "",
              cellClassName?.(r, c, cell) ?? "",
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
  );
}

interface ScrambleState {
  cells: Cell[][];
  steps: number;
  requested: number;
}

interface PuzzleResultPanelProps {
  title: string;
  cells: Cell[][];
  cols: number;
  steps: number;
  note?: string;
  defaultLevelId: string;
  onTestPlay: (cells: Cell[][]) => void;
  /** When false, the shortcut check only runs when the user clicks a button, instead of automatically after every change — useful while stepping through moves one at a time, where re-solving after each one gets disruptive. Defaults to true. */
  autoCheck?: boolean;
}

/** Shows a generated/built puzzle's board, shortcut check, Test Play button, and Export panel. Self-contained so the auto and manual flows can each have their own independently. */
function PuzzleResultPanel({
  title,
  cells,
  cols,
  steps,
  note,
  defaultLevelId,
  onTestPlay,
  autoCheck = true,
}: PuzzleResultPanelProps) {
  const [levelId, setLevelId] = useState(defaultLevelId);
  const [copied, setCopied] = useState(false);
  const [bestKnown, setBestKnown] = useState<BestKnownResult | null>(null);
  const [checkingBestKnown, setCheckingBestKnown] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  function runShortcutCheck() {
    setCheckingBestKnown(true);
    const board = cloneCells(cells);
    const handle = setTimeout(() => {
      setBestKnown(bestKnownSolutionLength(board, { maxStates: 150_000 }));
      setCheckingBestKnown(false);
      setHasChecked(true);
    }, 50);
    return () => clearTimeout(handle);
  }

  // Applying N reverse moves only proves the puzzle is solvable in AT MOST N
  // moves — it says nothing about whether a shortcut exists. Only the real
  // solver can answer that. With autoCheck on, check it every time the
  // puzzle changes; otherwise just clear any stale result from a previous
  // board and wait for the user to ask for it explicitly.
  useEffect(() => {
    if (!autoCheck) {
      setBestKnown(null);
      setCheckingBestKnown(false);
      setHasChecked(false);
      return;
    }
    return runShortcutCheck();
  }, [cells, autoCheck]);

  const code = useMemo(() => generateLevelCode(cells, levelId || "generated-level"), [cells, levelId]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable; the textarea below still lets you select + copy manually
    }
  }

  return (
    <div className="editor-generated">
      <h3>
        {title} — {steps} reverse move{steps === 1 ? "" : "s"} applied
        {note ? ` (${note})` : ""}
      </h3>

      <div className="editor-status">
        {!autoCheck && !checkingBestKnown && (
          <button onClick={runShortcutCheck}>{hasChecked ? "Re-check for Shortcuts" : "Check for Shortcuts"}</button>
        )}
        {checkingBestKnown && <p>Checking for shortcuts…</p>}
        {!checkingBestKnown && hasChecked && bestKnown === null && (
          <p className="editor-hint">
            Couldn't determine a best-known length within this quick check's budget — inconclusive, not proof
            there's no shortcut.
          </p>
        )}
        {!checkingBestKnown && bestKnown !== null && bestKnown.moves >= steps && (
          <p className="editor-ok">
            ✓ No shortcut found — best known is {bestKnown.moves}
            {bestKnown.proven ? "" : "+"} moves, matching your {steps}-move scramble.
          </p>
        )}
        {!checkingBestKnown && bestKnown !== null && bestKnown.moves < steps && (
          <p className="editor-warn">
            ⚠ Shortcut found — this solves in as few as {bestKnown.moves}
            {bestKnown.proven ? "" : "+"} moves, even though {steps} reverse moves were applied to build it. It's
            less scrambled than the step count suggests.
          </p>
        )}
      </div>

      {renderPuzzleGrid(cells, cols)}

      <button onClick={() => onTestPlay(cells)}>Test Play</button>

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
        <textarea readOnly value={code} rows={cells.length + 4} />
        <button onClick={copyCode}>{copied ? "Copied!" : "Copy to Clipboard"}</button>
      </div>
    </div>
  );
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
 * paint-the-start approach in the main Level Editor). A manual step-by-step
 * mode lets you pick each reverse move yourself instead of relying on the
 * random generator, so you can compare what you'd deliberately build against
 * what the random generator comes up with.
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
  const [testPlay, setTestPlay] = useState<{ cells: Cell[][]; key: number } | null>(null);

  const [manualCells, setManualCells] = useState<Cell[][] | null>(null);
  const [manualHistory, setManualHistory] = useState<Cell[][][]>([]);
  const [manualPreview, setManualPreview] = useState<{
    cells: [number, number][];
    dest: [number, number][];
  } | null>(null);

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
    setManualCells(null);
    setManualHistory([]);
  }

  function paint(r: number, c: number) {
    const cell = cellFromTool(tool, anchorMode);
    setTargetCells((prev) => prev.map((row, ri) => (ri === r ? row.map((c2, ci) => (ci === c ? cell : c2)) : row)));
    setScrambled(null);
    setManualCells(null);
    setManualHistory([]);
  }

  const incompleteColors = getIncompleteColors(targetCells);
  const targetComplete = isLevelComplete(targetCells);
  const gooseCount = targetCells.flat().filter((c) => c.kind === "goose" || c.kind === "anchor").length;

  function generate() {
    const result = scramble(targetCells, steps, seed);
    setScrambled({ cells: result.board, steps: result.steps, requested: steps });
    setSeed((s) => s + 1);
  }

  function startManual(from: Cell[][]) {
    setManualCells(cloneCells(from));
    setManualHistory([]);
    setManualPreview(null);
  }

  function applyManualMove(chain: ReverseChain, shift: number) {
    if (!manualCells) return;
    const next = applyReverseMove(manualCells, chain, shift);
    setManualHistory((h) => [...h, manualCells]);
    setManualCells(next);
    setManualPreview(null);
  }

  function undoManual() {
    setManualHistory((h) => {
      if (h.length === 0) return h;
      setManualCells(h[h.length - 1]);
      return h.slice(0, -1);
    });
    setManualPreview(null);
  }

  function resetManual() {
    setManualCells(cloneCells(targetCells));
    setManualHistory([]);
    setManualPreview(null);
  }

  function exitManual() {
    setManualCells(null);
    setManualHistory([]);
    setManualPreview(null);
  }

  const manualCandidates = useMemo(() => (manualCells ? findReverseChains(manualCells) : []), [manualCells]);

  function previewFor(chain: ReverseChain, shift: number) {
    const [dr, dc] = DELTA[chain.blockedDirection];
    return {
      cells: chain.cells,
      dest: chain.cells.map(([r, c]) => [r - dr * shift, c - dc * shift] as [number, number]),
    };
  }

  if (testPlay) {
    const testLevel: Level = { id: `reverse-test-${testPlay.key}`, rows, cols, cells: testPlay.cells };
    return (
      <div className="level-editor">
        <button onClick={() => setTestPlay(null)}>← Back to Generator</button>
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
        <PuzzleResultPanel
          title="Auto-generated puzzle"
          cells={scrambled.cells}
          cols={cols}
          steps={scrambled.steps}
          note={
            scrambled.steps < scrambled.requested
              ? "ran out of new positions before reaching the requested count"
              : undefined
          }
          defaultLevelId="w-generated-1"
          onTestPlay={(cells) => setTestPlay((p) => ({ cells, key: (p?.key ?? 0) + 1 }))}
        />
      )}

      <div className="editor-generated">
        <h3>Manual step-by-step</h3>
        <p className="editor-hint">
          Pick each reverse move yourself instead of leaving it to the random generator — useful for comparing
          against what the auto-generate button comes up with, or for deliberately scattering a flock further
          than it does.
        </p>

        {!manualCells && (
          <div className="manual-controls">
            <button onClick={() => startManual(targetCells)} disabled={!targetComplete}>
              Start from Target
            </button>
            {scrambled && (
              <button onClick={() => startManual(scrambled.cells)}>Start from Auto-generated Result</button>
            )}
          </div>
        )}

        {manualCells && (
          <>
            <div className="manual-controls">
              <span className="manual-steps">
                {manualHistory.length} step{manualHistory.length === 1 ? "" : "s"} applied
              </span>
              <button onClick={undoManual} disabled={manualHistory.length === 0}>
                Undo
              </button>
              <button onClick={resetManual}>Reset to Target</button>
              <button onClick={exitManual}>Exit Manual Mode</button>
            </div>

            {renderPuzzleGrid(manualCells, cols, (r, c) => {
              const isSource = manualPreview?.cells.some(([pr, pc]) => pr === r && pc === c) ?? false;
              const isDest = manualPreview?.dest.some(([pr, pc]) => pr === r && pc === c) ?? false;
              return [isSource ? "cell-reverse-source" : "", isDest ? "cell-reverse-dest" : ""]
                .filter(Boolean)
                .join(" ");
            })}

            <p className="editor-hint">
              {manualCandidates.length === 0
                ? "No further reverse moves available from here."
                : "Every piece or chain currently blocked in some direction could have just arrived via a push in that direction — pick one below and how far back to shift it. Hover a number to preview where it lands."}
            </p>

            {manualCandidates.length > 0 && (
              <div className="reverse-candidate-list">
                {manualCandidates.map((chain, i) => (
                  <div
                    key={i}
                    className="reverse-candidate"
                    onMouseEnter={() => setManualPreview(previewFor(chain, chain.maxShift))}
                    onMouseLeave={() => setManualPreview(null)}
                  >
                    <span className="reverse-candidate-cells">
                      {chain.cells.map(([r, c], idx) => {
                        const cell = manualCells[r][c];
                        return cell.kind === "goose" ? (
                          <span key={idx} className="reverse-candidate-icon">
                            <GooseIcon color={cell.color} className="reverse-candidate-goose" />
                          </span>
                        ) : null;
                      })}
                    </span>
                    <span className="reverse-candidate-arrow">{REVERSE_ARROW[chain.blockedDirection]}</span>
                    <span className="reverse-candidate-shifts">
                      {Array.from({ length: chain.maxShift }, (_, k) => k + 1).map((shift) => (
                        <button
                          key={shift}
                          title={`Shift ${shift} cell${shift === 1 ? "" : "s"} back`}
                          onMouseEnter={() => setManualPreview(previewFor(chain, shift))}
                          onMouseLeave={() => setManualPreview(null)}
                          onClick={() => applyManualMove(chain, shift)}
                        >
                          {shift}
                        </button>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {manualHistory.length > 0 && (
              <PuzzleResultPanel
                title="Manually-built puzzle"
                cells={manualCells}
                cols={cols}
                steps={manualHistory.length}
                defaultLevelId="w-generated-1-manual"
                onTestPlay={(cells) => setTestPlay((p) => ({ cells, key: (p?.key ?? 0) + 1 }))}
                autoCheck={false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
