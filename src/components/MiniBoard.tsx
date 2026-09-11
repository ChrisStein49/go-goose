import type { Cell } from "../game/types";
import { GooseIcon } from "./GooseIcon";

interface MiniBoardProps {
  cells: Cell[][];
  caption?: string;
}

/** Small, non-interactive board used to illustrate rules in How to Play. */
export function MiniBoard({ cells, caption }: MiniBoardProps) {
  const cols = cells[0]?.length ?? 0;
  return (
    <figure className="mini-board-figure">
      <div className="mini-board" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={[
                "mini-cell",
                cell.kind === "dead" ? "mini-cell-dead" : "",
                cell.kind === "anchor" ? "mini-cell-anchor" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {(cell.kind === "goose" || cell.kind === "anchor") && (
                <GooseIcon color={cell.color} className="mini-goose-icon" />
              )}
              {cell.kind === "anchor" && <span className="mini-anchor-pin">📌</span>}
            </div>
          )),
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
