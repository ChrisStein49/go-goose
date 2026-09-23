import { useLanguage } from "../i18n/LanguageContext";

export function Credits() {
  const { t } = useLanguage();

  return (
    <div className="credits">
      <section>
        <h2>{t.creditsTitle}</h2>
        <p>{t.creditsBody}</p>
        <p className="credits-note">{t.creditsNote}</p>
      </section>
    </div>
  );
}
