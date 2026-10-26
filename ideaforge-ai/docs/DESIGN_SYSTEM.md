# IdeaForge Design System

IdeaForge is a **Sunshine Tech Solution** product. Every screen should read as a
sibling of the corporate site at <https://sunshinetechsolution.vercel.app> — the way
Outlook, Teams, and Excel read as siblings within Microsoft.

The reference implementation is the Sunshine Tech Solution codebase
(`Tesfazion/Ethio-Sunshine-Tech-Solution`). Tokens below are taken from its
`src/index.css` and `tailwind.config.js`, not invented.

Source of truth in this repo: [`app/globals.css`](../app/globals.css).

---

## 1. Brand foundations

| Role | Token | Value | Used for |
| --- | --- | --- | --- |
| Primary brand | `--brand-orange` | `#ef842b` | Primary CTAs, active states, highlights, badges, key figures |
| Primary hover | `--brand-orange-hover` | `#d9721c` | Hover on primary actions |
| Primary press | `--brand-orange-press` | `#bf6317` | Active/pressed state |
| Brand tint | `--brand-orange-soft` | `#fff5ec` | Selected nav items, icon wells, badge fills |
| Brand border | `--brand-orange-line` | `#f6dbc2` | Border on tinted brand surfaces |
| Brand on tint | `--brand-orange-ink` | `#8a4a10` | Text on brand tints (AA on `#fff5ec`) |
| Secondary | `--brand-blue` | `#007acc` | Links, secondary data series, informational accents |
| Secondary tint | `--brand-blue-soft` | `#eff8fd` | Informational badges and bands |

### Neutral surfaces

| Token | Light | Dark |
| --- | --- | --- |
| `--surface-page` | `#f6f8fb` | `#0f172a` |
| `--surface` | `#ffffff` | `#1e293b` |
| `--surface-alt` | `#f3f7fb` | `#17233a` |
| `--surface-tint` | `#edf7fc` | `#17283a` |
| `--surface-sunken` | `#eef2f7` | `#0b1220` |

### Text and lines

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--ink` | `#0b1220` | `#f8fafc` | Headings, primary values |
| `--copy` | `#44536b` | `#cbd5e1` | Body copy |
| `--muted` | `#64748b` | `#94a3b8` | Labels, captions, meta |
| `--line` | `#e2e8f0` | `#2c3d54` | Default borders |
| `--line-strong` | `#cbd5e1` | `#3f5470` | Input borders, hover borders |

Status colours (`--success`, `--warning`, `--danger`) each have `-soft`, `-line`,
and `-ink` variants. Always use the `-ink` value for text — it is the only one
tuned for contrast.

**Never** introduce neon colours, purple/indigo product accents, or a second
brand hue. Orange carries emphasis; blue carries information.

## 2. Typography

| Element | Family | Weights |
| --- | --- | --- |
| Headings `h1–h6` | Montserrat (`--font-montserrat`) | 600 / 700 / 800 |
| Body and UI | Poppins (`--font-poppins`) | 400 / 500 / 600 |
| Numerals / code | Geist Mono | 400 |

Both web fonts are loaded with `next/font/google` in `app/layout.tsx` (no layout
shift, self-hosted at build time).

- Headings are tight: `letter-spacing: -0.02em`, `text-wrap: balance`.
- Body line height is generous (`leading-relaxed` for paragraphs).
- Section headings: `text-3xl sm:text-4xl font-bold tracking-tight text-ink`.
- Eyebrows: `.eyebrow` / `.section-kicker` — 11px, 700, uppercase, `0.09em`
  tracking, brand tint pill.

## 3. Layout

- **One container width:** `.container-page` = `max-w-7xl` (80rem) with
  `1rem / 1.5rem / 2rem` responsive gutters. Do not invent narrower containers
  for full-width marketing sections; use `max-w-2xl`/`3xl` only for centred prose.
- **Section rhythm:** `.section` pads `clamp(3.5rem, 6vw, 6rem)`. Use
  `.section-alt` and `.section-tint` to band sections; never stack two identical
  bands back to back.
- **White space over decoration.** Bright, spacious layouts. No glassmorphism,
  no blurred orbs, no full-bleed dark photography on marketing pages.
- Fixed header is `68px` tall; first sections must offset by `pt-[7.5rem]`.

## 4. Components

All component classes live in `@layer components`, so plain Tailwind utilities
can still override them. Prefer these over hand-rolling utilities.

### Buttons

```html
<button class="btn btn-primary">Primary action</button>
<button class="btn btn-secondary">Secondary action</button>
<button class="btn btn-ghost">Tertiary</button>
<a class="btn btn-primary btn-lg">Large CTA</a>
```

- Radius `.625rem`, height from padding, 600 weight, 14px.
- `btn-primary`: solid `#ef842b`, white text, subtle lift + warm shadow on hover,
  darker on press. **Never** a gradient.
- `btn-secondary`: white surface, `--line-strong` border, ink text, tinted hover.
- Focus: 2px orange outline, 2px offset (global `:focus-visible`).

### Cards

