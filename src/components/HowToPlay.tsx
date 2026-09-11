import { GREEN, ORANGE, PURPLE } from "../game/levels";
import type { Cell } from "../game/types";
import { MiniBoard } from "./MiniBoard";

const E: Cell = { kind: "empty" };
const D: Cell = { kind: "dead" };
const g = (color: string): Cell => ({ kind: "goose", color });
const a = (color: string): Cell => ({ kind: "anchor", color });

const pushBefore: Cell[][] = [
  [g(ORANGE), E, E, E],
  [E, E, E, E],
];
const pushAfter: Cell[][] = [
  [E, E, E, g(ORANGE)],
  [E, E, E, E],
];

const incompleteExample: Cell[][] = [
  [g(GREEN), g(GREEN), E, g(GREEN)],
  [E, E, E, E],
];
const completeExample: Cell[][] = [
  [g(GREEN), g(GREEN), g(GREEN), E],
  [E, E, E, E],
];

const blockedBefore: Cell[][] = [
  [g(PURPLE), E, D, E],
];
const blockedAfter: Cell[][] = [
  [E, g(PURPLE), D, E],
];

const anchorBefore: Cell[][] = [[g(GREEN), E, a(GREEN)]];
const anchorAfter: Cell[][] = [[E, g(GREEN), a(GREEN)]];

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="how-to-play">
      <button onClick={onBack}>← Menu</button>

      <section>
        <h2>The Goal</h2>
        <p>
          Every goose on the board has a color. Push the geese around until all the geese of each
          color are connected into a single group — touching up, down, left, or right. Try to do
          it in as few moves as possible.
        </p>
        <div className="how-to-example-row">
          <MiniBoard cells={incompleteExample} caption="Not done — one green goose sits apart" />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={completeExample} caption="Done — all green geese connected" />
        </div>
      </section>

      <section>
        <h2>Moving Geese</h2>
        <p>
          Drag a goose in the direction you want to push it — or tap it to select it, then use the
          arrow keys. The goose slides as far as it can, and it carries along any geese directly
          in front of it, until it's blocked by the edge of the board or another goose.
        </p>
        <div className="how-to-example-row">
          <MiniBoard cells={pushBefore} caption="Before: push right" />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={pushAfter} caption="After: slid to the edge" />
        </div>
      </section>

      <section>
        <h2>Blocked Cells</h2>
        <p>
          Some levels have permanently blocked cells (shown in grey). Geese can never enter or
          slide through them — a push stops right before one, just like it would at the edge of
          the board.
        </p>
        <div className="how-to-example-row">
          <MiniBoard cells={blockedBefore} caption="Before: push right" />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={blockedAfter} caption="Stopped by the blocked cell" />
        </div>
      </section>

      <section>
        <h2>Fixed Geese</h2>
        <p>
          Some levels include a goose that's permanently pinned in place (marked with 📌). It can
          never be pushed, and it blocks movement just like a blocked cell — but it still counts
          toward its color's connection requirement, so you'll need to bring your other geese of
          that color to it.
        </p>
        <div className="how-to-example-row">
          <MiniBoard cells={anchorBefore} caption="Before: push right" />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={anchorAfter} caption="Connected to the pinned goose" />
        </div>
      </section>
    </div>
  );
}
