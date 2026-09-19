import type * as React from 'react';
export type IconName = 'arrow-up-right'|'arrow-down-right'|'check'|'close'|'edit'|'share'|'chart'|'swap'|'chevron-down'|'home'|'grid'|'settings'|'user'|'menu'|'wallet'|'plus'|'filter'|'arrow-left'|'arrow-down-left'|'grip'|'trash'|'food'|'bag'|'bus'|'play'|'receipt'|'target';
export interface IconProps { name: IconName; size?: number; className?: string }
export declare function Icon(p: IconProps): React.ReactElement;
export interface IconButtonProps { icon: IconName; label: string; variant?: 'soft'|'dark'|'light'|'outline'; size?: 'sm'|'md'|'lg'; onClick?: () => void }
export declare function IconButton(p: IconButtonProps): React.ReactElement;
export interface ChipProps { children: React.ReactNode; variant?: 'soft'|'light'|'dark'; icon?: IconName; trend?: 'up'|'down' }
export declare function Chip(p: ChipProps): React.ReactElement;
export interface SegmentedToggleProps { options: { value: string; label: string }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; label?: string }
export declare function SegmentedToggle(p: SegmentedToggleProps): React.ReactElement;
export interface Person { initials: string; name?: string; tone?: 'sunflower'|'sky'|'butter'|'soft'|'coral'|'ink' }
export interface AvatarStackProps { people: Person[]; max?: number; extra?: number; extraTone?: 'ink'|'coral'; size?: 'md'|'lg' }
export declare function AvatarStack(p: AvatarStackProps): React.ReactElement;
export interface CalendarHeaderProps { month: string; days: { weekday: string; date: number }[]; selected?: number; defaultSelected?: number; onSelect?: (d: number) => void; onMonthClick?: () => void; avatar?: React.ReactNode }
export declare function CalendarHeader(p: CalendarHeaderProps): React.ReactElement;
export interface GreetingHeroProps { eyebrow?: string; children: React.ReactNode; leading?: React.ReactNode; trailing?: React.ReactNode; stats?: React.ReactNode }
export declare function GreetingHero(p: GreetingHeroProps): React.ReactElement;
export interface HighlightCardProps { title: React.ReactNode; subtitle?: React.ReactNode; tone?: 'sunflower'|'butter'; action?: React.ReactNode }
export declare function HighlightCard(p: HighlightCardProps): React.ReactElement;
export interface TaskCardProps { title: string; time?: string; subtitle?: string; chips?: React.ReactNode[]; people?: React.ReactNode; onOpen?: () => void; openLabel?: string; tone?: 'surface'|'soft' }
export declare function TaskCard(p: TaskCardProps): React.ReactElement;
export interface ProgressCardProps { label: string; message: React.ReactNode; value: string; toggle?: React.ReactNode; icon?: IconName; tone?: 'sky'|'butter' }
export declare function ProgressCard(p: ProgressCardProps): React.ReactElement;
export interface PlanRowProps { title: string; time: string; active?: boolean; onClick?: () => void }
export declare function PlanRow(p: PlanRowProps): React.ReactElement;
export interface BottomNavProps { items: { id: string; icon: IconName; label: string }[]; active?: string; defaultActive?: string; onChange?: (id: string) => void; showLabels?: boolean }
export declare function BottomNav(p: BottomNavProps): React.ReactElement;
export type Tone = 'coral'|'sunflower'|'sky'|'butter'|'blush'|'ink'|'grey'|'soft'|'positive';
export declare function formatINR(n: number, o?: { sign?: boolean; decimals?: number }): string;
export interface ButtonProps { children: React.ReactNode; variant?: 'dark'|'soft'|'light'|'danger'; icon?: IconName; full?: boolean; size?: 'sm'|'md'; onClick?: () => void; disabled?: boolean; type?: 'button'|'submit' }
export declare function Button(p: ButtonProps): React.ReactElement;
export interface AppBarProps { title: React.ReactNode; eyebrow?: string; onBack?: () => void; backLabel?: string; trailing?: React.ReactNode; children?: React.ReactNode }
export declare function AppBar(p: AppBarProps): React.ReactElement;
export interface SectionHeaderProps { title: string; action?: React.ReactNode; onCanvas?: boolean }
export declare function SectionHeader(p: SectionHeaderProps): React.ReactElement;
export interface LinkRowProps { title: string; caption?: string; icon?: IconName; tone?: 'soft'|'surface'|'butter'; onClick?: () => void }
export declare function LinkRow(p: LinkRowProps): React.ReactElement;
export interface Segment { label: string; value: number; tone?: Tone; display?: string; hatch?: boolean }
export interface AmountSummaryProps { value: string; eyebrow?: string; caption?: string; size?: 'md'|'lg'; tone?: 'surface'|'soft'|'sky'; segments?: Segment[]; parts?: { label: string; value: string; tone?: Tone; hatch?: boolean }[]; children?: React.ReactNode }
export declare function AmountSummary(p: AmountSummaryProps): React.ReactElement;
export interface RingChartProps { rings: { label: string; value: number; max: number; tone?: Tone; display?: string }[]; title?: string; trailing?: React.ReactNode; centerValue?: string; centerLabel?: string; size?: number; onClick?: () => void }
export declare function RingChart(p: RingChartProps): React.ReactElement;
export interface BarChartProps { bars: { id: string; label: string; value: number; display?: string }[]; selected?: string|null; onSelect?: (id: string|null) => void; max?: number; height?: number; label?: string }
export declare function BarChart(p: BarChartProps): React.ReactElement;
export interface BucketBreakdownProps { items: { id?: string; name: string; amount: number; tone: Tone; display?: string }[] }
export declare function BucketBreakdown(p: BucketBreakdownProps): React.ReactElement;
export interface BucketCardProps { name: string; value: number; limit: number; caption?: string; icon?: IconName; color?: Tone; goal?: boolean; tone?: 'surface'|'soft'; onEdit?: () => void }
export declare function BucketCard(p: BucketCardProps): React.ReactElement;
export interface TransactionRowProps { vendor: string; amount: number; bucket?: string; time?: string; tone?: Tone; icon?: IconName; initials?: string; decimals?: number; onClick?: () => void }
export declare function TransactionRow(p: TransactionRowProps): React.ReactElement;
export interface FilterChipsProps { options: { value: string; label: string; count?: number }[]; value?: string[]; defaultValue?: string[]; onChange?: (v: string[]) => void; single?: boolean; label?: string }
export declare function FilterChips(p: FilterChipsProps): React.ReactElement;
export interface DecisionInputProps { onSubmit?: (text: string) => void; eyebrow?: string; placeholder?: string; label?: string; submitLabel?: string; suggestions?: string[]; onSuggest?: (s: string) => void; id?: string }
export declare function DecisionInput(p: DecisionInputProps): React.ReactElement;
export interface TextFieldProps { label: string; value?: string; onChange?: (v: string) => void; placeholder?: string; prefix?: string; hint?: string; multiline?: boolean; inputMode?: string; id?: string }
export declare function TextField(p: TextFieldProps): React.ReactElement;
export interface BottomSheetProps { open: boolean; onClose: () => void; title?: string; subtitle?: string; pill?: React.ReactNode; trailing?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode; inline?: boolean }
export declare function BottomSheet(p: BottomSheetProps): React.ReactElement|null;
export interface PlanItemProps { title: string; meta?: string; amount?: string; done?: boolean; expanded?: boolean; onToggle?: () => void; onExpand?: () => void; draggable?: boolean; dragging?: boolean; onDragStart?: React.DragEventHandler; onDragEnd?: React.DragEventHandler; onDragOver?: React.DragEventHandler; onDrop?: React.DragEventHandler; children?: React.ReactNode }
export declare function PlanItem(p: PlanItemProps): React.ReactElement;
export interface NestItem { id: string; label: string; amount: number; display?: string; tone?: Tone; caption?: string }
export interface NestedBreakdownProps { items: NestItem[]; color?: Tone; selected?: string|null; onSelect?: (id: string|null) => void; height?: number; maxLevels?: number; showPercent?: boolean; label?: string; emptyText?: string }
export declare function NestedBreakdown(p: NestedBreakdownProps): React.ReactElement;
export interface CategoryCardProps { name: string; spent: number; limit?: number; color?: Tone; items: NestItem[]; selected?: string|null; onSelect?: (id: string|null) => void; onEdit?: () => void; height?: number; maxLevels?: number; showPercent?: boolean; footer?: React.ReactNode }
export declare function CategoryCard(p: CategoryCardProps): React.ReactElement;
export interface SelectFieldProps { label: string; options: { value: string; label: string }[]; value?: string; onChange?: (v: string) => void; placeholder?: string; hint?: string; id?: string }
export declare function SelectField(p: SelectFieldProps): React.ReactElement;
export interface ResultHeadlineProps { before: string; after: string; eyebrow?: string; caption?: string; insight?: React.ReactNode; tone?: 'surface'|'sunflower'|'sky'|'butter'; children?: React.ReactNode }
export declare function ResultHeadline(p: ResultHeadlineProps): React.ReactElement;
export interface ProjectionCardProps { value: string; eyebrow?: string; caption?: string; splits: { id: string; label: string; pct: number; tone?: Tone }[]; selected?: string|null; onSelect?: (id: string|null) => void; onExpand?: () => void; expandLabel?: string; children?: React.ReactNode }
export declare function ProjectionCard(p: ProjectionCardProps): React.ReactElement;
export interface InsightCardProps { children: React.ReactNode; kind?: string; detail?: string; tone?: 'soft'|'butter'|'sky'|'surface' }
export declare function InsightCard(p: InsightCardProps): React.ReactElement;
export interface CueRowProps { title: string; when?: string; note?: string; onClick?: () => void }
export declare function CueRow(p: CueRowProps): React.ReactElement;
export interface PieItem { id?: string; label: string; value: number; display?: string; tone?: Tone }
export interface PieChartProps { items: PieItem[]; total?: number; size?: number; donut?: boolean; centerValue?: string; centerLabel?: string; selected?: string|null; onSelect?: (id: string|null) => void }
export declare function PieChart(p: PieChartProps): React.ReactElement;
export interface BarListProps { items: { id?: string; label: string; value: number; display?: string; tone?: Tone }[]; max?: number; onDark?: boolean; selected?: string|null; onSelect?: (id: string|null) => void }
export declare function BarList(p: BarListProps): React.ReactElement;
