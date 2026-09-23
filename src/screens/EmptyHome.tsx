import { useNavigate } from 'react-router-dom'
import { Button, Icon, LinkRow, SectionHeader } from '../ui'
import { useApp } from '../state/AppContext'

/**
 * Phase 2 — the empty state, before there is any data.
 * The figure reads "—" rather than a zero dressed up as progress (CLAUDE.md §2.3).
 * Rendered without the bottom nav (§6).
 */
export function EmptyHome() {
  const app = useApp()
  const navigate = useNavigate()

  return (
    <div className="stack">
      <h1 className="greeting">Hi Parisha,</h1>
      <p className="greeting-sub">Nothing to show yet.</p>

      <section className="sm-projection">
        <p className="sm-eyebrow">Free to spend</p>
        <p className="v">&mdash;</p>
        <p className="c">Your first payment will fill this in. Until then, there is nothing to report.</p>
        <div className="empty-bars" aria-hidden>
          {[1, 2, 3].map((i) => (
            <span key={i} />
          ))}
        </div>
      </section>

      <button
        type="button"
        className="sm-card sunflower cta"
        onClick={() => {
          app.setDecision(null)
          navigate('/')
        }}
      >
        <span className="t">Kharcha with friends?</span>
        <span className="s">Works from day one — it only needs the amount</span>
        <span className="sm-iconbtn dark sm-lg" aria-hidden>
          <Icon name="arrow-up-right" />
        </span>
      </button>

      <SectionHeader onCanvas title="Get going" />

      <LinkRow
        tone="surface"
        title="Add your first payment"
        caption="Cash or anything the app did not catch"
        onClick={() => {
          app.setAdd(true)
          navigate('/profile/transactions')
        }}
      />
      <LinkRow
        tone="surface"
        title="Note something coming up"
        caption="A birthday, a trip, an appointment"
        onClick={() => navigate('/plans')}
      />
      <LinkRow
        tone="butter"
        title="Choose what the app reads"
        caption="Remarks and amounts, or nothing at all"
        onClick={() => {
          app.setStep(0)
          navigate('/onboarding')
        }}
      />

      <div style={{ marginTop: 16 }}>
        <Button full variant="soft" onClick={() => navigate('/')}>
          Back to the filled-in app
        </Button>
      </div>
    </div>
  )
}
