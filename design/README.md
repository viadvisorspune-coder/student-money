# Student Money — design handoff

Everything an engineer or a coding agent needs to build the app from the approved design.

## Start here

1. Open `prototype/prototype-v2.html` in a browser. No build step, no server — it is a single
   self-contained file. Tap through every screen and overlay; this is the specification.
2. Read `CLAUDE.md`. It carries the behavioural rules that the visual design depends on.
   Several of them (no limits, plans are never counted, no comparison with other students)
   are easy to break by accident.
3. Read `design-system/README.md` for the brand book, then `design-system/tokens.json`.

## Using this with Claude Code

Put this folder at the root of the app repository (or keep it as `design/` inside it) and run
Claude Code there. `CLAUDE.md` is picked up automatically as project context, so a prompt as
short as the following is enough to start:

```
Read CLAUDE.md and prototype/prototype-v2.html.
Scaffold the app in <your stack>, port design-system/tokens.css and the component
bundle first, then build the home → estimate → result flow.
Do not add any limit, budget or comparison feature.
```

If the repository already has its own `CLAUDE.md`, rename this one to `DESIGN-BRIEF.md` and
add a line to the existing file pointing at it, so both are read.

## Regenerating

- `design-system/tokens.css` is generated from `tokens.json`. If a token changes, regenerate
  rather than editing the CSS by hand.
- `prototype/screens-v2.js` is the same source that is inlined into `prototype-v2.html`.
  Editing the `.js` alone does not change the HTML.

## Confidentiality

This package contains the client's unreleased product design. Keep it private; do not publish
the prototype to a public URL or commit it to a public repository.
