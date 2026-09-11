import { GREEN, ORANGE, PURPLE } from "./levels";
import type { Cell } from "./types";

function cellCode(cell: Cell): string {
  if (cell.kind === "empty") return "E";
  if (cell.kind === "dead") return "D";
  if (cell.kind === "anchor") {
    if (cell.color === ORANGE) return "AO()";
    if (cell.color === GREEN) return "AG()";
    if (cell.color === PURPLE) return "AP()";
    return `anchor(${JSON.stringify(cell.color)})`;
  }
  if (cell.color === ORANGE) return "O()";
  if (cell.color === GREEN) return "G()";
  if (cell.color === PURPLE) return "P()";
  return `goose(${JSON.stringify(cell.color)})`;
}

/** Generates a levels.ts-style object literal for this board, ready to paste into a World's `levels` array. */
export function generateLevelCode(cells: Cell[][], id = "custom-level"): string {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const rowLines = cells
    .map((row) => `      [${row.map(cellCode).join(", ")}],`)
    .join("\n");

  return `{
  id: ${JSON.stringify(id)},
  rows: ${rows},
  cols: ${cols},
  cells: [
${rowLines}
  ],
},`;
}
