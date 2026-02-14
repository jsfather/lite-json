# Lite JSON — Developer Guide

## Overview

Lite JSON is a simple browser tool that takes any JSON input and **simplifies every array to its first element**, recursively. Useful for understanding the shape/schema of large API responses.

## Tech Stack

| Layer     | Tool                          |
| --------- | ----------------------------- |
| Runtime   | [Bun](https://bun.sh)        |
| Framework | React 19 + TypeScript         |
| Bundler   | Vite 7                        |
| Styling   | Tailwind CSS 4 (Vite plugin)  |
| Linting   | ESLint 9 (flat config)        |

## Prerequisites

- **Bun ≥ 1.x** — install via `curl -fsSL https://bun.sh/install | bash`

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:5173)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Lint
bun run lint
```

## Project Structure

```
src/
├── main.tsx            # React entry point
├── index.css           # Tailwind CSS import
├── App.tsx             # Main UI component
└── simplify-json.ts    # Core simplification logic (pure function)
```

## Core Logic — `simplifyJson(value)`

Located in `src/simplify-json.ts`. A pure, recursive function:

- **Array** → keep only the first element (simplified recursively).
- **Object** → recurse into every value.
- **Primitive** → return as-is.

Example:

```json
// Input
{ "data": [{ "name": "keyvan" }, { "name": "pezhman" }] }

// Output
{ "data": [{ "name": "keyvan" }] }
```

## Adding Features

1. **New transformation** — add a new pure function in `src/` (e.g., `src/flatten-json.ts`), import it in `App.tsx`.
2. **Styling** — use Tailwind utility classes directly in JSX. Global overrides go in `src/index.css` after the `@import "tailwindcss"` line.
3. **Testing** — install your preferred test runner (`bun add -d vitest @testing-library/react`) and write tests next to source files (`*.test.ts`).

## Conventions

- Keep transformation functions **pure** (no side effects, no DOM).
- Prefer **named exports** for utilities, **default export** for page components.
- Use `bun` for all package management — do **not** mix with npm/yarn/pnpm.
