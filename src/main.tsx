// Modules
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router';

// Components
import App from './App.tsx'

// Context
import { ChallengesProvider } from './context/challenges';

// Styles
import './index.css'

// Service workers
import './worker';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ChallengesProvider>
        <App />
      </ChallengesProvider>
    </Router>
  </StrictMode>,
)
