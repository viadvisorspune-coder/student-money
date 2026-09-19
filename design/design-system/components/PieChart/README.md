# PieChart

A donut split of one whole — on Home, the month's allowance divided into what each category took and what is still unspent.

- **Consumer provides:** `items` (`label`, `value`, `tone`, optional `display`), `total` (pass the allowance so the slices read as shares of the whole month, not of what was spent), and optionally `centerValue`, `centerLabel`, `selected` and `onSelect`.
- Always pass the unspent remainder as its own quiet slice. Without it the chart implies the money is gone.
- On the dark card an `ink` slice is lightened so it separates from the ground, and the unspent slice stays the palest thing in the chart.
- The legend prints the percentage and the amount, so nobody has to judge an angle. Keep it to six slices; fold the rest into “Other”.
