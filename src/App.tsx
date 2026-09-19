import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Cue } from './screens/Cue'
import { EmptyHome } from './screens/EmptyHome'
import { Estimate } from './screens/Estimate'
import { Experience } from './screens/Experience'
import { Home } from './screens/Home'
import { Onboarding } from './screens/Onboarding'
import { Plans } from './screens/Plans'
import { Profile } from './screens/Profile'
import { Result } from './screens/Result'
import { Transactions } from './screens/Transactions'
import { Widget } from './screens/Widget'
import { WhereItWent } from './screens/WhereItWent'

/**
 * Routes follow the screen keys in CLAUDE.md §6. The three nav destinations are
 * top level; everything else is a screen inside a flow and keeps a back button.
 */
export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        {/* Core flow */}
        <Route path="/" element={<Home />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/result" element={<Result />} />
        <Route path="/spend" element={<WhereItWent />} />

        {/* Nav destinations */}
        <Route path="/plans" element={<Plans />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/transactions" element={<Transactions />} />
        <Route path="/profile/experience" element={<Experience />} />

        {/* Phase 2 — these render without the bottom nav */}
        <Route path="/cue" element={<Cue />} />
        <Route path="/widget" element={<Widget />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/empty" element={<EmptyHome />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
