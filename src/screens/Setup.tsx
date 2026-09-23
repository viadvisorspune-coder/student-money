import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Button, TextField } from '../ui'
import { F } from '../lib/format'
import { useApp } from '../state/AppContext'

/**
 * Enter this month's figures by hand.
 *
 * For trying the app with a real student's numbers without typing out their whole
 * month. Whatever is entered here stands in for the figures derived from the
 * transactions, and every screen follows from it — free to spend, the projection, the
 * category shares, the patterns.
 *
 * Neither figure is a limit. The allowance is what came in, and passing it changes
 * nothing about how the app behaves (CLAUDE.md §2.1).
 */
export function Setup() {
  const app = useApp()
  const navigate = useNavigate()

  const [allowance, setAllowance] = useState(app.overrides.allowance?.toString() ?? '')
  const [spent, setSpent] = useState(app.overrides.spent?.toString() ?? '')

  const clean = (v: string) => +String(v).replace(/[^\d]/g, '')
  const a = clean(allowance)
  const s = clean(spent)
  const using = app.overrides.allowance != null || app.overrides.spent != null

  return (
    <div className="stack">
      <AppBar
        eyebrow="Try it with real numbers"
        title="This month's figures"
        onBack={() => navigate('/')}
        backLabel="Back to home"
      />

      <section className="sm-card surface decide">
        <TextField
          id="setup-allowance"
          label="Money in this month"
          prefix={'₹'}
          inputMode="numeric"
          value={allowance}
          placeholder="18,000"
          hint="Allowance, transfers, part-time work — everything that came in."
          onChange={(v) => setAllowance(v.replace(/[^\d,]/g, ''))}
        />

        <TextField
          id="setup-spent"
          label="Spent so far"
          prefix={'₹'}
          inputMode="numeric"
          value={spent}
          placeholder="10,057"
          hint="Everything that has gone out up to today."
          onChange={(v) => setSpent(v.replace(/[^\d,]/g, ''))}
        />

        {a > 0 && s >= 0 ? (
          <p className="setup-preview">{`That leaves ${F(a - s)} free to spend.`}</p>
        ) : null}

        <Button
          full
          disabled={!a}
          onClick={() => {
            app.setOverrides({ allowance: a || null, spent: s || 0 })
            app.say('Figures updated across the app.')
            navigate('/')
          }}
        >
          Use these figures
        </Button>
      </section>

      <p className="fine">
        Every screen follows from these two numbers. The category shares keep their proportions and are scaled to
        the total you enter, so the breakdowns stay consistent.
      </p>

      {using ? (
        <div className="exits">
          <Button
            full
            variant="soft"
            onClick={() => {
              app.setOverrides({ allowance: null, spent: null })
              app.say('Back to the figures from your transactions.')
              navigate('/')
            }}
          >
            Go back to the transaction figures
          </Button>
          <p className="fine">
            {`Your transactions say ${F(app.realIncome)} in and ${F(app.realSpent)} spent.`}
          </p>
        </div>
      ) : null}
    </div>
  )
}
