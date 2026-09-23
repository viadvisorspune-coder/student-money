/**
 * The Student Money design system, ported from design-system/components/bundle.js.
 *
 * Prop names and the tone classes are kept exactly as the handoff defines them, so
 * design-system/components/<Component>/README.md stays the reference (CLAUDE.md §5).
 *
 * One component from the bundle is deliberately not ported: `BucketCard`. It renders
 * "₹X of ₹Y · ₹Z left" with an "over" state, which is a limit — forbidden by
 * CLAUDE.md §2.1 and §2.3 — and no screen in prototype-v2 uses it. `CategoryCard`'s
 * optional `limit` prop is dropped for the same reason; prototype-v2 never passes it.
 * Both are listed as open items in README.md.
 */

export { Icon, IconButton, Chip, Button, SegmentedToggle, FilterChips, AvatarStack, iconNames } from './primitives'
export type {
  IconProps,
  IconButtonProps,
  ChipProps,
  ButtonProps,
  SegmentedToggleProps,
  FilterChipsProps,
  AvatarStackProps,
} from './primitives'

export { AppBar, SectionHeader, BottomNav, BottomSheet, GreetingHero, CalendarHeader } from './layout'
export type {
  AppBarProps,
  SectionHeaderProps,
  BottomNavProps,
  BottomSheetProps,
  GreetingHeroProps,
  CalendarHeaderProps,
} from './layout'

export { TextField, SelectField, DecisionInput } from './fields'
export { Combobox } from './Combobox'
export type { ComboboxProps, ComboOption } from './Combobox'
export type { TextFieldProps, SelectFieldProps, DecisionInputProps } from './fields'

export {
  Stack,
  RingChart,
  BarChart,
  BucketBreakdown,
  NestedBreakdown,
  PieChart,
  BarList,
  nestTones,
  foldItems,
} from './charts'
export type {
  RingChartProps,
  BarChartProps,
  BucketBreakdownProps,
  NestedBreakdownProps,
  PieChartProps,
  BarListProps,
} from './charts'

export {
  HighlightCard,
  TaskCard,
  ProgressCard,
  PlanRow,
  LinkRow,
  AmountSummary,
  TransactionRow,
  PlanItem,
  CategoryCard,
  ResultHeadline,
  ProjectionCard,
  InsightCard,
  CueRow,
} from './cards'
export type {
  HighlightCardProps,
  TaskCardProps,
  ProgressCardProps,
  PlanRowProps,
  LinkRowProps,
  AmountSummaryProps,
  TransactionRowProps,
  PlanItemProps,
  CategoryCardProps,
  ResultHeadlineProps,
  ProjectionCardProps,
  InsightCardProps,
  CueRowProps,
} from './cards'

export type { IconName, Tone, Segment, NestItem, PieItem, Person } from './types'

export { formatINR } from '../lib/format'
