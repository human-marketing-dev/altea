# Altea design system — React port

Imported from the Claude Design project **Altea Design System**
(`4e75110c-7f68-47eb-8039-f58407737c9d`).

- **`design-system/`** (repo root) — the upstream source, vendored verbatim:
  tokens, the eight components as inline-style JSX, `.d.ts`, `.prompt.md`,
  guideline specimen cards and the clickable UI kit. Reference only; it is
  excluded from `tsconfig` and ESLint and is never built.
- **`app/ui/`** (this folder) — what the app actually imports.

```tsx
import { Button, NavBar, SectionHeading, StatBlock } from "@/app/ui";
```

## Tokens

| Where | What |
| --- | --- |
| `app/ui/tokens.css` | brand + semantic colors, weights, spacing, motion |
| `app/globals.css` (`@theme`) | font, text, tracking, leading, radius, shadow |

The split is deliberate: a token that sits in a Tailwind theme namespace must be
declared **only** inside `@theme`, otherwise Tailwind re-emits it as
`--radius-md: var(--radius-md)` and the name resolves to itself. Colors are the
exception — `--color-*` doesn't collide with `--altea-*`, so those are mapped
with `@theme inline` and keep their single definition in `tokens.css`.

Both halves are plain CSS variables at runtime, so `var(--altea-coral)` and the
generated utilities (`bg-cream`, `text-ink`, `rounded-pill`, `shadow-card`,
`text-display-1`, `tracking-wide`) refer to the same values.

## Deviations from upstream

Same visual output, different mechanics — worth knowing before you diff:

1. **Hover/focus moved from `useState` to CSS.** Upstream tracks hover in React
   state because it renders with inline styles only. Here the declarations live
   in `app/ui/components.css`, so all eight components are Server Components.
2. **Focus rings added.** The brand manual specifies no focus treatment;
   interactive elements get a 2px coral `:focus-visible` outline.
3. **`NavBar` / `Footer` links carry routes.** Upstream uses `href="#"` with
   plain strings; here links are `{ label, href }` and render through
   `next/link`. Defaults follow the home wireframe — Inicio, Nosotros,
   Comercial, Industrial, Vivienda, Forestal — and only `/` exists so far.
4. **`ProjectCard` takes `imageSrc`, not an `<image-slot>` id.** The upstream
   `<image-slot>` custom element is a design-tool placeholder. With no
   `imageSrc` the card renders a labelled "Fotografía pendiente" block rather
   than a stock photo, per the brand rule against fabricated imagery.
5. **`SectionHeading` accepts `as`.** Upstream is always `h2`; override it when
   the heading opens a page.
6. **Logo/lockup SVGs were repaired.** Every upstream SVG ships with an empty
   `<defs></defs>`, so `.cls-1` / `.cls-2` had no fill and the marks rendered
   solid black — losing the coral accent notch. The fills are restored in
   `public/brand/` and in `design-system/assets/`. **This defect still exists in
   the Claude Design project** and will come back on the next import unless it
   is fixed upstream.
7. **The brand face loads via `next/font`,** not the Google Fonts `@import`.
   The CSS variable is `--font-brand`, so swapping families touches only
   `app/layout.tsx`. Gotham is the spec; Montserrat stands in until Altea
   supplies web-licensed files — see `public/fonts/README.md`.
8. **Two components added** that upstream has no counterpart for:
   `MediaSlot` (the production stand-in for `<image-slot>`: renders a labelled
   hueco instead of invented stock photography) and `CountUp` (the 0→N counter
   the home wireframe asks for; SSRs the final value and honours
   `prefers-reduced-motion`).
9. **Forestal is a fourth business unit.** The home wireframe lists it in the
   nav and in the unit grid, but the design system has no lockup, no colour and
   no copy for it — `assets/business-units/` only covers Comercial, Industrial
   and Vivienda. It currently renders as a text label. Needs upstream work.

## Pending from the brand owner

- **Gotham Bold/Medium.** The identity manual specifies it; no web-licensed
  files exist yet, so Montserrat substitutes. `app/layout.tsx` carries the
  ready-to-uncomment `next/font/local` block.
- **Project photography.** Nothing real exists yet; `ProjectCard` placeholders
  stand in.
- **UI icon set.** The manual defines none. If one is needed, use a neutral line
  set (e.g. Lucide) rather than drawing icons by hand.

## Brand rules worth remembering

Ink `#212222` is primary, cream `#E7DFD1` is the page surface, coral `#F15D4D`
is a scarce accent — never a section background. One `primary` Button per
section. Solid backgrounds only: the manual forbids the logo over images or
gradients. Copy is Mexican Spanish, no emoji. Full detail in
`design-system/readme.md`.
