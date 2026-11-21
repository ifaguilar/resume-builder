# Resume Builder

A free, open-source, local-first resume builder. The user edits a [JSON Resume](https://jsonresume.org/schema) in a form, sees the PDF update live, and exports ATS-friendly PDFs.

## Principles

- **Local-first:** no backend, account, telemetry or network calls. Resume data never leaves the device.
- **ATS-safe PDFs:** a clean text layer in reading order.
- **One source of truth:** a single JSON Resume object; the form, preview and exports derive from it. Presentation lives in a separate `settings` object.
- **Warn, never block:** validation shows warnings; unknown data is kept, never dropped.

## Tech stack

TanStack Start (React 19, TypeScript 7, TanStack Router and Form), Zod 4, `@react-pdf/renderer`, shadcn/ui on Base UI, Tailwind CSS 4, Temporal for dates, Vitest, oxlint, oxfmt, pnpm.

## Commands

```bash
pnpm dev            # dev server on http://localhost:3000
pnpm build
pnpm test
pnpm lint           # includes type checking
pnpm lint:fix
pnpm format
pnpm format:check
```

## Structure

```
src/
  routes/           thin TanStack file routes
  features/<name>/  code grouped by feature; features/resume is the shared domain model
  shared/           code used by several features (never imports from features/)
    components/ui/  shadcn components; don't hand-edit
tests/              Vitest suites and fixtures
```

## Conventions

- Kebab-case filenames, absolute `#/` imports, no barrel files.
- No magic numbers or strings: named constants in the feature's `constants.ts`.
- Comments only for a non-obvious why.
- Tailwind classes inline; a component for a repeated look, `cn()` for conditions.
- Dates use Temporal, never `Date`.
- Icon-only buttons go through `IconTooltip`.
- Warnings use the amber `warning` color, never destructive red.

## Workflow

- Branch from `dev` (`feat/`, `fix/`, `chore/`, `docs/`) and open PRs into `dev`. Conventional Commits.
- Dependencies stay on `^` ranges.
- Before finishing, run `pnpm lint:fix --format=agent` and `pnpm format`.
