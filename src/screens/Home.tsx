import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CueRow, Icon } from '../ui'
import { F } from '../lib/format'
import { DISPLAY_DATE } from '../data/assumptions'
import { InfoTip } from '../components/InfoTip'
import { useApp } from '../state/AppContext'

/**
 * Home. Greeting, the "Kharcha with friends?" check CTA, the month card, Coming up.
 * Two hues and one primary action (CLAUDE.md §3): butter on the CTA, accent on the plus.
 */
export function Home() {
  const app = useApp()
  const navigate = useNavigate()
  const [sel, setSel] = useState<string | null>(null)

  const split = app.splits()
  const top = Math.max(...split.map((x) => x.pct).concat([1]))
  const selected = sel ? split.filter((y) => y.id === sel)[0] : undefined

  return (
    <div className="home">
      <header className="home-head">
        <div className="home-greet">
          {/* The greeting is this screen's title, so it carries the h1. */}
          <h1 className="hi">Hi Parisha,</h1>
          <p className="hi-sub">Here&rsquo;s where your money stands.</p>
        </div>
        <p className="hi-date">{DISPLAY_DATE}</p>
      </header>

      <button
        type="button"
        className="cta2"
        onClick={() => {
          app.setDecision(null)
          navigate('/estimate')
        }}
      >
        <span className="cta2-txt">
          <span className="t">Kharcha with friends?</span>
          <span className="s">Check before you spend</span>
        </span>
        <span className="cta2-btn" aria-hidden>
          <Icon name="plus" size={24} />
        </span>
      </button>

      <section className="group">
        <div className="sec-head">
          <h2>This month</h2>
          <InfoTip term="free" onOpen={app.setInfo} />
        </div>

        <div className="money">
          <p className="money-hero">{F(app.free)}</p>
          <p className="money-label">free to spend</p>
          <p className="money-sub">{`of ${F(app.income)} this month · ${F(app.spent)} spent so far`}</p>

          <div className="money-bars">
            {split.slice(0, 4).map((x) => (
              <button
                key={x.id}
                type="button"
                className="mb"
                aria-pressed={sel === x.id}
                onClick={() => setSel(sel === x.id ? null : x.id)}
              >
                <span className="n">{x.label}</span>
                <span className="bar">
                  <span className={'fill t-' + x.tone} style={{ width: Math.max(4, (x.pct / top) * 100) + '%' }} />
                </span>
                <span className="p">{x.pct + '%'}</span>
              </button>
            ))}
          </div>

          {selected ? (
            <p className="money-note">
              {`${selected.label} · ${F(selected.amount)} so far, ${selected.pct}% of the month`}
            </p>
          ) : null}

          <button
            type="button"
            className="money-link"
            onClick={() => {
              app.setDecision(null)
              navigate('/spend')
            }}
          >
            See where it went
            <Icon name="arrow-up-right" size={16} />
          </button>
        </div>
      </section>

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
