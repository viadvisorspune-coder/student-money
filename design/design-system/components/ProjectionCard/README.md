# ProjectionCard

The “this month” card: where spending is heading if the month carries on at this rate, split by category.

- **Consumer provides:** `value` (the projected figure), `caption` (what it assumes), `splits` (`label`, `pct`, `tone`), plus `onSelect` for tapping a category and `onExpand` to open the full breakdown.
- Percentages are shares of spending so far, so they always add to 100. Say the assumption in the caption rather than presenting the projection as fact.
