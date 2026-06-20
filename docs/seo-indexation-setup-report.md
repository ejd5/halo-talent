# WTF — Where Talent Forms : Indexation Setup Report

This report outlines the details of the indexation configuration implemented for WTF — Where Talent Forms.

## 1. Dynamic Sitemap Implementation
The file `app/sitemap.ts` has been refactored to dynamically gather:
- The homepage (`/`)
- Brand/concept pages (`/qui-sommes-nous`, `/manifeste`)
- Operational tools and legal pages (`/lex-ai`, `/atlas`, `/chat-ai`, `/protection`, `/commissions`, `/pricing`, `/demo`, `/contact`, `/apply`, `/agence-vs-solo`, `/glossaire`, `/ressources-gratuites`)
- Operational department hubs (`/departements/glamour-premium`, `/departements/influenceurs`, `/departements/youtube-podcast`, `/departements/musique`, `/departements/sport-fitness`)
- Dynamic blog articles from the `ARTICLES_WTF` collection.

## 2. Robots.txt Configuration
The `public/robots.txt` configuration:
- Allows all standard search crawlers (`User-Agent: *`) to discover marketing pages.
- Restricts internal API endpoints (`Disallow: /api/`).
- Points correctly to the static root location: `https://halotalent.com/sitemap.xml`.

## 3. Search Console Action Items
To submit the sitemap to Google Search Console:
1. Log in to the Google Search Console dashboard.
2. Select the verified property `https://halotalent.com`.
3. Navigate to **Sitemaps** on the left menu.
4. Input `sitemap.xml` in the "Add a new sitemap" input and click **Submit**.
