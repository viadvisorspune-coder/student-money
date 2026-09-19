# BottomSheet

The overlay for details and edits: a close button, an optional dark pill and trailing action, a centred title, a scrolling body and a footer.

- **Consumer provides:** `open`, `onClose`, `title`, `subtitle`, `pill`, `trailing`, `children` and `footer`. It fills its nearest positioned ancestor (the phone frame).
- The footer holds at most one dark Button. Escape and tapping the scrim both close it.
