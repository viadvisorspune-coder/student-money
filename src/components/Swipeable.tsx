import { useRef, useState, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon } from '../ui'

interface SwipeableProps {
  children: ReactNode
  /** Which way the row may travel. 'right' reveals on the left edge, and vice versa. */
  side: 'left' | 'right'
  label: string
  onSwipe: () => void
  disabled?: boolean
}

/** Swipe a plan across to the other section. Ported from prototype/screens-v2.js. */
export function Swipeable({ children, side, label, onSwipe, disabled }: SwipeableProps) {
  const [dx, setDx] = useState(0)
  const start = useRef<number | null>(null)

  function down(e: React.PointerEvent) {
    if (disabled) return
    start.current = e.clientX
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture is a nicety, not a requirement */
    }
  }

  function move(e: React.PointerEvent) {
    if (start.current == null) return
    let d = e.clientX - start.current
    // Resist travel in the direction that has nothing behind it.
    d = side === 'right' ? Math.max(-24, d) : Math.min(24, d)
    setDx(d)
  }

  function up() {
    if (start.current == null) return
    const d = dx
    start.current = null
    setDx(0)
    if ((side === 'right' && d > 90) || (side === 'left' && d < -90)) onSwipe()
  }

  return (
    <div className="swipe-wrap">
      <span className={cx('swipe-bg', side)} aria-hidden>
        <Icon name="swap" size={16} />
        {label}
      </span>
      <div
        className="swipe-layer"
        style={dx ? { transform: `translateX(${dx}px)` } : undefined}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {children}
      </div>
    </div>
  )
}
