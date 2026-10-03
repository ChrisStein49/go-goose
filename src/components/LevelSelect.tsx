import { bestMoves } from "../game/bestMoves.generated";
import { allLevels, worlds } from "../game/levels";
import type { Level } from "../game/types";
import { useLanguage } from "../i18n/LanguageContext";
import { localizedWorldName } from "../i18n/worldNames";

interface LevelSelectProps {
  levelProgress: Record<string, number>;
  onSelectLevel: (level: Level) => void;
}

export function LevelSelect({ levelProgress, onSelectLevel }: LevelSelectProps) {
  const { language, t } = useLanguage();
  const indexOf = new Map(allLevels.map((level, i) => [level.id, i]));

  function isUnlocked(level: Level): boolean {
    const index = indexOf.get(level.id)!;
    if (index === 0) return true;
    return allLevels[index - 1].id in levelProgress;
  }

  /** A star = solved in at most the best known number of moves. */
  function hasStar(level: Level): boolean {
    const best = bestMoves[level.id];
    return level.id in levelProgress && best !== undefined && levelProgress[level.id] <= best.moves;
  }

  /** Levels that can earn a star at all (those with a best known score). */
  const starrable = (levels: Level[]) => levels.filter((level) => bestMoves[level.id] !== undefined);
  const earnedIn = (levels: Level[]) => starrable(levels).filter(hasStar).length;

  return (
    <div className="level-select">
      <p className="stars-total">{t.starsTotal(earnedIn(allLevels), starrable(allLevels).length)}</p>
      {worlds.map((world) => (
        <div className="world-section" key={world.id}>
          <h2>
            {localizedWorldName(world.id, world.name, language)}
            <span className="world-stars">
              ⭐ {earnedIn(world.levels)}/{starrable(world.levels).length}
            </span>
          </h2>
          <div className="level-grid">
            {world.levels.map((level, i) => {
              const unlocked = isUnlocked(level);
              const done = level.id in levelProgress;
              const starred = hasStar(level);
              // Solved but not yet at the best known score: a faint empty star invites a replay.
              const starPending = done && !starred && bestMoves[level.id] !== undefined;
              return (
                <button
                  key={level.id}
                  className={["level-tile", done ? "level-done" : "", !unlocked ? "level-locked" : ""]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={!unlocked}
                  onClick={() => onSelectLevel(level)}
                  title={`Level ${i + 1}`}
                >
                  {done ? "✓" : unlocked ? i + 1 : "🔒"}
                  {starred && <span className="level-star-badge">⭐</span>}
                  {starPending && <span className="level-star-badge level-star-pending">☆</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
