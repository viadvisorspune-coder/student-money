# BarList

Horizontal bars, one row per category: label, bar and figure. Use it wherever categories are compared at a glance — the spending analysis on Profile.

- **Consumer provides:** `items` (`label`, `value`, `display`, `tone`), `max` (defaults to the largest value, so the biggest category fills the track), `onDark` when it sits on a dark card, and optionally `selected` with `onSelect`.
- Sort largest first. The figure is always printed, so the bar only has to show relative size.
- Prefer this over rings when there are more than four categories: rings get thin and hard to compare.
