import { useState } from "react";
import "./App.css";
import { Credits } from "./components/Credits";
import { DailyChallenge } from "./components/DailyChallenge";
import { GameBoard } from "./components/GameBoard";
import { HowToPlay } from "./components/HowToPlay";
import { LevelEditor } from "./components/LevelEditor";
import { LevelSelect } from "./components/LevelSelect";
import { MainMenu } from "./components/MainMenu";
import { LevelStatusBar } from "./components/LevelStatusBar";
import { allLevels, levelDisplayName, worldNameForLevel } from "./game/levels";
import { loadCompletedLevels, saveCompletedLevels } from "./game/progress";
import type { Level } from "./game/types";

type Screen = "menu" | "worlds" | "level" | "daily" | "how-to-play" | "credits" | "editor";

function App() {
  const [screen, setScreen] = useState<Screen>(() =>
    window.location.hash === "#editor" ? "editor" : "menu",
  );
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLevels());
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [complete, setComplete] = useState(false);

  function openLevel(level: Level) {
    setCurrentLevel(level);
    setMoveCount(0);
    setComplete(false);
    setScreen("level");
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
    else setScreen("worlds");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Go Goose</h1>
        <p className="subtitle">Push the geese so every color forms one connected flock.</p>
      </header>

      {screen === "menu" && (
        <MainMenu
          onPlay={() => setScreen("worlds")}
          onDailyChallenge={() => setScreen("daily")}
          onHowToPlay={() => setScreen("how-to-play")}
          onCredits={() => setScreen("credits")}
        />
      )}

      {screen === "worlds" && (
        <>
          <div className="level-bar">
            <button onClick={() => setScreen("menu")}>← Menu</button>
          </div>
          <LevelSelect completed={completed} onSelectLevel={openLevel} />
        </>
      )}

      {screen === "daily" && <DailyChallenge onBack={() => setScreen("menu")} />}
      {screen === "how-to-play" && <HowToPlay onBack={() => setScreen("menu")} />}
      {screen === "credits" && <Credits onBack={() => setScreen("menu")} />}
      {screen === "editor" && (
        <LevelEditor
          onBack={() => {
            window.location.hash = "";
            setScreen("menu");
          }}
        />
      )}

      {screen === "level" && currentLevel && (
        <>
          <div className="level-bar">
            <button onClick={() => setScreen("worlds")}>← Map</button>
            <span className="level-name">
              <span className="world-name">{worldNameForLevel(currentLevel.id)}</span>
              {" · "}
              {levelDisplayName(currentLevel.id)}
            </span>
          </div>

          <LevelStatusBar levelId={currentLevel.id} moveCount={moveCount} complete={complete} />

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
