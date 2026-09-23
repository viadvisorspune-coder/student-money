import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { APP_NAME } from '../data/brand'
import { DISPLAY_DATE } from '../data/assumptions'
import { CueWidget, InfoWidget } from '../components/Widgets'
import { useApp } from '../state/AppContext'
import type { Tone } from '../ui/types'

/** Filler apps, so the widgets can be judged where they will actually sit. */
const APPS: { name: string; tone: Tone }[] = [
  { name: 'Messages', tone: 'sky' },
  { name: 'Camera', tone: 'grey' },
  { name: 'Maps', tone: 'positive' },
  { name: 'UPI', tone: 'coral' },
  { name: 'Photos', tone: 'sunflower' },
  { name: 'Notes', tone: 'butter' },
  { name: 'Music', tone: 'blush' },
  { name: 'Files', tone: 'soft' },
]

const DOCK: { name: string; tone: Tone }[] = [
  { name: 'Phone', tone: 'positive' },
  { name: 'Browser', tone: 'sky' },
  { name: 'Gallery', tone: 'blush' },
  { name: 'Settings', tone: 'grey' },
]

/**
 * Phase 2 — the widgets, shown on a pretend phone home screen so their placement can
 * be judged rather than imagined. Rendered without the bottom nav (CLAUDE.md §6).
 *
 * Two of them: one that only reports where the month stands, and one that asks about
 * an upcoming expense. Both are borrowed from the estimate card without being it —
 * a widget has room for a figure and a tap, not a form. The same pair sits on the
 * lock screen (see `/cue`).
 */
export function Widget() {
  const app = useApp()
  const navigate = useNavigate()

  // Opening from a widget always lands on Home with a clean form: the widget asks
  // the question, the app is where it gets answered. Nothing is carried across and
  // nothing is recorded on the way (CLAUDE.md §2.5).
  const openApp = () => {
    app.setDecision(null)
    navigate('/')
  }

  return (
    <div className="homescreen">
      {/* Simulates a phone home screen; the title is for assistive technology. */}
      <h1 className="sm-sr">The widgets on a phone home screen</h1>

      <div className="hs-face">
        <p className="hs-date">{DISPLAY_DATE}</p>

        {/* The cue sits where a thumb reaches first. */}
        <CueWidget onOpen={openApp} />

        <div className="hs-grid">
          {APPS.slice(0, 4).map((a) => (
            <span key={a.name} className="hs-app">
              <span className={'hs-ico t-' + a.tone} />
              {a.name}
            </span>
          ))}
        </div>

        <InfoWidget onOpen={openApp} />

        <div className="hs-grid">
          {APPS.slice(4).map((a) => (
            <span key={a.name} className="hs-app">
              <span className={'hs-ico t-' + a.tone} />
              {a.name}
            </span>
          ))}
        </div>

        <div className="hs-dock">
          {DOCK.map((a) => (
            <span key={a.name} className="hs-app">
              <span className={'hs-ico t-' + a.tone} />
              <span className="sm-sr">{a.name}</span>
            </span>
          ))}
        </div>
      </div>

      <p className="hs-note">
        The top widget asks; the lower one only reports. Tapping the bar opens {APP_NAME} on Home, where the
        field is waiting &mdash; a widget never takes the amount itself. Both sit on the lock screen too.
      </p>

      <div className="hs-exits">
        <Button full variant="soft" onClick={() => navigate('/cue')}>
          See them on the lock screen
        </Button>
        <Button full variant="soft" onClick={() => navigate('/')}>
          Back to the app
        </Button>
      </div>
    </div>
  )
}
