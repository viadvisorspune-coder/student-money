import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../ui'
import { F } from '../lib/format'

interface Props {
  /** Everything that came in this month. */
  allowance: number
  /** Everything spent so far. */
  spent: number
  /** A simulated spend to animate towards. Nothing is recorded (CLAUDE.md §2.5). */
  pending?: number
  /** Count the figures up and grow the bar on arrival. */
  animate?: boolean
  /** Show the arrow through to Where it went. */
  onOpen?: () => void
}

/** Ease-out, so the bar arrives rather than stopping dead. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const DURATION = 900

/**
 * Spent against the month's allowance.
 *
 * The denominator is the money that actually came in — ₹18,000 this month — not a
 * figure anyone set. Nothing is capped, nothing is refused, and passing it changes no
 * behaviour: the bar simply fills. That is why this is not a limit in the sense
 * design/CLAUDE.md §2.1 forbids, and why nothing turns red (§2.8). The allowance is
 * derived from transactions like every other figure, so there is no limit to store.
 *
 * With `pending`, the bar animates from where the month stands to where it would
 * stand — the student watches the spend land instead of being told about it.
 */
export function AllowanceBar({ allowance, spent, pending = 0, animate, onOpen }: Props) {
  const target = spent + pending
  const [shown, setShown] = useState(animate ? spent : target)
  const frame = useRef<number>(0)

  useEffect(() => {
    if (!animate) {
      setShown(target)
      return
    }

    // Someone who has asked for less motion gets the end state, not the journey.
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (still) {
      setShown(target)
      return
    }

    const from = spent
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      setShown(from + (target - from) * ease(t))
      if (t < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [animate, spent, target])

  const pct = allowance > 0 ? Math.min(100, (shown / allowance) * 100) : 0
  // The part of the bar the simulated spend is adding, drawn in yellow behind the
  // figure so the student can see which piece of it is the spend they are weighing.
  const addPct = allowance > 0 ? Math.min(100 - pct, ((shown - spent) / allowance) * 100) : 0
  const left = Math.round(allowance - shown)

  return (
    <section className="allowance">
      <div className="allowance-head">
        <div>
          <p className="sm-eyebrow">This month</p>
          <p className="allowance-v">{F(Math.round(shown))}</p>
          <p className="allowance-of">{`spent of ${F(allowance)} that came in`}</p>
        </div>
        {/* Labelled rather than a bare arrow: an arrow on its own does not say where
            it goes, and this one goes somewhere specific. */}
        {onOpen ? (
          <button type="button" className="allowance-go" onClick={onOpen}>
            <span>Where it went</span>
            <Icon name="arrow-up-right" size={16} />
          </button>
        ) : null}
      </div>

      <div
        className="allowance-track"
        role="img"
        aria-label={`${F(Math.round(shown))} spent of ${F(allowance)} that came in this month`}
      >
        <span className="allowance-fill" style={{ width: pct - addPct + '%' }} />
        {addPct > 0 ? <span className="allowance-add" style={{ width: addPct + '%' }} /> : null}
      </div>

      {addPct > 0 ? (
        <p className="allowance-key">
          <span className="k k-spent">{`${F(spent)} already spent`}</span>
          <span className="k k-add">{`${F(Math.round(shown - spent))} this spend`}</span>
        </p>
      ) : null}

      <p className="allowance-left">{`${F(left)} free to spend`}</p>
    </section>
  )
}

/** The same bar, wired to the Where it went screen. */
export function AllowanceBarLinked(props: Omit<Props, 'onOpen'>) {
  const navigate = useNavigate()
  return <AllowanceBar {...props} onOpen={() => navigate('/spend')} />
}
