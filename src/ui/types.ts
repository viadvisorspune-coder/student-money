/** Shared design-system types. Mirrors design-system/components/index.d.ts. */

export type IconName =
  | 'arrow-up-right'
  | 'arrow-down-right'
  | 'check'
  | 'close'
  | 'edit'
  | 'share'
  | 'chart'
  | 'swap'
  | 'chevron-down'
  | 'home'
  | 'grid'
  | 'settings'
  | 'user'
  | 'menu'
  | 'wallet'
  | 'plus'
  | 'filter'
  | 'arrow-left'
  | 'arrow-down-left'
  | 'grip'
  | 'trash'
  | 'food'
  | 'bag'
  | 'bus'
  | 'play'
  | 'receipt'
  | 'target'

/**
 * Tone classes map to `--tone` in components.css. Keeping these names is what
 * keeps the design system the single source of truth (CLAUDE.md §5).
 */
export type Tone =
  | 'coral'
  | 'sunflower'
  | 'sky'
  | 'butter'
  | 'blush'
  | 'ink'
  | 'grey'
  | 'soft'
  | 'positive'

export interface Segment {
  label: string
  value: number
  tone?: Tone
  display?: string
  hatch?: boolean
}

export interface NestItem {
  id: string
  label: string
  amount: number
  display?: string
  tone?: Tone
  caption?: string
}

export interface PieItem {
  id?: string
  label: string
  value: number
  display?: string
  tone?: Tone
}

export interface Person {
  initials: string
  name?: string
  tone?: 'sunflower' | 'sky' | 'butter' | 'soft' | 'coral' | 'ink'
}
