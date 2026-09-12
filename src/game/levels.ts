import type { Cell, World } from "./types";

const E: Cell = { kind: "empty" };
const D: Cell = { kind: "dead" };
const goose = (color: string): Cell => ({ kind: "goose", color });
const anchor = (color: string): Cell => ({ kind: "anchor", color });

export const ORANGE = "#e2791e";
export const GREEN = "#00BF63";
export const PURPLE = "#4E2996";

const O = () => goose(ORANGE);
const G = () => goose(GREEN);
const P = () => goose(PURPLE);
// Fixed/pinned geese (see the "anchor" cell kind) — can never move, but
// still count toward their color's connectivity requirement. Exported for
// use when hand-authoring new levels (e.g. `AO()` in a level's cells).
export const AO = () => anchor(ORANGE);
export const AG = () => anchor(GREEN);
export const AP = () => anchor(PURPLE);

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

  {
    id: "world-012",
    name: "Volcano",
    levels: [
{
  id: "world-012-1",
  rows: 5,
  cols: 6,
  cells: [
      [O(), G(), E, D, P(), G()],
      [D, E, D, P(), D, P()],
      [O(), E, D, E, P(), E],
      [D, E, E, E, D, E],
      [D, E, D, E, D, G()],
  ],
},
{
  id: "world-012-2",
  rows: 4,
  cols: 4,
  cells: [
      [O(), E, D, D],
      [D, P(), O(), E],
      [D, E, D, E],
      [P(), G(), D, G()],
  ],
},
{
  id: "world-012-3",
  rows: 4,
  cols: 5,
  cells: [
      [O(), P(), D, D, G()],
      [D, O(), E, G(), G()],
      [D, P(), D, G(), O()],
      [E, E, E, D, O()],
  ],
},
{
  id: "world-012-4",
  rows: 4,
  cols: 5,
  cells: [
      [G(), P(), E, D, P()],
      [D, D, E, E, O()],
      [G(), O(), E, D, O()],
      [D, O(), O(), P(), D],
  ],
},	
{
  id: "world-012-5",
  rows: 4,
  cols: 5,
  cells: [
      [G(), O(), P(), D, E],
      [D, E, D, E, P()],
      [D, O(), P(), G(), O()],
      [E, O(), D, D, P()],
  ],
},

],
},

  {
    id: "world-013",
    name: "Sand",
    levels: [
{
  id: "world-013-1",
  rows: 3,
  cols: 3,
  cells: [
      [O(), O(), E],
      [E, E, O()],
      [AO(), E, O()],
  ],
},
{
  id: "world-013-2",
  rows: 3,
  cols: 3,
  cells: [
      [E, E, AO()],
      [E, E, O()],
      [O(), AO(), E],
  ],
},
{
  id: "world-013-3",
  rows: 3,
  cols: 5,
  cells: [
      [D, D, D, O(), E],
      [E, E, AO(), D, E],
      [E, E, E, E, O()],
  ],
},
{
  id: "world-013-4",
  rows: 4,
  cols: 4,
  cells: [
      [E, D, E, O()],
      [O(), E, AO(), D],
      [E, E, E, E],
      [O(), E, E, E],
  ],
},	
{
  id: "world-013-5",
  rows: 4,
  cols: 5,
  cells: [
      [E, E, E, AO(), E],
      [E, E, AO(), E, E],
      [E, AO(), E, E, E],
      [O(), E, E, E, O()],
  ],
},

],
},

  {
    id: "world-014",
    name: "Dune",
    levels: [
{
  id: "world-014-1",
  rows: 4,
  cols: 4,
  cells: [
      [G(), E, E, E],
      [E, AG(), E, E],
      [E, E, AG(), E],
      [G(), E, E, E],
  ],
},
{
  id: "world-014-2",
  rows: 4,
  cols: 4,
  cells: [
      [G(), E, AG(), D],
      [AG(), E, E, G()],
      [E, E, AG(), E],
      [E, E, E, E],
  ],
},
{
  id: "world-014-3",
  rows: 4,
  cols: 4,
  cells: [
      [E, E, E, G()],
      [E, AG(), D, E],
      [E, E, E, G()],
      [E, AG(), E, E],
  ],
},
{
  id: "world-014-4",
  rows: 5,
  cols: 5,
  cells: [
      [P(), D, E, E, AP()],
      [E, P(), D, E, E],
      [D, P(), AP(), E, E],
      [E, E, P(), D, E],
      [AP(), E, P(), E, P()],
  ],
},	
{
  id: "world-014-5",
  rows: 4,
  cols: 5,
  cells: [
      [AO(), E, E, E, E],
      [E, E, AO(), E, E],
      [AO(), O(), D, E, AO()],
      [O(), O(), E, O(), D],
  ],
},

],
},

   {
    id: "world-015",
    name: "Mars",
    levels: [
{
  id: "world-015-1",
  rows: 4,
  cols: 5,
  cells: [
      [D, AO(), E, AO(), E],
      [E, E, E, E, E],
      [E, D, E, E, E],
      [E, O(), E, E, D],
  ],
},
{
  id: "world-015-2",
  rows: 4,
  cols: 4,
  cells: [
      [O(), E, AO(), E],
      [E, E, E, E],
      [E, D, AO(), E],
      [E, O(), E, E],
  ],
},
{
  id: "world-015-3",
  rows: 4,
  cols: 4,
  cells: [
      [O(), E, O(), E],
      [E, AO(), AO(), E],
      [E, E, E, E],
      [E, AO(), E, E],
  ],
},
{
  id: "world-015-4",
  rows: 5,
  cols: 5,
  cells: [
      [AO(), E, AO(), E, O()],
      [E, E, E, E, E],
      [E, E, AO(), E, D],
      [D, E, E, E, E],
      [O(), E, AO(), O(), E],
  ],
},	
{
  id: "world-015-5",
  rows: 4,
  cols: 4,
  cells: [
      [D, O(), E, D],
      [AO(), E, E, AO()],
      [O(), AO(), E, E],
      [O(), E, E, AO()],
  ],
},

],
},

  {
    id: "world-016",
    name: "North Pole",
    levels: [
{
  id: "world-016-1",
  rows: 3,
  cols: 4,
  cells: [
      [AO(), E, O(), AP()],
      [AO(), AP(), E, D],
      [P(), E, E, P()],
  ],
},
{
  id: "world-016-2",
  rows: 3,
  cols: 4,
  cells: [
      [P(), O(), O(), E],
      [P(), AO(), P(), D],
      [P(), O(), E, AP()],
  ],
},
{
  id: "world-016-3",
  rows: 4,
  cols: 4,
  cells: [
      [AP(), E, P(), E],
      [D, AO(), E, AO()],
      [P(), E, E, E],
      [O(), AO(), O(), E],
  ],
},
{
  id: "world-016-4",
  rows: 4,
  cols: 5,
  cells: [
      [O(), P(), E, AO(), AP()],
      [E, AP(), O(), E, P()],
      [P(), E, O(), O(), O()],
      [D, AO(), D, P(), O()],
  ],
},	
{
  id: "world-016-5",
  rows: 4,
  cols: 5,
  cells: [
      [O(), P(), P(), AO(), O()],
      [D, P(), P(), P(), P()],
      [P(), E, E, E, P()],
      [O(), D, AO(), O(), P()],
  ],
},

],
},

   {
    id: "world-017",
    name: "Canyon",
    levels: [
{
  id: "world-017-1",
  rows: 4,
  cols: 4,
  cells: [
      [E, O(), AP(), AO()],
      [O(), E, O(), P()],
      [O(), AO(), P(), P()],
      [AP(), O(), P(), E],
  ],
},
{
  id: "world-017-2",
  rows: 4,
  cols: 4,
  cells: [
      [D, P(), AO(), D],
      [E, P(), G(), E],
      [E, AG(), AP(), P()],
      [P(), E, O(), G()],
  ],
},
{
  id: "world-017-3",
  rows: 4,
  cols: 5,
  cells: [
      [O(), P(), E, E, E],
      [D, D, G(), D, P()],
      [E, P(), E, AO(), D],
      [D, AP(), O(), G(), O()],
  ],
},
{
  id: "world-017-4",
  rows: 4,
  cols: 4,
  cells: [
      [AG(), G(), G(), P()],
      [O(), O(), AP(), O()],
      [P(), E, O(), G()],
      [D, AP(), G(), E],
  ],
},	
{
  id: "world-017-5",
  rows: 5,
  cols: 5,
  cells: [
      [G(), G(), E, O(), G()],
      [G(), AO(), E, E, O()],
      [AG(), P(), E, AG(), E],
      [E, AO(), E, AP(), D],
      [G(), G(), G(), E, O()],
  ],
},

],
},

  {
    id: "world-018", 
    name: "Fountain",
    levels: [
{
  id: "world-018-1",
  rows: 5,
  cols: 5,
  cells: [
      [D, E, AO(), E, AO()],
      [G(), E, E, E, O()],
      [E, AG(), AO(), G(), E],
      [E, E, E, E, E],
      [AG(), E, AG(), O(), E],
  ],
},
{
  id: "world-018-2",
  rows: 4,
  cols: 5,
  cells: [
      [AG(), E, G(), E, O()],
      [E, E, D, E, AO()],
      [AG(), E, AG(), E, E],
      [G(), E, E, E, AO()],
  ],
},
{
  id: "world-018-3",
  rows: 5,
  cols: 6,
  cells: [
      [O(), E, E, E, E, E],
      [G(), E, AO(), E, D, E],
      [AG(), E, AG(), AO(), E, E],
      [O(), E, E, E, E, G()],
      [AG(), E, AO(), E, O(), D],
  ],
},
{
  id: "world-018-4",
  rows: 5,
  cols: 5,
  cells: [
      [D, AO(), D, G(), O()],
      [G(), E, E, O(), D],
      [E, AG(), E, O(), AG()],
      [E, E, AO(), O(), E],
      [G(), AO(), O(), E, AG()],
  ],
},	
{
  id: "world-018-5",
  rows: 5,
  cols: 5,
  cells: [
      [G(), O(), AP(), D, AG()],
      [AO(), E, E, AG(), P()],
      [E, E, AP(), E, E],
      [AO(), E, AO(), E, AG()],
      [E, G(), G(), E, O()],
  ],
},

],
},

  {
    id: "world-019", 
    name: "Ocean",
    levels: [
{
  id: "world-019-1",
  rows: 3,
  cols: 6,
  cells: [
      [O(), AP(), D, E, AO(), O()],
      [G(), G(), P(), E, AG(), E],
      [E, AP(), AG(), O(), P(), E],
  ],
},
{
  id: "world-019-2",
  rows: 4,
  cols: 5,
  cells: [
      [AO(), P(), AO(), O(), E],
      [G(), G(), P(), E, P()],
      [O(), AP(), AG(), E, P()],
      [AG(), P(), E, E, AP()],
  ],
},
{
  id: "world-019-3",
  rows: 5,
  cols: 5,
  cells: [
      [AO(), E, AO(), AP(), G()],
      [E, E, E, E, P()],
      [AG(), D, E, E, E],
      [O(), E, E, E, P()],
      [AG(), P(), AG(), AP(), G()],
  ],
},
{
  id: "world-019-4",
  rows: 4,
  cols: 5,
  cells: [
      [AO(), E, AO(), E, AP()],
      [E, E, P(), E, E],
      [O(), AO(), AG(), AG(), AP()],
      [O(), G(), E, E, E],
  ],
},
{
  id: "world-019-5",
  rows: 5,
  cols: 6,
  cells: [
      [AO(), E, AO(), AG(), D, O()],
      [E, E, E, E, E, E],
      [E, E, E, AG(), AP(), E],
      [E, AG(), E, AG(), E, E],
      [E, G(), E, P(), G(), E],
  ],
},

],
},

  {
    id: "world-020", 
    name: "Lava",
    levels: [
{
  id: "world-020-1",
  rows: 3,
  cols: 6,
  cells: [
      [O(), AP(), D, E, AO(), O()],
      [G(), G(), P(), E, AG(), E],
      [E, AP(), AG(), O(), P(), E],
  ],
},
{
  id: "world-020-2",
  rows: 6,
  cols: 6,
  cells: [
      [O(), G(), P(), AO(), D, AG()],
      [E, E, G(), AG(), O(), O()],
      [D, E, D, AG(), O(), O()],
      [O(), E, E, E, E, G()],
      [AP(), D, E, D, AG(), P()],
      [G(), E, E, E, D, E],
  ],
},
{
  id: "world-020-3",
  rows: 6,
  cols: 6,
  cells: [
      [O(), E, AP(), E, E, P()],
      [E, G(), E, D, E, E],
      [G(), D, E, E, E, AG()],
      [AO(), P(), E, E, AG(), O()],
      [P(), P(), AP(), G(), O(), O()],
      [P(), P(), P(), AG(), O(), O()],
  ],
},
{
  id: "world-020-4",
  rows: 7,
  cols: 7,
  cells: [
      [AO(), G(), D, AG(), D, E, D],
      [G(), E, E, E, E, E, E],
      [E, E, AO(), D, AG(), E, O()],
      [E, D, P(), P(), P(), O(), O()],
      [E, E, AP(), D, D, O(), O()],
      [E, E, E, E, E, E, O()],
      [D, G(), D, D, AP(), E, D],
  ],
},
{
  id: "world-020-5",
  rows: 7,
  cols: 7,
  cells: [
      [E, E, O(), E, AP(), G(), P()],
      [AO(), E, E, G(), E, P(), E],
      [G(), E, AO(), E, E, E, P()],
      [AO(), E, E, E, AG(), E, AG()],
      [AO(), E, AO(), E, E, E, AG()],
      [E, E, E, E, E, E, E],
      [E, E, D, O(), AG(), O(), AG()],
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
