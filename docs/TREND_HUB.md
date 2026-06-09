# Trend Hub — Intelligence de tendances

## Sources
- **Google Trends** — via SerpAPI (SERPAPI_KEY)
- **TikTok** — via Apify TikTok Creative Lab (APIFY_TOKEN)
- **YouTube** — via YouTube Data API (YOUTUBE_API_KEY)
- **Reddit** — via NewsAPI (NEWSAPI_KEY)
- **X/Twitter** — scraping direct

## Architecture
- `lib/trends/` — engine classes par source
- `app/api/trends/` — endpoints d'accès
- `app/api/cron/trends/refresh` — refresh toutes les 4h
- `app/(private)/dashboard/trends/` — UI créateur

## Configuration
Les APIs sont optionnelles. Le système détecte les clés manquantes et désactive la source correspondante. Le système fonctionne avec au moins une source active.

## Contenu généré
- Trending topics du jour
- Hashtags émergents par catégorie
- Analyse concurrentielle tendances
- Suggestions de contenu basées tendances

## Limitation
Limiter à 1000 requêtes/jour toutes sources confondues. Le cron de refresh respecte les quotas API.
