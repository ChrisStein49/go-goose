export type Language = "en" | "de";

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  menuBack: string;
  mapBack: string;
  nextLevel: string;
  levelBarSeparator: string;

  creditsTitle: string;
  creditsBody: string;
  creditsNote: string;

  play: string;
  dailyChallenge: string;
  dailyChallengeCompletedTitle: string;
  howToPlay: string;
  credits: string;

  dailyCompleteTitle: string;
  dailyCompleteBody: string;
  playAgain: string;
  nextPuzzle: string;
  puzzleOf: (index: number, total: number) => string;
  dailySolvedAll: (count: number) => string;

  undo: string;
  reset: string;

  howToGoalTitle: string;
  howToGoalBody: string;
  howToNotDone: string;
  howToDone: string;
  howToMovingTitle: string;
  howToMovingBody: string;
  howToBeforePushRight: string;
  howToAfterSlidEdge: string;
  howToBlockedTitle: string;
  howToBlockedBody: string;
  howToStoppedByBlocked: string;
  howToFixedTitle: string;
  howToFixedBody: string;
  howToConnectedToPinned: string;

  movesLabel: string;
  bestKnownLabel: string;
  levelCompletePlain: string;
  /** `best` is a pre-formatted score (already includes a trailing "+" for unproven bounds). */
  newRecord: (best: string, moves: number) => string;
  matchedBest: string;
  /** `best` is a pre-formatted score (already includes a trailing "+" for unproven bounds). */
  completeTryBeat: (best: string) => string;
}

export const en: Translations = {
  appTitle: "Go Goose",
  appSubtitle: "Push the geese so every color forms one connected flock.",
  menuBack: "← Menu",
  mapBack: "← Map",
  nextLevel: "Next Level →",
  levelBarSeparator: " · ",

  creditsTitle: "Credits",
  creditsBody: "Go Goose was designed and built by Christoph.",
  creditsNote: "Built with Claude Code.",

  play: "Play",
  dailyChallenge: "Today's Challenge",
  dailyChallengeCompletedTitle: "Today's Challenge completed",
  howToPlay: "How to Play",
  credits: "Credits",

  dailyCompleteTitle: "Today's Challenge complete!",
  dailyCompleteBody: "Come back tomorrow for a new set — or play through today's again.",
  playAgain: "Play Again",
  nextPuzzle: "Next Puzzle →",
  puzzleOf: (index, total) => `Puzzle ${index} of ${total}`,
  dailySolvedAll: (count) => `🏆 You solved all ${count} puzzles.`,

  undo: "Undo",
  reset: "Restart",

  howToGoalTitle: "The Goal",
  howToGoalBody:
    "Every goose on the board has a color. Push the geese around until all the geese of each color are connected into a single group — touching up, down, left, or right. Try to do it in as few moves as possible.",
  howToNotDone: "Not done — one green goose sits apart",
  howToDone: "Done — all green geese connected",
  howToMovingTitle: "Moving Geese",
  howToMovingBody:
    "Drag a goose in the direction you want to push it — or tap it to select it, then use the arrow keys. The goose slides as far as it can, and it carries along any geese directly in front of it, until it's blocked by the edge of the board or another goose.",
  howToBeforePushRight: "Before: push right",
  howToAfterSlidEdge: "After: slid to the edge",
  howToBlockedTitle: "Blocked Cells",
  howToBlockedBody:
    "Some levels have permanently blocked cells (shown in grey). Geese can never enter or slide through them — a push stops right before one, just like it would at the edge of the board.",
  howToStoppedByBlocked: "Stopped by the blocked cell",
  howToFixedTitle: "Fixed Geese",
  howToFixedBody:
    "Some levels include a goose that's permanently pinned in place (marked with 📌). It can never be pushed, and it blocks movement just like a blocked cell — but it still counts toward its color's connection requirement, so you'll need to bring your other geese of that color to it.",
  howToConnectedToPinned: "Connected to the pinned goose",

  movesLabel: "Moves: ",
  bestKnownLabel: "Best known: ",
  levelCompletePlain: "Level complete!",
  newRecord: (best, moves) => `🏆 New record! Beat the best known score (${best}) with ${moves}.`,
  matchedBest: "🏆 Matched the best known score!",
  completeTryBeat: (best) => `Level complete! Best known: ${best} — try again to beat it.`,
};


