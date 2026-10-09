import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { Credits } from "./components/Credits";
import { DailyChallenge } from "./components/DailyChallenge";
import { GameBoard } from "./components/GameBoard";
import { HowToPlay } from "./components/HowToPlay";
import { LevelEditor } from "./components/LevelEditor";
import { LevelSelect } from "./components/LevelSelect";
import { MainMenu } from "./components/MainMenu";
import { LevelCompleteBadge, LevelStatusBar } from "./components/LevelStatusBar";
import { ReverseEditor } from "./components/ReverseEditor";
import { loadDailyCompletedToday, loadDailyStreak, recordDailyCompletion } from "./game/dailyProgress";
import { allLevels, levelDisplayName, worldIdForLevel, worldNameForLevel } from "./game/levels";
import { knownMoves, loadLevelProgress, saveLevelProgress } from "./game/progress";
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
  const [levelProgress, setLevelProgress] = useState<Record<string, number>>(() => loadLevelProgress());
  const [dailyCompleted, setDailyCompleted] = useState(() => loadDailyCompletedToday());
  const [dailyStreak, setDailyStreak] = useState(() => loadDailyStreak());
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [complete, setComplete] = useState(false);
  // The player's fewest moves on this level as of the start of the current run
  // (null = none yet); used to word the level-complete message.
  const [bestBeforeRun, setBestBeforeRun] = useState<number | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  // Scroll position of the level list, so coming back from a level (e.g. after
  // tapping the wrong one) lands where the player was instead of at the top.
  const worldsScrollY = useRef(0);

  useLayoutEffect(() => {
    if (screen === "worlds") window.scrollTo(0, worldsScrollY.current);
  }, [screen]);

  const guardedScreen = screen === "level" || screen === "daily";

  useEffect(() => {
    if (!guardedScreen) return;

    history.pushState({ goGooseGuard: true }, "");

    function handlePopState() {
      history.pushState({ goGooseGuard: true }, "");
      setShowLeaveConfirm(true);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [guardedScreen]);

  useEffect(() => {
    if (!guardedScreen) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [guardedScreen]);

  function openLevel(level: Level) {
    // Only remember the position when leaving the level list (not when moving level to level).
    if (screen === "worlds") worldsScrollY.current = window.scrollY;
    setCurrentLevel(level);
    setMoveCount(0);
    setComplete(false);
    setScreen("level");
  }

  function handleCompleteChange(isComplete: boolean, moves: number) {
    setComplete(isComplete);
    // GameBoard re-reports on every render, so snapshot the best score only while the level
    // is NOT complete — by the time it is complete, the progress has already been updated.
    if (!isComplete && currentLevel) setBestBeforeRun(knownMoves(levelProgress[currentLevel.id]));
    if (isComplete && currentLevel) {
      const existing = levelProgress[currentLevel.id];
      if (existing === undefined || moves < existing) {
        const next = { ...levelProgress, [currentLevel.id]: moves };
        setLevelProgress(next);
        saveLevelProgress(next);
      }
    }
  }

  function handleDailyComplete() {
    setDailyCompleted(true);
    setDailyStreak(recordDailyCompletion());
  }

  function goToNextLevel() {
    if (!currentLevel) return;
    const index = allLevels.findIndex((l) => l.id === currentLevel.id);
    const next = allLevels[index + 1];
    if (next) openLevel(next);
    else setScreen("worlds");
  }

  function confirmLeave() {
    setShowLeaveConfirm(false);
    if (screen === "level") setScreen("worlds");
    else if (screen === "daily") setScreen("menu");
  }

  function cancelLeave() {
    setShowLeaveConfirm(false);
  }

  const backButton =
    screen === "level"
      ? { label: t.mapBack, onClick: () => setShowLeaveConfirm(true) }
      : screen === "daily"
        ? { label: t.menuBack, onClick: () => setShowLeaveConfirm(true) }
        : screen === "worlds" || screen === "how-to-play" || screen === "credits"
          ? { label: t.menuBack, onClick: () => setScreen("menu") }
          : null;

  return (
    <div className="app">
      <div className="top-nav">
        {backButton && (
          <button className="back-button" onClick={backButton.onClick}>
            {backButton.label}
          </button>
        )}
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
        {screen !== "credits" && <p className="subtitle">{t.appSubtitle}</p>}
      </header>

      {screen === "menu" && (
        <MainMenu
          onPlay={() => {
            worldsScrollY.current = 0; // a fresh visit from the menu starts at the top
            setScreen("worlds");
          }}
          onDailyChallenge={() => setScreen("daily")}
          onHowToPlay={() => setScreen("how-to-play")}
          onCredits={() => setScreen("credits")}
          dailyCompleted={dailyCompleted}
          dailyStreak={dailyStreak}
        />
      )}

      {screen === "worlds" && <LevelSelect levelProgress={levelProgress} onSelectLevel={openLevel} />}

      {screen === "daily" && <DailyChallenge onComplete={handleDailyComplete} streak={dailyStreak} />}
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
            <LevelStatusBar levelId={currentLevel.id} moveCount={moveCount} showBestKnown={false} />
          </div>

          <GameBoard
            key={currentLevel.id}
            level={currentLevel}
            onMoveCountChange={setMoveCount}
            onCompleteChange={handleCompleteChange}
            onNext={goToNextLevel}
            nextLabel={t.nextLevel}
          />

          {complete && <LevelCompleteBadge levelId={currentLevel.id} moveCount={moveCount} previousBest={bestBeforeRun} />}
        </>
      )}

      {showLeaveConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{t.confirmLeaveMessage}</p>
            <div className="modal-actions">
              <button onClick={cancelLeave}>{t.no}</button>
              <button className="modal-button-secondary" onClick={confirmLeave}>
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
