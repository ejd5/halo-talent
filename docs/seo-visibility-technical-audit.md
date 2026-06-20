# WTF — Where Talent Forms : Technical SEO Audit Report

This report presents a thorough technical SEO audit of the Where Talent Forms website's public marketing assets.

## 1. robots.txt Verification
- **Status**: Checked.
- **File location**: `/public/robots.txt`
- **Configuration**:
  ```text
  User-Agent: *
  Allow: /
  Disallow: /api/
  Sitemap: https://halotalent.com/sitemap.xml
  ```
- **Evaluation**: The setup is correct and standard. It allows search engines to crawl all public marketing pages while protecting sensitive `/api/` endpoints.

## 2. sitemap.xml Verification
- **Status**: Needs Enrichment.
- **File location**: `/app/sitemap.ts` (Next.js dynamic sitemap)
- **Evaluation**: The current dynamic sitemap only lists 6 URLs, missing most of the critical marketing, department, tool, protection, and blog pages. This will be resolved in Mission 2.

## 3. Metadata Title / Description
- **Status**: Audited.
- **Evaluation**:
  - Global default title template: `%s, Where Talent Forms` is configured in `/app/layout.tsx`.
  - Individual pages override metadata properly (e.g. `/blog`, `/pricing`, `/atlas`, `/lex-ai`).
  - To prevent duplicate indexing issues, we will verify all headings and meta titles are uniquely defined.

## 4. Canonical Tags
- **Status**: Audited.
- **Evaluation**: Canonical tags should be explicitly declared on every route to prevent content duplication across different domains or trailing slash variations. A helper canonical injector is recommended.

## 5. Open Graph & Twitter Cards
- **Status**: Checked.
- **Evaluation**: Open Graph objects are declared in `layout.tsx` and child metadata objects. They properly specify locales, type, and siteName.

## 6. Internal Linking & Headings
- **Status**: Needs Improvement.
- **Evaluation**: The internal link mapping between tool pages (Atlas, Lex, CHATEENG) and departments is present but needs to be enhanced automatically using predefined widget structures to boost page authority. H1 tags are correctly restricted to one per page.

## 7. Audit Checklist & Recommendations
1. **Sitemap Dynamic Routing**: Include all dynamic `/blog/[slug]`, `/departements/[slug]` and glossary routes.
2. **Alt Text on Images**: Verify all images have descriptive `alt` tags to support image search.
3. **Structured Data Injection**: Embed JSON-LD blocks to help LLMs and search engines parse entity relationships.
