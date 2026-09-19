import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { AppProvider } from './state/AppContext'

// Order matters: tokens, then the fonts that reference them, then the component
// bundle, then the screen styles that override it.
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/components.css'
import './styles/screens.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
