---
name: admin-command-center-redesign
description: Admin Command Center dashboard redesign — 5-row layout with sparkline KPIs, hierarchical quick actions, activity feed, top creators ranking, and alerts panel
type: project
---

# Admin Command Center Redesign — Complete

**Completed:** 2026-06-10

The admin "Command Center" dashboard at `/admin` was redesigned from 8 sections to a focused 5-row layout:

- **ROW 1** — Header + PeriodSelector (segmented 7J/30J/90J/12M/Custom) + DemoBadge (orange bg)
- **ROW 2** — 5 KPI cards with inline SVG sparklines (revenue, commission, active creators, applications, retention rate)
- **ROW 3** — Hierarchical quick actions (candidatures card bigger with pulsating badge, 3 normal cards, Chat Copilot)
- **ROW 4** — 2-col [65% RevenueChart with "View by creator" toggle] + [35% ActivityFeed with colored icons]
- **ROW 5** — 2-col [50% TopCreatorsRanking] + [50% AlertsPanel]

**Removed sections:** CreatorHealthTable, AcquisitionPipeline, TeamPerformance, CompliancePreview, InternationalPanel, old filter chips, old metric grid.

## Files modified
- `lib/mock/admin-dashboard.ts` — 5 KPIs with sparkline arrays, new types (ActivityItem, TopCreator, AlertItem), new data arrays, Chat Copilot action
- `lib/i18n/common.ts` — ~50 new keys for period selector, activity feed, ranking, alerts, quick actions, demo badge
- `components/admin/RevenueChart.tsx` — Added 4th "View by creator" toggle with per-creator revenue lines
- `components/admin/CommandCenter.tsx` — Rewritten orchestrator with 5-row layout and new imports

## Files created
- `components/admin/DemoBadge.tsx` — Orange-bg demo badge with Sparkles icon
- `components/admin/PeriodSelector.tsx` — Segmented button group
- `components/admin/KpiCard.tsx` — Single KPI card with inline SVG sparkline
- `components/admin/KpiRow.tsx` — Row of 5 KpiCards
- `components/admin/QuickActions.tsx` — Hierarchical actions grid
- `components/admin/ActivityFeed.tsx` — Feed items with colored icons
- `components/admin/TopCreatorsRanking.tsx` — Top 5 creators by revenue
- `components/admin/AlertsPanel.tsx` — Alert cards with colored borders

## Files removed from orchestrator (code kept on disk)
- UrgentActionsPanel, AdminMetricGrid, CreatorHealthTable, AcquisitionPipeline, TeamPerformancePanel, CompliancePreview, InternationalPanel
