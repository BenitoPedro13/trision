# AlignUI vendored sources

Byte-identical copies from AlignUI docs v1.2, fetched 2026-08-18. Re-fetch each URL
and diff against the working tree — zero differences is the standing invariant.

| File | Source URL | sha256 | Fetched |
|---|---|---|---|
| `src/utils/cn.ts` | https://alignui.com/docs/v1.2/utils/cn | `22aaa8d9aa84117a593571d6fa65299b4f35e8279ebf22b4505cf420b2c78bbe` | 2026-08-18 |
| `src/utils/tv.ts` | https://alignui.com/docs/v1.2/utils/tv | `0e97244340460e637ef3e9e1c296ef2e7ea83194f71ad117dd676b6722cb9723` | 2026-08-18 |
| `src/utils/polymorphic.ts` | https://alignui.com/docs/v1.2/utils/polymorphic | `97c0eda0d098e45dcd909a030366d33e17e0128a2b39226f7c93a88e03629766` | 2026-08-18 |
| `src/utils/recursive-clone-children.tsx` | https://alignui.com/docs/v1.2/utils/recursive-clone-children | `fe8c15480a41f303dafbf941a4db4eb1f23dd3123b77d1e093c2fd8de716e176` | 2026-08-18 |
| `src/components/ui/drawer.tsx` | https://alignui.com/docs/v1.2/ui/drawer | `af1f1915d69a8e714773c90481993a955f347d280e17016fe48583a662d7ac1e` | 2026-08-18 |
| `src/components/ui/compact-button.tsx` | https://alignui.com/docs/v1.2/ui/compact-button | `3352322270681bbef52c427710ef5ba4e003c1b66885a5fecf549b0d8c58a615` | 2026-08-18 |

**Not vendored via CLI:** `npx @alignui/cli tailwind` overwrites `globals.css` — see
`docs/tasks/TASK-alignui-vendoring.md` §1. AlignUI token names used by these files are
bridged in `src/app/globals.css` `@theme inline`, not ported from AlignUI's full theme.

**Restyle boundary:** Trísion values only — overlay opacity, `--fumo` panel surface,
`--aro` hairlines, sharp corners (`--radius-*: 0`), no shadow elevation. Backdrop blur
from the vendored Drawer overlay is disabled in `globals.css` (opaque overlay only).
