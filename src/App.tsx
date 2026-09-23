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
import { ReverseEditor } from "./components/ReverseEditor";
import { loadDailyCompleted, saveDailyCompleted } from "./game/dailyProgress";
import { allLevels, levelDisplayName, worldIdForLevel, worldNameForLevel } from "./game/levels";
import { loadCompletedLevels, saveCompletedLevels } from "./game/progress";
import type { Level } from "./game/types";
import { useLanguage } from "./i18n/LanguageContext";
import { localizedWorldName } from "./i18n/worldNames";

type Screen = "menu" | "worlds" | "level" | "daily" | "how-to-play" | "credits" | "editor" | "reverse-editor";

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [screen, setScreen] = useState<Screen>(() => {
    if (window.location.hash === "#editor") return "editor";
    if (window.location.hash === "#reverse-editor") return "reverse-editor";
    return "menu";
  });
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLevels());
  const [dailyCompleted, setDailyCompleted] = useState(() => loadDailyCompleted());
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

  function handleDailyComplete() {
    setDailyCompleted(true);
    saveDailyCompleted(true);
  }

  function goToNextLevel() {
    if (!currentLevel) return;
    const index = allLevels.findIndex((l) => l.id === currentLevel.id);
    const next = allLevels[index + 1];
    if (next) openLevel(next);
    else setScreen("worlds");
  }

  const backButton =
    screen === "level"
      ? { label: t.mapBack, onClick: () => setScreen("worlds") }
      : screen === "worlds" || screen === "daily" || screen === "how-to-play" || screen === "credits"
        ? { label: t.menuBack, onClick: () => setScreen("menu") }
        : null;

  return (
    <div className="app">
      <div className="top-nav">
        {backButton && <button onClick={backButton.onClick}>{backButton.label}</button>}
        <div className="language-switcher">
          <button
            className={language === "en" ? "language-active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={language === "de" ? "language-active" : ""}
            onClick={() => setLanguage("de")}
          >
            DE
          </button>
        </div>
      </div>
      <header className="app-header">
        <img src="/goose-orange.svg" alt="" className="app-logo" />
        <h1>{t.appTitle}</h1>
        <p className="subtitle">{t.appSubtitle}</p>
      </header>

      {screen === "menu" && (
        <MainMenu
          onPlay={() => setScreen("worlds")}
          onDailyChallenge={() => setScreen("daily")}
          onHowToPlay={() => setScreen("how-to-play")}
          onCredits={() => setScreen("credits")}
          dailyCompleted={dailyCompleted}
        />
      )}

      {screen === "worlds" && <LevelSelect completed={completed} onSelectLevel={openLevel} />}

      {screen === "daily" && <DailyChallenge onComplete={handleDailyComplete} />}
      {screen === "how-to-play" && <HowToPlay />}
      {screen === "credits" && <Credits />}
      {screen === "editor" && (
        <LevelEditor
          onBack={() => {
            window.location.hash = "";
            setScreen("menu");
          }}
        />
      )}
      {screen === "reverse-editor" && (
        <ReverseEditor
          onBack={() => {
            window.location.hash = "";
            setScreen("menu");
          }}
        />
      )}

      {screen === "level" && currentLevel && (
        <>
          <div className="level-bar">
            <span className="level-name">
              <span className="world-name">
                {localizedWorldName(
                  worldIdForLevel(currentLevel.id) ?? "",
                  worldNameForLevel(currentLevel.id) ?? "",
                  language,
                )}
              </span>
              {t.levelBarSeparator}
              {levelDisplayName(currentLevel.id)}
            </span>
            <LevelStatusBar levelId={currentLevel.id} moveCount={moveCount} complete={complete} />
          </div>

          <GameBoard
            key={currentLevel.id}
            level={currentLevel}
            onMoveCountChange={setMoveCount}
            onCompleteChange={handleCompleteChange}
          />

          {complete && (
            <button className="next-level-button" onClick={goToNextLevel}>
              {t.nextLevel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
