import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loadLanguage, saveLanguage } from "./languageStorage";
import { translations, type Language, type Translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => loadLanguage());

  function setLanguage(next: Language) {
    setLanguageState(next);
    saveLanguage(next);
  }

  useEffect(() => {
    document.title = translations[language].appTitle;
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
