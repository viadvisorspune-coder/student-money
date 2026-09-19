import { cx } from '../lib/cx'
import { formatINR } from '../lib/format'
import type { NestItem, PieItem, Segment, Tone } from './types'

/* ------------------------------------------------------------------- Stack */

interface StackProps {
  segments?: Segment[]
  label?: string
}

/** The shared proportional bar behind AmountSummary and BucketBreakdown. */
export function Stack({ segments = [], label }: StackProps) {
  const total = segments.reduce((a, s) => a + Math.max(0, s.value), 0) || 1

  return (
    <div
      className="sm-stack"
      role="img"
      aria-label={label || segments.map((s) => s.label + ' ' + (s.display ?? s.value)).join(', ')}
    >
      {segments.map((s, i) => (
        <span
          key={i}
          className={cx('seg', 't-' + (s.tone || 'sky'), s.hatch && 'hatch')}
          style={{ flexGrow: Math.max(0, s.value) / total }}
        />
      ))}
    </div>
  )
}

/* --------------------------------------------------------------- RingChart */

export interface RingChartProps {
  rings: { label: string; value: number; max: number; tone?: Tone; display?: string }[]
  title?: string
  trailing?: React.ReactNode
  centerValue?: string
  centerLabel?: string
  size?: number
  onClick?: () => void
}

export function RingChart({ rings = [], title, trailing, centerValue, centerLabel, size = 200, onClick }: RingChartProps) {
  const n = rings.length
  const sw = n > 5 ? 8 : n > 3 ? 10 : 14
  const gap = n > 5 ? 5 : n > 3 ? 6 : 8
  const R = 100

  const fig = (
    <div className="sm-ring-fig" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        role="img"
        aria-label={rings.map((r) => r.label + ': ' + (r.display ?? r.value)).join(', ')}
      >
        {rings.map((r, i) => {
          const rad = R - i * (sw + gap)
          const c = 2 * Math.PI * rad
          const f = Math.max(0, Math.min(1, r.value / (r.max || 1)))
          return (
            <g key={i} transform="rotate(-90 110 110)">
              <circle cx={110} cy={110} r={rad} fill="none" className="track" strokeWidth={sw} />
              {f > 0 ? (
                <circle
                  cx={110}
                  cy={110}
                  r={rad}
                  fill="none"
                  className={'arc t-' + (r.tone || 'sky')}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  strokeDasharray={c * f + ' ' + c}
                />
              ) : null}
            </g>
          )
        })}
      </svg>
      {centerValue && n <= 3 ? (
        <div className="sm-ring-center">
          <span className="v">{centerValue}</span>
          {centerLabel ? <span className="l">{centerLabel}</span> : null}
        </div>
      ) : null}
    </div>
  )

  const legend = (
    <ul className="sm-legend">
      {rings.map((r, i) => (
        <li key={i}>
          <i className={'dot t-' + (r.tone || 'sky')} />
          <span className="l">{r.label}</span>
          <span className="v">{r.display ?? r.value}</span>
        </li>
      ))}
    </ul>
  )

  const inner = (
    <>
      {title || trailing ? (
        <div className="sm-ringcard-head">
          <p className="sm-eyebrow">{title}</p>
          {trailing || null}
        </div>
      ) : null}
      <div className="sm-ring">
        {fig}
        {legend}
      </div>
    </>
  )

  return onClick ? (
    <button type="button" className="sm-ringcard is-btn" onClick={onClick}>
      {inner}
    </button>
  ) : (
    <section className="sm-ringcard">{inner}</section>
  )
}

/* ---------------------------------------------------------------- BarChart */

export interface BarChartProps {
  bars: { id: string; label: string; value: number; display?: string }[]
  selected?: string | null
  onSelect?: (id: string | null) => void
  max?: number
  height?: number
  label?: string
}

