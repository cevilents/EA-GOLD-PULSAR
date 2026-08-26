# i18n Implementation Report — GoldPulsarEA Bilingual (ID/EN)

## What was implemented

1. **First-visit language gate** — `components/LanguageGate.tsx`: full-screen fixed overlay (`fixed inset-0 z-[60] bg-ink`) shown whenever `locale === null`. Contains centered Gold/Pulsar/EA gradient brand text, the self-bilingual prompt "Pilih Bahasa / Choose Language", and two large gold-gradient CTA buttons ("Bahasa Indonesia" / "English") with `hover:scale-105` and aria-labels. Fade-in via opacity transition driven by `requestAnimationFrame` + state; reduced-motion handled by existing global CSS.
2. **Persistence** — `components/LanguageProvider.tsx` reads/writes `localStorage["gp-locale"]` (`"id" | "en"`), all access wrapped in try/catch (private-mode safe; failure treated as unset → gate). Returning visitors skip the gate. `setLocale` persists, sets context state, and updates `document.documentElement.lang`; the mount effect also applies `lang` from stored preference.
3. **Headline change** — ID hero line 2 is now `Gratis 100%.` (was "Gratis Selamanya."); EN is `100% Free.` EN line 1 adapted naturally (`Premium XAUUSD EAs.`).
4. **Full translation** — every visible string now comes from the dictionary: navbar (links, CTA, menu aria-label), hero, stats labels, EA collection (incl. per-EA tagline/description via `taglineEn`/`descriptionEn` fallback helpers), tutorial (5 steps with bodies, bullets, warnings, wallet box label, copy/copied button), claim form (labels, placeholders, helper, client validation errors, submit/submitting, success panel, generic/network errors), download panel locked/unlocked, FAQ (6 Q/A), footer (disclaimer, help line, contact link, © line with `{year}` placeholder).
5. **Server errors verbatim** — `/api/submit` response messages (and its per-field `fields` errors) render as-is; only *client-side* validation failures are localized (mapped from which fields failed, without touching `lib/validation.ts`). Generic/network fallbacks are dictionary-driven.
6. **`<html lang>`** updated to active locale via effect.

## Dictionary shape (`lib/i18n.ts`)

- `export type Locale = "id" | "en"`
- Explicit `Dictionary` interface; sections: `gate`, `nav`, `hero`, `stats.items[] {value,label}`, `collection` (+`metrics`, `freeBadge`), `tutorial` (+`steps: TutorialStep[]`, `walletLabel`, `copy`, `copied`), `form` (+`errors.{name,whatsapp,account}`), `download`, `faq.items[] {q,a}`, `footer`, each mirrored exactly across locales.
- `TutorialStep = { title: string; body: string; bullets: string[]; warning: string | null; wallet: boolean }` — flags model which steps show warnings/bullets/wallet box; both locales share identical structure (`warning: null` in BOTH locales for step 5 so parity holds).
- `export const dictionaries: Record<Locale, Dictionary>` + `getDictionary(locale)` helper.

## Files changed

| File | Change |
|---|---|
| `lib/i18n.ts` | new — Locale type, Dictionary interface, dictionaries, getDictionary |
| `lib/i18n.test.ts` | new — vitest structural-parity tests |
| `components/LanguageProvider.tsx` | new — context, storage read/write, `useI18n()` guarded hook |
| `components/LanguageGate.tsx` | new — locale selection overlay |
| `data/eas.ts` | added optional `taglineEn`/`descriptionEn` for all 6 EAs + `eaTagline()`/`eaDescription()` locale pickers with fallback |
| `app/page.tsx` | wraps tree in `<LanguageProvider>`, section order unchanged |
| `Navbar.tsx`, `Hero.tsx`, `StatsBar.tsx`, `EaCollection.tsx`, `TutorialSteps.tsx`, `ClaimFlow.tsx`, `Faq.tsx`, `Footer.tsx` | converted to client components using `useI18n()`; class names, ids, anchors, aria attributes unchanged |
| Untouched | `CandleChart`, `Reveal`, `app/api/**`, `lib/validation.ts`, `lib/rateLimit.ts`, `globals.css`, configs |

No new dependencies.

## Verification outputs

```
npx tsc --noEmit        → clean (exit 0)
npx vitest run          → 5 files, 22 passed (18 pre-existing + 4 new parity tests)
npm run build           → ✓ Compiled successfully; 5/5 static pages generated
```

Parity test asserts: identical sorted key-path sets across locales, pairwise leaf-type match, FAQ = 6 items both sides, tutorial steps = 5 both sides.

## Self-review findings

Grep sweep of converted components for Indonesian-only strings ("Gratis", "Klaim", "Unduh", "Salin", etc.): no leftovers. Remaining hardcoded visible text is limited to allowed exceptions: brand name GoldPulsarEA (navbar/footer/gate), XAUUSD ticker label, EA names + `.ex5` file names, WALLET_PARTNER digits, server error messages. `#cara-klaim` appears only as an anchor href/key name (required unchanged).

Notable decisions:
- Client-side validation errors are re-mapped from `validateClaim`'s field keys to dictionary messages at the call site (validation logic itself untouched); server-side field errors stay verbatim per spec.
- Tutorial step bodies became plain strings per the mandated `{title, body}` model, so the inline `<strong>`/`<em>` emphasis inside old step 1/3 JSX was dropped (quotes retained as typographic characters).

## Concerns

- Brief gate flash on repeat visits: locale is resolved in a mount effect, so returning visitors see the gate for ~1 frame before content swaps (inherent to the prescribed null-start architecture; avoids SSR hydration mismatch).
- `<html lang>` starts as `"id"` (SSR) and corrects on mount/hydration; metadata description remains Indonesian (out of scope per instructions).
- Old step 1/3 rich-text emphasis lost (see above) — flagged as intentional tradeoff of the flat step model.
