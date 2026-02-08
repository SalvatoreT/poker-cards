# Suggested Commands

## Build
```bash
# Build all packages
bun run build

# Build example demo page
bun run build:example

# Build and preview example with dev server (pre-built card SVGs served as static files)
bun run build && bun run --filter example preview
# Then open http://localhost:3000

# Watch mode (rebuild on changes)
bun run dev
```

## Type Checking
```bash
# Type-check all packages
bun run type-check
```
**Note:** `poker-card-element` depends on `poker-cards`'s built output. Run `bun run build` before `bun run type-check` if `poker-cards/dist/` is missing.

## System Utilities (macOS / Darwin)
- `git` — version control
- `open` — open files/URLs in default app
- `bun` — JS runtime and package manager
