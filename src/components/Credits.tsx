interface CreditsProps {
  onBack: () => void;
}

export function Credits({ onBack }: CreditsProps) {
  return (
    <div className="credits">
      <button onClick={onBack}>← Menu</button>
      <section>
        <h2>Credits</h2>
        <p>Go Goose was designed and built by Christoph.</p>
        <p className="credits-note">Built with Claude Code.</p>
      </section>
    </div>
  );
}
