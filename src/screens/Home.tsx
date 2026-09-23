import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Combobox, CueRow, IconButton, type ComboOption } from '../ui'
import { F } from '../lib/format'
import { DISPLAY_DATE, QUICK_AMOUNTS } from '../data/assumptions'
import { AllowanceBarLinked } from '../components/AllowanceBar'
import { useApp } from '../state/AppContext'

/**
 * Home. The greeting, the decide form, spent-against-allowance, and Coming up.
 *
 * The check now happens here rather than on a screen of its own, so deciding is the
 * first thing on the first screen. Nothing on this form is recorded — it only sets up
 * the simulation the Result screen runs (CLAUDE.md §2.5).
 */
export function Home() {
  const app = useApp()
  const navigate = useNavigate()
  const [amountText, setAmountText] = useState('')
  const [forText, setForText] = useState('')
  const [forOption, setForOption] = useState<ComboOption | undefined>()

  const amount = +String(amountText).replace(/[^\d]/g, '')

  /**
   * Every section across every category, so "For?" offers what the spend actually is —
   * cabs, tapri, delivery — rather than only the broad category above it.
   */
  const options = useMemo<ComboOption[]>(
    () =>
      app.buckets.flatMap((b) =>
        b.outlets.map((o) => ({ value: `${b.id}:${o.id}`, label: o.name, group: b.name })),
      ),
    [app.buckets],
  )

  /**
   * A picked section carries its category with it. Typed text is matched against the
   * section and category names, and if it matches nothing that is fine — the check
   * still runs, just against the month as a whole rather than one category.
   */
  function resolveBucket(): string | null {
    if (forOption) return forOption.value.split(':')[0]
    const typed = forText.trim().toLowerCase()
    if (!typed) return null
    const bySection = options.filter((o) => o.label.toLowerCase() === typed)[0]
    if (bySection) return bySection.value.split(':')[0]
    const byCategory = app.buckets.filter((b) => b.name.toLowerCase() === typed)[0]
    return byCategory ? byCategory.id : null
  }

  function check(e: React.FormEvent) {
    e.preventDefault()
    if (!amount) return
    app.setDecision({
      amount,
      label: forText.trim() || 'this',
      bucket: resolveBucket(),
    })
    navigate('/result')
  }

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

      <h2 className="decide-head">Want to decide whether to spend?</h2>

      <section className="sm-card surface decide">
        <form onSubmit={check}>
          <label className="big-amt" htmlFor="home-amt">
            <span className="sm-sr">Amount</span>
            <span className="cur">{'₹'}</span>
            <input
              id="home-amt"
              className="amt"
              inputMode="numeric"
              placeholder="___"
              value={amountText}
              autoComplete="off"
              onChange={(e) => setAmountText(e.target.value.replace(/[^\d]/g, ''))}
            />
          </label>

          <div className="quick-amts" role="group" aria-label="Common amounts">
            {QUICK_AMOUNTS.map((v) => (
              <button
                key={v}
                type="button"
                className="sm-chip soft"
                aria-pressed={String(v) === amountText}
                onClick={() => setAmountText(String(v))}
              >
                {F(v)}
              </button>
            ))}
          </div>

          <Combobox
            id="home-for"
            label="For?"
            options={options}
            value={forText}
            onChange={(text, option) => {
              setForText(text)
              setForOption(option)
            }}
            placeholder="Cabs, tapri, delivery…"
            hint="Pick one or write it yourself. Not sure is fine — it only decides which category the check is against."
          />

          <Button type="submit" full disabled={!amount}>
            Check
          </Button>
        </form>
      </section>

      <p className="fine">
        Nothing is recorded here. This only shows what the spend would do to the rest of your month.
      </p>

      <div className="group">
        <AllowanceBarLinked allowance={app.income} spent={app.spent} />
      </div>

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
              <CueRow key={p.id} title={p.title} when={p.when} onClick={() => navigate('/plans')} />
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
