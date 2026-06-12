# P0-C Legal Pages, Footer & Newsletter Report

**Date**: 2026-06-11
**Status**: APPROVED

---

## 1. Summary

Phase P0-C created the three missing legal pages, wired the Footer with real links, built a newsletter API with Supabase storage, added social link configuration, documented the contact notification gap, and added i18n keys. All tests pass.

---

## 2. Legal Pages Created

### `/mentions-legales`
- **File**: `app/(marketing)/mentions-legales/page.tsx`
- **Content**: 7 sections — Éditeur, Directeur de publication, Hébergement, Propriété intellectuelle, Liens hypertextes, Limitation de responsabilité, Contact
- **Placeholders**: 8 fields marked [À compléter] for company info (raison sociale, forme juridique, SIRET, TVA, capital, adresse, directeur, email)
- **Admin banner**: "Certaines informations administratives doivent être complétées avant mise en production."
- **Dark theme**: Matching existing page design (noise overlay, radial gradient, `#1A1614` background)

### `/confidentialite`
- **File**: `app/(marketing)/confidentialite/page.tsx`
- **Content**: 9 sections — Introduction, Données collectées (7 sub-sections: contact, apply, compte, Chat AI/CRM, Halo Lex, newsletter, données techniques), Finalités, Durées de conservation, Sous-traitants, Vos droits, Sécurité, Cookies, Contact
- **Legal review notice**: "Document informatif à finaliser avec un conseil juridique avant production."
- **Sub-sections**: Each data collection point explains what, why, and tentative legal basis with "à confirmer" annotations
- **No absolute claims**: All legal bases marked as indicative

### `/cgu`
- **File**: `app/(marketing)/cgu/page.tsx`
- **Content**: 16 sections — Objet, Accès, Compte, Usage acceptable, Interdiction scraping, Modules IA, Absence de garantie de revenus, Absence de garantie plateforme, Responsabilité utilisateur, Données et export, Suspension/résiliation, Propriété intellectuelle, Limitation de responsabilité, Modification, Loi applicable, Contact
- **Key protections**: No revenue guarantees (Section 7), no platform non-restriction guarantees (Section 8), AI modules "en l'état" with human validation recommendation (Section 6)

---

## 3. Footer Updates

**File**: `components/shared/Footer.tsx`

| Element | Before | After |
|---------|--------|-------|
| Legal links | `<span>Mentions légales</span>` | `<Link href="/mentions-legales">Mentions légales</Link>` |
| Legal links | `<span>Politique de confidentialité</span>` | `<Link href="/confidentialite">Politique de confidentialité</Link>` |
| Legal links | `<span>CGU</span>` | `<Link href="/cgu">CGU</Link>` |
| Social links | 4x `<span>` (IG, TT, IN, X) | Config-driven: URL present → `<a>` external, empty → `<span>` |
| Newsletter | Dead form (no onSubmit) | Functional form wired to `/api/newsletter` with success/error states |
| Newsletter text | "Restez informé des nouvelles de la maison." | "Recevez les mises à jour produit et guides Halo." |

No `href="#"` remaining in Footer.

---

## 4. Newsletter API

### Files created:
| File | Purpose |
|------|---------|
| `supabase/migrations/041_newsletter_subscribers.sql` | `newsletter_subscribers` table: email (unique), source, consent, IP, user agent, status, timestamps. RLS: public insert, admin read/update |
| `app/api/newsletter/route.ts` | POST route: Zod validation, duplicate detection (returns `already_subscribed`), re-subscribe logic, IP/user-agent logging |
| `lib/validations/newsletter.ts` | Zod schema: email, optional source and consent |

### Behavior:
- New subscriber → inserts with status `active`
- Already subscribed → returns `already_subscribed` (no error)
- Previously unsubscribed → re-activates as `resubscribed`
- Race condition (23505 unique violation) → treated as success
- TODO: confirmation email via Resend when configured

---

## 5. Contact Notification

**Status**: Documented, not implemented.

The `/api/contact/route.ts` now has a TODO block explaining:
- Messages are stored in Supabase and consultable via admin dashboard
- Future options: Resend email, Telegram bot, Slack webhook
- No paid dependency added

