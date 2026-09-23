import { GREEN, ORANGE, PURPLE } from "../game/levels";
import type { Cell } from "../game/types";
import { useLanguage } from "../i18n/LanguageContext";
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

export function HowToPlay() {
  const { t } = useLanguage();

  return (
    <div className="how-to-play">
      <section>
        <h2>{t.howToGoalTitle}</h2>
        <p>{t.howToGoalBody}</p>
        <div className="how-to-example-row">
          <MiniBoard cells={incompleteExample} caption={t.howToNotDone} />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={completeExample} caption={t.howToDone} />
        </div>
      </section>

      <section>
        <h2>{t.howToMovingTitle}</h2>
        <p>{t.howToMovingBody}</p>
        <div className="how-to-example-row">
          <MiniBoard cells={pushBefore} caption={t.howToBeforePushRight} />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={pushAfter} caption={t.howToAfterSlidEdge} />
        </div>
      </section>

      <section>
        <h2>{t.howToBlockedTitle}</h2>
        <p>{t.howToBlockedBody}</p>
        <div className="how-to-example-row">
          <MiniBoard cells={blockedBefore} caption={t.howToBeforePushRight} />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={blockedAfter} caption={t.howToStoppedByBlocked} />
        </div>
      </section>

      <section>
        <h2>{t.howToFixedTitle}</h2>
        <p>{t.howToFixedBody}</p>
        <div className="how-to-example-row">
          <MiniBoard cells={anchorBefore} caption={t.howToBeforePushRight} />
          <span className="how-to-arrow">→</span>
          <MiniBoard cells={anchorAfter} caption={t.howToConnectedToPinned} />
        </div>
      </section>
    </div>
  );
}
