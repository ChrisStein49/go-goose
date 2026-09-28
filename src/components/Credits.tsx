import { useLanguage } from "../i18n/LanguageContext";

export function Credits() {
  const { t } = useLanguage();

  return (
    <div className="credits">
      <section>
        <h2>{t.creditsTitle}</h2>
        <p>{t.creditsDesign}</p>
        <p>{t.creditsConceptDevelopment}</p>
        <p>{t.creditsBuild}</p>
      </section>
    </div>
  );
}
