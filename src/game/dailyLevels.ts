import { GREEN, ORANGE, PURPLE } from "./levels";
import type { Cell, Level } from "./types";

const E: Cell = { kind: "empty" };
const D: Cell = { kind: "dead" };
const goose = (color: string): Cell => ({ kind: "goose", color });
const anchor = (color: string): Cell => ({ kind: "anchor", color });
const O = () => goose(ORANGE);
const G = () => goose(GREEN);
const P = () => goose(PURPLE);
const AO = () => anchor(ORANGE);
const AG = () => anchor(GREEN);
const AP = () => anchor(PURPLE);

/**
 * First version of the "Today's Challenge" sequence: three fixed puzzles,
 * played in order, escalating in size and complexity. Not yet date-seeded —
 * every player currently gets the same three puzzles every day, until a
 * more efficient generation pipeline (e.g. motif "template" ingredients)
 * lets this rotate daily.
 */
export const dailyLevels: Level[] = [
  {
    id: "daily-1",
    rows: 4,
    cols: 4,
    cells: [
      [O(), E, D, G()],
      [E, O(), D, E],
      [E, G(), D, G()],
      [O(), E, E, G()],
    ],
  },
  {
    id: "daily-2",
    rows: 5,
    cols: 5,
    cells: [
      [E, E, D, P(), E],
      [E, AO(), D, E, E],
      [E, E, D, E, E],
      [E, O(), O(), E, P()],
      [E, E, E, E, E],
    ],
  },
  {
    id: "daily-3",
    rows: 6,
    cols: 6,
    cells: [
      [E, AO(), D, E, AG(), D],
      [E, E, D, E, E, D],
      [O(), E, D, O(), G(), D],
      [E, E, O(), E, E, E],
      [E, E, AP(), E, G(), E],
      [E, E, P(), E, E, E],
    ],
  },
];
