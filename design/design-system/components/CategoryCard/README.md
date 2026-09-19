# CategoryCard

One spending category (for example Eating) as a card: its name, what it came to, a NestedBreakdown of its sections (such as delivery apps, cafés, tapri, 7-Eleven) with the amount and share printed inside each block.

- **Consumer provides:** `name`, `spent`, `color` (the bucket colour), `items` (sections with `id`, `label`, `amount` and an optional `caption` such as the vendors), and optionally `selected` with `onSelect`, and `onEdit`.
- The product sets no spending limits, so leave `limit` out: the card reports what was spent and lets the student judge it. `limit` exists only for a student who asks for a reference point of their own.
- Sections come from what was actually spent: empty sections are hidden from the chart, and anything past four levels folds into “Other”.
- Each block carries its own figure and percentage, so the chart needs no legend. Tapping a block names its vendors in the line beneath. The edit button opens the bucket sheet where sections and vendors are managed.
