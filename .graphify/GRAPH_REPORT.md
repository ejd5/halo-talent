# Graph Report - .  (2026-06-09)

## Corpus Check
- 352 files · ~481 222 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1309 nodes · 1915 edges · 100 communities detected
- Extraction: 99% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output
- Edge kinds: contains: 966 · imports: 487 · imports_from: 368 · references: 56 · calls: 20 · semantically_similar_to: 7 · conceptually_related_to: 6 · reads_from: 2 · triggers: 2 · re_exports: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: cli)
- Included files: 352 · Candidates: 1119
- Excluded: 454 untracked · 90365 ignored · 0 sensitive · 1 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.
## God Nodes (most connected - your core abstractions)
1. `createClient()` - 34 edges
2. `cn()` - 21 edges
3. `formatEuro()` - 17 edges
4. `Section()` - 12 edges
5. `Application` - 11 edges
6. `Creator` - 10 edges
7. `createClient()` - 10 edges
8. `CalendarEvent` - 9 edges
9. `colors` - 9 edges
10. `profiles` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Hero Image Variant 2` --semantically_similar_to--> `Hero Image (Active)`  [AMBIGUOUS] [semantically similar]
  public/images/heropic2.png → public/images/heropic.png
- `Hero Image Variant 3` --semantically_similar_to--> `Hero Image (Active)`  [AMBIGUOUS] [semantically similar]
  public/images/heropic3.png → public/images/heropic.png
- `Hero Image Variant 4` --semantically_similar_to--> `Hero Image (Active)`  [AMBIGUOUS] [semantically similar]
  public/images/heropic4.png → public/images/heropic.png
- `Hero Image Variant 5` --semantically_similar_to--> `Hero Image (Active)`  [AMBIGUOUS] [semantically similar]
  public/images/heropic5.png → public/images/heropic.png
- `Hero Image Variant 6` --semantically_similar_to--> `Hero Image (Active)`  [AMBIGUOUS] [semantically similar]
  public/images/heropic6.png → public/images/heropic.png

## Hyperedges (group relationships)
- **Creator Protection Ecosystem** — contrat_type_halo_talent, creator_rights_guide, clauses_abusives_catalogue [INFERRED 0.85]
- **Agency Litigation Trends** — chatters_lawsuits_2026, unruly_lawsuits_2021, class_action_onlyfans_2024 [INFERRED 0.80]
- **French Creator Rights Legal Framework** — code_consommation, code_propriete_intellectuelle [INFERRED 0.85]
- **AI Content Regulation Landscape** — onlyfans_ai_content_policy_2026, take_it_down_act_2026, online_safety_bill, onlyfans_terms_of_service_2026 [INFERRED 0.85]
- **Platform Account Governance Rules** — onlyfans_terms_of_service_2026, fansly_terms_of_service, instagram_terms_of_service, mym_terms_of_service [INFERRED 0.80]
- **Next.js Default Public Assets** — file_icon, globe_icon, next_logo, vercel_logo, window_icon [INFERRED 0.80]

## Communities

### Community 0 - "Blog & Knowledge Base"
Cohesion: 0.05
Nodes (42): metadata, BLOCK_TYPES, BlockEditor(), BlockPreview(), ALL_CATEGORIES, ALL_TAGS, BlogEditor(), ALL_CATEGORIES (+34 more)

### Community 1 - "Calendar Module"
Cohesion: 0.06
Nodes (40): calendarEvents, metadata, CalendarEvent, CalendarFilters, CalendarStatus, CalendarView, CONTENT_TYPE_ICONS, CONTENT_TYPE_LABELS (+32 more)

### Community 2 - "Revenue Alert Cards"
Cohesion: 0.06
Nodes (45): alertBg, alertBorder, AlertCards(), alertIcons, Props, ByCreatorTab(), paymentStatusStyles, Props (+37 more)

### Community 3 - "Analytics & AI Chat"
Cohesion: 0.06
Nodes (43): analyticsData, MONTHS_24, metadata, ActivityHeatMap, AnalyticsData, AnalyticsTab, CACData, ChartProps (+35 more)

### Community 4 - "Layout & Typography"
Cohesion: 0.06
Nodes (31): instrumentSerif, jetbrainsMono, metadata, plusJakartaSans, RootLayout(), syne, styles, icons (+23 more)

### Community 5 - "Dashboard Shell"
Cohesion: 0.07
Nodes (25): agentCards, formatEuro(), mockActivities, mockBrief, mockCreator, mockEvolution, mockKpi, navSections (+17 more)

### Community 6 - "Auth & Site Pages"
Cohesion: 0.07
Nodes (15): AnalyzeResult, categoryOrder, Clause, FALLBACK_VALUES, getMaxScore(), getRiskLevel(), PLATFORM_IDS, ProtectionPage() (+7 more)

### Community 7 - "Creator Onboarding"
Cohesion: 0.08
Nodes (19): ageOptions, allPlatforms, departments, followerRanges, FormData, PlatformEntry, revenueRanges, Step1 (+11 more)

### Community 8 - "Activity Feed"
Cohesion: 0.08
Nodes (18): activities, Activity, ActivityFeed(), DashboardOverview(), Props, atRisk, creators, deadlines (+10 more)

### Community 9 - "Payout Detail Panel"
Cohesion: 0.11
Nodes (18): methodIcons, methodLabels, PayoutDetailPanel(), Props, statusLabels, PayoutFilters(), Props, STATUS_TABS (+10 more)

### Community 10 - "Mock Data Generator"
Cohesion: 0.11
Nodes (17): BackupRow(), CronRow(), formatDate(), SERVICE_ICONS, SystemPage(), timeAgo(), auditLogs, backups (+9 more)

### Community 11 - "Creator Detail & Platforms"
Cohesion: 0.11
Nodes (19): Props, statusLabels, tabs, calendarPosts, internalNotes, messages, Creator, relativeTime() (+11 more)

### Community 12 - "Home & Commissions"
Cohesion: 0.10
Nodes (14): calcCommission(), Calculator(), CommissionsSection(), tiers, departments, DepartmentsSection(), FinalCtaSection(), heroLines (+6 more)

### Community 13 - "API Routes"
Cohesion: 0.08
Nodes (2): AnalyzeRequest, createClient()

### Community 14 - "Commission Adjustments"
Cohesion: 0.18
Nodes (13): commissionAdjustments, CommissionAdjustment, CommissionAdjustmentStatus, CommissionRow, buildCommissionRows(), AdjustmentModal(), Props, REASONS (+5 more)

### Community 15 - "Library Filters"
Cohesion: 0.14
Nodes (13): ALL_CREATORS, ALL_TAGS, ALL_TYPES, LibraryFilters(), LibraryFiltersState, LibraryPage(), MediaCard(), TYPE_ICONS (+5 more)

### Community 16 - "Audit Logs"
Cohesion: 0.14
Nodes (15): ACTION_TYPE_LABELS, AuditLogsPage(), formatDate(), LogRow(), RESOURCE_TYPE_LABELS, SEVERITY_COLORS, SEVERITY_ICONS, timeAgo() (+7 more)

### Community 17 - "Team Management"
Cohesion: 0.11
Nodes (10): ALL_PERMISSIONS, Assignment, AuditLog, Availability, Performance, ROLE_COLORS, ROLE_LABELS, STATUS_COLORS (+2 more)

### Community 18 - "Performance Reports"
Cohesion: 0.11
Nodes (8): CohortData, CompareCreator, CreatorPerf, DepartmentData, FlowData, Tab, TABS, TierData

### Community 19 - "Seed Data"
Cohesion: 0.17
Nodes (12): ALL_ROLES, InviteMemberModal(), mockCreators, TeamPage(), auditLogs, teamMembers, ROLE_COLORS, ROLE_LABELS (+4 more)

### Community 20 - "Creator AI Chat"
Cohesion: 0.15
Nodes (9): Period, periods, Props, Topbar(), StatsCardProps, Goal, initialGoals, cn() (+1 more)

### Community 21 - "Media Upload"
Cohesion: 0.15
Nodes (13): CreatorCard(), Props, statusConfig, ExportTab(), contracts, tierConfig, formatDate(), formatEuro() (+5 more)

### Community 22 - "Payout Filters"
Cohesion: 0.17
Nodes (12): Application, Props, statusStyles, tabs, Props, rejectionTemplates, RejectModal(), countryFlags (+4 more)

### Community 23 - "Notifications"
Cohesion: 0.18
Nodes (11): applications, departments, platformOptions, metadata, ApplicationStatus, ApplicationDetailPanel(), ApplicationFilters(), Props (+3 more)

### Community 24 - "Navbar & Navigation"
Cohesion: 0.13
Nodes (6): CommandCenterData, CreatorData, Filters, Period, SortKey, ViewMode

### Community 25 - "Protection Page"
Cohesion: 0.19
Nodes (13): auditLogs, departments, managers, months, AIReport, AuditLog, CalendarPost, Contract (+5 more)

### Community 26 - "Application Tables"
Cohesion: 0.13
Nodes (9): ACTION_LABELS, Analysis, CATEGORY_OPTIONS, JURISDICTION_OPTIONS, KnowledgeEntry, LegalUpdate, PLATFORM_OPTIONS, RISK_COLORS (+1 more)

### Community 27 - "Atlas Legal Dashboard"
Cohesion: 0.16
Nodes (10): AdminShell(), Props, CommandItem, CommandPalette(), Props, NavItem, NavSection, navSections (+2 more)

### Community 28 - "Application Filters"
Cohesion: 0.17
Nodes (11): auditLogs, internalNotes, formatDate(), relativeTime(), units, actionColors, actionIcons, HistoryTab() (+3 more)

### Community 29 - "Community Page"
Cohesion: 0.14
Nodes (9): CreatorDetailPage(), CreatorsGridPage(), Filters, ViewMode, creators, metadata, CreatorStatus, Tier (+1 more)

### Community 30 - "Contracts Page"
Cohesion: 0.17
Nodes (11): ALL_ROLES, CustomRoleDef, MANAGED_ROLES, PendingChange, PermissionsPage(), metadata, ALL_ACTIONS, canAccessResource() (+3 more)

### Community 31 - "Dashboard Goals"
Cohesion: 0.22
Nodes (2): createAdminClient(), POST()

### Community 32 - "Dashboard Insights"
Cohesion: 0.15
Nodes (8): CalendarEvent, CONTENT_TYPE_ICONS, CONTENT_TYPE_LABELS, PLATFORM_COLORS, PLATFORM_LABELS, STATUS_COLORS, STATUS_LABELS, ViewMode

### Community 33 - "Dashboard Learning"
Cohesion: 0.28
Nodes (12): ai_conversations, applications, auth.users, contracts, creator_accounts, messages, monthly_revenues, notifications (+4 more)

### Community 34 - "Dashboard Library"
Cohesion: 0.28
Nodes (12): ai_conversations, applications, auth.users, contracts, creator_accounts, messages, monthly_revenues, notifications (+4 more)

### Community 35 - "Dashboard Messages"
Cohesion: 0.25
Nodes (4): logAction(), LogParams, sendTelegramAlert(), createClient()

### Community 36 - "Dashboard Platform Cards"
Cohesion: 0.22
Nodes (7): Button(), ButtonProps, ButtonVariant, variantBase, variantHover, Input, InputProps

### Community 37 - "Dashboard Revenue"
Cohesion: 0.20
Nodes (9): CATEGORIES, CATEGORY_BADGE, ForumPost, Meetup, MOCK_MEETUPS, MOCK_POSTS, PostCard(), PostCategory (+1 more)

### Community 38 - "Creator AI Analysis"
Cohesion: 0.40
Nodes (10): Agency Practices Report 2026, Chatters Lawsuits 2026, Catalogue des Clauses Abusives, Code Civil Droit des Contrats, Commission Rates Benchmark 2026, Contrat-Type Halo Talent, Creator Rights Guide, Digital Services Act Extraits (+2 more)

### Community 39 - "Creator Calendar Tab"
Cohesion: 0.31
Nodes (5): Footer(), socialIcons, getNavItems(), Navbar(), NavItem

### Community 40 - "Creator Communications"
Cohesion: 0.25
Nodes (6): AIAnalysis, AuditLog, InternalNote, platformFollowers, platformVerified, Props

### Community 41 - "Creator Contracts Tab"
Cohesion: 0.32
Nodes (5): Alert, ALERT_THRESHOLDS, detectAlerts(), determineStatus(), EnrichedCreator

### Community 42 - "Creator Notes & Docs"
Cohesion: 0.25
Nodes (2): ALL_TAGS, CREATORS

### Community 43 - "Creator Overview"
Cohesion: 0.46
Nodes (7): auth.users, creator_manager_assignments, profiles, team_audit_log, team_member_availability, team_member_permissions, team_members

### Community 44 - "Creator Platforms Tab"
Cohesion: 0.43
Nodes (6): AIScoreTab(), criteriaLabels, Props, recIcon(), scoreColor(), scoreLabel()

### Community 45 - "Creator Revenue Tab"
Cohesion: 0.29
Nodes (4): ROLE_COLORS, ROLE_LABELS, STATUS_LABELS, TeamMember

### Community 46 - "Creators Grid"
Cohesion: 0.29
Nodes (1): DEFAULT_TEMPLATES

### Community 47 - "Dashboard Analytics"
Cohesion: 0.29
Nodes (5): DAYS, MOCK_POSTS, MONTHS, PLATFORM_COLORS, STATUS_LABELS

### Community 48 - "Dashboard Trends"
Cohesion: 0.29
Nodes (5): ARTICLES, CATEGORIES, LEVELS, TRACKS, WEBINARS

### Community 49 - "Dashboard Wellness"
Cohesion: 0.29
Nodes (4): GEO_OPTIONS, tiktokMockHashtags, TIMEFRAMES, TrendsPageData

### Community 50 - "Admin Applications"
Cohesion: 0.29
Nodes (7): Hero Image (Active), Hero Image Variant 2, Hero Image Variant 3, Hero Image Variant 4, Hero Image Variant 5, Hero Image Variant 6, Hero Image Variant 7

### Community 51 - "Application AI Score"
Cohesion: 0.43
Nodes (6): abusive_clauses, auth.users, contract_analyses, generated_letters, legal_knowledge, legal_updates_log

### Community 52 - "Application History"
Cohesion: 0.29
Nodes (6): CommissionTier, CreatorProfile, CreatorRole, CreatorStatus, Department, Platform

### Community 53 - "Application Notes"
Cohesion: 0.33
Nodes (4): ApplicationsTable(), platformIcon, Props, statusStyles

### Community 54 - "Application Profile"
Cohesion: 0.33
Nodes (5): documents, docIcons, docLabels, NotesDocumentsTab(), Props

### Community 55 - "Application Responses"
Cohesion: 0.33
Nodes (3): Account, platformColors, platformIcons

### Community 56 - "Application Approve"
Cohesion: 0.47
Nodes (5): content_calendar_campaigns, content_calendar_events, content_calendar_templates, profiles, team_members

### Community 57 - "Application Reject"
Cohesion: 0.40
Nodes (4): ApproveModal(), commissionTiers, managers, Props

### Community 58 - "Admin Calendar Create"
Cohesion: 0.50
Nodes (4): aiReports, AIAnalysisTab(), Props, scoreColor()

### Community 59 - "Calendar Day View"
Cohesion: 0.50
Nodes (4): executeTool(), MOCK_DB, POST(), tools

### Community 63 - "Calendar Insights"
Cohesion: 0.50
Nodes (4): GenerateLetterRequest, generateStaticLetter(), LETTER_PROMPTS, POST()

### Community 64 - "Calendar Events"
Cohesion: 0.50
Nodes (5): Atlas API, Atlas Compliance, Atlas README, Atlas Troubleshooting, Atlas Workflows

### Community 65 - "Admin Commissions"
Cohesion: 0.40
Nodes (3): adminRoutes, config, sensitiveActions

### Community 66 - "Commission Validation"
Cohesion: 0.50
Nodes (2): agentIcons, agents

### Community 67 - "Admin Revenue"
Cohesion: 0.50
Nodes (2): Message, suggestions

### Community 69 - "Revenue Export"
Cohesion: 0.50
Nodes (1): MonitoringData

### Community 70 - "Revenue Top Creators"
Cohesion: 0.50
Nodes (2): MessageContent, RouteParams

### Community 71 - "Admin Analytics Web"
Cohesion: 0.50
Nodes (2): HealthCheck, HealthStatus

### Community 75 - "Admin Analytics Creators"
Cohesion: 0.50
Nodes (1): departments

### Community 76 - "Shared Charts"
Cohesion: 0.50
Nodes (1): data

### Community 78 - "Blog Editor"
Cohesion: 1.00
Nodes (2): generateFallbackForecast(), POST()

### Community 83 - "System Settings"
Cohesion: 0.67
Nodes (1): AuthLayout()

### Community 84 - "Invite Member"
Cohesion: 0.67
Nodes (1): contracts

### Community 85 - "Marketing Hero"
Cohesion: 0.67
Nodes (1): platforms

### Community 86 - "Marketing Departments"
Cohesion: 0.67
Nodes (1): sections

### Community 87 - "Marketing Navbar"
Cohesion: 0.67
Nodes (1): activities

### Community 88 - "Dashboard Agents"
Cohesion: 0.67
Nodes (1): suggestions

### Community 89 - "Dashboard Preferences"
Cohesion: 0.67
Nodes (1): Revenue

### Community 90 - "Dashboard Settings"
Cohesion: 0.67
Nodes (1): StatCardProps

### Community 91 - "Dashboard Profile"
Cohesion: 1.00
Nodes (3): File Document Icon, Globe Icon, Window Icon

### Community 92 - "Dashboard Integrations"
Cohesion: 0.67
Nodes (2): config, { getDefaultConfig }

### Community 93 - "Dashboard Manager"
Cohesion: 0.67
Nodes (3): UK Online Safety Bill, OnlyFans AI Content Policy 2026, TAKE IT DOWN Act 2026

### Community 94 - "Legal Contract Analysis"
Cohesion: 1.00
Nodes (3): OnlyFans Acceptable Use Policy, OnlyFans Creator Guidelines, OnlyFans Terms of Service 2026

### Community 120 - "Community 120"
Cohesion: 1.00
Nodes (2): Code de la Consommation, Code de la Propriete Intellectuelle

### Community 121 - "Community 121"
Cohesion: 1.00
Nodes (1): Serie V Complete

### Community 122 - "Community 122"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 123 - "Community 123"
Cohesion: 1.00
Nodes (2): Graphify Config, Knowledge Graph README

### Community 125 - "Community 125"
Cohesion: 1.00
Nodes (1): nextConfig

### Community 126 - "Community 126"
Cohesion: 1.00
Nodes (2): Next.js Logo, Vercel Logo

### Community 127 - "Community 127"
Cohesion: 1.00
Nodes (1): config

### Community 128 - "Community 128"
Cohesion: 1.00
Nodes (1): App Icon

### Community 129 - "Community 129"
Cohesion: 1.00
Nodes (1): Backup Log

### Community 130 - "Community 130"
Cohesion: 1.00
Nodes (1): Brand Guidelines

### Community 131 - "Community 131"
Cohesion: 1.00
Nodes (1): Class Action OnlyFans 2024

### Community 132 - "Community 132"
Cohesion: 1.00
Nodes (1): Agency Contract Comparison

### Community 133 - "Community 133"
Cohesion: 1.00
Nodes (1): Fansly Terms of Service

### Community 134 - "Community 134"
Cohesion: 1.00
Nodes (1): Graph Report

### Community 135 - "Community 135"
Cohesion: 1.00
Nodes (1): Instagram Terms of Service

### Community 139 - "Community 139"
Cohesion: 1.00
Nodes (1): MyM Terms of Service

### Community 141 - "Community 141"
Cohesion: 1.00
Nodes (1): Trend Hub Doc

## Ambiguous Edges - Review These
- `Hero Image Variant 2` → `Hero Image (Active)`  [AMBIGUOUS]
  public/images/heropic2.png · relation: semantically_similar_to
- `Hero Image Variant 3` → `Hero Image (Active)`  [AMBIGUOUS]
  public/images/heropic3.png · relation: semantically_similar_to
- `Hero Image Variant 4` → `Hero Image (Active)`  [AMBIGUOUS]
  public/images/heropic4.png · relation: semantically_similar_to
- `Hero Image Variant 5` → `Hero Image (Active)`  [AMBIGUOUS]
  public/images/heropic5.png · relation: semantically_similar_to
- `Hero Image Variant 6` → `Hero Image (Active)`  [AMBIGUOUS]
  public/images/heropic6.png · relation: semantically_similar_to
- `Hero Image Variant 7` → `Hero Image (Active)`  [AMBIGUOUS]
  public/images/heropic7.png · relation: semantically_similar_to

## Knowledge Gaps
- **424 isolated node(s):** `SUGGESTIONS`, `Message`, `TABS`, `ALERT_COLORS`, `ALERT_ICONS` (+419 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `API Routes`** (2 nodes): `AnalyzeRequest`, `createClient()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Goals`** (2 nodes): `createAdminClient()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Creator Notes & Docs`** (2 nodes): `ALL_TAGS`, `CREATORS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Creators Grid`** (1 nodes): `DEFAULT_TEMPLATES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Commission Validation`** (2 nodes): `agentIcons`, `agents`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Revenue`** (2 nodes): `Message`, `suggestions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Revenue Export`** (1 nodes): `MonitoringData`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Revenue Top Creators`** (2 nodes): `MessageContent`, `RouteParams`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Analytics Web`** (2 nodes): `HealthCheck`, `HealthStatus`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Analytics Creators`** (1 nodes): `departments`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shared Charts`** (1 nodes): `data`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blog Editor`** (2 nodes): `generateFallbackForecast()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `System Settings`** (1 nodes): `AuthLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Invite Member`** (1 nodes): `contracts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Marketing Hero`** (1 nodes): `platforms`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Marketing Departments`** (1 nodes): `sections`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Marketing Navbar`** (1 nodes): `activities`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Agents`** (1 nodes): `suggestions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Preferences`** (1 nodes): `Revenue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Settings`** (1 nodes): `StatCardProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Integrations`** (2 nodes): `config`, `{ getDefaultConfig }`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (2 nodes): `Code de la Consommation`, `Code de la Propriete Intellectuelle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `Serie V Complete`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 123`** (2 nodes): `Graphify Config`, `Knowledge Graph README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `nextConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (2 nodes): `Next.js Logo`, `Vercel Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 127`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (1 nodes): `App Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (1 nodes): `Backup Log`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (1 nodes): `Brand Guidelines`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `Class Action OnlyFans 2024`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (1 nodes): `Agency Contract Comparison`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (1 nodes): `Fansly Terms of Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 134`** (1 nodes): `Graph Report`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 135`** (1 nodes): `Instagram Terms of Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 139`** (1 nodes): `MyM Terms of Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (1 nodes): `Trend Hub Doc`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Hero Image Variant 2` and `Hero Image (Active)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Hero Image Variant 3` and `Hero Image (Active)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Hero Image Variant 4` and `Hero Image (Active)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Hero Image Variant 5` and `Hero Image (Active)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Hero Image Variant 6` and `Hero Image (Active)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Hero Image Variant 7` and `Hero Image (Active)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `cn()` connect `Creator AI Chat` to `Activity Feed`, `Atlas Legal Dashboard`, `Creator Onboarding`, `Auth & Site Pages`, `Dashboard Analytics`, `Dashboard Revenue`, `Dashboard Trends`, `Creator Notes & Docs`, `Dashboard Messages`, `Application Responses`, `Home & Commissions`, `Dashboard Platform Cards`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._