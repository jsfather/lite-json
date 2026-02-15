# Lite JSON

Shrink large JSON payloads before feeding them to an LLM — smaller context, sharper answers.

Lite JSON recursively simplifies any JSON by trimming every array down to its single most representative element, preserving the full schema shape while dramatically reducing token count.

## How It Works

Paste (or type) JSON into the **Input** panel, click **Simplify**, and get a minimal version in the **Output** panel.

**Algorithm** — for each array in the payload:

1. Score every element by nesting depth (deepest = most structural info).
2. Break ties by serialized size (smallest wins).
3. Keep only the winning element and recurse into it.

Objects are traversed recursively; primitives pass through unchanged.

```
Input  → { "users": [{ "name": "Alice", "orders": [1,2] }, { "name": "Bob", "orders": [] }] }
Output → { "users": [{ "name": "Alice", "orders": [1] }] }
```

## Features

- **One-click simplification** with live before/after character counts and reduction percentage
- **Beautify / Minify** toggle for the output
- **Copy to clipboard** button
- Syntax-highlighted JSON output
- Zero backend — runs entirely in the browser

## Quick Start

```bash
# Prerequisites: Bun ≥ 1.x
curl -fsSL https://bun.sh/install | bash

# Clone and run
git clone https://github.com/jsfather/lite-json
cd lite-json
bun install
bun run dev        # → http://localhost:5173
```

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `bun run dev`      | Start Vite dev server with HMR     |
| `bun run build`    | Type-check + production build      |
| `bun run preview`  | Preview the production build       |
| `bun run lint`     | Run ESLint                         |

## Tech Stack

| Layer     | Tool                         |
| --------- | ---------------------------- |
| Runtime   | [Bun](https://bun.sh)       |
| Framework | React 19 + TypeScript        |
| Bundler   | Vite 7                       |
| Styling   | Tailwind CSS 4 (Vite plugin) |
| Linting   | ESLint 9 (flat config)       |

## Project Structure

```
src/
├── main.tsx            # React entry point
├── App.tsx             # Main UI — input/output panels, buttons
├── index.css           # Tailwind import + custom styles
├── simplify-json.ts    # Core simplification logic (pure function)
└── json-highlight.tsx  # Syntax highlighting for JSON output
```

## License

MIT
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
