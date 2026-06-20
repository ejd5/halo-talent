# WTF — Where Talent Forms : Image & Video SEO Report

This report presents our technical guidelines and audit details for media asset search optimization.

## 1. Alt Text and Image Naming Conventions
- **Descriptive Filenames**: All images in `/public/images/wtf/journal/` use descriptive hyphenated names rather than generic titles.
- **Alt Text Integrity**: 
  - Informative images contain concise descriptions.
  - Decorative background panels use `alt=""` to avoid screen-reader clutter and maintain layout shift safety.

## 2. Technical Performance
- **Next.js Image Integration**: Leverage the Next.js `Image` component with `priority` flags on above-the-fold hero assets to prevent Cumulative Layout Shifts (CLS).
- **Format and Compression**: We ensure that image files are lightweight (under 300KB) and serve optimized formats like WebP or AVIF.
