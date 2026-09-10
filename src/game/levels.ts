import type { Cell, World } from "./types";

const E: Cell = { kind: "empty" };
const D: Cell = { kind: "dead" };
const goose = (color: string): Cell => ({ kind: "goose", color });

export const ORANGE = "#e2791e";
export const BLUE = "#1f6fb0";
export const PINK = "#e0509c";

const O = () => goose(ORANGE);
const B = () => goose(BLUE);
const P = () => goose(PINK);

export const worlds: World[] = [
  {
    id: "world-1",
    name: "Meadow",
    levels: [
      {
        id: "w1-l1",
        name: "First Steps",
        rows: 4,
        cols: 4,
        cells: [
          [O(), E, E, E],
          [E, O(), O(), E],
          [O(), E, O(), E],
          [E, E, E, E],
        ],
      },
      {
        id: "w1-l2",
        name: "Spread Out",
        rows: 4,
        cols: 4,
        cells: [
          [O(), O(), E, O()],
          [E, E, E, E],
          [O(), E, E, E],
          [E, E, O(), E],
        ],
      },
      {
        id: "w1-l3",
        name: "Wide Field",
        rows: 4,
        cols: 5,
        cells: [
          [E, E, O(), O(), O()],
          [E, E, E, E, E],
          [E, E, E, E, E],
          [O(), O(), O(), E, E],
        ],
      },
      {
        id: "w1-l4",
        name: "Big Flock",
        rows: 5,
        cols: 5,
        cells: [
          [E, E, O(), O(), O()],
          [E, E, E, E, E],
          [E, E, E, E, E],
          [E, O(), E, E, E],
          [O(), E, E, O(), O()],
        ],
      },
    ],
  },
  {
    id: "world-2",
    name: "Flocks",
    levels: [
      {
        id: "w2-l1",
        name: "Three Flocks",
        rows: 4,
        cols: 5,
        cells: [
          [B(), B(), E, O(), B()],
          [E, O(), E, O(), E],
          [E, P(), O(), B(), P()],
          [E, O(), P(), E, O()],
        ],
      },
      {
        id: "w2-l2",
        name: "Mixed Meadow",
        rows: 4,
        cols: 5,
        cells: [
          [E, B(), B(), E, O()],
          [E, E, B(), O(), E],
          [E, E, E, E, P()],
          [E, P(), P(), O(), E],
        ],
      },
      {
        id: "w2-l3",
        name: "Long Pond",
        rows: 4,
        cols: 6,
        cells: [
          [B(), O(), O(), O(), E, E],
          [B(), E, B(), E, E, E],
          [E, E, E, E, E, B()],
          [P(), P(), E, E, P(), E],
        ],
      },
      {
        id: "w2-l4",
        name: "Scattered Flocks",
        rows: 4,
        cols: 6,
        cells: [
          [B(), O(), E, E, E, O()],
          [B(), B(), E, E, E, E],
          [P(), E, E, E, E, B()],
          [E, E, P(), P(), O(), E],
        ],
      },
    ],
  },
  {
    id: "world-3",
    name: "Thickets",
    levels: [
      {
        id: "w3-l1",
        name: "Blocked Paths",
        rows: 4,
        cols: 5,
        cells: [
          [B(), B(), E, O(), B()],
          [E, O(), D, O(), E],
          [E, P(), E, B(), P()],
          [D, O(), E, E, O()],
        ],
      },
      {
        id: "w3-l2",
        name: "Narrow Gaps",
        rows: 4,
        cols: 5,
        cells: [
          [E, E, O(), B(), E],
          [E, B(), D, P(), E],
          [B(), O(), E, E, P()],
          [D, O(), E, E, P()],
        ],
      },
      {
        id: "w3-l3",
        name: "Split Pond",
        rows: 4,
        cols: 5,
        cells: [
          [E, B(), D, O(), O()],
          [E, E, E, B(), B()],
          [D, P(), P(), E, P()],
          [E, E, E, D, O()],
        ],
      },
      {
        id: "w3-l4",
        name: "Deep Thicket",
        rows: 4,
        cols: 5,
        cells: [
          [B(), B(), D, O(), E],
          [E, B(), O(), E, E],
          [D, E, O(), E, E],
          [E, P(), P(), D, P()],
        ],
      },
    ],
  },
];

export const allLevels = worlds.flatMap((world) => world.levels);
