import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, FilterChips, SectionHeader } from '../ui'
import { F } from '../lib/format'
import { DISPLAY_DATE } from '../data/assumptions'
import { weekdayAverage } from '../state/selectors'
import { useApp } from '../state/AppContext'

/** The cue in this mock fires on a Friday evening. */
const FRIDAY = 5

/**
 * Phase 2 — the notification cue shown before a known spending moment.
 *
 * The cue reports the student's own figures and offers a check. It never says what
 * to do (CLAUDE.md §2.3) and never compares them with anyone (§2.2). Rendered
 * without the bottom nav (§6).
 */
export function Cue() {
  const app = useApp()
  const navigate = useNavigate()
  const [rules, setRules] = useState<string[]>(['evenings', 'weekends'])

  // Both figures are Parisha's own, read from her transactions — not literals.
  const { average, occurrences } = weekdayAverage(app.txns, FRIDAY)

  return (
    <div className="lockwrap">
      <div className="lock">
        <p className="lock-date">{DISPLAY_DATE}</p>
        <p className="lock-time">6:40</p>

        <div className="notif">
          <div className="notif-head">
            <span className="notif-app">Student Money</span>
            <span className="notif-time">now</span>
          </div>
          <p className="notif-title">{`${F(app.free)} free · going out tonight?`}</p>
          <p className="notif-body">
            {`Last ${occurrences} Fridays you spent ${F(average)} on average. Check before you go.`}
          </p>
          <div className="notif-actions">
            <button
              type="button"
              className="na primary"
              onClick={() => {
                app.setDecision(null)
                navigate('/estimate')
              }}
            >
              Check
            </button>
            <button
              type="button"
              className="na"
              onClick={() => {
                app.say('Quiet for the rest of the week.')
                navigate('/')
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>

      <div className="lock-notes">
        <SectionHeader onCanvas title="When this is allowed to interrupt" />
        <div className="sm-card surface">
          <FilterChips
            label="Cue rules"
            value={rules}
            onChange={setRules}
            options={[
              { value: 'evenings', label: 'Friday and Saturday evenings' },
              { value: 'weekends', label: 'Before a planned outing' },
              { value: 'lowdays', label: 'When money is running low' },
            ]}
          />
          <ul className="rules-list">
            <li>At most two cues a week, never two days running.</li>
            <li>Silent after a &ldquo;Not now&rdquo; until the next week.</li>
            <li>Never during the night, and never on exam days you mark.</li>
            <li>A cue only ever reports your own figures. It never says what to do.</li>
          </ul>
        </div>
        <Button full variant="soft" onClick={() => navigate('/')}>
          Back to the app
        </Button>
      </div>
    </div>
  )
}
