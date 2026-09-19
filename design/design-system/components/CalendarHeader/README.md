# CalendarHeader

The coral header at the top of the planner, with a month switcher and a seven-day strip.

- **Consumer provides:** `month`, `days` (`weekday`, `date`), `selected` or `defaultSelected`, `onSelect`, and an optional `avatar` node.
- Use one per screen, at the top of the stack. The large white month label passes contrast on `coral` because it is 34px bold; don’t add small white text to this header.
