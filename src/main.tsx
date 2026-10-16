import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are self-hosted (bundled with the app) instead of loaded from Google's servers, so no
// visitor data is sent to Google. Same styles as before: Montserrat 400/600/400 italic, League Spartan 700.
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/montserrat/latin-400-italic.css'
import '@fontsource/montserrat/latin-600.css'
import '@fontsource/league-spartan/latin-700.css'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
