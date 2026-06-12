# Halo Chat AI — Setup Local

## Prérequis

- Node.js 20+ et pnpm
- Compte Supabase avec les migrations 038 et 039 appliquées
- Projet Halo Talent configuré

## Variables d'environnement

Dans `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optionnelle — sans cette clé, le module fonctionne en Demo Mode
DEEPSEEK_API_KEY=sk-...
```

## Migrations

```bash
# Appliquer les migrations Chat AI
npx supabase migration up
```

Vérifier que les migrations 038 et 039 sont appliquées dans le dashboard Supabase.

## Seed des données démo

```bash
npx tsx scripts/seed-chat-ai-demo.ts
```

Ce script crée :
- 1 compte créateur démo (`demo-creator@halo-talent.com` / `DemoChatAI2026!`)
- 41 fans (dont 2 `do_not_contact` et 1 `vulnerable_fan`)
- 25 conversations avec 8-11 messages chacune
- 20 vault assets (dont 3 avec `soldTo`)
- 3 playbooks (Solo Standard, VIP Premium, Agency Safe)
- 12 recommandations PPV
- 9 items QA
- Checklist de consentement validée (11/11)
- Configuration utilisateur active
- Audit logs initiaux

## Accès à la page dev-test

1. Lancer le serveur Next.js : `npm run dev`
2. Se connecter avec le compte démo (email + mot de passe ci-dessus)
3. Aller sur `/dashboard/chat-ai/dev-test`

## Comportement Demo Mode

- **Sans `DEEPSEEK_API_KEY`** : les drafts sont générés avec des réponses pré-enregistrées. Un badge "DEMO" apparaît.
- **Avec `DEEPSEEK_API_KEY`** : les drafts utilisent l'IA réelle (deepseek-v4-flash pour les brouillons, deepseek-v4-pro pour les analyses PPV).

## Tester les blocages compliance

### Fan do_not_contact
Le fan "Blocked_User" (ID: `*-fan-40`) est marqué `do_not_contact`.
Toute génération de draft pour ce fan retourne HTTP 403.

### Fan vulnerable_fan
Le fan "Vulnerable_Fan" (ID: `*-fan-41`) a le flag `vulnerable_fan`.
Toute action commerciale (PPV, upsell) pour ce fan est bloquée (HTTP 403).

### Contenu déjà vendu
- `vault-05` (Contenu Sensible) a déjà été vendu à Alex.M (`*-fan-01`)
- `vault-17` (Contenu Ultra Premium) a déjà été vendu à Alex.M et James.W
- Proposer ces assets aux fans concernés retourne HTTP 409

### Checklist de consentement
Le compte démo a la checklist complète (11/11). Pour tester le blocage consentement :
1. Mettre `item_1_authorized = false` dans `chat_ai_consent_checklists`
2. Tenter de générer un draft → HTTP 403

### Module en pause
Mettre `is_paused = true` dans `chat_ai_user_config` pour le compte démo.
Toute action retourne HTTP 403.

## Vérifier les audit logs

Les audit logs sont visibles :
- Dans la page dev-test (colonne de droite)
- Via l'API : `GET /api/chat-ai/audit`
- Dans Supabase : table `chat_ai_audit_logs`

## Smoke test automatisé

```bash
# Lancer le serveur Next.js d'abord
npm run dev

# Puis dans un autre terminal :
npx tsx scripts/smoke-chat-ai.ts
```

Le smoke test vérifie :
- GET conversations (doit retourner > 0)
- GET fans (doit retourner >= 40)
- GET fan detail
- POST draft sur fan autorisé → 200
- POST draft sur fan do_not_contact → 403
- POST scan sur vulnerable_fan + action commerciale → bloqué
- POST approve draft → 200
- POST copy draft → 200
- POST PPV sur asset déjà vendu → bloqué
- GET audit logs → > 0
- GET audit export → JSON

## Commandes utiles

```bash
# Vérifier TypeScript
npx tsc --noEmit

# Lint des fichiers Chat AI
npx eslint "app/api/chat-ai/" "app/(private)/dashboard/chat-ai/"

# Build complet
npm run build
```
