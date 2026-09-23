import { DELTA, inBounds } from "./board";
import type { Board, Direction } from "./types";

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

export interface ReverseChain {
  /** Cells of the chain, ordered from the back (farthest from the blocker) to the front (blocked side). */
  cells: [number, number][];
  /** The direction the chain is currently blocked in — i.e. the direction a forward push would have arrived from. */
  blockedDirection: Direction;
  /** How many empty cells are available behind the chain to shift back into (1..maxShift is a valid distance). */
  maxShift: number;
}

/**
 * Finds every reversible chain of contiguous movable geese in the board —
 * each one is a candidate "this chain could have just arrived here via a
 * forward push in `blockedDirection`", and can be undone by shifting it
 * backward.
 *
 * A forward push always sweeps up every contiguous goose ahead of the pushed
 * one (color-blind), so a maximal contiguous run blocked by the edge, a dead
 * cell, or an anchor at its front is one candidate — but it isn't the only
 * one. That same run could equally have been assembled by a *shorter* chain
 * sliding forward and coming to rest against geese that were already sitting
 * there (which, being contiguous, is indistinguishable from a single bigger
 * chain in the resulting board). So for every maximal run, every back-anchored
 * sub-chain — the last K cells counting from the end farthest from the
 * blocker — is also a valid reversible unit: pushing forward, it would have
 * stopped the instant it touched the (stationary) remainder of the run,
 * exactly as if that remainder were the blocker. Only the *full* run (K =
 * length) additionally requires the front to be blocked by something other
 * than a goose, since a full run that could still slide further in
 * `blockedDirection` couldn't have legitimately come to rest there.
 */
export function findReverseChains(board: Board): ReverseChain[] {
  const chains: ReverseChain[] = [];

  for (const blockedDirection of DIRECTIONS) {
    const [dr, dc] = DELTA[blockedDirection];
    const seenFronts = new Set<string>();

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c].kind !== "goose") continue;

        // Walk forward (toward blockedDirection) to find this run's front and its blocker.
        let fr = r;
        let fc = c;
        while (inBounds(board, fr + dr, fc + dc) && board[fr + dr][fc + dc].kind === "goose") {
          fr += dr;
          fc += dc;
        }
        const blockerR = fr + dr;
        const blockerC = fc + dc;
        const isBlocked =
          !inBounds(board, blockerR, blockerC) ||
          board[blockerR][blockerC].kind === "dead" ||
          board[blockerR][blockerC].kind === "anchor";

        const frontKey = `${fr},${fc}`;
        if (seenFronts.has(frontKey)) continue; // already recorded this run for this direction
        seenFronts.add(frontKey);

        // Walk backward from (r,c) — the run may extend further back than (r,c) itself.
        let br = r;
        let bc = c;
        while (inBounds(board, br - dr, bc - dc) && board[br - dr][bc - dc].kind === "goose") {
          br -= dr;
          bc -= dc;
        }

        const cells: [number, number][] = [];
        for (let cr = br, cc = bc; ; cr += dr, cc += dc) {
          cells.push([cr, cc]);
          if (cr === fr && cc === fc) break;
        }

        let maxShift = 0;
        let sr = br - dr;
        let sc = bc - dc;
        while (inBounds(board, sr, sc) && board[sr][sc].kind === "empty") {
          maxShift++;
          sr -= dr;
          sc -= dc;
        }
        if (maxShift === 0) continue;

        // Sub-chains shorter than the full run are always valid reversible
        // units (their "blocker" is simply the next cell of the same run,
        // which is provably a goose). The full run is only valid when it's
        // genuinely blocked by something other than another goose.
        const maxLength = isBlocked ? cells.length : cells.length - 1;
        for (let length = 1; length <= maxLength; length++) {
          chains.push({ cells: cells.slice(0, length), blockedDirection, maxShift });
        }
      }
    }
  }

  return chains;
}

/** Shifts `chain` backward (away from its blocked direction) by `shift` cells (1..chain.maxShift). */
export function applyReverseMove(board: Board, chain: ReverseChain, shift: number): Board {
  const [dr, dc] = DELTA[chain.blockedDirection];
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  for (const [r, c] of chain.cells) {
    newBoard[r][c] = { kind: "empty" };
  }
  for (const [r, c] of chain.cells) {
    newBoard[r - dr * shift][c - dc * shift] = { ...board[r][c] };
  }
  return newBoard;
}

function serializeBoard(board: Board): string {
  return board
    .map((row) =>
      row
        .map((cell) => (cell.kind === "goose" || cell.kind === "anchor" ? `${cell.kind[0]}${cell.color}` : cell.kind[0]))
        .join(","),
    )
    .join("|");
}

function mulberry32(seed: number) {
  let s = seed;
  return function random() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ScrambleResult {
  board: Board;
  /** Number of reverse moves actually applied (may be less than requested if it ran out of valid moves). */
  steps: number;
}

/**
 * Repeatedly applies random valid reverse moves to `board` (normally a
 * solved/complete layout), producing a scrambled starting board that is
 * guaranteed solvable — the exact reverse of these moves, played forward in
 * reverse order, reconstructs a complete state.
 *
 * Guards against ever revisiting a board state already seen in this
 * scramble — not just "undo the immediately previous move": a move from a
 * *different* blocked direction can still trivially cancel out an earlier
 * one's net effect (e.g. shift left then shift back right), which a
 * same-chain-only guard would miss. Tracking visited states directly is
 * what actually prevents degenerate back-and-forth scrambles.
 *
 * Tries one random shift per candidate chain first (in shuffled order) — the
 * cheap, common-case path. Only if that whole pass fails to find anything
 * fresh does it fall back to exhaustively trying every remaining shift
 * distance of every chain before finally giving up: sampling just one random
 * distance per chain would risk declaring a dead end (and stopping short of
 * the requested step count) even when a different, untried distance for
 * that same chain would have reached fresh territory. Falling back only on
 * failure — rather than always shuffling every shift up front — keeps the
 * normal-case move selection exactly as before, so this only ever rescues
 * steps that would otherwise have been cut short, never changes ones that
 * were already succeeding.
 */
export function scramble(board: Board, steps: number, seed = 1): ScrambleResult {
  const random = mulberry32(seed);
  let current = board;
  const visited = new Set<string>([serializeBoard(board)]);
  let applied = 0;

  for (let i = 0; i < steps; i++) {
    const candidates = findReverseChains(current);
    // Shuffle so we try chains in random order.
    for (let j = candidates.length - 1; j > 0; j--) {
      const k = Math.floor(random() * (j + 1));
      [candidates[j], candidates[k]] = [candidates[k], candidates[j]];
    }

    let next: { board: Board; key: string } | null = null;

    for (const chain of candidates) {
      const shift = 1 + Math.floor(random() * chain.maxShift);
      const candidateBoard = applyReverseMove(current, chain, shift);
      const key = serializeBoard(candidateBoard);
      if (visited.has(key)) continue;
      next = { board: candidateBoard, key };
      break;
    }

    if (!next) {
      for (const chain of candidates) {
        for (let shift = 1; shift <= chain.maxShift; shift++) {
          const candidateBoard = applyReverseMove(current, chain, shift);
          const key = serializeBoard(candidateBoard);
          if (visited.has(key)) continue;
          next = { board: candidateBoard, key };
          break;
        }
        if (next) break;
      }
    }

    if (!next) break; // every candidate's every shift distance would revisit a seen state
    current = next.board;
    visited.add(next.key);
    applied++;
  }

  return { board: current, steps: applied };
}
