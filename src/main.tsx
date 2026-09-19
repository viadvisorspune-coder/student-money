import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { App } from './App'
import { AppProvider } from './state/AppContext'

// Order matters: tokens, then the fonts that reference them, then the component
// bundle, then the screen styles that override it.
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/components.css'
import './styles/screens.css'

/**
 * Hash routing for static hosts that cannot rewrite unknown paths to index.html
 * (a plain object store, or a preview served from a subdirectory). Build with
 * VITE_HASH_ROUTER=true to switch; the app itself is identical either way.
 */
const Router = import.meta.env.VITE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html')

createRoot(root).render(
  <StrictMode>
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </StrictMode>,
)