export const de: Translations = {
  appTitle: "Gänsemarsch",
  appSubtitle: "Bewege die Gänse, bis jede Farbe zu einem Schwarm zusammenfindet.",
  menuBack: "← Menü",
  mapBack: "← Karte",
  nextLevel: "Nächstes Level →",
  levelBarSeparator: " · ",

  creditsTitle: "Credits",
  creditsBody: "Gänsemarsch wurde von Christoph entworfen und entwickelt.",
  creditsNote: "Erstellt mit Claude Code.",

  play: "Spielen",
  dailyChallenge: "Heutiges Rätsel",
  dailyChallengeCompletedTitle: "Heutiges Rätsel abgeschlossen",
  howToPlay: "Spielanleitung",
  credits: "Credits",

  dailyCompleteTitle: "Heutiges Rätsel abgeschlossen!",
  dailyCompleteBody: "Komm morgen für ein neues Set wieder vorbei — oder spiele die heutigen Rätsel noch einmal.",
  playAgain: "Nochmal spielen",
  nextPuzzle: "Nächstes Rätsel →",
  puzzleOf: (index, total) => `Rätsel ${index} von ${total}`,
  dailySolvedAll: (count) => `🏆 Du hast alle ${count} Rätsel gelöst.`,

  undo: "Rückgängig",
  reset: "Neu starten",

  howToGoalTitle: "Das Ziel",
  howToGoalBody:
    "Jede Gans auf dem Spielfeld hat eine Farbe. Schiebe die Gänse so lange herum, bis alle Gänse einer Farbe zu einer einzigen Gruppe verbunden sind — sie müssen sich oben, unten, links oder rechts berühren. Versuche, das mit möglichst wenigen Zügen zu schaffen.",
  howToNotDone: "Noch nicht fertig — eine grüne Gans sitzt abseits",
  howToDone: "Fertig — alle grünen Gänse verbunden",
  howToMovingTitle: "Gänse bewegen",
  howToMovingBody:
    "Ziehe eine Gans in die Richtung, in die du sie schieben willst — oder tippe sie an, um sie auszuwählen, und benutze dann die Pfeiltasten. Die Gans gleitet so weit wie möglich und nimmt dabei alle Gänse mit, die direkt vor ihr stehen, bis sie vom Spielfeldrand oder einer anderen Gans gestoppt wird.",
  howToBeforePushRight: "Vorher: nach rechts geschoben",
  howToAfterSlidEdge: "Nachher: bis zum Rand gerutscht",
  howToBlockedTitle: "Blockierte Felder",
  howToBlockedBody:
    "Manche Level haben dauerhaft blockierte Felder (grau dargestellt). Gänse können sie nie betreten oder durchqueren — ein Schub stoppt direkt davor, genau wie am Spielfeldrand.",
  howToStoppedByBlocked: "Vom blockierten Feld gestoppt",
  howToFixedTitle: "Fixierte Gänse",
  howToFixedBody:
    "Manche Level enthalten eine Gans, die dauerhaft festgesteckt ist (markiert mit 📌). Sie kann nie geschoben werden und blockiert die Bewegung genau wie ein blockiertes Feld — zählt aber trotzdem zur Verbindung ihrer Farbe, du musst also deine anderen Gänse dieser Farbe zu ihr hinbringen.",
  howToConnectedToPinned: "Mit der fixierten Gans verbunden",

  movesLabel: "Züge: ",
  bestKnownLabel: "Bestwert: ",
  levelCompletePlain: "Level geschafft!",
  newRecord: (best, moves) => `🏆 Neuer Rekord! Bestwert (${best}) mit ${moves} Zügen unterboten.`,
  matchedBest: "🏆 Bestwert erreicht!",
  completeTryBeat: (best) => `Level geschafft! Bestwert: ${best} — versuch's nochmal, um ihn zu unterbieten.`,
};

export const translations: Record<Language, Translations> = { en, de };
