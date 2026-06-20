# WTF — Where Talent Forms : Structured Data Implementation Report

This report documents the Schema.org JSON-LD microdata structure implemented on WTF — Where Talent Forms.

## 1. StructuredData Component
A reusable react component `/components/seo/StructuredData.tsx` has been built to inject clean JSON-LD blocks on any page route.

## 2. Configured Schemas

### Organization Schema (Homepage)
- **Properties**:
  - `name`: WTF — Where Talent Forms
  - `url`: `https://halotalent.com`
  - `logo`: `https://halotalent.com/default-icon.svg`
  - `description`: Maison de management créatif premium pour créateurs de contenu, YouTube, podcasts, sportifs, et profils glamour.

### WebSite Schema (Homepage)
- **Properties**:
  - `name`: WTF — Where Talent Forms
  - `url`: `https://halotalent.com`

### Article Schema (Blog Pages)
Dynamically populated on all `/blog/[slug]` endpoints:
- `headline`: Title of the article.
- `description`: Excerpt / summary.
- `author`: Plume name (e.g. Camille, Madison, Rafael).
- `datePublished`: Article date.
- `image`: Absolute hero image URL.
- `publisher`: Where Talent Forms organization node.
- `mainEntityOfPage`: Absolute canonical URL.
