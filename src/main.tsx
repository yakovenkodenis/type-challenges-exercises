// Modules
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router } from 'react-router';

// Components
import App from './App.tsx'

// Context
import { ChallengesProvider } from './context/challenges';
import { CurrentChallengeProvider } from './context/current-challenge';

// Styles
import './index.css'

// Service workers
import './worker';

if (import.meta.env.MODE === 'development') {
  import('@locator/runtime').then((setupLocatorUI) => setupLocatorUI.default());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ChallengesProvider>
        <CurrentChallengeProvider>
          <App />
        </CurrentChallengeProvider>
      </ChallengesProvider>
    </Router>
  </StrictMode>,
)
