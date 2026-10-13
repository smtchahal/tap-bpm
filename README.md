# Tap 2 BPM

Tap anywhere (or press any key) to measure BPM. A minimal, installable PWA built with React, TypeScript, Vite and Tailwind CSS.

## Features

- Tap anywhere on the screen, or press any key, to measure tempo
- Live BPM readout with a pulse animation on every tap
- Optional bar-spectrum visualizer that spikes on tap
- Auto-restart after 3 seconds of silence, or when a gap is far longer than the average interval
- Settings persisted in `localStorage`
- Installable and works offline (PWA)

## Getting started

Requires Node.js and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Typecheck and build for production |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm check` | Format and lint with Biome (auto-fix) |
| `pnpm ci:lint` | Lint without writing changes (as in CI) |
| `pnpm typecheck` | Run the TypeScript compiler |
| `pnpm knip` | Find unused files, exports and dependencies |
| `pnpm deploy` | Build and deploy to Cloudflare Pages |

## Project structure

```
src/
  App.tsx            # Tap surface, BPM readout, Info button
  useBpm.ts          # Tap timing and BPM calculation
  useSettings.ts     # Persisted settings hook
  components/        # InfoPanel, InfoIcon, WaveformVisualizer
```

Tests live next to the source they cover (`foo.ts` → `foo.test.ts`).

## Contributing

See [CLAUDE.md](CLAUDE.md) for project conventions: use pnpm, Tailwind utility classes instead of inline styles, and add or update tests for any change under `src/`.

## Deployment

Pushes to `master` run CI; on success the `Deploy` workflow builds the app and publishes it to Cloudflare Pages.
