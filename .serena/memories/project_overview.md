# poker-cards Project Overview

## Purpose
A monorepo for rendering playing cards in pure TypeScript as SVG strings. Originated from the [cardmeister](https://github.com/nickaerts/cardmeister) web component.

## Tech Stack
- **Runtime:** Bun
- **Language:** TypeScript (strict mode, ESM-only)
- **Build tool:** Bunup (configured in `bunup.config.ts`)
- **Monorepo:** Bun workspaces (`packages/*`)
- **No runtime dependencies**

## Packages
1. **`packages/poker-cards`** — Core library (`poker-cards` on npm). Renders playing cards as SVG strings. Pure TS, no DOM.
2. **`packages/poker-card-element`** — `<playing-card>` Web Component (`poker-card-element` on npm). Wraps core library. Browser-only.
3. **`packages/example`** — Static demo page. Private, not published.

## Key Files in `packages/poker-cards`
- `src/data.ts` — Auto-generated SVG path data. **Do not edit manually.**
- `src/types.ts` — `CardRenderOptions` interface and related types.
- `src/render.ts` — `renderCard()` and `renderCardToDataUri()` functions.
- `src/index.ts` — Re-exports.

## Architecture Notes
- ESM-only output with TypeScript declaration files
- Package entry points use `exports` field with separate `types` and `default` conditions
- `poker-card-element` depends on `poker-cards` via `"poker-cards": "workspace:*"`
- Root `package.json` also re-exports `poker-cards` as the base package
