import type { Language } from "./translations";

const STORAGE_KEY = "go-goose-language";

function detectBrowserLanguage(): Language {
  const lang = typeof navigator !== "undefined" ? navigator.language : "en";
  return lang.toLowerCase().startsWith("de") ? "de" : "en";
}

export function loadLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "de") return stored;
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
  return detectBrowserLanguage();
}

export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}
