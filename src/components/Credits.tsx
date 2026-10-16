import { useLanguage } from "../i18n/LanguageContext";

const GANZGRAZ_URL = "https://ganzgraz.at/";
const NEWSLETTER_URL = "https://news.ganzgraz.at";
const MEMBERSHIP_URL = `${GANZGRAZ_URL}mitmachen`;

export function Credits() {
  const { t } = useLanguage();

  return (
    <div className="credits">
      <section>
        <p>
          <strong>{t.creditsDesign}:</strong>{" "}
          <a className="credits-link" href={GANZGRAZ_URL} target="_blank" rel="noopener noreferrer">
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

      <a className="credits-logo-link" href={GANZGRAZ_URL} target="_blank" rel="noopener noreferrer">
        <img className="credits-logo" src="/ganzgraz-logo.webp" alt="ganzgraz" />
      </a>

      <div className="credits-buttons">
        <a className="credits-button credits-button-newsletter" href={NEWSLETTER_URL} target="_blank" rel="noopener noreferrer">
          {t.creditsNewsletter}
        </a>
        <a className="credits-button credits-button-member" href={MEMBERSHIP_URL} target="_blank" rel="noopener noreferrer">
          {t.creditsMember}
        </a>
      </div>

      <nav className="credits-legal">
        <a className="credits-link" href={`${GANZGRAZ_URL}impressum`} target="_blank" rel="noopener noreferrer">
          {t.creditsImprint}
        </a>
        <a className="credits-link" href={`${GANZGRAZ_URL}datenschutzerklaerung`} target="_blank" rel="noopener noreferrer">
          {t.creditsPrivacy}
        </a>
      </nav>
    </div>
  );
}
