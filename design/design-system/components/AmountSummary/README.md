# AmountSummary

The big-number card that answers “how much?”, with an optional stacked bar and a grid of labelled parts.

- **Consumer provides:** `value` (already formatted with `formatINR`), `eyebrow`, `caption`, `segments` for the bar and `parts` for the grid.
- Use it for money available to spend, the account balance and period totals. Use one per screen at `lg` size.
- A pending decision shows as a `hatch` segment, so it reads as “not spent yet”.
