# tap-bpm — Claude Code Rules

## Package manager
Always use **pnpm**. Never use `npm` or `yarn` for installs, script runs, or adding dependencies.

## Tests
- Any change to source code under `src/` must be accompanied by added or updated tests.
- Tests live alongside the source they cover: `src/foo.test.ts` for `src/foo.ts`, `src/components/Bar.test.tsx` for `src/components/Bar.tsx`.
- Run `pnpm test:run` before considering a task complete. All tests must pass.
- Do not delete or skip existing tests to make a change pass — fix the code or update the test with a clear reason.

## Styling
- This project uses Tailwind CSS. Always use Tailwind utility classes — never `style=` props.
- Biome enforces this via `nursery/noInlineStyles: "error"`.
- If a `style=` prop is truly unavoidable (e.g., a CSS value Tailwind cannot express even with arbitrary values), suppress with `// biome-ignore lint/nursery/noInlineStyles: <reason>` and explain why Tailwind cannot cover the case.
