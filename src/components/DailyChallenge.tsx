interface DailyChallengeProps {
  onBack: () => void;
}

export function DailyChallenge({ onBack }: DailyChallengeProps) {
  return (
    <div className="daily-challenge">
      <button onClick={onBack}>← Menu</button>
      <section>
        <h2>Today's Challenge</h2>
        <p>
          Coming soon — a new puzzle every day, with scores you can compare against other
          players.
        </p>
      </section>
    </div>
  );
}
