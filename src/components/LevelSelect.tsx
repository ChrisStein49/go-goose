import { allLevels, worlds } from "../game/levels";
import type { Level } from "../game/types";

interface LevelSelectProps {
  completed: Set<string>;
  onSelectLevel: (level: Level) => void;
}

export function LevelSelect({ completed, onSelectLevel }: LevelSelectProps) {
  const indexOf = new Map(allLevels.map((level, i) => [level.id, i]));

  function isUnlocked(level: Level): boolean {
    const index = indexOf.get(level.id)!;
    if (index === 0) return true;
    return completed.has(allLevels[index - 1].id);
  }

  return (
    <div className="level-select">
      {worlds.map((world) => (
        <div className="world-section" key={world.id}>
          <h2>{world.name}</h2>
          <div className="level-grid">
            {world.levels.map((level, i) => {
              const unlocked = isUnlocked(level);
              const done = completed.has(level.id);
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
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
