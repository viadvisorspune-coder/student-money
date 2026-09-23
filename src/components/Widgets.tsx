import { useNavigate } from 'react-router-dom'
import { Icon } from '../ui'
import { F } from '../lib/format'
import { DAYS_IN_MONTH, TODAY } from '../lib/calendar'
import { APP_NAME } from '../data/brand'
import { useApp } from '../state/AppContext'

/**
 * The two home-screen and lock-screen widgets.
 *
 * Both are read-only surfaces outside the app: neither records anything, and neither
 * offers an opinion on what the student should do (CLAUDE.md §2.3). They borrow the
 * language of the estimate card without being it — a widget has room for a figure and
 * a tap, not a form.
 */

/**
 * Informational. Where the month stands, at a glance, without opening anything.
 * Spent against what came in, and what is left.
 */
export function InfoWidget({ onOpen }: { onOpen?: () => void }) {
  const app = useApp()
  const navigate = useNavigate()
  const open = onOpen || (() => navigate('/'))

  const pct = app.income > 0 ? Math.min(100, (app.spent / app.income) * 100) : 0
  const daysLeft = DAYS_IN_MONTH - TODAY

  return (
    <button type="button" className="wg wg-info" onClick={open}>
      <span className="wg-head">
        <span className="wg-app">{APP_NAME}</span>
        <span className="wg-when">{`${daysLeft} days left`}</span>
      </span>

      <span className="wg-value">{F(app.free)}</span>
      <span className="wg-label">free to spend</span>

      <span className="wg-track" aria-hidden>
        <span className="wg-fill" style={{ width: pct + '%' }} />
      </span>
      <span className="wg-foot">{`${F(app.spent)} spent of ${F(app.income)}`}</span>
    </button>
  )
}

/**
 * The cue. A bar that looks like somewhere to type an amount — because it is the
 * question, not the form. A widget cannot run the check, so the first tap opens the
 * app on Home, where the real field is waiting.
 */
export function CueWidget({ onOpen }: { onOpen?: () => void }) {
  const app = useApp()
  const navigate = useNavigate()
  const open = onOpen || (() => navigate('/'))

  return (
    <div className="wg wg-cue">
      <span className="wg-head">
        <span className="wg-app">{APP_NAME}</span>
        <span className="wg-when">{F(app.free)} free</span>
      </span>

      <span className="wg-ask">Upcoming expense?</span>

      {/* Looks like a field and behaves like a door. Tapping it opens the app rather
          than pretending a widget can take typing. */}
      <button type="button" className="wg-bar" onClick={open}>
        <span className="cur">{'₹'}</span>
        <span className="ph">Type an amount</span>
        <span className="go" aria-hidden>
          <Icon name="arrow-up-right" size={16} />
        </span>
      </button>
    </div>
  )
}
