import { useLanguage } from "../i18n/LanguageContext";

interface MainMenuProps {
  onPlay: () => void;
  onDailyChallenge: () => void;
  onHowToPlay: () => void;
  onCredits: () => void;
  dailyCompleted: boolean;
}

export function MainMenu({ onPlay, onDailyChallenge, onHowToPlay, onCredits, dailyCompleted }: MainMenuProps) {
  const { t } = useLanguage();

  return (
    <nav className="main-menu">
      <button className="menu-button" onClick={onPlay}>
        {t.play}
      </button>
      <button className="menu-button daily-menu-button" onClick={onDailyChallenge}>
        {t.dailyChallenge}
        {dailyCompleted && (
          <span className="daily-winner-badge" title={t.dailyChallengeCompletedTitle}>
            🏆
          </span>
        )}
      </button>
      <button className="menu-button" onClick={onHowToPlay}>
        {t.howToPlay}
      </button>
      <button className="menu-button" onClick={onCredits}>
        {t.credits}
      </button>
    </nav>
  );
}
