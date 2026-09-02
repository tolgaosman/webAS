# frontend/ — webAS React app

React 18 + TypeScript, two Vite entry points (see `vite.config.ts`):

- `index.html` → `src/entries/public/main.tsx` — the public site
- `admin.html` → `src/entries/admin/main.tsx` — the admin panel

`styles.css` and `admin.css` are the original, untouched stylesheets —
every component in `src/` targets their existing class names. The only
new CSS lives in `src/styles/` (`lang-selector.css`, `admin-i18n.css`),
imported additively from each entry's `main.tsx`. **Do not** import
`styles.css` from the admin entry separately — `admin.css`'s own
`@import url('styles.css')` must stay the only place that happens, or
its `.form-group`/`.form-grid` overrides land in the wrong cascade
order and every admin form's layout breaks.

## Commands

```bash
npm install
npm run dev          # against a real backend (proxies /api -> :8000, see vite.config.ts)
npm run dev:mock     # against the bundled fixture in src/lib/mockPortfolio.ts — no backend needed
npm run build        # tsc --noEmit && vite build
npm run typecheck
```

## i18n

`src/i18n/` — `LocaleProvider` resolves the active locale from
`?lang=` → `localStorage` → browser language → `"tr"`, persists on
change, and never reloads the page. `useT()` resolves a database
`{tr,en,nl}` value for the active locale (falling back to `tr` when
empty); `useDict()` returns the static developer-owned UI strings from
`src/i18n/dictionaries/{tr,en,nl}.ts`. Every dictionary implements the
same `UiDict` interface, so a missing translation key is a compile
error, not a runtime blank.

## Admin panel

`src/admin/fields/TranslatableInput.tsx` / `TranslatableTextarea.tsx`
are the reusable core every translatable field uses — TR/EN/NL tabs
above a normal `.form-group` input, sharing one active locale per form
via `LocaleTabsProvider`. `src/admin/store/useCrudResource.ts` gives
the simple resources (core skills, education, languages, toolkit,
certificates, bio paragraphs, hobbies, specialties) list/create/update/
delete/reorder for free; projects and experience have their own hooks
because they also carry nested children (images/achievements,
accomplishments) in the same payload.

## Verifying nothing regressed

A parity script compares every `class="..."` in the pre-rewrite HTML
(`git show <pre-rewrite commit>:frontend/index.html` /
`admin_panel.html`) against every `className` used in `src/` — anything
in the old set that's missing from the new one (excluding the
deliberately-removed Google-Translate/hidden-DOM classes) is a silent
visual regression. Re-run it after any component change that touches
class names.
