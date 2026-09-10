import { useState } from "react";
import "./App.css";
import { GameBoard } from "./components/GameBoard";
import { LevelSelect } from "./components/LevelSelect";
import { allLevels } from "./game/levels";
import { loadCompletedLevels, saveCompletedLevels } from "./game/progress";
import type { Level } from "./game/types";

function App() {
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLevels());
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [complete, setComplete] = useState(false);

  function openLevel(level: Level) {
    setCurrentLevel(level);
    setMoveCount(0);
    setComplete(false);
  }

  function backToMap() {
    setCurrentLevel(null);
  }

  function handleCompleteChange(isComplete: boolean) {
    setComplete(isComplete);
    if (isComplete && currentLevel && !completed.has(currentLevel.id)) {
      const next = new Set(completed);
      next.add(currentLevel.id);
      setCompleted(next);
      saveCompletedLevels(next);
    }
  }

  function goToNextLevel() {
    if (!currentLevel) return;
    const index = allLevels.findIndex((l) => l.id === currentLevel.id);
    const next = allLevels[index + 1];
    if (next) openLevel(next);
    else backToMap();
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Go Goose</h1>
        <p className="subtitle">Push the geese so every color forms one connected flock.</p>
      </header>

      {!currentLevel && <LevelSelect completed={completed} onSelectLevel={openLevel} />}

      {currentLevel && (
        <>
          <div className="level-bar">
            <button onClick={backToMap}>← Map</button>
            <span className="level-name">{currentLevel.name}</span>
          </div>

          <div className="status-bar">
            <span>Moves: {moveCount}</span>
            {complete && <span className="complete-badge">Level complete!</span>}
          </div>

          <GameBoard
            key={currentLevel.id}
            level={currentLevel}
            onMoveCountChange={setMoveCount}
            onCompleteChange={handleCompleteChange}
          />

          {complete && (
            <button className="next-level-button" onClick={goToNextLevel}>
              Next Level →
            </button>
          )}

          <p className="hint">Drag a goose, or tap it and use arrow keys, to push it.</p>
        </>
      )}
    </div>
  );
}

export default App;