This follows the same pattern as `/api/apply/route.ts` (existing TODO for Resend/Telegram).

---

## 6. Social Links Configuration

**File**: `lib/config/site.ts`

```typescript
socialLinks: {
  instagram: "",
  tiktok: "",
  linkedin: "",
  x: "",
}
```

Also includes: `editorName`, `legalForm`, `address`, `contactEmail`, `publicationDirector`, `hoster`, `registrationNumber`, `dpoEmail` — all with placeholder values.

**Footer behavior**:
- If URL is empty string → renders `<span>{label}</span>` (non-clickable)
- If URL is populated → renders `<a href={url} target="_blank" rel="noopener noreferrer">`
- No `href="#"` dead links

---

## 7. i18n Keys Added

| Key | Purpose |
|-----|---------|
| `footer.newsletter.desc` | Newsletter description text (6 languages) |
| `footer.newsletter.success` | Success message after subscription |
| `footer.newsletter.error_email` | Email validation error |
| `footer.newsletter.error_generic` | Generic subscription error |
| `legal.mentions_legales` | Page title (6 languages) |
| `legal.confidentialite` | Page title (6 languages) |
| `legal.cgu` | Page title (6 languages) |

Legal pages are written primarily in French (site is FR-first). i18n keys exist for titles/subtitles so navigation can be localized.

---

## 8. Tests

| Test | Result |
|------|--------|
| `npx tsc --noEmit` | PASS — 0 new errors |
| `npx eslint` (new P0-C files) | PASS — 0 errors, 0 warnings |
| `npm run build` | PASS — Compiled successfully, 377/377 pages |

---

## 9. Files Created/Modified

### Created (8):
1. `app/(marketing)/mentions-legales/page.tsx`
2. `app/(marketing)/confidentialite/page.tsx`
3. `app/(marketing)/cgu/page.tsx`
4. `lib/config/site.ts`
5. `supabase/migrations/041_newsletter_subscribers.sql`
6. `lib/validations/newsletter.ts`
7. `app/api/newsletter/route.ts`

### Modified (3):
8. `components/shared/Footer.tsx` — legal links, social config, newsletter form
9. `app/api/contact/route.ts` — added admin notification TODO
10. `lib/i18n/common.ts` — added 7 new keys (newsletter + legal)

---

## 10. Information to Complete Before Production

| Field | Location | Current Value |
|-------|----------|---------------|
| Raison sociale | `lib/config/site.ts`, `/mentions-legales` | `[À compléter]` |
| Forme juridique | `lib/config/site.ts`, `/mentions-legales` | `[À compléter]` |
| Capital social | `/mentions-legales` | `[À compléter]` |
| Adresse siège | `lib/config/site.ts`, `/mentions-legales` | `[À compléter]` |
| SIRET | `lib/config/site.ts`, `/mentions-legales` | `[À compléter]` |
| TVA intracom. | `/mentions-legales` | `[À compléter]` |
| Directeur publication | `lib/config/site.ts`, `/mentions-legales` | `[À compléter]` |
| Email DPO / privacy | `lib/config/site.ts`, `/confidentialite` | `[À compléter]` |
| Social media URLs | `lib/config/site.ts` | Empty strings |
| Legal bases (RGPD) | `/confidentialite` | Marked "à confirmer" |
| Cookie consent banner | `/confidentialite` §8 | Not yet deployed |

---

## 11. Remaining Risks

| Severity | Description |
|----------|-------------|
| LOW | Legal pages contain `[À compléter]` placeholders — must be filled before production |
| LOW | Social links are `<span>` because no real URLs exist — non-blocking, just not functional |
| LOW | Newsletter has no confirmation email (Resend not configured) — same pattern as apply route |
| LOW | Cookie consent banner not implemented — needed if analytics cookies deployed |
| LOW | Legal basis annotations in `/confidentialite` are indicative — must be validated by counsel |

**No CRITICAL, HIGH, or MEDIUM risks.** All pages are structurally complete with prudent language. No compliance guarantees, no revenue claims, no platform non-restriction promises.
