import { useEffect, useState, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon, IconButton } from './primitives'
import type { IconName } from './types'

/* ------------------------------------------------------------------ AppBar */

export interface AppBarProps {
  title: ReactNode
  eyebrow?: string
  onBack?: () => void
  backLabel?: string
  trailing?: ReactNode
  children?: ReactNode
}

export function AppBar({ title, eyebrow, onBack, backLabel, trailing, children }: AppBarProps) {
  return (
    <header className="sm-appbar">
      <div className="sm-appbar-top">
        {onBack ? <IconButton icon="arrow-left" label={backLabel || 'Back'} onClick={onBack} /> : <span />}
        {trailing || null}
      </div>
      {eyebrow ? <p className="sm-eyebrow">{eyebrow}</p> : null}
      <h1 className="sm-appbar-title">{title}</h1>
      {children || null}
    </header>
  )
}

/* ----------------------------------------------------------- SectionHeader */

export interface SectionHeaderProps {
  title: string
  action?: ReactNode
  onCanvas?: boolean
}

export function SectionHeader({ title, action, onCanvas }: SectionHeaderProps) {
  return (
    <div className={cx('sm-section', onCanvas && 'on-canvas')}>
      <h2>{title}</h2>
      {action || null}
    </div>
  )
}

/* --------------------------------------------------------------- BottomNav */

export interface BottomNavProps {
  items: { id: string; icon: IconName; label: string }[]
  active?: string
  defaultActive?: string
  onChange?: (id: string) => void
  showLabels?: boolean
}

export function BottomNav({ items, active, defaultActive, onChange, showLabels }: BottomNavProps) {
  const [inner, setInner] = useState(defaultActive ?? items[0]?.id)
  const act = active !== undefined ? active : inner

  return (
    <nav className="sm-nav" aria-label="Main">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-current={act === it.id ? 'page' : undefined}
          aria-label={it.label}
          onClick={() => {
            setInner(it.id)
            onChange?.(it.id)
          }}
        >
          <Icon name={it.icon} size={22} />
          {showLabels ? <span className="lab">{it.label}</span> : null}
        </button>
      ))}
    </nav>
  )
}

/* -------------------------------------------------------------- BottomSheet */

export interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  pill?: ReactNode
  trailing?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  inline?: boolean
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  pill,
  trailing,
  footer,
  children,
  inline,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={cx('sm-sheet-wrap', inline && 'inline')}>
      <div className="sm-scrim" onClick={onClose} />
      <div className="sm-sheet" role="dialog" aria-modal={!inline} aria-label={title}>
        <div className="sm-sheet-grab" aria-hidden />
        <div className="sm-sheet-head">
          <IconButton icon="close" label="Close" onClick={onClose} />
          {pill ? <span className="sm-chip dark">{pill}</span> : <span />}
          {trailing || <span className="sm-sheet-sp" />}
        </div>
        {title ? <h2 className="sm-sheet-title">{title}</h2> : null}
        {subtitle ? <p className="sm-sheet-sub">{subtitle}</p> : null}
        <div className="sm-sheet-body">{children}</div>
        {footer ? <div className="sm-sheet-foot">{footer}</div> : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- GreetingHero */

export interface GreetingHeroProps {
  eyebrow?: string
  children: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  stats?: ReactNode
}

export function GreetingHero({ eyebrow, children, leading, trailing, stats }: GreetingHeroProps) {
  return (
    <section className="sm-hero">
      <div className="sm-header-top">
        {leading || <span />}
        {trailing || null}
      </div>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{children}</h1>
      {stats ? <div className="sm-hero-stats">{stats}</div> : null}
    </section>
  )
}

/* ----------------------------------------------------------- CalendarHeader */

export interface CalendarHeaderProps {
  month: string
  days: { weekday: string; date: number }[]
  selected?: number
  defaultSelected?: number
  onSelect?: (d: number) => void
  onMonthClick?: () => void
  avatar?: ReactNode
}

export function CalendarHeader({
  month,
  days = [],
  selected,
  defaultSelected,
  onSelect,
  onMonthClick,
  avatar,
}: CalendarHeaderProps) {
  const [inner, setInner] = useState(defaultSelected)
  const sel = selected !== undefined ? selected : inner

  return (
    <header className="sm-header">
      <div className="sm-header-top">
        <button type="button" className="sm-iconbtn sm-sm" style={{ background: 'none', color: 'inherit' }} aria-label="Menu">
          <Icon name="menu" size={24} />
        </button>
        {avatar || null}
      </div>
      <button type="button" className="sm-month" style={{ marginTop: 24 }} onClick={onMonthClick}>
        {month}
        <Icon name="chevron-down" size={22} />
      </button>
      <div className="sm-dates" role="group" aria-label="Choose a day">
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            className="sm-date"
            aria-pressed={sel === d.date}
            onClick={() => {
              setInner(d.date)
              onSelect?.(d.date)
            }}
          >
            <span className="w">{d.weekday}</span>
            <span className="d">{d.date}</span>
          </button>
        ))}
      </div>
    </header>
  )
}
