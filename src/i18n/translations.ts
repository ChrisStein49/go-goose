export type Language = "en" | "de";

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  menuBack: string;
  mapBack: string;
  nextLevel: string;
  levelBarSeparator: string;

  creditsDesign: string;
  creditsConceptDevelopment: string;
  creditsBuild: string;

  play: string;
  dailyChallenge: string;
  dailyChallengeCompletedTitle: string;
  howToPlay: string;
  credits: string;

  dailyCompleteTitle: string;
  dailyCompleteBody: string;
  playAgain: string;
  nextPuzzle: string;
  dailyPuzzleOf: (index: number, total: number) => string;
  dailySolvedAll: (count: number, moves: number) => string;
  dailyStreak: (streak: number) => string;
  shareResult: string;
  shareCopiedMessage: string;

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
  newRecord: string;
  matchedBest: string;
  starsTotal: (earned: number, total: number) => string;
  personalBestNew: (yours: number, best: number, proven: boolean) => string;
  personalBestKept: (yours: number, best: number, proven: boolean) => string;

  confirmLeaveMessage: string;
  yes: string;
  no: string;
}

export const en: Translations = {
  appTitle: "Go Goose",
  appSubtitle: "Push the geese so every color forms one connected flock.",
  menuBack: "← Menu",
  mapBack: "← Map",
  nextLevel: "Next Level →",
  levelBarSeparator: " · ",

  creditsDesign: "Design",
  creditsConceptDevelopment: "Concept and Development",
  creditsBuild: "Built with",

  play: "Play",
  dailyChallenge: "Today's Challenge",
  dailyChallengeCompletedTitle: "Today's Challenge completed",
  howToPlay: "How to Play",
  credits: "Credits",

  dailyCompleteTitle: "Congratulations!",
  dailyCompleteBody: "New levels tomorrow. Or play through today's levels again.",
  playAgain: "Play Again",
  nextPuzzle: "Next Puzzle →",
  dailyPuzzleOf: (index, total) => `Today's Puzzle: ${index} of ${total}`,
  dailySolvedAll: (count, moves) => `🏆 You solved all ${count} puzzles in ${moves} moves.`,
  dailyStreak: (streak) => `🔥 ${streak} day streak!`,
  shareResult: "Share Result",
  shareCopiedMessage: "Copied to clipboard!",

  undo: "Undo",
  reset: "Restart",

  howToGoalTitle: "Goal",
  howToGoalBody:
    "Every goose on the board has a color. Push the geese around until all the geese of each color are connected into a single group — they need to touch each other up, down, left, or right. Geese can move up, down, or sideways.",
  howToNotDone: "Not done — one green goose sits apart",
  howToDone: "Done — all green geese are together",
  howToMovingTitle: "Moving Geese",
  howToMovingBody:
    "Drag a goose in the direction you want to push it — or tap it to select it, then use the arrow keys. The goose then marches as far as it can, carrying along any geese directly in front of it, until it's stopped by the edge of the board or another goose.",
  howToBeforePushRight: "Before: goose on the left",
  howToAfterSlidEdge: "After: marched to the edge",
  howToBlockedTitle: "Blocked Cells",
  howToBlockedBody:
    "Grey cells are blocked. Geese can never enter or slide through them — a push stops right before one, just like it would at the edge of the board.",
  howToStoppedByBlocked: "After: marched to the blocked cell",
  howToFixedTitle: "Immovable Geese",
  howToFixedBody:
    "Some levels include geese that can't be moved. Such a goose sits in a grey cell marked with 📌. The cell blocks other geese just like a normal grey cell — but the goose inside still belongs to its flock, so you'll need to bring your other geese of that color to it.",
  howToConnectedToPinned: "Connected to the immovable goose",

  movesLabel: "Moves: ",
  bestKnownLabel: "Best known: ",
  levelCompletePlain: "Level complete!",
  newRecord: "Level complete! 🏆 New record!",
  matchedBest: "Level complete! 🏆 Matched best known score!",
  starsTotal: (earned, total) => `⭐ ${earned} / ${total} best scores matched`,
  personalBestNew: (yours, best, proven) =>
    `Level complete! New personal best: ${yours} moves (best known: ${best}${proven ? "" : "+"})`,
  personalBestKept: (yours, best, proven) =>
    `Level complete! Your best: ${yours} moves (best known: ${best}${proven ? "" : "+"})`,

  confirmLeaveMessage: "Leave the game?",
  yes: "Yes",
  no: "No",
};


