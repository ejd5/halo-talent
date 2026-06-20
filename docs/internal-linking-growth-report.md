# WTF — Where Talent Forms : Internal Linking Growth Report

This document reports on the internal linking strategy implemented to distribute authority across product, blog, and category pages.

## 1. Context-Relevant Linking Structure
The system maps articles to related tools and department pages automatically:
- **Droit à l'image / Lex articles** → point directly to `/lex-ai` and `/protection`.
- **CRM / Audience articles** → cross-reference `/atlas`, `/chat-ai`, and `/demo`.
- **Management & Agency articles** → link back to `/qui-sommes-nous`, `/commissions`, and `/apply`.

## 2. Dynamic Linking Widgets
- **Related Articles Section**: Dynamically queries the `ARTICLES_WTF` collection, displaying 3 related topics from the same category to increase session duration and reduce bounce rate.
- **Glossary Cross-Referencing**: Every term in the glossary features a `lien` object leading visitors to relevant tools.