```html
<div class="card p-5">…</div>
<a class="card card-hover p-5">…</a>
```

White surface, 1px `--line` border, `0.875rem` radius, `--shadow-sm`
(`0 1px 2px … , 0 4px 12px …`). Hover lifts 2px and moves to `--shadow-md`.
Icons sit in a `bg-brand-soft text-brand-ink` well at `0.5rem` radius.

### Forms

```html
<div class="field">
  <label class="label" for="email">Work email</label>
  <input id="email" class="input" />
  <p class="helper">Helper copy</p>
</div>
```

- Labels always visible above the field, 13px 600.
- Inputs: white, `--line-strong` border, `.625rem` radius, orange focus ring
  (`0 0 0 3px var(--ring)`).
- Errors: `aria-invalid="true"` on the input plus `.helper-error` (danger ink).
  Never signal an error with colour alone.

### Tables

```html
<table class="data-table">
  <thead><tr><th>Idea</th><th>Status</th><th class="text-right">Score</th></tr></thead>
  <tbody><tr><td class="cell-strong">…</td><td>…</td><td class="cell-num">87%</td></tr></tbody>
</table>
```

Tinted header row, 11px uppercase column labels, `0.875rem` row padding,
hairline row dividers, row hover on `--surface-alt`. Wrap in
`overflow-x-auto` on small screens.

### Badges

`badge` + one of `badge-brand`, `badge-accent`, `badge-neutral`,
`badge-success`, `badge-warning`, `badge-danger`. Always pair with a text label —
never colour alone.

## 5. Dashboard

- `.dashboard-shell` defines the workspace surface and `--dashboard-*` aliases.
- Sidebar: `.sidebar-base` (white, hairline right border), items `.sidebar-item`
  with `.is-active` resolving to the brand tint + brand ink and a left accent.
- Top bar: `.header-base`, 68px, translucent white with blur and a hairline border.
- Analytics cards: `.card`; KPI value uses Montserrat, 24–30px, tabular numerals.
- Tabs: `.dashboard-tabs` / `.dashboard-tab` (active = brand tint + 1px brand line).
- Dropdowns and menus: white surface, `--line` border, `--shadow-lg`, no glass.

## 6. Motion

Motion is functional only. 150–450ms, `ease-out`, small distances (6–16px).

- Fade/rise on first paint for heroes and section headers.
- Graph bars animate width/height once, never loop.
- Continuous loops are reserved for two ambient cases: the proof ticker and the
  pulsing "live" dot. Everything else must be static.
- `prefers-reduced-motion: reduce` disables all transforms and transitions
  globally (see the end of `globals.css`).

## 7. Accessibility

- Text contrast: `--ink` and `--copy` on white both exceed 4.5:1. `--brand-orange`
  is used for large text, icons, and fills — use `--brand-orange-ink` for small
  text on tinted brand surfaces.
- Every interactive element has a visible focus ring.
- Icon-only buttons carry `aria-label`; decorative SVGs carry `aria-hidden`.
- Tab bars use `role="tablist"`/`role="tab"`/`aria-selected`; the billing toggle
  uses `role="switch"` + `aria-checked`; menus expose `aria-expanded`.
- Skip link to `#main-content` is the first focusable element.

## 8. Legacy compatibility shim

`globals.css` ends with a scoped `.light …` block that remaps pre-design-system
utility combinations (`bg-[#060a13]`, `text-white`, `bg-white/[0.04]`,
`border-white/[0.06]`, `bg-gradient-to-*`, …) so older pages stay legible while
they are migrated.

Rules:

1. **New work must not use it.** Use the semantic tokens and component classes.
2. When you migrate a page, delete its reliance on those utilities; do not add
   new selectors to the shim.
3. The shim is scoped to `.light` and never affects dark mode.

## 9. Migrating a legacy page

1. Replace `bg-[#060a13]` → `bg-page` (or `bg-surface` for cards/panels).
2. Replace `text-white` / `text-slate-400` → `text-ink` / `text-copy`.
3. Replace `border-white/[0.06]` → `border-line`.
4. Replace `bg-white/[0.03]` → `bg-surface-alt`.
5. Replace `gradient-btn` → `btn btn-primary`; outline buttons → `btn btn-secondary`.
6. Replace `rounded-2xl` card shells → `card` (+ `card-hover` when clickable).
7. Delete decorative glow orbs and gradient overlays.
8. Verify with `npm run build` and check both themes.

## 10. Token quick reference

| Utility | Resolves to |
| --- | --- |
| `bg-page` / `bg-surface` / `bg-surface-alt` | page and panel surfaces |
| `text-ink` / `text-copy` / `text-muted` | heading / body / caption |
| `border-line` / `border-line-strong` | hairlines and input borders |
| `bg-brand` / `text-brand` / `border-brand` | `#ef842b` |
| `bg-brand-soft` / `text-brand-ink` / `border-brand-line` | brand tints |
| `text-link` | `#007acc` |
| `bg-link-soft` / `border-link-line` | blue tints |
| `text-success-ink` / `bg-success-soft` / `border-success-line` | status |
