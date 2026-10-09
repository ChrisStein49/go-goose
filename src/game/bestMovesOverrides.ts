/**
 * Hand-entered best-known scores for levels the solver could not score within
 * its budget (the hardest ones), taken from a player's own solves. They are
 * upper bounds, never proven, so every entry stays `proven: false`.
 *
 * Kept separate from bestMoves.generated.ts so regenerating that file
 * (npm run compute-best-moves) doesn't wipe them. src/game/bestKnown.ts only
 * applies an entry when the generated file has no score for the level or a
 * worse (higher) one.
 *
 * Every Worlds level has a score (generated or overridden) as of 2026-10-09.
 */
export const bestMovesOverrides: Record<string, { moves: number; proven: false }> = {
  "world-020-2": { moves: 41, proven: false }, // Lava 2
  "world-020-3": { moves: 82, proven: false }, // Lava 3
  "world-020-4": { moves: 44, proven: false }, // Lava 4
  "world-021-5": { moves: 35, proven: false }, // Thin Ice 5
  "world-025-3": { moves: 39, proven: false }, // Swamp 3
  "world-027-4": { moves: 40, proven: false }, // Terrace 4
};
