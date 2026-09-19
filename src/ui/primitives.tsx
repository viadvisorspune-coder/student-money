import { useState, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import type { IconName, Person } from './types'

/* -------------------------------------------------------------------- Icon */

const PATHS: Record<IconName, string> = {
  'arrow-up-right': 'M7 17L17 7M9 7h8v8',
  'arrow-down-right': 'M7 7l10 10M17 9v8H9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  close: 'M6 6l12 12M18 6L6 18',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  share: 'M17 5.5a2 2 0 1 0 .01 0M7 12a2 2 0 1 0 .01 0M17 18.5a2 2 0 1 0 .01 0M8.8 11l6.4-4M8.8 13l6.4 4',
  chart: 'M4 16l5-5 4 3 7-7M15 7h5v5',
  swap: 'M7 8h11l-3-3M17 16H6l3 3',
  'chevron-down': 'M6 9l6 6 6-6',
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  grid: 'M5 5h6v6H5zM13 13h6v6h-6z',
  settings:
    'M12 9a3 3 0 1 0 .01 0M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20c1-3.5 3.8-5 7-5s6 1.5 7 5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  wallet: 'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4zM4 7V6a2 2 0 0 1 2-2h10M16 13.5h.01',
  plus: 'M12 5v14M5 12h14',
  filter: 'M4 6h16M7 12h10M10 18h4',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-down-left': 'M17 7L7 17M15 17H7V9',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12',
  food: 'M4 11h16a8 8 0 0 1-16 0zM9 4v3M12 3v4M15 4v3',
  bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
  bus: 'M6 4h12v12H6zM6 11h12M8 19v-3M16 19v-3M9 14h.01M15 14h.01',
  play: 'M8 5v14l11-7z',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  target: 'M12 12h.01M12 7a5 5 0 1 0 .01 0M12 3a9 9 0 1 0 .01 0',
}

export const iconNames = Object.keys(PATHS) as IconName[]

export interface IconProps {
  name: IconName
  size?: number
  className?: string | null
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      className={cx('sm-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={PATHS[name] || ''} />
    </svg>
  )
}

/* -------------------------------------------------------------- IconButton */

export interface IconButtonProps {
  icon: IconName
  /** Required: an icon-only control needs an accessible name. */
  label: string
  variant?: 'soft' | 'dark' | 'light' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function IconButton({ icon, label, variant = 'soft', size, className, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cx('sm-iconbtn', variant, size === 'lg' && 'sm-lg', size === 'sm' && 'sm-sm', className)}
      aria-label={label}
      onClick={onClick}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  )
}

/* -------------------------------------------------------------------- Chip */

export interface ChipProps {
  children: ReactNode
  variant?: 'soft' | 'light' | 'dark'
  icon?: IconName
  trend?: 'up' | 'down'
  className?: string
}

export function Chip({ children, variant = 'soft', icon, trend, className }: ChipProps) {
  return (
    <span className={cx('sm-chip', variant, className)}>
      {icon ? (
        <Icon name={icon} size={16} className={trend === 'up' ? 'sm-pos' : trend === 'down' ? 'sm-neg' : null} />
      ) : null}
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ Button */

export interface ButtonProps {
  children: ReactNode
  variant?: 'dark' | 'soft' | 'light' | 'danger'
  icon?: IconName
  full?: boolean
  size?: 'sm' | 'md'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function Button({
  children,
  variant = 'dark',
  icon,
  full,
  size,
  className,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('sm-button', variant, full && 'sm-full', size === 'sm' && 'sm-sm', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon ? <Icon name={icon} size={18} /> : null}
    </button>
  )
}

/* --------------------------------------------------------- SegmentedToggle */

export interface SegmentedToggleProps {
  options: { value: string; label: string }[]
  value?: string
  defaultValue?: string
  onChange?: (v: string) => void
  label?: string
}

export function SegmentedToggle({ options, value, defaultValue, onChange, label }: SegmentedToggleProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value)
  const val = value !== undefined ? value : inner

  return (
    <div className="sm-seg" role="group" aria-label={label || 'View'}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={val === o.value}
          onClick={() => {
            setInner(o.value)
            onChange?.(o.value)
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- FilterChips */

export interface FilterChipsProps {
  options: { value: string; label: string; count?: number }[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (v: string[]) => void
  /** Single-select behaves like a radio group that can also be cleared. */
  single?: boolean
  label?: string
}

export function FilterChips({ options, value, defaultValue, onChange, single, label }: FilterChipsProps) {
  const [inner, setInner] = useState<string[]>(defaultValue || [])
  const val = value || inner

  return (
    <div className="sm-filters" role="group" aria-label={label || 'Filter'}>
      {options.map((o) => {
        const on = val.indexOf(o.value) > -1
        return (
          <button
            key={o.value}
            type="button"
            className="sm-filter"
            aria-pressed={on}
            onClick={() => {
              const next = single
                ? on
                  ? []
                  : [o.value]
                : on
                  ? val.filter((v) => v !== o.value)
                  : val.concat([o.value])
              setInner(next)
              onChange?.(next)
            }}
          >
            {on ? <Icon name="check" size={16} /> : null}
            {o.label}
            {o.count != null ? <span className="n">{o.count}</span> : null}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------- AvatarStack */

export interface AvatarStackProps {
  people: Person[]
  max?: number
  extra?: number
  extraTone?: 'ink' | 'coral'
  size?: 'md' | 'lg'
}

export function AvatarStack({ people = [], max = 3, extra = 0, extraTone, size }: AvatarStackProps) {
  const shown = people.slice(0, max)
  const rest = extra + Math.max(0, people.length - max)

  return (
    <div className="sm-avatars" role="img" aria-label={people.length + extra + ' people'}>
      {shown.map((x, i) => (
        <span key={i} className={cx('sm-avatar', 't-' + (x.tone || 'soft'), size === 'lg' && 'sm-lg')} title={x.name}>
          {x.initials}
        </span>
      ))}
      {rest > 0 ? (
        <span className={cx('sm-avatar', extraTone === 'coral' ? 't-coral' : 't-ink', size === 'lg' && 'sm-lg')}>
          {'+' + rest}
        </span>
      ) : null}
    </div>
  )
}
