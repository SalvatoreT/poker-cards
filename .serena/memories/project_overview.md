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

## Key Files in `packages/example`
- `src/main.ts` — Interactive card picker, random hand generator, and card grid population (loads cards as `<img>` from pre-built SVGs).
- `index.html` — Static HTML demo page.
- `build.ts` — Build script using `Bun.build()` to bundle `index.html` into `dist/`, then generates all 52 card SVGs into `dist/card/` using `renderCard()`. Run via `bun run build:example`.
- `serve.ts` — Bun dev server. Serves static files from `dist/`.

## Pre-built Card SVGs (`packages/example/build.ts`)
The build generates 52 SVG files at `dist/card/<suit>-<rank>.svg` using `renderCard()` from `poker-cards`.
- **URL format:** `/card/spades-queen.svg`, `/card/hearts-jack.svg`, `/card/diamonds-ace.svg`, `/card/clubs-10.svg`
- **Suits:** `spades`, `hearts`, `diamonds`, `clubs`
- **Ranks:** `ace`, `2`–`10`, `jack`, `queen`, `king`
- The "All Cards by Suit" grid on the demo page loads cards as `<img>` elements from these files.
