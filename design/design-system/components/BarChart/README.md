# BarChart

Tappable bars for spending over time (days of a week or weeks of a month), with the selected bar in ink.

- **Consumer provides:** `bars` (`id`, `label`, `value`, `display`), plus `selected` and `onSelect` (which receives `null` when a bar is tapped again to clear it).
- Selecting a bar should filter the breakdown and the transactions shown below it.
