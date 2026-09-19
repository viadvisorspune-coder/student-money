import { useNavigate } from 'react-router-dom'
import { Button, Icon } from '../ui'
import { F } from '../lib/format'
import { DAYS_IN_MONTH, TODAY } from '../lib/calendar'
import { DISPLAY_DATE } from '../data/assumptions'
import { useApp } from '../state/AppContext'

const APPS = ['Messages', 'Camera', 'Maps', 'UPI', 'Photos', 'Notes', 'Music', 'Files']

/** Phase 2 — the home-screen widget. Rendered without the bottom nav (CLAUDE.md §6). */
export function Widget() {
  const app = useApp()
  const navigate = useNavigate()

  return (
    <div className="homescreen">
      <p className="hs-date">{DISPLAY_DATE}</p>

      <div className="hs-grid">
        {APPS.map((n) => (
          <span key={n} className="hs-app">
            <span className="hs-ico" />
            {n}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="hs-widget"
        onClick={() => {
          app.setDecision(null)
          navigate('/estimate')
        }}
      >
        <span className="w-top">
          <span className="w-name">Kharcha?</span>
          <span className="sm-iconbtn sm-sm dark" aria-hidden>
            <Icon name="arrow-up-right" size={16} />
          </span>
        </span>
        <span className="w-value">{F(app.free)}</span>
        <span className="w-label">{`free to spend · ${DAYS_IN_MONTH - TODAY} days left`}</span>
        <span className="w-bars">
          {app.splits().slice(0, 4).map((x) => (
            <span key={x.id} className={'w-bar t-' + x.tone} style={{ flexGrow: x.pct }} />
          ))}
        </span>
      </button>

      <p className="hs-note">Tap the widget to check a spend without opening the app first.</p>

      <div style={{ padding: '0 8px' }}>
        <Button full variant="soft" onClick={() => navigate('/')}>
          Back to the app
        </Button>
      </div>
    </div>
  )
}
