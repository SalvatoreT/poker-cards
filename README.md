# Poker Cards

A monorepo for rendering playing cards as SVG in pure TypeScript.

## Installation

```bash
# Core library only
npm install poker-cards
yarn add poker-cards
pnpm add poker-cards
bun add poker-cards

# Web Component (includes core library as a dependency)
npm install poker-card-element
yarn add poker-card-element
pnpm add poker-card-element
bun add poker-card-element
```

## Packages

### `poker-cards` — Core rendering library

Renders playing cards as SVG strings with no DOM dependency. Works in Node, Bun, Deno, browsers, SSR — anywhere TypeScript/JavaScript runs.

```ts
import { renderCard, renderCardToDataUri } from "poker-cards"

// Get raw SVG markup
const svg = renderCard({ suit: 0, rank: 1 }) // Ace of Spades

// Get a data URI for <img> tags
const src = renderCardToDataUri({ cid: "QH" }) // Queen of Hearts

// Use string names
renderCard({ suit: "hearts", rank: "queen" })

// Card back
renderCard({ rank: 0 })
```

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `cid` | `string` | — | Card ID shorthand: `"AS"`, `"QH"`, `"10D"`, or `"ACE-OF-SPADES"` |
| `suit` | `number \| string` | `0` | 0=spades, 1=hearts, 2=diamonds, 3=clubs (or name) |
| `rank` | `number \| string` | `1` | 0=back, 1=ace, 2–10, 11=jack, 12=queen, 13=king (or name) |
| `cardcolor` | `string` | `"#fff"` | Card face background color |
| `suitcolor` | `string` | `"#000,#f00,#f00,#000"` | Suit symbol colors (comma-separated per suit) |
| `rankcolor` | `string` | `"#000,#f00,#f00,#000"` | Rank indicator colors |
| `borderradius` | `number` | `12` | Corner radius |
| `bordercolor` | `string` | `"#444"` | Border stroke color |
| `borderline` | `string \| number` | `"1"` | Border stroke width |
| `opacity` | `number` | `0.8` | Pip/symbol opacity |
| `backcolor` | `string` | `"#e55"` | Card back pattern color |
| `backtext` | `string` | `""` | Text on card back |
| `courtcolors` | `string` | `"#db3,#f00,#44f,#000,#000,4"` | Court card layer colors |
| `norank` | `boolean` | `false` | Hide rank indicator |
| `letters` | `string \| false` | `false` | Custom rank display characters |
| `courts` | `string` | `"012"` | Court card art style per court |
| `suits` | `string` | `"0123"` | Suit variant per position |
| `shadow` | `string` | `"5,5,5"` | Drop shadow: dx,dy,stdDeviation |
| `svg` | `string` | `""` | Extra attributes on the root `<svg>` element |

### `poker-card-element` — Web Component

A `<playing-card>` custom element that wraps the core library. Import it to register the element, then use it in HTML.

```ts
import "poker-card-element"
```

```html
<playing-card suit="1" rank="12"></playing-card>   <!-- Queen of Hearts -->
<playing-card cid="AS"></playing-card>              <!-- Ace of Spades -->
<playing-card rank="0" backcolor="#338"></playing-card> <!-- Custom back -->
```

All options from the core library are available as HTML attributes.

## Example

A live demo page showcasing the full deck, an interactive card picker, random hand dealer, and card back colors.

```bash
# Build libraries + example
bun run build && bun run build:example

# Open in browser
open packages/example/dist/index.html
```

The built demo is a static site (`packages/example/dist/`) deployable to any host (GitHub Pages, Netlify, Vercel, etc.).

## Development

Requires [Bun](https://bun.sh).

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Build the example demo page
bun run build:example

# Type-check
bun run type-check

# Watch mode
bun run dev
```

## Credits

Card rendering logic and SVG artwork based on [cardmeister](https://github.com/nickaerts/cardmeister).
