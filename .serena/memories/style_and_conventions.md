# Code Style and Conventions

## Formatting
- **Tabs** for indentation
- No linter or formatter configured
- ESM-only (`"type": "module"`)

## TypeScript
- Strict mode enabled
- `noUncheckedIndexedAccess: true`
- `isolatedDeclarations` enabled
- `verbatimModuleSyntax: true` (use `import type` for type-only imports)
- Target: ES2023, Module: Preserve, Resolution: bundler
- `noEmit: true` (Bunup handles emit)

## Patterns
- Pure functions for rendering (no side effects in core)
- Web Component pattern for browser package
- Re-export barrel files (`index.ts`)
