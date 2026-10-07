# TimeApp

A small React 19 app with a header, a side menu and a content area:

- **Header:** a "last stamp" time (VAR1), empty until you first press the button in the content and updated on each press, and a live clock (VAR2) that updates every second.
- **Menu:** switches the content between two views.
- **Content:** two views, each with a button that stamps the current time into the header.

Front-end only, no back end.

## Getting started

Requires Node 26 (see `.nvmrc`).

```bash
nvm use        # switch to the Node version in .nvmrc
npm install
npm run dev    # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm test` | Run the tests once (`npm run test:watch` to watch) |
| `npm run lint` | Lint with ESLint |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

**Stack:** React 19, TypeScript 6, Zustand 5, Vite 8, Vitest 5 + Testing Library, ESLint, CSS Modules. No UI or date libraries.

## Project structure

```
src/
  features/              self-contained features, each with a public index.ts
    stamp/               VAR1
      Stamp/             the last stamp shown in the header
      StampButton/       the button used in both views
      stampStore.ts      Zustand store + useStamp / useStampNow hooks (store is internal)
    clock/               VAR2
      LiveClock/         the live clock shown in the header
      useCurrentTime.ts  second-aligned time hook (+ test)
    navigation/
      Menu/              the side menu
      MenuAndContent/    owns the active view, renders menu + content
      menuItems.ts       the list of views
  views/                 Content1/, Content2/ + shared views.module.css
  layout/Header/         composes features into the app frame
  components/            shared, feature-agnostic UI: DateTime/, LabeledValue/
  utils/                 formatDateTime
  App.tsx                layout grid, holds no state
```

Every component has its own folder with its `.tsx` and `.module.css` (if any), imported by its full path (e.g. `components/DateTime/DateTime`). Hooks, stores and config sit at the feature root. The only `index.ts` files are the features' public APIs.

Import rules, enforced by ESLint (`eslint.config.js`):

- Outside a feature, import it only through its `index.ts` (e.g. `features/stamp`), never its internal files.
- Shared code (`components/`, `utils/`) never imports from features.

**Adding a view:** create a folder for it in `views/` and add one entry to `features/navigation/menuItems.ts`. The menu, switching and types follow from that list.

## Key decisions

### Re-renders: state lives where it's read

Re-renders are kept to a minimum by **where state lives**, not by memoization. The React Compiler isn't used, and neither are `React.memo` or `useCallback`.

| State | Owner | Re-renders when it changes |
|---|---|---|
| Live time | `LiveClock` (via `useCurrentTime`) | the clock only |
| Last stamp | `stampStore` (Zustand) | `Stamp` only |
| Active view | `MenuAndContent` | the menu and the content |

- `App` holds no state, so it renders once.
- Components subscribe to the stamp store through **selectors** (`useStamp`, `useStampNow`), so each re-renders only when the field it reads changes. The buttons read only `stampNow`, which never changes, so they never re-render.
- Zustand was chosen over React context with future shared state in mind: selective subscriptions without providers. Components only use the hooks, so the storage behind them can change without touching components.
- `App.renders.test.tsx` checks this by counting renders of the real components.

`React.memo` with `useCallback` would only be worth adding if profiling showed an expensive component that couldn't be isolated this way.

### An accurate clock

`useCurrentTime` uses a `setTimeout` that re-schedules itself at the start of each next whole second, instead of `setInterval`:

- `setInterval` starts at an arbitrary offset, so the display can lag up to a second behind the real time.
- Its small delays add up, which can skip or repeat a second.

Tests check that the clock lines up with the second and that it doesn't drift over an hour.

### Date and time formatting

The app uses the browser's built-in `Intl` (`timeStyle`/`dateStyle: 'medium'`), with no date library. Each visitor sees their own locale's format and their own timezone: for example "1:42:41 PM · Oct 6, 2026" in the US, or "13:42:41 · 6 Oct 2026" in the UK.

### Accessibility

- The stamp is a polite live region (`role="status"`), so screen readers announce "Last stamp, <time>" after each click. The region stays in the page when the stamp updates, because screen readers often skip announcements from a region that was just added.
- The live clock is deliberately **not** a live region, since it would announce every second.
- The stamp's and clock's labels are connected to their values with `aria-labelledby` (`LabeledValue`).
- Keyboard focus is always visible.
- Animations are turned off when the user prefers reduced motion.

### Styling

- `index.css` holds the design tokens (colors, fonts) and base styles. Each component has its own `*.module.css` next to it.
- Where a parent customizes a child, it sets CSS custom properties (e.g. `--dt-time-weight`) rather than reaching into the child's scoped class names.
- Fonts are self-hosted through Fontsource, so the app makes no external requests.

### Testing

- Tests find elements by role and accessible name, the same way assistive tech does. There are no test ids.
- Interactions use `userEvent`, and fake timers make the time-dependent tests deterministic.
- `setupTests.ts` includes a small shim so Testing Library works with Vitest's fake timers.
- `__mocks__/zustand.ts` (from Zustand's testing guide) resets every store after each test, so state never leaks between tests.

## Possible next steps

These aren't needed at the current size:

- **URLs per view and a working back button:** add React Router and turn `menuItems` into the route list.
- **More shared state:** add a store per feature, following `stampStore.ts`. Tests reset new stores automatically.
- **A back end:** TanStack Query for loading data, plus error boundaries.
