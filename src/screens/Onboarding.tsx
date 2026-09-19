import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, FilterChips } from '../ui'
import { useApp } from '../state/AppContext'

const PAGES = [
  {
    eyebrow: 'Welcome',
    title: 'Money you can actually see',
    body: 'This app does not budget for you and never tells you what to spend. It shows what a spend would do to the rest of your month, in your own numbers, and leaves the choice to you.',
    points: [
      'Check any spend before you make it',
      'See where your money actually went, by outlet',
      'Keep notes on what is coming up',
    ],
    cta: 'Next',
  },
  {
    eyebrow: 'What it reads',
    title: 'You decide what it can see',
    body: 'Pick what the app is allowed to use. You can change this any time, and clear everything from your profile.',
    cta: 'Next',
  },
  {
    eyebrow: 'Your categories',
    title: 'Start with these?',
    body: 'Keep the ones that sound like you. You can rename them, add sections and add new ones later.',
    cta: 'Start',
  },
]

/**
 * Phase 2 — onboarding. Privacy is a feature (CLAUDE.md §2.9): step two is the
 * student choosing what the app may read, and nothing here is required to use it.
 * Rendered without the bottom nav (§6).
 */
export function Onboarding() {
  const app = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    reads: ['remarks', 'amounts'],
    keep: ['eat', 'travel', 'subs', 'shop', 'ess'],
  })

  const step = app.step
  const page = PAGES[step]

  return (
    <div className="stack onboard">
      <div className="ob-dots">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i === step ? 'on' : ''} />
        ))}
      </div>

      <section className="sm-appbar">
        <p className="sm-eyebrow">{page.eyebrow}</p>
        <h1 className="sm-appbar-title">{page.title}</h1>
        <p className="plans-lede">{page.body}</p>
      </section>

      {step === 0 ? (
        <div className="sm-card surface">
          <ul className="rules-list">
            {page.points?.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="sm-card surface">
          <FilterChips
            label="What the app reads"
            value={form.reads}
            onChange={(v) => setForm({ ...form, reads: v })}
            options={[
              { value: 'remarks', label: 'Payment remarks' },
              { value: 'amounts', label: 'Amounts and dates' },
              { value: 'contacts', label: 'Who you paid' },
            ]}
          />
          <p className="hint-s">
            Remarks and amounts are what make &ldquo;dinner with Riya&rdquo; possible. Nothing leaves your phone, and
            none of it is needed to use the app — without them you can still add payments by hand.
          </p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="sm-card surface">
          <FilterChips
            label="Categories to start with"
            value={form.keep}
            onChange={(v) => setForm({ ...form, keep: v })}
            options={app.buckets.map((b) => ({ value: b.id, label: b.name }))}
          />
          <p className="hint-s">
            Sections inside them — delivery apps, cafés, tapri — fill in as you spend.
          </p>
        </div>
      ) : null}

      <div className="exits">
        <Button
          full
          onClick={() => {
            if (step < 2) {
              app.setStep(step + 1)
            } else {
              app.keepBuckets(form.keep)
              app.say('Set up. You can change any of this later.')
              navigate('/')
            }
          }}
        >
          {page.cta}
        </Button>

        {step > 0 ? (
          <button type="button" className="plainlink" onClick={() => app.setStep(step - 1)}>
            Back
          </button>
        ) : (
          <button type="button" className="plainlink" onClick={() => navigate('/')}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  )
}
