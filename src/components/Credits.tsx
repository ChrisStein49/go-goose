import { useLanguage } from "../i18n/LanguageContext";

export function Credits() {
  const { t } = useLanguage();

  return (
    <div className="credits">
      <section>
        <p>
          <strong>{t.creditsDesign}:</strong>{" "}
          <a className="credits-link" href="https://ganzgraz.at/" target="_blank" rel="noopener noreferrer">
            ganzgraz
          </a>
        </p>
        <p>
          <strong>{t.creditsConceptDevelopment}:</strong> Christoph Steinkellner
        </p>
        <p>
          <strong>{t.creditsBuild}:</strong> Claude Code
        </p>
      </section>
    </div>
  );
}