export const de: Translations = {
  appTitle: "Gänseschar",
  appSubtitle: "Bewege die Gänse, bis jede Farbe zu einer Schar zusammenfindet.",
  menuBack: "← Menü",
  mapBack: "← Karte",
  nextLevel: "Nächstes Level →",
  levelBarSeparator: " · ",

  creditsDesign: "Design",
  creditsConceptDevelopment: "Konzept und Entwicklung",
  creditsBuild: "Erstellt mit",

  play: "Spielen",
  dailyChallenge: "Rätsel des Tages",
  dailyChallengeCompletedTitle: "Heutige Aufgabe gelöst",
  howToPlay: "Spielanleitung",
  credits: "Credits",

  dailyCompleteTitle: "Gratulation!",
  dailyCompleteBody: "Morgen gibt es neue Levels. Oder spiele die heutigen Levels noch einmal.",
  playAgain: "Nochmal spielen",
  nextPuzzle: "Nächstes Rätsel →",
  dailyPuzzleOf: (index, total) => `Heutiges Rätsel: ${index} von ${total}`,
  dailySolvedAll: (count, moves) => `🏆 Du hast alle ${count} Rätsel in ${moves} Zügen gelöst.`,
  dailyStreak: (streak) => (streak === 1 ? "🔥 1 Tag in Folge!" : `🔥 ${streak} Tage in Folge!`),
  shareResult: "Ergebnis teilen",
  shareCopiedMessage: "In die Zwischenablage kopiert!",

  undo: "Rückgängig",
  reset: "Neu starten",

  howToGoalTitle: "Ziel",
  howToGoalBody:
    "Jede Gans auf dem Spielfeld hat eine Farbe. Verschiebe die Gänse so lange, bis alle Gänse einer Farbe zu einer einzigen Gruppe verbunden sind — sie müssen einander oben, unten, links oder rechts berühren. Gänse bewgen sich nach oben, unten oder seitwärts.",
  howToNotDone: "Noch nicht fertig — eine grüne Gans sitzt abseits",
  howToDone: "Fertig — alle grünen Gänse sind zusammen",
  howToMovingTitle: "Gänse bewegen",
  howToMovingBody:
    "Ziehe eine Gans in die Richtung, in die du sie schieben willst — oder tippe sie an, um sie auszuwählen, und benutze dann die Pfeiltasten. Die Gans marschiert dann so weit wie möglich und nimmt dabei alle Gänse mit, die direkt vor ihr stehen, bis sie vom Spielfeldrand oder einer anderen Gans gestoppt wird.",
  howToBeforePushRight: "Vorher: Gans sitzt links",
  howToAfterSlidEdge: "Nachher: Gans ist bis zum Rand marschiert",
  howToBlockedTitle: "Blockierte Felder",
  howToBlockedBody:
    "Graue Felder sind blockiert. Gänse können sie nicht betreten oder durchqueren — ein Schub stoppt direkt davor, genau wie am Spielfeldrand.",
  howToStoppedByBlocked: "Nachher: Gans ist bis zum blockierten Feld marschiert",
  howToFixedTitle: "Unbewegliche Gänse",
  howToFixedBody:
    "Level können Gänse enthalten, die nicht bewegt werden können. Eine solche Gans sitzt in einem grauen Feld und ist mit 📌 markiert. Das Feld blockiert andere Gänse ebenso wie ein normales, graues Feld. Die Gans darin gehört aber auch zu ihrer Schar. Bring also andere Gänse dieser Farbe zu ihr hin.",
  howToConnectedToPinned: "Mit der unbeweglichen Gans verbunden",

  movesLabel: "Züge: ",
  bestKnownLabel: "Bestwert: ",
  levelCompletePlain: "Level geschafft!",
  newRecord: "Level geschafft! 🏆 Neuer Rekord!",
  matchedBest: "Level geschafft! 🏆 Bestwert erreicht!",
  starsTotal: (earned, total) => `⭐ ${earned} / ${total} Bestwerte erreicht`,
  personalBestNew: (yours, best, proven) =>
    `Level geschafft! Neue Bestleistung: ${yours} Züge (Bestwert: ${best}${proven ? "" : "+"})`,
  personalBestKept: (yours, best, proven) =>
    `Level geschafft! Deine Bestleistung: ${yours} Züge (Bestwert: ${best}${proven ? "" : "+"})`,

  confirmLeaveMessage: "Spiel verlassen?",
  yes: "Ja",
  no: "Nein",
};

export const translations: Record<Language, Translations> = { en, de };
