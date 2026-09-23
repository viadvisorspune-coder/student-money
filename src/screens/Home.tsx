import { useNavigate } from 'react-router-dom'
import { CueRow, IconButton } from '../ui'
import { F } from '../lib/format'
import { setAside } from '../lib/plan'
import { DISPLAY_DATE } from '../data/assumptions'
import { AllowanceBarLinked } from '../components/AllowanceBar'
import { DecideForm } from '../components/DecideForm'
import { useApp } from '../state/AppContext'

/**
 * Home. The greeting, where the month stands, the decide form, and Coming up.
 *
 * The month leads: the student sees what they have spent against what came in before
 * they are asked about anything. The check sits under it rather than on a screen of
 * its own. Nothing on the form is recorded — it only sets up the simulation the
 * Result screen runs (CLAUDE.md §2.5).
 */
export function Home() {
  const app = useApp()
  const navigate = useNavigate()
  return (
    <div className="home">
      <header className="home-head">
        <div className="home-greet">
          {/* The greeting is this screen's title, so it carries the h1. */}
          <h1 className="hi">Hi Parisha,</h1>
          <p className="hi-sub">Here&rsquo;s where your money stands.</p>
        </div>
        <div className="home-corner">
          <p className="hi-date">{DISPLAY_DATE}</p>
          {/* The widgets as they sit on a phone, without leaving the app. */}
          <IconButton
            icon="star"
            variant="soft"
            size="sm"
            className="home-star"
            label="See the widgets on a phone"
            onClick={() => navigate('/widget')}
          />
          {/* Enter this month's figures by hand, for trying the app with real numbers. */}
          <IconButton
            icon="settings"
            variant="soft"
            size="sm"
            label="Enter this month's figures"
            onClick={() => navigate('/setup')}
          />
        </div>
      </header>

      <div className="group">
        <AllowanceBarLinked allowance={app.income} spent={app.spent} />
      </div>

      <h2 className="decide-head">Upcoming expense: write an estimate.</h2>

      <section className="sm-card surface decide">
        <DecideForm
          onSubmit={(d) => {
            app.setDecision(d)
            navigate('/result')
          }}
        />
      </section>

      <p className="fine">
        Nothing is recorded here. This only shows what the spend would do to the rest of your month.
      </p>

      {app.cues.length ? (
        <section className="group">
          <div className="sec-head">
            <h2>Coming up</h2>
            <button type="button" className="sec-link" onClick={() => navigate('/plans')}>
              All plans
            </button>
          </div>
          <div className="cues">
            {app.cues.slice(0, 2).map((p) => (
              <CueRow
                key={p.id}
                title={p.title}
                when={p.when}
                // Shown back, never counted (CLAUDE.md §2.4).
                amount={setAside(p.amount)}
                onClick={() => navigate('/plans')}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Stated, not scored. A skip moves no total (CLAUDE.md §2.5). */}
      {app.skipped.length ? (
        <p className="home-foot">
          {`You have skipped ${F(app.skipped.reduce((a, x) => a + x.amount, 0))} this month.`}
        </p>
      ) : null}
    </div>
  )
}
