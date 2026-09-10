import type { Cell, World } from "./types";

const E: Cell = { kind: "empty" };
const D: Cell = { kind: "dead" };
const goose = (color: string): Cell => ({ kind: "goose", color });

export const ORANGE = "#e2791e";
export const GREEN = "#00BF63";
export const PURPLE = "#4E2996";

const O = () => goose(ORANGE);
const G = () => goose(GREEN);
const P = () => goose(PURPLE);

export const worlds: World[] = [
  {
    id: "world-1",
    name: "Meadow",
    levels: [
      {
        id: "w1-l1",
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
        rows: 4,
        cols: 5,
        cells: [
          [G(), G(), E, O(), G()],
          [E, O(), E, O(), E],
          [E, P(), O(), G(), P()],
          [E, O(), P(), E, O()],
        ],
      },
      {
        id: "w2-l2",
        rows: 4,
        cols: 5,
        cells: [
          [E, G(), G(), E, O()],
          [E, E, G(), O(), E],
          [E, E, E, E, P()],
          [E, P(), P(), O(), E],
        ],
      },
      {
        id: "w2-l3",
        rows: 4,
        cols: 6,
        cells: [
          [G(), O(), O(), O(), E, E],
          [G(), E, G(), E, E, E],
          [E, E, E, E, E, G()],
          [P(), P(), E, E, P(), E],
        ],
      },
      {
        id: "w2-l4",
        rows: 4,
        cols: 6,
        cells: [
          [G(), O(), E, E, E, O()],
          [G(), G(), E, E, E, E],
          [P(), E, E, E, E, G()],
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
        rows: 4,
        cols: 5,
        cells: [
          [G(), G(), E, O(), G()],
          [E, O(), D, O(), E],
          [E, P(), E, G(), P()],
          [D, O(), E, E, O()],
        ],
      },
      {
        id: "w3-l2",
        rows: 4,
        cols: 5,
        cells: [
          [E, E, O(), G(), E],
          [E, G(), D, P(), E],
          [G(), O(), E, E, P()],
          [D, O(), E, E, P()],
        ],
      },
      {
        id: "w3-l3",
        rows: 4,
        cols: 5,
        cells: [
          [E, G(), D, O(), O()],
          [E, E, E, G(), G()],
          [D, P(), P(), E, P()],
          [E, E, E, D, O()],
        ],
      },
      {
        id: "w3-l4",
        rows: 4,
        cols: 5,
        cells: [
          [G(), G(), D, O(), E],
          [E, G(), O(), E, E],
          [D, E, O(), E, E],
          [E, P(), P(), D, P()],
        ],
      },
    ],
  },
];

export const allLevels = worlds.flatMap((world) => world.levels);

/** "Level N", numbered by position within its own world (1-based). */
export function levelDisplayName(levelId: string): string {
  for (const world of worlds) {
    const index = world.levels.findIndex((level) => level.id === levelId);
    if (index !== -1) return `Level ${index + 1}`;
  }
  return levelId;
}
