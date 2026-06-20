# Rapport d'Audit Technique : Système de Blog WTF — Where Talent Forms

Ce document dresse l'état des lieux de la section Journal / Blog de WTF, identifie l'infrastructure et propose un plan d'intégration pour les 20 nouveaux articles premium.

## 1. Structure Technique du Blog Actuel

### Routes et Fichiers
- **Index du blog** : `/app/(marketing)/blog/page.tsx` qui rend le client `JournalClient.tsx`.
- **Pages d'articles** : `/app/(marketing)/blog/[slug]/page.tsx` qui rend le composant `JournalArticle.tsx`.
- **Configuration éditoriale** : `/lib/marketing/journal-wtf.ts`.
- **Fichier de données d'articles** : `/lib/marketing/journal-articles.ts`.

### Modèle de Données (`ArticleWTF`)
Défini dans `/lib/marketing/journal-wtf.ts` :
- `slug` (string)
- `title` (string)
- `excerpt` (string)
- `category` (string : 'maison', 'image-influence', 'atlas-ia', 'protection', 'lex', 'departements', 'dossiers')
- `rubrique` (string)
- `readingTime` (number)
- `publishedAt` (string : "YYYY-MM-DD")
- `heroImage` (string, optionnel)
- `metaTitle` (string)
- `metaDescription` (string)
- `content` (ArticleSectionWTF[])
- `internalLinks` (array of objects `{ label: string, href: string }`, optionnel)
- `cta` (object, optionnel)

Le contenu (`content`) supporte les types de bloc suivants :
- `heading`
- `subheading`
- `paragraph`
- `pullquote`
- `list`
- `a-retenir`
- `faq`
- `table` (supporte les en-têtes et les lignes)
- `cta`

## 2. Plan d'Intégration des 20 Nouveaux Articles

### Ajout des Données
- Nous allons enrichir la liste `ARTICLES_WTF` exportée dans `/lib/marketing/journal-articles.ts` avec les 20 nouveaux articles.
- Chaque article respectera la structure de type `ArticleWTF` en y incorporant toutes les exigences :
  - Métadonnées complètes (incluant `imagePrompt` et mots-clés dans les commentaires de structure de code ou de données si nécessaire, ou modélisés proprement).
  - Actes de narration : situation concrète, le problème réel, erreurs fréquentes, tendances avec données publiques, méthodologie actionnable, tableau comparatif, section solo vs accompagné, section droit à l'image, encadré "À retenir", FAQ (5 à 8 questions), et l'encart de conclusion WTF obligatoire avec liens internes appropriés.
  - Plumes éditoriales (Madison, Camille, Rafael, Niran, Alessio) réparties en rotation.
  - Dates échelonnées entre janvier 2026 et juin 2026.

### Gestion des Visuels et Mockups
- Les prompts d'images hero et d'illustrations seront documentés dans `/docs/journal-wtf-image-prompts.md`.
- Les prompts des captures d'écran et des mockups (Atlas CRM, CHATEENG, Lex, etc.) seront documentés dans `/docs/journal-wtf-mockup-prompts.md`.

### Wording et Prudence Juridique
- Un contrôle automatique ou manuel sera effectué pour s'assurer qu'aucun terme prohibé (ex: "revenu garanti", "protection totale") n'est utilisé, en les remplaçant par des formulations prudentes et conformes aux obligations professionnelles.
