
## Fix Wave — 2026-08-26 (commit 811f2f4)

### Finding 1: Prerendered HTML was gate-only (LanguageProvider.tsx)
- `components/LanguageProvider.tsx:49-53` — children tree now renders unconditionally; `<LanguageGate/>` renders as a sibling overlay (`{locale === null ? <LanguageGate /> : null}`) on top via its existing `fixed inset-0 z-[60] bg-ink` positioning. Gate fade/rAF entrance untouched.
- `components/LanguageProvider.tsx:60-64` — `useI18n()` no longer throws when locale is null; it centrally resolves to the `id` dictionary fallback (`const resolved = locale ?? "id"`), so SSR/first client render emits full Indonesian marketing content and all consumers keep non-nullable `t: Dictionary` (no call-site changes needed; verified all consumers via grep).
- Hydration safety: SSR output (children with id dict + opacity-0 gate) equals first client render since state starts null on both; storage resolution to "en" happens post-hydration in useEffect, swapping content client-side with no mismatch.
- Gate behavior unchanged: picking a language persists to localStorage (`gp-locale`), sets `document.documentElement.lang`, and swaps dictionaries exactly as before.
- Acceptance criteria (a)–(d) met.

### Finding 2: EN thousands separator (lib/i18n.ts)
- `lib/i18n.ts:315` — EN stats value `"2.400+"` → `"2,400+"`. ID stays `"2.400+"`.

### Tests / Gates
- `npx tsc --noEmit` — clean (no output, exit 0)
- `npx vitest run` — 22/22 passed (5 files), 417ms
- `npm run build` — passed; `/` prerendered static (17.2 kB), no errors
- `lib/i18n.test.ts` untouched — assertions cover key-path parity/type parity only, not affected values.

### Scope
Only `components/LanguageProvider.tsx` and `lib/i18n.ts` changed (5 insertions, 6 deletions). Single commit `811f2f4 fix: render content under language gate + en number format` on `feat/landing-page`.
