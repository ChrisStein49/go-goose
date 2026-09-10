export type Direction = "up" | "down" | "left" | "right";

export type Cell =
  | { kind: "empty" }
  | { kind: "dead" }
  | { kind: "goose"; color: string };

export type Board = Cell[][];

export interface Level {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cells: Cell[][];
}

export interface World {
  id: string;
  name: string;
  levels: Level[];
}
