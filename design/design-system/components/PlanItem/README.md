# PlanItem

A row in the Plans list: a done circle, title and details, amount, and a drag handle. Tap it to expand and edit.

- **Consumer provides:** `title`, `meta`, `amount`, `done`, `expanded`, `onToggle`, `onExpand`, drag handlers, and `children` for the expanded fields.
- `amount` is a figure the student typed on the plan itself. Show it back to them on the collapsed row and keep it out of every total, projection and chart.
- Dragging is the only way to move an item between Scheduled and TBD; the expanded item carries no move button.
