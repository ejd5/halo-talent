# Deployment Guide — Halo Talent

## Environment Variables

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=

# Cron Auth
CRON_SECRET=

# Trend Intelligence (optional per module)
APIFY_TOKEN=
SERPAPI_KEY=
YOUTUBE_API_KEY=
NEWSAPI_KEY=

# Notifications (optional)
TELEGRAM_BOT_TOKEN=
```

## Cron Jobs (Vercel)

Configured in `vercel.json`:

| Cron | Schedule | Route |
|------|----------|-------|
| Trend refresh | Every 4h | `/api/cron/trends/refresh` |
| Daily digest | 7:00 daily | `/api/cron/trends/daily-digest` |
| Segment recalc | Every hour | `/api/cron/segments/recalculate-all` |
| Weekly insights | Monday 8:00 | `/api/cron/benchmarking/weekly-insights` |
| Scheduled publish | Every 15min | `/api/cron/calendar/scheduled-publish` |

## Database Migrations

Run migrations in order from `supabase/migrations/`:

- `init.sql` — Core schema
- `025_atlas_smart_messages.sql` — Smart messaging
- `026_atlas_ppv.sql` — PPV system
- `027_benchmarking.sql` — Benchmarking
- `028_team_management.sql` — Team management
- `029_content_calendar.sql` — Agency content calendar

## Module Verification Checklist

- [ ] Trend Hub loads in <3s
- [ ] Smart Segments recalculate on fan update
- [ ] PPV Analytics shows correct metrics
- [ ] LTV Prediction works with and without history
- [ ] Command Center scales to 100+ creators
- [ ] Content Calendar filters correctly
- [ ] Audit logs immutable
- [ ] Pro Mode disclaimer enforced
- [ ] RLS policies tested per table
- [ ] Mobile responsive on all screens
