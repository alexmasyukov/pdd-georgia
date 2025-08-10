# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Run the development server with hot module replacement:
```bash
yarn dev
```

Build the production bundle (runs TypeScript compilation then Vite build):
```bash
yarn build
```

Run ESLint to check code quality:
```bash
yarn lint
```

Preview the production build locally:
```bash
yarn preview
```

## Project Architecture

This is a React 19 + TypeScript application built with Vite. The project uses:

- **Vite** as the build tool and dev server for fast HMR
- **React 19** with React DOM for UI
- **TypeScript** with strict mode enabled for type safety
- **ESLint** configured with TypeScript and React Hooks rules
- **Yarn** as the package manager (yarn.lock present)

### TypeScript Configuration

The project uses a composite TypeScript configuration:
- `tsconfig.app.json`: Application code configuration with strict type checking, targeting ES2022
- `tsconfig.node.json`: Node.js configuration for build scripts
- Key strict settings enabled: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

### Entry Points

- `index.html`: Main HTML file serving as the entry point
- `src/main.tsx`: React application bootstrap, renders App component in StrictMode
- `src/App.tsx`: Root React component

### Code Structure

- `/src`: All application source code
  - Components use `.tsx` extension
  - CSS modules imported directly into components
  - Assets stored in `src/assets/`
- `/public`: Static assets served directly by Vite