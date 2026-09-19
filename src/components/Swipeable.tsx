import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon } from '../ui'

/** How far a finger must travel sideways before this counts as a swipe and not a tap. */
const DRAG_THRESHOLD = 8

/** How far it must travel before releasing completes the move. */
const COMMIT_DISTANCE = 90

interface SwipeableProps {
  children: ReactNode
  /** Which way the row may travel. 'right' reveals on the left edge, and vice versa. */
  side: 'left' | 'right'
  label: string
  onSwipe: () => void
  disabled?: boolean
}

/**
 * Swipe a plan across to the other section.
 *
 * Pointer capture is taken only once a sideways drag is actually under way, never on
 * the first touch. Capturing on pointerdown retargets the following click to this
 * wrapper, which swallowed every tap on the row — the checkbox, the row itself and
 * the buttons inside it all stopped working. A tap now reaches the button beneath,
 * and a mostly-vertical move is left alone so the page still scrolls.
 */
export function Swipeable({ children, side, label, onSwipe, disabled }: SwipeableProps) {
  const [dx, setDx] = useState(0)
  const start = useRef<{ x: number; y: number; id: number } | null>(null)
  const dragging = useRef(false)
  // How far the row has travelled, mirrored outside React state. `up` runs from the
  // handler of whatever render is current, so reading `dx` there can miss the last
  // move of a fast flick and lose the gesture.
  const travelled = useRef(0)

  function down(e: PointerEvent<HTMLDivElement>) {
    if (disabled) return
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
    dragging.current = false
  }

  function move(e: PointerEvent<HTMLDivElement>) {
    const s = start.current
    if (!s) return

    const movedX = e.clientX - s.x
    const movedY = e.clientY - s.y

    if (!dragging.current) {
      // Going down the page rather than across: the student is scrolling, so let go.
      if (Math.abs(movedY) > Math.abs(movedX)) {
        start.current = null
        return
      }
      if (Math.abs(movedX) < DRAG_THRESHOLD) return
      dragging.current = true
      try {
        e.currentTarget.setPointerCapture(s.id)
      } catch {
        // Capture is a nicety; the drag still tracks without it.
      }
    }

    // Resist travel in the direction that has nothing behind it.
    const next = side === 'right' ? Math.max(-24, movedX) : Math.min(24, movedX)
    travelled.current = next
    setDx(next)
  }

  function up(e: PointerEvent<HTMLDivElement>) {
    const s = start.current
    const wasDragging = dragging.current
    const distance = travelled.current

    start.current = null
    dragging.current = false
    travelled.current = 0
    setDx(0)

    if (s && wasDragging) {
      try {
        e.currentTarget.releasePointerCapture(s.id)
      } catch {
        /* already released */
      }
    }

    // A tap is not a swipe: only a real drag can move the plan.
    if (!wasDragging) return
    if ((side === 'right' && distance > COMMIT_DISTANCE) || (side === 'left' && distance < -COMMIT_DISTANCE)) {
      onSwipe()
    }
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
        onDragStartCapture={(e) => {
          if (dragging.current) e.preventDefault()
        }}
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
