import { BLUE, ORANGE, PINK } from "../game/levels";
import type { Cell } from "../game/types";
import { MiniBoard } from "./MiniBoard";

const E: Cell = { kind: "empty" };
const D: Cell = { kind: "dead" };
const g = (color: string): Cell => ({ kind: "goose", color });

const pushBefore: Cell[][] = [
  [g(ORANGE), E, E, E],
  [E, E, E, E],
];
const pushAfter: Cell[][] = [
  [E, E, E, g(ORANGE)],
  [E, E, E, E],
];

const incompleteExample: Cell[][] = [
  [g(BLUE), g(BLUE), E, g(BLUE)],
  [E, E, E, E],
];
const completeExample: Cell[][] = [
  [g(BLUE), g(BLUE), g(BLUE), E],
  [E, E, E, E],
];

const blockedBefore: Cell[][] = [
  [g(PINK), E, D, E],
];
const blockedAfter: Cell[][] = [
  [E, g(PINK), D, E],
];

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
          <MiniBoard cells={incompleteExample} caption="Not done — one blue goose sits apart" />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={completeExample} caption="Done — all blue geese connected" />
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
    </div>
  );
}