export function BarChart({ bars = [], selected, onSelect, max, height = 132, label }: BarChartProps) {
  const top = max || Math.max(...bars.map((b) => b.value).concat([1]))

  return (
    <div className="sm-bars" role="group" aria-label={label || 'Spending chart'}>
      {bars.map((b) => {
        const on = selected === b.id
        const hh = Math.max(4, Math.round((b.value / top) * height))
        return (
          <button
            key={b.id}
            type="button"
            className="sm-bar"
            aria-pressed={on}
            aria-label={b.label + ': ' + (b.display ?? b.value)}
            onClick={() => onSelect?.(on ? null : b.id)}
          >
            <span className="val">{b.display ?? b.value}</span>
            <span className="col" style={{ height: hh }} />
            <span className="lab">{b.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------- BucketBreakdown */

export interface BucketBreakdownProps {
  items: { id?: string; name: string; amount: number; tone: Tone; display?: string }[]
}

export function BucketBreakdown({ items = [] }: BucketBreakdownProps) {
  const shown = items.filter((x) => x.amount > 0)
  const total = shown.reduce((a, x) => a + x.amount, 0) || 1

  return (
    <div className="sm-breakdown">
      <Stack segments={shown.map((x) => ({ label: x.name, value: x.amount, tone: x.tone, display: x.display }))} />
      <ul>
        {shown.map((x) => (
          <li key={x.id || x.name}>
            <i className={'dot t-' + x.tone} />
            <span className="n">{x.name}</span>
            <span className="pct">{Math.round((x.amount / total) * 100) + '%'}</span>
            <span className="a">{x.display ?? formatINR(x.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------- NestedBreakdown */

/** Tone ramp for the nested blocks; warm categories never sit next to a second yellow. */
export function nestTones(color: Tone | undefined, n: number): Tone[] {
  const base: Tone[] = ['sunflower', 'sky', 'soft', 'grey', 'coral']
  const warm = color === 'sunflower' || color === 'butter'
  const r: Tone[] = [color || 'coral'].concat(
    base.filter((t) => t !== color && !(warm && (t === 'butter' || t === 'sunflower'))),
  )
  return r.slice(0, n)
}

/** Sort by amount and fold everything past `max` into a single "Other" block. */
export function foldItems(items: NestItem[] | undefined, max: number): NestItem[] {
  const s = (items || []).filter((x) => x.amount > 0).slice().sort((a, b) => b.amount - a.amount)
  if (s.length > max) {
    const rest = s.slice(max - 1)
    return s.slice(0, max - 1).concat([
      {
        id: '__other',
        label: 'Other',
        amount: rest.reduce((a, x) => a + x.amount, 0),
        caption: rest.map((x) => x.label).join(', '),
      },
    ])
  }
  return s
}

export interface NestedBreakdownProps {
  items: NestItem[]
  color?: Tone
  selected?: string | null
  onSelect?: (id: string | null) => void
  height?: number
  maxLevels?: number
  showPercent?: boolean
  label?: string
  emptyText?: string
}

export function NestedBreakdown({
  items: rawItems,
  color,
  selected,
  onSelect,
  height = 280,
  maxLevels = 4,
  label,
  emptyText,
}: NestedBreakdownProps) {
  const items = foldItems(rawItems, maxLevels)
  const total = items.reduce((a, x) => a + x.amount, 0)

  if (!total) {
    return (
      <div className="sm-nest-empty" style={{ height: Math.round(height / 2) }}>
        {emptyText || 'Nothing spent here yet'}
      </div>
    )
  }

  const tones = nestTones(color, items.length)
  let cum = 1
  const hs: number[] = []
  const ws: number[] = []

  return (
    <div className="sm-nest" style={{ height }} role="group" aria-label={label || 'Breakdown'}>
      {items.map((x, i) => {
        const c = cum
        cum -= x.amount / total
        const s = Math.sqrt(c)
        const hh = i ? Math.max(64, Math.min(height * s, hs[i - 1] - 66)) : height
        const ww = i ? Math.max(36, Math.min(100 * s, ws[i - 1] - 20)) : 100
        hs.push(hh)
        ws.push(ww)
        const tone = x.tone || tones[i]
        const on = selected === x.id
        const pct = Math.round((x.amount / total) * 100)

        return (
          <button
            key={x.id}
            type="button"
            className={cx('sm-nest-box', 't-' + tone, on && 'on')}
            style={{ width: ww + '%', height: hh, zIndex: i + 1 }}
            aria-pressed={on}
            aria-label={x.label + ': ' + formatINR(x.amount) + ', ' + pct + '% of this category'}
            onClick={() => onSelect?.(on ? null : x.id)}
          >
            <span className="v">{formatINR(x.amount)}</span>
            <span className="l">{x.label}</span>
            <span className="pct">{pct + '%'}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- PieChart */

function polar(cx0: number, cy: number, r: number, a: number): [number, number] {
  const t = ((a - 90) * Math.PI) / 180
  return [cx0 + r * Math.cos(t), cy + r * Math.sin(t)]
}

function slicePath(cx0: number, cy: number, r: number, ri: number, a0: number, a1: number) {
  if (a1 - a0 >= 359.999) a1 = a0 + 359.999
  const s = polar(cx0, cy, r, a1)
  const e = polar(cx0, cy, r, a0)
  const si = polar(cx0, cy, ri, a0)
  const ei = polar(cx0, cy, ri, a1)
  const big = a1 - a0 > 180 ? 1 : 0
  return ['M', s[0], s[1], 'A', r, r, 0, big, 0, e[0], e[1], 'L', si[0], si[1], 'A', ri, ri, 0, big, 1, ei[0], ei[1], 'Z'].join(
    ' ',
  )
}

export interface PieChartProps {
  items: PieItem[]
  total?: number
  size?: number
  donut?: boolean
  centerValue?: string
  centerLabel?: string
  selected?: string | null
  onSelect?: (id: string | null) => void
}

export function PieChart({
  items: rawItems,
  total: totalProp,
  size = 190,
  donut,
  centerValue,
  centerLabel,
  selected,
  onSelect,
}: PieChartProps) {
  const items = (rawItems || []).filter((x) => x.value > 0)
  const total = totalProp || items.reduce((a, x) => a + x.value, 0) || 1
  let a = 0

  return (
    <div className="sm-pie">
      <div className="sm-pie-fig" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 190 190"
          width={size}
          height={size}
          role="img"
          aria-label={items.map((x) => x.label + ' ' + Math.round((x.value / total) * 100) + '%').join(', ')}
        >
          {items.map((x, i) => {
            const sweep = (x.value / total) * 360
            const d = slicePath(95, 95, 88, donut === false ? 0 : 52, a, a + sweep)
            a += sweep
            return (
              <path
                key={x.id || i}
                d={d}
                className={cx('slice', 't-' + (x.tone || 'sky'), selected === x.id && 'on')}
                onClick={onSelect ? () => onSelect(selected === x.id ? null : (x.id ?? null)) : undefined}
              />
            )
          })}
        </svg>
        {centerValue ? (
          <div className="sm-pie-center">
            <span className="v">{centerValue}</span>
            {centerLabel ? <span className="l">{centerLabel}</span> : null}
          </div>
        ) : null}
      </div>
      <ul className="sm-pie-legend">
        {items.map((x, i) => {
          const pct = Math.round((x.value / total) * 100)
          return (
            <li key={x.id || i}>
              <button
                type="button"
                aria-pressed={selected === x.id}
                onClick={onSelect ? () => onSelect(selected === x.id ? null : (x.id ?? null)) : undefined}
              >
                <i className={'dot t-' + (x.tone || 'sky')} />
                <span className="l">{x.label}</span>
                <span className="p">{pct + '%'}</span>
                {x.display ? <span className="v">{x.display}</span> : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ----------------------------------------------------------------- BarList */

export interface BarListProps {
  items: { id?: string; label: string; value: number; display?: string; tone?: Tone }[]
  max?: number
  onDark?: boolean
  selected?: string | null
  onSelect?: (id: string | null) => void
}

export function BarList({ items = [], max, onDark, selected, onSelect }: BarListProps) {
  const top = max || Math.max(...items.map((x) => x.value).concat([1]))

  return (
    <ul className={cx('sm-barlist', onDark && 'on-dark')}>
      {items.map((x, i) => (
        <li key={x.id || i}>
          <button
            type="button"
            aria-pressed={selected === x.id}
            aria-label={x.label + ': ' + (x.display ?? x.value)}
            onClick={onSelect ? () => onSelect(selected === x.id ? null : (x.id ?? null)) : undefined}
          >
            <span className="n">{x.label}</span>
            <span className="bar">
              <span className={'fill t-' + (x.tone || 'sky')} style={{ width: Math.max(2, (x.value / top) * 100) + '%' }} />
            </span>
            <span className="v">{x.display ?? x.value}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
