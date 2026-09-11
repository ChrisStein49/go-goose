export type Direction = "up" | "down" | "left" | "right";

export type Cell =
  | { kind: "empty" }
  | { kind: "dead" }
  | { kind: "goose"; color: string }
  // A permanently placed goose: counts toward its color's connectivity
  // requirement like a normal goose, but can never be pushed and blocks
  // movement like a dead cell (other geese slide up to it and stop, same
  // as they would at the board edge).
  | { kind: "anchor"; color: string };

export type Board = Cell[][];

export interface Level {
  id: string;
  rows: number;
  cols: number;
  cells: Cell[][];
}

export interface World {
  id: string;
  name: string;
  levels: Level[];
}
