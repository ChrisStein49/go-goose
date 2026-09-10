interface MainMenuProps {
  onPlay: () => void;
  onDailyChallenge: () => void;
  onHowToPlay: () => void;
  onCredits: () => void;
}

export function MainMenu({ onPlay, onDailyChallenge, onHowToPlay, onCredits }: MainMenuProps) {
  return (
    <nav className="main-menu">
      <button className="menu-button" onClick={onPlay}>
        Play
      </button>
      <button className="menu-button" onClick={onDailyChallenge}>
        Today's Challenge
      </button>
      <button className="menu-button" onClick={onHowToPlay}>
        How to Play
      </button>
      <button className="menu-button" onClick={onCredits}>
        Credits
      </button>
    </nav>
  );
}
