import type { DragEventHandler, ReactNode } from 'react'
import { cx } from '../lib/cx'
import { formatINR } from '../lib/format'
import { Chip, Icon, IconButton } from './primitives'
import { NestedBreakdown, Stack, foldItems } from './charts'
import type { IconName, NestItem, Segment, Tone } from './types'

/* ----------------------------------------------------------- HighlightCard */

export interface HighlightCardProps {
  title: ReactNode
  subtitle?: ReactNode
  tone?: 'sunflower' | 'butter'
  action?: ReactNode
}

export function HighlightCard({ title, subtitle, tone = 'sunflower', action }: HighlightCardProps) {
  return (
    <div className={cx('sm-card sm-highlight', tone)}>
      <div className="txt">
        <p className="t">{title}</p>
        {subtitle ? <p className="s">{subtitle}</p> : null}
      </div>
      {action || null}
    </div>
  )
}

/* ---------------------------------------------------------------- TaskCard */

export interface TaskCardProps {
  title: string
  time?: string
  subtitle?: string
  chips?: ReactNode[]
  people?: ReactNode
  onOpen?: () => void
  openLabel?: string
  tone?: 'surface' | 'soft'
}

export function TaskCard({ title, time, subtitle, chips = [], people, onOpen, openLabel, tone = 'surface' }: TaskCardProps) {
  return (
    <article className={cx('sm-card sm-task', tone)}>
      <div className="top">
        <div>
          {time ? <p className="time">{time}</p> : null}
          <h3 className="t">{title}</h3>
        </div>
        {people || null}
      </div>
      {subtitle ? <p className="s">{subtitle}</p> : null}
      <div className="foot">
        {chips.map((c, i) => (
          <Chip key={i}>{c}</Chip>
        ))}
        <IconButton variant="dark" icon="arrow-up-right" size="lg" label={openLabel || 'Open ' + title} onClick={onOpen} />
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ ProgressCard */

export interface ProgressCardProps {
  label: string
  message: ReactNode
  value: string
  toggle?: ReactNode
  icon?: IconName
  tone?: 'sky' | 'butter'
}

export function ProgressCard({ label, message, value, toggle, icon = 'chart', tone = 'sky' }: ProgressCardProps) {
  return (
    <section className={cx('sm-card sm-progress', tone)}>
      <div className="head">
        <span className="sm-iconbtn sm-sm light" aria-hidden>
          <Icon name={icon} size={16} />
        </span>
        {toggle || null}
      </div>
      <div className="body">
        <div>
          <p className="l">{label}</p>
          <p className="m">{message}</p>
        </div>
        <span className="v">{value}</span>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- PlanRow */

export interface PlanRowProps {
  title: string
  time: string
  active?: boolean
  onClick?: () => void
}

export function PlanRow({ title, time, active, onClick }: PlanRowProps) {
  return (
    <button type="button" className="sm-plan" aria-current={active ? 'step' : undefined} onClick={onClick}>
      <span className="t">{title}</span>
      <span className="time">{time}</span>
    </button>
  )
}

/* ----------------------------------------------------------------- LinkRow */

export interface LinkRowProps {
  title: string
  caption?: string
  icon?: IconName
  tone?: 'soft' | 'surface' | 'butter'
  onClick?: () => void
}

export function LinkRow({ title, caption, icon = 'arrow-up-right', tone = 'soft', onClick }: LinkRowProps) {
  return (
    <button type="button" className={cx('sm-linkrow', tone)} onClick={onClick}>
      <span className="main">
        <span className="t">{title}</span>
        {caption ? <span className="c">{caption}</span> : null}
      </span>
      <span className="sm-iconbtn sm-sm dark" aria-hidden>
        <Icon name={icon} size={16} />
      </span>
    </button>
  )
}

/* ----------------------------------------------------------- AmountSummary */

export interface AmountSummaryProps {
  value: string
  eyebrow?: string
  caption?: string
  size?: 'md' | 'lg'
  tone?: 'surface' | 'soft' | 'sky'
  segments?: Segment[]
  parts?: { label: string; value: string; tone?: Tone; hatch?: boolean }[]
  children?: ReactNode
}

export function AmountSummary({
  value,
  eyebrow,
  caption,
  size,
  tone = 'surface',
  segments,
  parts = [],
  children,
}: AmountSummaryProps) {
  return (
    <section className={cx('sm-card sm-amount', tone, size === 'lg' && 'sm-lg')}>
      {eyebrow ? <p className="sm-eyebrow">{eyebrow}</p> : null}
      <p className="v">{value}</p>
      {caption ? <p className="c">{caption}</p> : null}
      {segments ? <Stack segments={segments} /> : null}
      {parts.length ? (
        <dl className="sm-parts">
          {parts.map((x, i) => (
            <div key={i}>
              <dt>
                {x.tone ? <i className={cx('dot', 't-' + x.tone, x.hatch && 'hatch')} /> : null}
                {x.label}
              </dt>
              <dd>{x.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {children || null}
    </section>
  )
}

/* ----------------------------------------------------------- TransactionRow */

export interface TransactionRowProps {
  /** The "For?" line — what the payment was for, not who it was paid to (CLAUDE.md §2.7). */
  vendor: string
  amount: number
  bucket?: string
  time?: string
  tone?: Tone
  icon?: IconName
  initials?: string
  decimals?: number
  onClick?: () => void
}

export function TransactionRow({
  vendor,
  amount,
  bucket,
  time,
  tone = 'soft',
  icon = 'wallet',
  initials,
  decimals,
  onClick,
}: TransactionRowProps) {
  const incoming = amount > 0

  return (
    <button type="button" className="sm-txn" onClick={onClick}>
      <span className={'sm-badge t-' + tone}>{initials || <Icon name={icon} size={18} />}</span>
      <span className="sm-txn-main">
        <span className="v">{vendor}</span>
        <span className="m">{[bucket, time].filter(Boolean).join(' · ')}</span>
      </span>
      {/* The one place red and green are allowed in the design (CLAUDE.md §2.8). */}
      <span className={cx('sm-txn-amt', incoming ? 'pos' : 'out')}>
        <Icon name={incoming ? 'arrow-down-left' : 'arrow-up-right'} size={14} />
        {formatINR(amount, { sign: true, decimals })}
      </span>
    </button>
  )
}

/* ---------------------------------------------------------------- PlanItem */

export interface PlanItemProps {
  title: string
  meta?: string | null
  /** Displayed back to the student, never counted anywhere (CLAUDE.md §2.4). */
  amount?: string
  done?: boolean
  expanded?: boolean
  onToggle?: () => void
  onExpand?: () => void
  draggable?: boolean
  dragging?: boolean
  onDragStart?: DragEventHandler
  onDragEnd?: DragEventHandler
  onDragOver?: DragEventHandler
  onDrop?: DragEventHandler
  children?: ReactNode
}

export function PlanItem({
  title,
  meta,
  amount,
  done,
  expanded,
  onToggle,
  onExpand,
  draggable,
  dragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  children,
}: PlanItemProps) {
  return (
    <div
      className={cx('sm-planitem', expanded && 'open', done && 'done', dragging && 'dragging')}
      draggable={!!draggable && !expanded}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <button
        type="button"
        className="sm-check"
        aria-pressed={!!done}
        aria-label={(done ? 'Mark not done: ' : 'Mark done: ') + title}
        onClick={onToggle}
      >
        {done ? <Icon name="check" size={16} /> : null}
      </button>
      <button type="button" className="sm-planitem-main" aria-expanded={!!expanded} onClick={onExpand}>
        <span className="t">{title}</span>
        {meta ? <span className="m">{meta}</span> : null}
      </button>
      {amount ? <span className="sm-planitem-amt">{amount}</span> : null}
      {expanded ? (
        <IconButton icon="close" size="sm" label="Close details" onClick={onExpand} />
      ) : (
        <span className="sm-grip" aria-hidden>
          <Icon name="grip" size={20} />
        </span>
      )}
      {expanded && children ? <div className="sm-planitem-body">{children}</div> : null}
    </div>
  )
}

/* ------------------------------------------------------------ CategoryCard */

export interface CategoryCardProps {
  name: string
  spent: number
  color?: Tone
  items: NestItem[]
  selected?: string | null
  onSelect?: (id: string | null) => void
  onEdit?: () => void
  height?: number
  maxLevels?: number
  showPercent?: boolean
  footer?: ReactNode
}

export function CategoryCard({
  name,
  spent,
  color,
  items,
  selected,
  onSelect,
  onEdit,
  height,
  maxLevels = 4,
  showPercent,
  footer,
}: CategoryCardProps) {
  const shown = foldItems(items, maxLevels)
  const total = shown.reduce((a, x) => a + x.amount, 0) || 1
  const sel = shown.filter((x) => x.id === selected)[0]

  return (
    <article className="sm-card surface sm-category">
      <div className="sm-category-head">
        <div className="main">
          <h3 className="t">{name}</h3>
          {/* No limit and no "left"/"over" — the figure is stated, not judged (CLAUDE.md §2.1, §2.3). */}
          <p className="s">
            <b>{formatINR(spent)}</b>
          </p>
        </div>
        {onEdit ? <IconButton icon="edit" label={'Edit ' + name} onClick={onEdit} /> : null}
      </div>
      <NestedBreakdown
        items={items}
        color={color}
        selected={selected}
        onSelect={onSelect}
        height={height}
        label={name + ' by section'}
        showPercent={showPercent}
        maxLevels={maxLevels}
      />
      <p className="sm-category-note">
        {sel
          ? sel.label +
            ' · ' +
            formatINR(sel.amount) +
            ' · ' +
            Math.round((sel.amount / total) * 100) +
            '% of ' +
            name +
            (sel.caption ? ' · ' + sel.caption : '')
          : 'Tap a block to see what is inside it'}
      </p>
      {footer || null}
    </article>
  )
}

/* ---------------------------------------------------------- ResultHeadline */

export interface ResultHeadlineProps {
  before: string
  after: string
  eyebrow?: string
  caption?: string
  insight?: ReactNode
  tone?: 'surface' | 'sunflower' | 'sky' | 'butter'
  children?: ReactNode
}

export function ResultHeadline({ before, after, eyebrow, caption, insight, tone = 'surface', children }: ResultHeadlineProps) {
  return (
    <section className={cx('sm-card sm-result', tone)}>
      {eyebrow ? <p className="sm-eyebrow">{eyebrow}</p> : null}
      <p className="nums">
        <span className="from">{before}</span>
        <Icon name="arrow-up-right" size={22} className="sep" />
        <span className="to">{after}</span>
      </p>
      {caption ? <p className="c">{caption}</p> : null}
      {insight ? <p className="ins">{insight}</p> : null}
      {children || null}
    </section>
  )
}

/* ---------------------------------------------------------- ProjectionCard */

export interface ProjectionCardProps {
  value: string
  eyebrow?: string
  caption?: string
  splits: { id: string; label: string; pct: number; tone?: Tone }[]
  selected?: string | null
  onSelect?: (id: string | null) => void
  onExpand?: () => void
  expandLabel?: string
  children?: ReactNode
}

export function ProjectionCard({
  value,
  eyebrow = 'This month',
  caption,
  splits = [],
  selected,
  onSelect,
  onExpand,
  expandLabel,
  children,
}: ProjectionCardProps) {
  return (
    <section className="sm-projection">
      <div className="head">
        <p className="sm-eyebrow">{eyebrow}</p>
        {onExpand ? (
          <IconButton
            icon="arrow-up-right"
            variant="light"
            size="sm"
            label={expandLabel || 'See all spending'}
            onClick={onExpand}
          />
        ) : null}
      </div>
      <p className="v">{value}</p>
      {caption ? <p className="c">{caption}</p> : null}
      <ul className="splits">
        {splits.map((s) => {
          const on = selected === s.id
          return (
            <li key={s.id}>
              <button type="button" aria-pressed={on} onClick={() => onSelect?.(on ? null : s.id)}>
                <span className="n">{s.label}</span>
                <span className="bar">
                  <span className={'fill t-' + (s.tone || 'sky')} style={{ width: s.pct + '%' }} />
                </span>
                <span className="p">{s.pct + '%'}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {children || null}
    </section>
  )
}

/* ------------------------------------------------------------- InsightCard */

export interface InsightCardProps {
  children: ReactNode
  kind?: string
  detail?: string
  tone?: 'soft' | 'butter' | 'sky' | 'surface'
}

export function InsightCard({ children, kind = 'Pattern', detail, tone = 'soft' }: InsightCardProps) {
  return (
    <article className={cx('sm-insight', tone)}>
      <p className="sm-eyebrow">{kind}</p>
      <p className="t">{children}</p>
      {detail ? <p className="d">{detail}</p> : null}
    </article>
  )
}

/* ----------------------------------------------------------------- CueRow */

export interface CueRowProps {
  title: string
  when?: string
  note?: string | null
  /**
   * What the student has set aside for it, already formatted. Added beyond the
   * handoff's props: a plan is easier to recognise by its figure than its title.
   * Shown back only — no total, projection or chart reads it (CLAUDE.md §2.4).
   */
  amount?: string | null
  onClick?: () => void
}

export function CueRow({ title, when, note, amount, onClick }: CueRowProps) {
  const inner = (
    <>
      <span className="t">{title}</span>
      {amount ? <span className="a">{amount}</span> : null}
      {when ? <span className="w">{when}</span> : null}
      {note ? <span className="n">{note}</span> : null}
    </>
  )

  return onClick ? (
    <button type="button" className="sm-cue" onClick={onClick}>
      {inner}
      <Icon name="arrow-up-right" size={16} />
    </button>
  ) : (
    <div className="sm-cue">{inner}</div>
  )
}
