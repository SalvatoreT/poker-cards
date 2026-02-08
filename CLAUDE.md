# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A monorepo for rendering playing cards in pure TypeScript. Uses Bun workspaces with packages under `packages/`.

Contains three packages:

- **`packages/card`** — Core library for rendering playing cards as SVG strings. Pure TypeScript, no DOM dependency. Works in Node, Bun, Deno, SSR, etc.
- **`packages/card-element`** — A `<playing-card>` Web Component that wraps the core library. Browser-only. Depends on `card` via workspace.
- **`packages/example`** — Static demo page showcasing the card library and web component. Private, not publishable.

## Build & Development Commands

```bash
# Build all packages
bun run build

# Build and view the example demo page
bun run build:example
open packages/example/dist/index.html

# Watch mode (rebuild on changes)
bun run dev

# Type-check all packages
bun run type-check
```

The build tool is **Bunup** (configured in `bunup.config.ts`).

**Note:** `card-element` depends on `card`'s built output for type-checking. Run `bun run build` before `bun run type-check` if the `card` package's `dist/` is missing.

## Architecture

- **Monorepo** using Bun workspaces (`packages/*`)
- **No runtime dependencies** — pure TypeScript libraries
- **ESM-only** output with TypeScript declaration files
- **Strict TypeScript** with `noUncheckedIndexedAccess`, `isolatedDeclarations`, and other strict options enabled (see `tsconfig.base.json`)
- Package entry points use the `exports` field in package.json with separate `types` and `default` conditions
- `card-element` depends on `card` via `"card": "workspace:*"`

## Package Details

### `packages/card` (core)

- `src/data.ts` — Auto-generated SVG path data for suits, ranks, court card artwork. **Do not edit manually** — regenerate from `elements.cardmeister.full.js` if needed.
- `src/types.ts` — `CardRenderOptions` interface and related types.
- `src/render.ts` — `renderCard()` (returns SVG string) and `renderCardToDataUri()` (returns data URI). This is a faithful translation of the original `cardt` function from cardmeister.
- `src/index.ts` — Re-exports from the above modules.

### `packages/card-element` (web component)

- `src/index.ts` — Defines and registers the `<playing-card>` custom element. Imports rendering from `card`.

### `packages/example` (demo page)

- `src/main.ts` — Interactive card picker, random hand generator. Imports `card-element` to register the web component.
- `index.html` — Static HTML demo with sections for all suits, interactive picker, random hand, and card backs.
- Build uses `bun build` CLI to bundle `src/main.ts` into `dist/main.js`. Run via `bun run build:example`.

## Code Style

- Uses tabs for indentation
- No linter or formatter is currently configured

## Origin

The card rendering logic and SVG artwork originate from the [cardmeister](https://github.com/nickaerts/cardmeister) web component. The original minified source is preserved at `elements.cardmeister.full.js` in the repo root.
