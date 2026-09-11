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
    id: "world-001",
    name: "Start",
    levels: [
      {
        id: "world-001-1",
        rows: 3,
        cols: 3,
        cells: [
          [O(), E, E],
          [E, O(), O()],
          [O(), E, E],
        ],
      },
      {
 	id: "world-001-2",
 	rows: 3,
  	cols: 3,
  	cells: [
         [O(), E, O()],
         [E, O(), E],
         [O(), E, E],
       ],
      },
  {
  id: "world-001-3",
  rows: 3,
  cols: 4,
  cells: [
      [O(), E, O(), E],
      [E, O(), E, E],
      [O(), E, O(), O()],
  ],
},

{
  id: "world-001-4",
  rows: 4,
  cols: 4,
  cells: [
      [O(), E, O(), O()],
      [O(), E, E, E],
      [O(), E, O(), O()],
      [E, O(), E, E],
  ],
},	

{
  id: "world-001-5",
  rows: 4,
  cols: 5,
  cells: [
      [O(), E, O(), E, E],
      [O(), O(), O(), E, O()],
      [E, O(), E, E, O()],
      [E, E, E, O(), E],
  ],
},
],

},

    {
    id: "world-002",
    name: "Lawn",
    levels: [
{
  id: "world-002-1",
  rows: 2,
  cols: 3,
  cells: [
      [E, P(), O()],
      [P(), O(), E],
  ],
},
{
  id: "world-002-2",
  rows: 3,
  cols: 3,
  cells: [
      [E, P(), O()],
      [P(), O(), E],
      [O(), E, O()],
  ],
},
{
  id: "world-002-3",
  rows: 3,
  cols: 3,
  cells: [
      [O(), P(), O()],
      [P(), O(), E],
      [E, E, O()],
  ],
},
{
  id: "world-002-4",
  rows: 3,
  cols: 3,
  cells: [
      [P(), P(), O()],
      [O(), O(), P()],
      [P(), E, O()],
  ],
},	
{
  id: "world-002-5",
  rows: 4,
  cols: 4,
  cells: [
      [E, P(), O(), O()],
      [O(), E, P(), P()],
      [P(), E, O(), E],
      [E, P(), P(), O()],
  ],
},

],
},

  {
    id: "world-003",
    name: "Roadblocks",
    levels: [
{
  id: "world-003-1",
  rows: 3,
  cols: 3,
  cells: [
      [O(), E, D],
      [E, D, O()],
      [O(), O(), E],
  ],
},
{
  id: "world-003-2",
  rows: 3,
  cols: 4,
  cells: [
      [O(), E, E, D],
      [D, D, O(), O()],
      [O(), O(), E, E],
  ],
},
{
  id: "world-003-3",
  rows: 4,
  cols: 4,
  cells: [
      [O(), E, D, O()],
      [E, O(), D, O()],
      [O(), D, O(), E],
      [E, O(), E, D],
  ],
},
{
  id: "world-003-4",
  rows: 5,
  cols: 4,
  cells: [
      [O(), E, D, D],
      [O(), O(), E, O()],
      [O(), D, D, E],
      [E, D, O(), O()],
      [D, O(), O(), E],
  ],
},	
{
  id: "world-003-5",
  rows: 4,
  cols: 5,
  cells: [
      [O(), E, E, E, O()],
      [O(), D, D, D, O()],
      [E, D, D, O(), E],
      [E, E, O(), O(), D],
  ],
},

],
},

  {
    id: "world-004",
    name: "Meadow",
    levels: [
{
  id: "world-004-1",
  rows: 3,
  cols: 3,
  cells: [
      [O(), O(), P()],
      [E, D, P()],
      [O(), P(), E],
  ],
},
{
  id: "world-004-2",
  rows: 3,
  cols: 4,
  cells: [
      [O(), E, P(), P()],
      [P(), D, O(), E],
      [O(), P(), E, D],
  ],
},
{
  id: "world-004-3",
  rows: 3,
  cols: 4,
  cells: [
      [O(), O(), D, D],
      [P(), D, E, E],
      [O(), P(), E, E],
  ],
},
{
  id: "world-004-4",
  rows: 4,
  cols: 4,
  cells: [
      [O(), E, E, E],
      [P(), E, D, E],
      [E, D, O(), E],
      [O(), E, D, P()],
  ],
},	
{
  id: "world-004-5",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), D, E],
      [P(), O(), D, E],
      [E, D, P(), E],
      [O(), E, P(), P()],
  ],
},

],
},

   {
    id: "world-005",
    name: "Fog",
    levels: [
{
  id: "world-005-1",
  rows: 4,
  cols: 4,
  cells: [
      [E, O(), P(), E],
      [P(), O(), O(), D],
      [P(), D, O(), D],
      [P(), D, E, P()],
  ],
},
{
  id: "world-005-2",
  rows: 4,
  cols: 4,
  cells: [
      [D, E, E, P()],
      [E, D, E, E],
      [P(), O(), D, E],
      [O(), O(), E, E],
  ],
},
{
  id: "world-005-3",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), P(), P()],
      [E, E, O(), E],
      [P(), O(), D, E],
      [E, O(), E, D],
  ],
},
{
  id: "world-005-4",
  rows: 5,
  cols: 5,
  cells: [
      [D, O(), P(), D, E],
      [O(), E, O(), E, E],
      [P(), O(), D, E, O()],
      [E, O(), O(), D, P()],
      [D, D, D, E, E],
  ],
},	
{
  id: "world-005-5",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), P(), D],
      [O(), P(), O(), P()],
      [P(), O(), D, E],
      [E, O(), O(), D],
  ],
},

],
},

    {
    id: "world-006",
    name: "Thickets",
    levels: [
{
  id: "world-006-1",
  rows: 3,
  cols: 5,
  cells: [
      [D, O(), P(), D, D],
      [O(), P(), O(), O(), E],
      [E, O(), D, P(), E],
  ],
},
{
  id: "world-006-2",
  rows: 4,
  cols: 4,
  cells: [
      [E, O(), E, P()],
      [O(), P(), D, E],
      [E, D, E, P()],
      [D, E, O(), O()],
  ],
},
{
  id: "world-006-3",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), P(), D],
      [P(), O(), O(), O()],
      [D, E, O(), P()],
      [D, O(), O(), D],
  ],
},
{
  id: "world-006-4",
  rows: 4,
  cols: 4,
  cells: [
      [E, O(), P(), P()],
      [P(), O(), O(), D],
      [D, P(), O(), P()],
      [D, D, E, O()],
  ],
},	
{
  id: "world-006-5",
  rows: 4,
  cols: 5,
  cells: [
      [D, O(), P(), O(), P()],
      [P(), O(), O(), D, P()],
      [D, P(), O(), P(), P()],
      [D, D, E, D, O()],
  ],
},

],
},

    {
    id: "world-007",
    name: "Forest",
    levels: [
{
  id: "world-007-1",
  rows: 3,
  cols: 5,
  cells: [
      [D, O(), P(), D, D],
      [O(), P(), O(), O(), E],
      [E, O(), D, P(), E],
  ],
},
{
  id: "world-007-2",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), P(), E],
      [O(), O(), E, D],
      [D, P(), P(), P()],
      [D, D, O(), O()],
  ],
},
{
  id: "world-007-3",
  rows: 4,
  cols: 5,
  cells: [
      [P(), O(), P(), O(), O()],
      [O(), D, P(), D, P()],
      [O(), P(), P(), P(), O()],
      [O(), P(), D, E, O()],
  ],
},
{
  id: "world-007-4",
  rows: 4,
  cols: 4,
  cells: [
      [P(), O(), E, D],
      [E, D, P(), D],
      [O(), O(), P(), P()],
      [O(), P(), O(), P()],
  ],
},	
{
  id: "world-007-5",
  rows: 4,
  cols: 5,
  cells: [
      [P(), E, O(), O(), P()],
      [D, D, P(), O(), O()],
      [D, O(), P(), D, E],
      [D, D, O(), P(), O()],
  ],
},

],
},

  {
    id: "world-008",
    name: "Mountain",
    levels: [
{
  id: "world-008-1",
  rows: 4,
  cols: 4,
  cells: [
      [P(), O(), P(), D],
      [O(), D, P(), E],
      [E, O(), P(), D],
      [D, D, P(), P()],
  ],
},
{
  id: "world-008-2",
  rows: 4,
  cols: 4,
  cells: [
      [O(), P(), O(), D],
      [P(), D, E, P()],
      [O(), O(), O(), O()],
      [D, D, P(), E],
  ],
},
{
  id: "world-008-3",
  rows: 4,
  cols: 5,
  cells: [
      [P(), P(), D, D, E],
      [O(), D, E, O(), O()],
      [P(), P(), E, P(), O()],
      [D, D, D, E, O()],
  ],
},
{
  id: "world-008-4",
  rows: 4,
  cols: 5,
  cells: [
      [D, P(), O(), E, D],
      [O(), D, D, O(), O()],
      [P(), O(), P(), P(), E],
      [D, P(), E, D, O()],
  ],
},	
{
  id: "world-008-5",
  rows: 5,
  cols: 5,
  cells: [
      [O(), O(), D, D, D],
      [P(), D, D, O(), O()],
      [P(), O(), P(), P(), E],
      [O(), D, P(), D, O()],
      [P(), O(), P(), P(), E],
  ],
},

],
},
  {
    id: "world-009",
    name: "Valley",
    levels: [
{
  id: "world-009-1",
  rows: 3,
  cols: 4,
  cells: [
      [O(), O(), E, G()],
      [P(), G(), P(), O()],
      [E, G(), E, P()],
  ],
},
{
  id: "world-009-2",
  rows: 2,
  cols: 5,
  cells: [
      [O(), O(), G(), G(), E],
      [P(), G(), P(), O(), G()],
  ],
},
{
  id: "world-009-3",
  rows: 3,
  cols: 4,
  cells: [
      [D, O(), P(), G()],
      [P(), E, P(), O()],
      [G(), O(), O(), D],
  ],
},
{
  id: "world-009-4",
  rows: 4,
  cols: 4,
  cells: [
      [E, O(), P(), G()],
      [P(), D, P(), O()],
      [G(), O(), O(), E],
      [G(), G(), G(), E],
  ],
},	
{
  id: "world-009-5",
  rows: 4,
  cols: 5,
  cells: [
      [E, O(), P(), G(), E],
      [P(), D, P(), D, P()],
      [O(), D, O(), D, P()],
      [G(), P(), G(), E, P()],
  ],
},

],
},

  {
    id: "world-010",
    name: "Chaos",
    levels: [
{
  id: "world-010-1",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), P(), D],
      [P(), G(), P(), D],
      [O(), G(), O(), E],
      [D, P(), G(), G()],
  ],
},
{
  id: "world-010-2",
  rows: 5,
  cols: 4,
  cells: [
      [D, G(), E, D],
      [G(), D, O(), D],
      [E, O(), O(), G()],
      [D, P(), E, D],
      [D, P(), G(), D],
  ],
},
{
  id: "world-010-3",
  rows: 4,
  cols: 4,
  cells: [
      [P(), O(), P(), G()],
      [G(), D, O(), G()],
      [E, O(), O(), G()],
      [D, P(), O(), D],
  ],
},
{
  id: "world-010-4",
  rows: 4,
  cols: 5,
  cells: [
      [P(), O(), P(), G(), E],
      [O(), D, D, G(), D],
      [G(), D, D, O(), E],
      [E, P(), O(), G(), G()],
  ],
},	
{
  id: "world-010-5",
  rows: 4,
  cols: 4,
  cells: [
      [G(), G(), D, G()],
      [G(), O(), P(), E],
      [G(), D, D, O()],
      [E, P(), O(), G()],
  ],
},

],
},

  {
    id: "world-011",
    name: "Outer Space",
    levels: [
{
  id: "world-011-1",
  rows: 4,
  cols: 4,
  cells: [
      [E, D, E, O()],
      [E, E, E, E],
      [G(), D, G(), D],
      [D, E, E, O()],
  ],
},
{
  id: "world-011-2",
  rows: 4,
  cols: 5,
  cells: [
      [E, D, O(), D, E],
      [G(), D, E, G(), E],
      [E, E, E, D, O()],
      [E, D, E, D, D],
  ],
},
{
  id: "world-011-3",
  rows: 4,
  cols: 4,
  cells: [
      [E, D, E, D],
      [G(), O(), P(), E],
      [P(), D, D, G()],
      [O(), E, D, O()],
  ],
},
{
  id: "world-011-4",
  rows: 4,
  cols: 4,
  cells: [
      [E, D, P(), D],
      [E, P(), G(), E],
      [O(), D, D, E],
      [D, D, G(), O()],
  ],
},	
{
  id: "world-011-5",
  rows: 5,
  cols: 5,
  cells: [
      [P(), G(), E, E, D],
      [D, D, E, D, O()],
      [P(), E, E, E, O()],
      [D, D, E, D, D],
      [G(), O(), E, E, D],
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

/** The name of the World a level belongs to. */
export function worldNameForLevel(levelId: string): string | undefined {
  return worlds.find((world) => world.levels.some((level) => level.id === levelId))?.name;
}
