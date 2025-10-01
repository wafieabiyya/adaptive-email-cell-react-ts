# Email Recipients Cell – React + TypeScript + CSS

An adaptive table cell that renders an email recipients list based on the actual available width. It measures real text widths (font-aware), supports Single + Badge and Multi-Fit modes, and includes a lightweight tooltip with basic accessibility.

> The original assignment brief is preserved in CHALLENGE.md.

## Getting Started

#### Requirements

- Node 18+ or 20+
- PNPM (or npm / yarn) -> mine is npm

#### Run Locally

```bash
npm i
npm run dev #opens http://localhost:5173
```

## How it Works (Design Notes)

- **Width Detection** : Uses `ResizeObserver` on the cell container; width updates are throttled via `requestAnimationFrame` for smooth resizing.
- **Font-aware measurement**: Each email and the separator `", "` are measured in an off-screen container that shares the same font styles as the visible cell. This avoids naive character counting.
- **Fit Calculation**: pure function `computeFitCount(emailWidths, sepWidth, containerWidth)` determines how many full emails fit given the current width. It accounts for the separator after the first item.
- **Rendering modes**
  - **Single + Badge** (≤1 email fits): show the first email with ellipsis if needed; if there are more emails, show a `+N` badge. Hovering/focusing the badge shows a tooltip with the full list.
  - **Multi-Fit** (≥2 fit): render as many full emails as possible (no truncation). Leftover count goes into the `+N` badge with tooltip.
- **Tooltip & accessibility**
  - **Badge** has `role="button"`, `aria-label`, and `tabIndex`.
  - Tooltip appears on hover and keyboard focus; Enter/Space toggles it.
- **Performance**
  - `ResizeObserver` + `requestAnimationFrame` to avoid state thrashing.
    O(n) fit computation.
  - Measurement runs when the email list changes.
- **Edge cases**
  - Empty list → renders `–`.
  - Empty strings are filtered out.
  - Duplicates are displayed as provided.
  - Rapid column resizing handled smoothly.

## Accessibility

- Badge is keyboard-reachable `(tabIndex={0})`.
- `role="button"` + `aria-label added`.
- Tooltip shows on focus and hides on blur; Enter/Space toggle supported.
- The first (single) email uses `title` for full text on hover when truncated.

## Assumptions & Notes

- **No UI libraries** : Tooltip and badge are pure CSS/React.
- Separator is strictly `", "` and never truncates within an email.
- **Clipping fix**: Tables often set `overflow: hidden`, which can clip the tooltip. Two safe options:
  - Allow `.tbl { overflow: visible }` and raise `z-index` on `hover`, or
  - Use a portal to `document.body` (provided as an optional approach in code comments) to avoid any clipping entirely.
- **No secrets are committed** . The submission API credentials are used only at submission time (not stored in the repo).
  foobar.pluralize('goose')
