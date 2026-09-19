# BottomNav

The dark tab bar at the foot of every main screen, where the active tab becomes a white pill.

- **Consumer provides:** `items` (`id`, `icon`, `label`), plus `active` or `defaultActive`, and `onChange`.
- Pass `showLabels` to label every tab, not only the active one: a student should never have to guess an icon. The active tab keeps the white pill. The app's order is Home, Plans, Profile — the thing they came for first.
- Use three or four tabs with labels showing; more than that and the labels stop fitting at phone width.
