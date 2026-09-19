import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Button, SelectField } from '../ui'
import { F } from '../lib/format'
import { QUICK_AMOUNTS } from '../data/assumptions'
import { useApp } from '../state/AppContext'

/**
 * Estimated spend. Amount, quick amounts, and "For?".
 * This screen records nothing — it only sets up the simulation (CLAUDE.md §2.5).
 */
export function Estimate() {
  const app = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ amount: '', forId: '' })

  const amount = +String(form.amount).replace(/[^\d]/g, '')

  return (
    <div className="stack">
      <AppBar
        eyebrow="Before you spend"
        title="Estimated spend"
        onBack={() => navigate('/')}
        backLabel="Back to home"
      />

      <section className="sm-card surface estimate">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!amount) return
            app.setDecision({
              amount,
              label: form.forId ? (app.bmap[form.forId] ? app.bmap[form.forId].name.toLowerCase() : 'this') : 'this',
              bucket: form.forId || null,
            })
            navigate('/result')
          }}
        >
          <label className="big-amt" htmlFor="est-amt">
            <span className="sm-sr">Amount</span>
            <span className="cur">{'₹'}</span>
            <input
              id="est-amt"
              inputMode="numeric"
              placeholder="___"
              value={form.amount}
              autoComplete="off"
              onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^\d]/g, '') })}
            />
          </label>

          <div className="quick-amts" role="group" aria-label="Common amounts">
            {QUICK_AMOUNTS.map((v) => (
              <button
                key={v}
                type="button"
                className="sm-chip soft"
                aria-pressed={String(v) === form.amount}
                onClick={() => setForm({ ...form, amount: String(v) })}
              >
                {F(v)}
              </button>
            ))}
          </div>

          <SelectField
            id="est-for"
            label="For?"
            value={form.forId}
            onChange={(v) => setForm({ ...form, forId: v })}
            options={[{ value: '', label: 'Not sure yet' }].concat(
              app.buckets.map((b) => ({ value: b.id, label: b.name })),
            )}
            hint="Not sure is fine. It only decides which category the check is against."
          />

          <Button type="submit" full disabled={!amount}>
            Check
          </Button>
        </form>
      </section>

      <p className="fine">
        Nothing is recorded here. This only shows what the spend would do to the rest of your month.
      </p>
    </div>
  )
}
