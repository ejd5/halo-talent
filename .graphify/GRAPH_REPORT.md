# Graph Report - .  (2026-06-09)

## Corpus Check
- Large corpus: 759 files · ~713 699 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3359 nodes · 5368 edges · 228 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.82)
- Token cost: 4 800 input · 3 500 output
- Edge kinds: contains: 2548 · imports: 1325 · imports_from: 863 · calls: 244 · references: 171 · method: 153 · reads_from: 45 · re_exports: 7 · semantically_similar_to: 7 · triggers: 4 · conceptually_related_to: 1


## Input Scope
- Requested: all
- Resolved: all (source: cli)
- Included files: 759 · Candidates: recursive
- Excluded: 0 untracked · 0 ignored · 0 sensitive · 0 missing committed
## God Nodes (most connected - your core abstractions)
1. `createClient()` - 190 edges
2. `cn()` - 35 edges
3. `createAdminClient()` - 28 edges
4. `ContentRecommender` - 18 edges
5. `formatEuro()` - 17 edges
6. `Tool` - 16 edges
7. `GoogleTrendsProvider` - 16 edges
8. `TikTokCreativeProvider` - 15 edges
9. `SmartSegmentEngine` - 14 edges
10. `ViralityScorer` - 14 edges

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
- **Platform Account Governance Rules** — onlyfans_terms_of_service_2026, fansly_terms_of_service, instagram_terms_of_service, mym_terms_of_service [INFERRED 0.80]
- **AI Content Regulation Landscape** — onlyfans_ai_content_policy_2026, take_it_down_act_2026, online_safety_bill, onlyfans_terms_of_service_2026 [INFERRED 0.85]
- **Hero Image Variant Set** — heropic, heropic2, heropic3, heropic4, heropic5, heropic6, heropic7 [AMBIGUOUS 0.30]

## Communities

### Community 0 - "Core API Routes"
Cohesion: 0.03
Nodes (11): GET(), GET(), GET(), GET(), GET(), GET(), MessageContent, RouteParams (+3 more)

### Community 1 - "Blog & CMS Editor"
Cohesion: 0.05
Nodes (42): metadata, BLOCK_TYPES, BlockEditor(), BlockPreview(), ALL_CATEGORIES, ALL_TAGS, BlogEditor(), ALL_CATEGORIES (+34 more)

### Community 2 - "Media Library"
Cohesion: 0.06
Nodes (38): ALL_CREATORS, ALL_TAGS, ALL_TYPES, LibraryFilters(), LibraryFiltersBar(), LibraryFiltersState, MODERATION_OPTIONS, TYPE_OPTIONS (+30 more)

### Community 3 - "Calendar & Scheduling"
Cohesion: 0.06
Nodes (40): calendarEvents, metadata, CalendarEvent, CalendarFilters, CalendarStatus, CalendarView, CONTENT_TYPE_ICONS, CONTENT_TYPE_LABELS (+32 more)

### Community 4 - "Data API Routes"
Cohesion: 0.07
Nodes (36): getCreatorDNA(), enhancePromptWithDNA(), generateHuggingFace(), generateReplicate(), POST(), storeImages(), STYLE_PROMPTS, generateTone() (+28 more)

### Community 5 - "Social Platform Publishers"
Cohesion: 0.06
Nodes (23): BlueskyPublisher, InstagramPublisher, LinkedInPublisher, ThreadsPublisher, TikTokPublisher, TwitterPublisher, BlueskyPostParams, CarouselItem (+15 more)

### Community 6 - "Analytics Dashboard"
Cohesion: 0.06
Nodes (43): analyticsData, MONTHS_24, metadata, ActivityHeatMap, AnalyticsData, AnalyticsTab, CACData, ChartProps (+35 more)

### Community 7 - "Root Layout & Typography"
Cohesion: 0.06
Nodes (31): instrumentSerif, jetbrainsMono, metadata, plusJakartaSans, RootLayout(), syne, styles, icons (+23 more)

### Community 8 - "Revenue Reporting"
Cohesion: 0.08
Nodes (38): ByCreatorTab(), paymentStatusStyles, Props, SortDir, SortKey, ByPlatformTab(), platformLogos, Props (+30 more)

### Community 9 - "Email Campaigns"
Cohesion: 0.06
Nodes (32): buildEmailHtml(), CampaignContent, CampaignRecipient, ContentBlock, EMAIL_TEMPLATES, estimateSegmentCount(), generateUnsubToken(), getRecipientsForSegment() (+24 more)

### Community 10 - "Creator DNA & AI Profiling"
Cohesion: 0.07
Nodes (37): callClaude(), finalizeDNA(), generateEmbedding(), generateProfile(), notifyStudioUnlocked(), buildDNAStatusResponse(), computeCompletionPct(), getDNAFilledSections() (+29 more)

### Community 11 - "Atlas Fan CRM"
Cohesion: 0.05
Nodes (15): AiInsight, AtlasDocument, AtlasDraft, AtlasInteraction, AtlasNote, AtlasPurchase, buildTimeline(), COUNTRY_FLAGS (+7 more)

### Community 12 - "Admin Auth & Middleware"
Cohesion: 0.06
Nodes (10): checkAdmin(), GET(), POST(), GET(), notify(), NotifyParams, apifyClient, GET() (+2 more)

### Community 13 - "Calendar Pages"
Cohesion: 0.06
Nodes (20): DAYS, MOCK_POSTS, MONTHS, PLATFORM_COLORS, STATUS_LABELS, StatsCardProps, Goal, initialGoals (+12 more)

### Community 14 - "Trend & Hashtag Analysis"
Cohesion: 0.06
Nodes (31): FreshnessIndicator(), Props, formatCount(), HashtagAnalysisPopup(), Props, Hashtag, HashtagsTab(), Props (+23 more)

### Community 15 - "Analytics Insights Engine"
Cohesion: 0.08
Nodes (21): extractCommonTags(), generateInsights(), getChartData(), getDashboardSummary(), getPerformanceQuartiles(), getPeriodComparison(), runFeedbackLoop(), AbTest (+13 more)

### Community 16 - "Platform Connection API"
Cohesion: 0.08
Nodes (22): decrypt(), encrypt(), ICON_MAP, platforms, PlatformsPage(), useConnections(), buildAuthUrl(), decodeOAuthState() (+14 more)

### Community 17 - "Moderation & Comments"
Cohesion: 0.09
Nodes (32): AnalysisResult, analyzeComment(), heuristicAnalysis(), validateIntent(), validateSentiment(), PLATFORM_ICONS, AtlasComment, CommentRule (+24 more)

### Community 18 - "Funnel & Workflow Builder"
Cohesion: 0.08
Nodes (28): ACTION_DESCRIPTIONS, ACTION_LABELS, ActionNodeConfig, ActionType, FunnelEdge, FunnelNode, FunnelSteps, LOGIC_DESCRIPTIONS (+20 more)

### Community 19 - "Creator Detail Pages"
Cohesion: 0.07
Nodes (29): Props, statusLabels, tabs, aiReports, calendarPosts, contracts, documents, messages (+21 more)

### Community 20 - "Automation Actions Config"
Cohesion: 0.08
Nodes (27): ACTION_DESCRIPTIONS, ACTION_LABELS, ActionConfig, ActionType, ApiKey, Condition, Operator, OutgoingWebhook (+19 more)

### Community 21 - "Creators Grid & List"
Cohesion: 0.09
Nodes (27): CreatorCard(), Props, statusConfig, CreatorsGridPage(), Filters, ViewMode, auditLogs, departments (+19 more)

### Community 22 - "Background Draft Gen"
Cohesion: 0.09
Nodes (10): generateDraftsInBackground(), POST(), AVAILABLE_FIELDS, OPERATORS, Rule, SEGMENT_TEMPLATES, SegmentRule, SegmentTemplate (+2 more)

### Community 23 - "AI Agent Chats"
Cohesion: 0.07
Nodes (24): Message, toolIcons, toolLabels, ContentStrategistChat(), DraftedPost, Message, SavedIdea, SKILLS (+16 more)

### Community 24 - "Engagement & Platform Cards"
Cohesion: 0.07
Nodes (19): CATEGORY_CONFIG, DM, Draft, EngagementHelperChat(), Message, MOCK_CONVERSATIONS, MOCK_DMS, STATUS_LABELS (+11 more)

### Community 25 - "Atlas Analytics Pages"
Cohesion: 0.15
Nodes (17): TabId, TABS, MODELS, CHANNEL_ICONS, CHANNEL_COLORS, CHANNEL_LABELS, COST_LABELS, Card() (+9 more)

### Community 26 - "Page Builder & Fields"
Cohesion: 0.10
Nodes (20): SelectField(), STATUS_STYLES, STATUS_STYLES, TYPE_ICONS, TYPE_LABELS, BackgroundType, generateQRUrl(), LeadCaptureLink (+12 more)

### Community 27 - "Compliance Drafting"
Cohesion: 0.11
Nodes (13): addDisclosureIfRequired(), approveDraft(), ComplianceCheck, ComplianceDrafter, CreatorDNA, Draft, DraftIntent, DraftParams (+5 more)

### Community 28 - "Landing Page Sections"
Cohesion: 0.09
Nodes (18): calcCommission(), Calculator(), CommissionsSection(), tiers, departments, DepartmentsSection(), FinalCtaSection(), heroLines (+10 more)

### Community 29 - "Application Forms"
Cohesion: 0.08
Nodes (19): ageOptions, allPlatforms, departments, followerRanges, FormData, PlatformEntry, revenueRanges, Step1 (+11 more)

### Community 30 - "Admin Dashboard Overview"
Cohesion: 0.08
Nodes (18): activities, Activity, ActivityFeed(), DashboardOverview(), Props, atRisk, creators, deadlines (+10 more)

### Community 31 - "Generic API Routes"
Cohesion: 0.12
Nodes (9): DELETE(), GET(), PATCH(), POST(), PUT(), ManualPlatform, ManualPublication, ManualPublicationPreparer (+1 more)

### Community 32 - "Page Shells"
Cohesion: 0.11
Nodes (5): Container(), ContainerProps, backgroundStyles, Section(), SectionProps

### Community 33 - "Content Composer"
Cohesion: 0.10
Nodes (18): CaptionTab(), CaptionTabProps, ConfigTab(), ConfigTabProps, ContentTab(), ContentTabProps, getPreviewStyle(), PreviewPanel() (+10 more)

### Community 34 - "Payouts Management"
Cohesion: 0.11
Nodes (18): methodIcons, methodLabels, PayoutDetailPanel(), Props, statusLabels, PayoutFilters(), Props, STATUS_TABS (+10 more)

### Community 35 - "System Administration"
Cohesion: 0.11
Nodes (17): BackupRow(), CronRow(), formatDate(), SERVICE_ICONS, SystemPage(), timeAgo(), auditLogs, backups (+9 more)

### Community 36 - "Composer State"
Cohesion: 0.10
Nodes (21): composerReducer(), createInitialState(), useComposerState(), ComposerAction, ComposerState, CREDIT_COSTS, CreditBalance, CreditCheckResult (+13 more)

### Community 37 - "Trend Hub Pages"
Cohesion: 0.12
Nodes (15): GEO_OPTIONS, tiktokMockHashtags, TIMEFRAMES, TrendsPageData, mockGoogleItems, mockNewsItems, mockYouTubeItems, TrendCard() (+7 more)

### Community 38 - "AI Video Generation"
Cohesion: 0.18
Nodes (22): checkKlingStatus(), checkLumaStatus(), checkPikaStatus(), checkRunwayStatus(), checkSoraStatus(), checkVeoStatus(), checkVideoJobStatus(), DEMO_VIDEOS (+14 more)

### Community 39 - "Commissions"
Cohesion: 0.18
Nodes (13): commissionAdjustments, CommissionAdjustment, CommissionAdjustmentStatus, CommissionRow, buildCommissionRows(), AdjustmentModal(), Props, REASONS (+5 more)

### Community 40 - "Audit Logs"
Cohesion: 0.14
Nodes (15): ACTION_TYPE_LABELS, AuditLogsPage(), formatDate(), LogRow(), RESOURCE_TYPE_LABELS, SEVERITY_COLORS, SEVERITY_ICONS, timeAgo() (+7 more)

### Community 41 - "Google Trends"
Cohesion: 0.11
Nodes (12): GEO_OPTIONS, SUGGESTIONS, TIMEFRAMES, frenchTrends, globalTrends, InterestPoint, rateMap, RegionInterest (+4 more)

### Community 42 - "Atlas Launcher & Sidebar"
Cohesion: 0.12
Nodes (15): ACTIONS, AtlasLauncher(), QuickAction, mockCreator, breadcrumbMap, Header(), atlasNavSections, iconMap (+7 more)

### Community 43 - "Dashboard Widgets"
Cohesion: 0.12
Nodes (14): CreditsWidget(), Draft, DRAFTS, DraftsRow(), TYPE_ICONS, Inspiration, InspirationFeed(), INSPIRATIONS (+6 more)

### Community 44 - "SQL Analytics Functions"
Cohesion: 0.20
Nodes (20): active_fans, atlas_analytics_cohorts, atlas_analytics_conversions, atlas_analytics_costs, atlas_calculate_roi(), atlas_campaigns, atlas_fans, atlas_funnels (+12 more)

### Community 45 - "Admin Layout Shell"
Cohesion: 0.12
Nodes (14): AdminShell(), Props, CommandItem, CommandPalette(), Props, NavItem, NavSection, navSections (+6 more)

### Community 46 - "Email Builder"
Cohesion: 0.10
Nodes (9): BLOCK_TEMPLATES, ContentBlock, GOAL_OPTIONS, GOALS, PLATFORMS, Segment, TONES, TYPE_OPTIONS (+1 more)

### Community 47 - "Co-Management Onboarding"
Cohesion: 0.11
Nodes (12): CoManagement, COMPARISON, PLATFORMS, ACCESS_LEVELS, OnboardingWizard(), OnboardingWizardProps, PLATFORMS, VERIFICATION_ITEMS (+4 more)

### Community 48 - "Audio Editor"
Cohesion: 0.16
Nodes (12): AudioWaveform(), Props, Clip, EffectFilter, TRACK_COLORS, TransitionType, formatDuration(), generateId() (+4 more)

### Community 49 - "Audio Generation"
Cohesion: 0.10
Nodes (11): DURATIONS, Emotion, EMOTIONS, LIBRARY_GENRES, LIBRARY_MOODS, LibraryTrack, MUSIC_STYLES, MusicDuration (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.15
Nodes (13): EngagementHelper, categorizeMessage, detectSalesOpportunity, draftDMResponse, flagSuspiciousMessage, generateMessageTemplate, generateReplyDraft, getDMHistory (+5 more)

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (10): ALL_PERMISSIONS, Assignment, AuditLog, Availability, Performance, ROLE_COLORS, ROLE_LABELS, STATUS_COLORS (+2 more)

### Community 52 - "Community 52"
Cohesion: 0.19
Nodes (15): analyzePostPerformance, generateCaption, generateContentIdeas, generateHook, getContentHistory, getContentSuggestions, saveContentIdea, scheduleDraft (+7 more)

### Community 53 - "Community 53"
Cohesion: 0.15
Nodes (10): AGENT_DESCRIPTIONS, AGENT_EMOJIS, AGENT_LABELS, ContentStrategist, AgentName, getAgent(), agentIcons, agents (+2 more)

### Community 54 - "Community 54"
Cohesion: 0.11
Nodes (8): CohortData, CompareCreator, CreatorPerf, DepartmentData, FlowData, Tab, TABS, TierData

### Community 55 - "Community 55"
Cohesion: 0.17
Nodes (12): ALL_ROLES, InviteMemberModal(), mockCreators, TeamPage(), auditLogs, teamMembers, ROLE_COLORS, ROLE_LABELS (+4 more)

### Community 56 - "Community 56"
Cohesion: 0.18
Nodes (11): PricingAdvisor, getCreatorAccounts, getCreatorContracts, getCreatorGoals, getCreatorPosts, getCreatorProfile, getCreatorRevenues, analyzeChurnRate (+3 more)

### Community 57 - "Community 57"
Cohesion: 0.21
Nodes (14): FanTier, applyTierChange(), calculateFanScore(), calculateMonthlyPurchaseStreak(), countActiveChannels(), daysBetween(), determineTier(), FanInteraction (+6 more)

### Community 58 - "Community 58"
Cohesion: 0.15
Nodes (3): NewsTrendsProvider, RedditTrendsProvider, YouTubeTrendsProvider

### Community 59 - "Community 59"
Cohesion: 0.18
Nodes (16): APPROACH_COLORS, APPROACH_LABELS, AtlasDraft, AtlasMessage, CHANNEL_ICONS, CHANNEL_LABELS, Conversation, ConversationCard() (+8 more)

### Community 60 - "Community 60"
Cohesion: 0.15
Nodes (7): AtlasGuidedTour(), AtlasTourButton(), AtlasPageSkeleton(), EMPTY_ILLUSTRATIONS, AtlasOverview, formatEuro(), KpiCard()

### Community 61 - "Community 61"
Cohesion: 0.12
Nodes (7): agentCards, formatEuro(), mockActivities, mockBrief, mockEvolution, mockKpi, timeAgo()

### Community 62 - "Community 62"
Cohesion: 0.17
Nodes (12): Application, Props, statusStyles, tabs, Props, rejectionTemplates, RejectModal(), countryFlags (+4 more)

### Community 63 - "Community 63"
Cohesion: 0.18
Nodes (11): applications, departments, platformOptions, metadata, ApplicationStatus, ApplicationDetailPanel(), ApplicationFilters(), Props (+3 more)

### Community 64 - "Community 64"
Cohesion: 0.13
Nodes (6): CommandCenterData, CreatorData, Filters, Period, SortKey, ViewMode

### Community 65 - "Community 65"
Cohesion: 0.17
Nodes (8): GET(), POST(), hasVapidKeys(), PushCampaign, PushSendResult, PushSubscription, sendPushCampaign(), sendPushToSub()

### Community 66 - "Community 66"
Cohesion: 0.17
Nodes (6): AtlasFan, getFanById(), getFans(), TIER_COLORS, TIER_LABELS, GET()

### Community 67 - "Community 67"
Cohesion: 0.19
Nodes (1): ContentRecommender

### Community 68 - "Community 68"
Cohesion: 0.21
Nodes (9): TrendSpotter, analyzeCompetitors, detectViralContent, getGoogleTrends, getTikTokTopAds, getTikTokTrendingHashtags, getTikTokTrendingSongs, searchTikTokTrends (+1 more)

### Community 69 - "Community 69"
Cohesion: 0.17
Nodes (11): auditLogs, internalNotes, formatDate(), relativeTime(), units, actionColors, actionIcons, HistoryTab() (+3 more)

### Community 70 - "Community 70"
Cohesion: 0.17
Nodes (11): ALL_ROLES, CustomRoleDef, MANAGED_ROLES, PendingChange, PermissionsPage(), metadata, ALL_ACTIONS, canAccessResource() (+3 more)

### Community 71 - "Community 71"
Cohesion: 0.17
Nodes (10): AuditEntry, ComplianceChannel, CONSENT_TYPES, ConsentEntry, Settings, TOGGLES, CopyBlock(), Section() (+2 more)

### Community 72 - "Community 72"
Cohesion: 0.15
Nodes (11): CaptionGenerator(), Props, Caption, CaptionStyle, ClipProps, ClipType, DEFAULT_PROJECT, Draft (+3 more)

### Community 73 - "Community 73"
Cohesion: 0.15
Nodes (12): VIDEO_MODELS, VIDEO_STYLES, VideoMode, VideoModelDef, AspectRatio, ASPECTS, DURATIONS, formatDuration() (+4 more)

### Community 74 - "Community 74"
Cohesion: 0.24
Nodes (2): ViralityFactors, ViralityScorer

### Community 75 - "Community 75"
Cohesion: 0.27
Nodes (14): atlas_auto_audit(), atlas_campaigns, atlas_compliance_audit, atlas_compliance_settings, atlas_compliance_status(), atlas_consent_registry, atlas_fans, atlas_incident_logs (+6 more)

### Community 76 - "Community 76"
Cohesion: 0.30
Nodes (14): atlas_api_keys, atlas_enqueue_rule(), atlas_fans, atlas_outgoing_webhooks, atlas_process_rule_queue(), atlas_rule_executions, atlas_rule_queue, atlas_rules (+6 more)

### Community 77 - "Community 77"
Cohesion: 0.21
Nodes (7): WellnessCoach, Tool, escalateToHuman, getWellnessHistory, getWorkPatterns, logWellnessCheck, suggestBreak

### Community 78 - "Community 78"
Cohesion: 0.16
Nodes (5): CATEGORY_LABELS, PACKS, WalletData, CREDIT_PACKS, CreditPack

### Community 79 - "Community 79"
Cohesion: 0.16
Nodes (8): TYPE_ICONS, TYPE_ICONS, Template, TemplateType, CATEGORIES, MOOD_OPTIONS, STYLE_OPTIONS, TYPE_ICONS

### Community 80 - "Community 80"
Cohesion: 0.26
Nodes (2): checkRateLimit(), GoogleTrendsProvider

### Community 81 - "Community 81"
Cohesion: 0.15
Nodes (8): CalendarEvent, CONTENT_TYPE_ICONS, CONTENT_TYPE_LABELS, PLATFORM_COLORS, PLATFORM_LABELS, STATUS_COLORS, STATUS_LABELS, ViewMode

### Community 82 - "Community 82"
Cohesion: 0.19
Nodes (8): NAV, NavItem, NavSection, StudioSidebar(), PLATFORMS, StudioTopbar(), StudioLayoutClient(), WalletBalance

### Community 83 - "Community 83"
Cohesion: 0.18
Nodes (7): Track, ImageOverlay(), Props, Props, Scene, Props, TextOverlay()

### Community 84 - "Community 84"
Cohesion: 0.28
Nodes (12): ai_conversations, applications, auth.users, contracts, creator_accounts, messages, monthly_revenues, notifications (+4 more)

### Community 85 - "Community 85"
Cohesion: 0.28
Nodes (12): ai_conversations, applications, auth.users, contracts, creator_accounts, messages, monthly_revenues, notifications (+4 more)

### Community 86 - "Community 86"
Cohesion: 0.17
Nodes (4): FUNNEL_TEMPLATES, IMPORT_OPTIONS, PLATFORMS, STEPS

### Community 87 - "Community 87"
Cohesion: 0.18
Nodes (6): ASPECT_RATIOS, AspectRatio, EditorPreview(), Props, EditorSidebar(), Props

### Community 88 - "Community 88"
Cohesion: 0.24
Nodes (9): StickerDef, VideoTemplate, Props, StickerLibrary(), STICKER_CATEGORIES, STICKERS, VIDEO_TEMPLATES, Props (+1 more)

### Community 89 - "Community 89"
Cohesion: 0.17
Nodes (8): AspectRatio, ASPECTS, GeneratedImage, HistoryItem, Provider, Quality, StyleKey, STYLES

### Community 90 - "Community 90"
Cohesion: 0.17
Nodes (8): CONTENT_TYPES, ContentType, GenerateResult, LengthOption, LENGTHS, ToneOption, TONES, Variation

### Community 91 - "Legal Contracts & Rights"
Cohesion: 0.40
Nodes (11): Agency Practices Report 2026, Chatters Lawsuits 2026, Catalogue des Clauses Abusives, Code Civil Droit des Contrats, Commission Rates Benchmark 2026, Comparaison des Contrats d'Agences, Contrat-Type Halo Talent, Creator Rights Guide (+3 more)

### Community 92 - "Community 92"
Cohesion: 0.25
Nodes (2): ChurnPrediction, ChurnPredictor

### Community 93 - "Community 93"
Cohesion: 0.22
Nodes (7): Button(), ButtonProps, ButtonVariant, variantBase, variantHover, Input, InputProps

### Community 94 - "Community 94"
Cohesion: 0.20
Nodes (9): CATEGORIES, CATEGORY_BADGE, ForumPost, Meetup, MOCK_MEETUPS, MOCK_POSTS, PostCard(), PostCategory (+1 more)

### Community 95 - "Community 95"
Cohesion: 0.24
Nodes (9): CATEGORIES, formatCount(), formatDuration(), GEO_OPTIONS, SUGGESTIONS, timeAgo(), VideoCard(), YouTubeTrendData (+1 more)

### Community 96 - "Community 96"
Cohesion: 0.31
Nodes (9): navSections, ActivityEvent, AgentCard, CreatorProfile, DailyBrief, EvolutionData, KpiData, NavItem (+1 more)

### Community 97 - "Community 97"
Cohesion: 0.27
Nodes (10): ACTION_TO_PROVIDER, buildChartData(), checkAndDeductCredits(), CREDIT_COSTS, getCreditCost(), getWalletBalance(), grantMonthlyCredits(), hasByokForAction() (+2 more)

### Community 98 - "Community 98"
Cohesion: 0.35
Nodes (9): analyzeBestPostingTimes, benchmarkAgainstPeers, calculateMonthlyGrowth, compareToPreviousPeriod, detectAnomalies, generatePerformanceReport, generateReport, identifyTopPerformers (+1 more)

### Community 99 - "Community 99"
Cohesion: 0.35
Nodes (8): atlas_campaigns, atlas_drafts, atlas_fans, atlas_funnels, atlas_interactions, atlas_rules, atlas_snapshots, profiles

### Community 100 - "Community 100"
Cohesion: 0.58
Nodes (2): shouldUseScrapeCreators(), TikTokCreativeProvider

### Community 101 - "Community 101"
Cohesion: 0.25
Nodes (2): getCreatorDNA(), TrendAggregator

### Community 102 - "Community 102"
Cohesion: 0.29
Nodes (5): DEFAULT_TEMPLATES, DELETE(), GET(), POST(), PUT()

### Community 103 - "Community 103"
Cohesion: 0.20
Nodes (2): Tab, TABS

### Community 104 - "Community 104"
Cohesion: 0.29
Nodes (6): chat(), saveConversation(), AgentResponse, Message, ToolCall, ToolResult

### Community 105 - "Community 105"
Cohesion: 0.47
Nodes (9): add_purchased_credits(), credits_transactions, credits_wallet, deduct_credits(), grant_credits(), profiles, subscription_tiers, user_api_keys (+1 more)

### Community 106 - "Community 106"
Cohesion: 0.22
Nodes (1): MonitoringData

### Community 107 - "Community 107"
Cohesion: 0.25
Nodes (5): generateFallbackDrafts(), POST(), DraftParams, DraftResult, ModerationResult

### Community 108 - "Community 108"
Cohesion: 0.22
Nodes (4): COOLDOWN, CooldownStatus, ProductRecommendation, ScoredFan

### Community 109 - "Community 109"
Cohesion: 0.36
Nodes (6): ab_tests, analytics_insights, coach_sessions, content_feedback, content_metrics, profiles

### Community 110 - "Community 110"
Cohesion: 0.25
Nodes (6): ALERT_COLORS, ALERT_ICONS, ALERT_TYPES, SEVERITY_COLORS, SEVERITY_LEVELS, TrendAlert

### Community 111 - "Community 111"
Cohesion: 0.25
Nodes (6): AIAnalysis, AuditLog, InternalNote, platformFollowers, platformVerified, Props

### Community 112 - "Community 112"
Cohesion: 0.32
Nodes (5): Alert, ALERT_THRESHOLDS, detectAlerts(), determineStatus(), EnrichedCreator

### Community 113 - "Community 113"
Cohesion: 0.25
Nodes (4): faqs, Plan, PlanFeature, plans

### Community 114 - "Community 114"
Cohesion: 0.32
Nodes (4): Footer(), socialIcons, Navbar(), navLinks

### Community 115 - "Community 115"
Cohesion: 0.25
Nodes (4): ANTI_DETECT_TOOLS, ENGAGEMENT_TOOLS, FAQ_ITEMS, PROXY_TOOLS

### Community 116 - "Community 116"
Cohesion: 0.57
Nodes (7): atlas_deletion_log, atlas_documents, atlas_fans, atlas_merge_log, atlas_notes, atlas_purchases, profiles

### Community 117 - "Community 117"
Cohesion: 0.50
Nodes (7): atlas_campaign_sends, atlas_campaigns, atlas_consent_logs, atlas_fans, atlas_segments, atlas_unsubscribe_tokens, profiles

### Community 118 - "Community 118"
Cohesion: 0.50
Nodes (7): atlas_comments, atlas_fans, comment_actions, comment_rules, comment_templates, platform_sync_log, profiles

### Community 119 - "Community 119"
Cohesion: 0.61
Nodes (7): atlas_fans, atlas_ppv_ab_tests, atlas_ppv_products, atlas_ppv_scripts, atlas_ppv_sends, atlas_segments, profiles

### Community 120 - "Community 120"
Cohesion: 0.46
Nodes (7): auth.users, creator_manager_assignments, profiles, team_audit_log, team_member_availability, team_member_permissions, team_members

### Community 121 - "Community 121"
Cohesion: 0.43
Nodes (1): ComplianceDrafter

### Community 122 - "Community 122"
Cohesion: 0.38
Nodes (1): AnalyticsCoach

### Community 123 - "Community 123"
Cohesion: 0.33
Nodes (3): GET(), POST(), PROVIDERS

### Community 124 - "Community 124"
Cohesion: 0.43
Nodes (6): AIScoreTab(), criteriaLabels, Props, recIcon(), scoreColor(), scoreLabel()

### Community 125 - "Community 125"
Cohesion: 0.33
Nodes (2): GET(), POST()

### Community 126 - "Community 126"
Cohesion: 0.29
Nodes (5): GENRES, LibraryTrack, MOODS, TEMPOS, TRACKS

### Community 127 - "Community 127"
Cohesion: 0.29
Nodes (3): CampaignDetail, STATUS_BADGES, TYPE_LABELS

### Community 128 - "Community 128"
Cohesion: 0.29
Nodes (2): Product, Recommendation

### Community 129 - "Community 129"
Cohesion: 0.29
Nodes (6): ICON_MAP, PlatformSelector(), PlatformSelectorProps, PLATFORM_LABELS, PlatformConfig, PLATFORMS

### Community 130 - "Community 130"
Cohesion: 0.33
Nodes (4): PushOptInProps, CaptureForm(), inputStyle(), Props

### Community 131 - "Hero Images"
Cohesion: 0.29
Nodes (7): Hero Image (Active), Hero Image Variant 2, Hero Image Variant 3, Hero Image Variant 4, Hero Image Variant 5, Hero Image Variant 6, Hero Image Variant 7

### Community 132 - "Community 132"
Cohesion: 0.57
Nodes (6): decrement_template_likes(), increment_template_likes(), increment_template_uses(), profiles, template_likes, templates

### Community 133 - "Community 133"
Cohesion: 0.67
Nodes (6): atlas_fans, consent_logs, lead_capture_links, lead_capture_pages, lead_capture_submissions, profiles

### Community 134 - "Community 134"
Cohesion: 0.48
Nodes (5): atlas_fans, atlas_segment_memberships, atlas_segments, on_fan_update, profiles

### Community 135 - "Community 135"
Cohesion: 0.29
Nodes (6): CommissionTier, CreatorProfile, CreatorRole, CreatorStatus, Department, Platform

### Community 136 - "Community 136"
Cohesion: 0.33
Nodes (3): BLOCKED_PATTERNS, FLAGGED_CONTENT, ModerationResult

### Community 137 - "Community 137"
Cohesion: 0.33
Nodes (4): ApplicationsTable(), platformIcon, Props, statusStyles

### Community 138 - "Community 138"
Cohesion: 0.33
Nodes (3): CreatorDetailPage(), creators, Props

### Community 139 - "Community 139"
Cohesion: 0.33
Nodes (5): alertBg, alertBorder, AlertCards(), alertIcons, Props

### Community 140 - "Community 140"
Cohesion: 0.33
Nodes (2): features, stats

### Community 141 - "Community 141"
Cohesion: 0.33
Nodes (2): stats, testimonials

### Community 142 - "Community 142"
Cohesion: 0.53
Nodes (4): creator_dna, creator_dna_versions, profiles, trigger_creator_dna_updated

### Community 143 - "Community 143"
Cohesion: 0.53
Nodes (5): credit_usage, current_credits, decrement_credits(), plans, profiles

### Community 144 - "Community 144"
Cohesion: 0.73
Nodes (5): atlas_campaign_sends, atlas_fans, atlas_push_campaigns, atlas_push_subscriptions, profiles

### Community 145 - "Community 145"
Cohesion: 0.47
Nodes (5): content_calendar_campaigns, content_calendar_events, content_calendar_templates, profiles, team_members

### Community 146 - "Community 146"
Cohesion: 0.53
Nodes (1): LTVPredictor

### Community 147 - "Community 147"
Cohesion: 0.40
Nodes (4): ApproveModal(), commissionTiers, managers, Props

### Community 148 - "Community 148"
Cohesion: 0.50
Nodes (4): executeTool(), MOCK_DB, POST(), tools

### Community 151 - "Community 151"
Cohesion: 0.40
Nodes (3): GET(), HealthCheck, HealthStatus

### Community 153 - "Community 153"
Cohesion: 0.50
Nodes (1): confirmationEmailHtml()

### Community 156 - "Community 156"
Cohesion: 0.40
Nodes (2): checklist, complianceSections

### Community 157 - "Community 157"
Cohesion: 0.40
Nodes (3): Campaign, STATUS_STYLES, TYPE_LABELS

### Community 158 - "Community 158"
Cohesion: 0.40
Nodes (3): STATUS_STYLES, Funnel, FUNNEL_PRESETS

### Community 160 - "Community 160"
Cohesion: 0.40
Nodes (3): ACTION_COLORS, ACTION_LABELS, AuditEntry

### Community 161 - "Community 161"
Cohesion: 0.40
Nodes (3): ACTION_LABELS, AtRiskFan, LEVEL_CONFIG

### Community 162 - "Community 162"
Cohesion: 0.40
Nodes (3): AVAILABLE_FIELDS, OPERATORS, Rule

### Community 163 - "Community 163"
Cohesion: 0.40
Nodes (2): EditorToolbar(), Props

### Community 164 - "Community 164"
Cohesion: 0.40
Nodes (3): ManualPublication, PLATFORM_LABELS, PLATFORM_LINKS

### Community 165 - "Community 165"
Cohesion: 0.70
Nodes (4): atlas_audit_log, atlas_conversation_read, atlas_fans, profiles

### Community 166 - "Community 166"
Cohesion: 0.70
Nodes (4): profiles, trends_alerts, trends_cache, trends_watchlist

### Community 167 - "Community 167"
Cohesion: 0.70
Nodes (4): atlas_drafts, atlas_fans, profiles, sovereign_chat_settings

### Community 168 - "Community 168"
Cohesion: 0.40
Nodes (3): adminRoutes, config, sensitiveActions

### Community 169 - "Community 169"
Cohesion: 0.67
Nodes (2): GET(), POST()

### Community 170 - "Community 170"
Cohesion: 0.50
Nodes (2): Message, suggestions

### Community 172 - "Community 172"
Cohesion: 0.50
Nodes (2): DocSection, SECTIONS

### Community 173 - "Community 173"
Cohesion: 0.50
Nodes (3): OPTIONS, PeriodSelector(), Props

### Community 174 - "Community 174"
Cohesion: 0.50
Nodes (3): Props, RevenueTabBar(), Tab

### Community 178 - "Community 178"
Cohesion: 0.67
Nodes (2): GET(), PUT()

### Community 182 - "Community 182"
Cohesion: 0.83
Nodes (3): getCount(), getSum(), POST()

### Community 183 - "Community 183"
Cohesion: 0.50
Nodes (1): LTNPrediction

### Community 184 - "Community 184"
Cohesion: 0.50
Nodes (1): sections

### Community 185 - "Community 185"
Cohesion: 0.50
Nodes (1): departments

### Community 186 - "Community 186"
Cohesion: 0.50
Nodes (2): Campaign, STATUS_BADGES

### Community 187 - "Community 187"
Cohesion: 0.50
Nodes (2): Fan, Segment

### Community 188 - "Community 188"
Cohesion: 0.50
Nodes (2): Draft, STATUS_LABELS

### Community 189 - "Community 189"
Cohesion: 0.50
Nodes (2): Campaign, STATUS_CONFIG

### Community 190 - "Community 190"
Cohesion: 0.50
Nodes (1): PLANS

### Community 191 - "Community 191"
Cohesion: 0.50
Nodes (1): data

### Community 192 - "Community 192"
Cohesion: 0.50
Nodes (3): KeyboardShortcuts(), SECTIONS, Shortcut

### Community 193 - "Platform Terms of Service"
Cohesion: 0.67
Nodes (4): Fansly Terms of Service, OnlyFans Acceptable Use Policy, OnlyFans Creator Guidelines, OnlyFans Terms of Service 2026

### Community 194 - "Community 194"
Cohesion: 0.83
Nodes (3): atlas_fans, atlas_sms_webhook_logs, profiles

### Community 195 - "Community 195"
Cohesion: 0.83
Nodes (3): atlas_draft_audit, atlas_drafts, profiles

### Community 196 - "Community 196"
Cohesion: 1.00
Nodes (3): co_management_audit, platform_co_management, profiles

### Community 197 - "Community 197"
Cohesion: 0.83
Nodes (3): atlas_segments, atlas_smart_messages_campaigns, profiles

### Community 198 - "Community 198"
Cohesion: 0.67
Nodes (1): CHECKBOXES

### Community 199 - "Community 199"
Cohesion: 0.67
Nodes (1): ProviderStatus

### Community 200 - "Community 200"
Cohesion: 0.67
Nodes (1): AdminStats

### Community 201 - "Community 201"
Cohesion: 1.00
Nodes (2): generateFallbackForecast(), POST()

### Community 202 - "Community 202"
Cohesion: 1.00
Nodes (2): generateReportHtml(), POST()

### Community 203 - "Community 203"
Cohesion: 0.67
Nodes (1): PIXEL

### Community 205 - "Community 205"
Cohesion: 1.00
Nodes (2): nextMonth(), POST()

### Community 209 - "Community 209"
Cohesion: 1.00
Nodes (2): GET(), POST()

### Community 210 - "Community 210"
Cohesion: 0.67
Nodes (1): config

### Community 211 - "Community 211"
Cohesion: 1.00
Nodes (2): getProductSendCount(), POST()

### Community 212 - "Community 212"
Cohesion: 1.00
Nodes (2): getCount(), POST()

### Community 213 - "Community 213"
Cohesion: 0.67
Nodes (1): AuthLayout()

### Community 214 - "Community 214"
Cohesion: 0.67
Nodes (1): Campaign

### Community 215 - "Community 215"
Cohesion: 0.67
Nodes (1): Draft

### Community 216 - "Community 216"
Cohesion: 0.67
Nodes (1): contracts

### Community 217 - "Community 217"
Cohesion: 0.67
Nodes (1): sections

### Community 218 - "Community 218"
Cohesion: 0.67
Nodes (1): Segment

### Community 219 - "Community 219"
Cohesion: 0.67
Nodes (1): CampaignResults

### Community 220 - "Community 220"
Cohesion: 0.67
Nodes (1): tabs

### Community 221 - "Community 221"
Cohesion: 0.67
Nodes (1): HistoryImage

### Community 222 - "Community 222"
Cohesion: 0.67
Nodes (1): activities

### Community 223 - "Community 223"
Cohesion: 0.67
Nodes (1): suggestions

### Community 224 - "Community 224"
Cohesion: 0.67
Nodes (1): Revenue

### Community 225 - "Community 225"
Cohesion: 0.67
Nodes (1): StatCardProps

### Community 226 - "Community 226"
Cohesion: 1.00
Nodes (2): manual_publications, profiles

### Community 227 - "Community 227"
Cohesion: 1.00
Nodes (2): platform_connections, profiles

### Community 228 - "Community 228"
Cohesion: 0.67
Nodes (1): config

### Community 229 - "Community 229"
Cohesion: 1.00
Nodes (2): media_library, profiles

### Community 230 - "Community 230"
Cohesion: 1.00
Nodes (2): profiles, video_generation_jobs

### Community 232 - "Community 232"
Cohesion: 1.00
Nodes (2): pro_mode_acknowledgments, profiles

### Community 233 - "Community 233"
Cohesion: 0.67
Nodes (2): admin_insights, best_practices

### Community 234 - "Community 234"
Cohesion: 0.67
Nodes (2): config, { getDefaultConfig }

### Community 235 - "UK/US Internet Laws"
Cohesion: 0.67
Nodes (3): UK Online Safety Bill, OnlyFans AI Content Policy 2026, TAKE IT DOWN Act 2026

### Community 266 - "Community 266"
Cohesion: 1.00
Nodes (2): Code de la Consommation, Code de la Propriete Intellectuelle

### Community 267 - "Community 267"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 270 - "Community 270"
Cohesion: 1.00
Nodes (1): apify_usage_logs

### Community 271 - "Community 271"
Cohesion: 1.00
Nodes (1): nextConfig

### Community 272 - "Community 272"
Cohesion: 1.00
Nodes (1): config

### Community 273 - "Community 273"
Cohesion: 1.00
Nodes (1): options

### Community 274 - "Community 274"
Cohesion: 1.00
Nodes (1): Brand Guidelines

### Community 275 - "OnlyFans Class Action"
Cohesion: 1.00
Nodes (1): Class Action OnlyFans 2024

### Community 276 - "Instagram Terms"
Cohesion: 1.00
Nodes (1): Instagram Terms of Service

### Community 281 - "MyM Platform Terms"
Cohesion: 1.00
Nodes (1): MyM Terms of Service

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
- **812 isolated node(s):** `SUGGESTIONS`, `Message`, `TABS`, `ALERT_COLORS`, `ALERT_ICONS` (+807 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 67`** (1 nodes): `ContentRecommender`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (2 nodes): `ViralityFactors`, `ViralityScorer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `checkRateLimit()`, `GoogleTrendsProvider`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (2 nodes): `ChurnPrediction`, `ChurnPredictor`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (2 nodes): `shouldUseScrapeCreators()`, `TikTokCreativeProvider`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (2 nodes): `getCreatorDNA()`, `TrendAggregator`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (2 nodes): `Tab`, `TABS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `MonitoringData`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `ComplianceDrafter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `AnalyticsCoach`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (2 nodes): `GET()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (2 nodes): `Product`, `Recommendation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 140`** (2 nodes): `features`, `stats`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (2 nodes): `stats`, `testimonials`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 146`** (1 nodes): `LTVPredictor`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 153`** (1 nodes): `confirmationEmailHtml()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 156`** (2 nodes): `checklist`, `complianceSections`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 163`** (2 nodes): `EditorToolbar()`, `Props`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 169`** (2 nodes): `GET()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 170`** (2 nodes): `Message`, `suggestions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 172`** (2 nodes): `DocSection`, `SECTIONS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 178`** (2 nodes): `GET()`, `PUT()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 183`** (1 nodes): `LTNPrediction`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 184`** (1 nodes): `sections`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 185`** (1 nodes): `departments`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 186`** (2 nodes): `Campaign`, `STATUS_BADGES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 187`** (2 nodes): `Fan`, `Segment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 188`** (2 nodes): `Draft`, `STATUS_LABELS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 189`** (2 nodes): `Campaign`, `STATUS_CONFIG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 190`** (1 nodes): `PLANS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 191`** (1 nodes): `data`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 198`** (1 nodes): `CHECKBOXES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 199`** (1 nodes): `ProviderStatus`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 200`** (1 nodes): `AdminStats`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 201`** (2 nodes): `generateFallbackForecast()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 202`** (2 nodes): `generateReportHtml()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 203`** (1 nodes): `PIXEL`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 205`** (2 nodes): `nextMonth()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 209`** (2 nodes): `GET()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 210`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 211`** (2 nodes): `getProductSendCount()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 212`** (2 nodes): `getCount()`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 213`** (1 nodes): `AuthLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 214`** (1 nodes): `Campaign`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 215`** (1 nodes): `Draft`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 216`** (1 nodes): `contracts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 217`** (1 nodes): `sections`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 218`** (1 nodes): `Segment`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 219`** (1 nodes): `CampaignResults`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 220`** (1 nodes): `tabs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 221`** (1 nodes): `HistoryImage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 222`** (1 nodes): `activities`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 223`** (1 nodes): `suggestions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 224`** (1 nodes): `Revenue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 225`** (1 nodes): `StatCardProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 226`** (2 nodes): `manual_publications`, `profiles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 227`** (2 nodes): `platform_connections`, `profiles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 228`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 229`** (2 nodes): `media_library`, `profiles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 230`** (2 nodes): `profiles`, `video_generation_jobs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 232`** (2 nodes): `pro_mode_acknowledgments`, `profiles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 233`** (2 nodes): `admin_insights`, `best_practices`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 234`** (2 nodes): `config`, `{ getDefaultConfig }`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 266`** (2 nodes): `Code de la Consommation`, `Code de la Propriete Intellectuelle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 267`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 270`** (1 nodes): `apify_usage_logs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 271`** (1 nodes): `nextConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 272`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 273`** (1 nodes): `options`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 274`** (1 nodes): `Brand Guidelines`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `OnlyFans Class Action`** (1 nodes): `Class Action OnlyFans 2024`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Instagram Terms`** (1 nodes): `Instagram Terms of Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `MyM Platform Terms`** (1 nodes): `MyM Terms of Service`
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
- **Why does `createClient()` connect `Core API Routes` to `Admin Layout Shell`, `Community 149`, `Community 112`, `Community 65`, `Community 150`, `Community 102`, `Community 176`, `Community 175`, `Community 177`, `Compliance Drafting`, `Community 202`, `Community 178`, `Admin Auth & Middleware`, `Generic API Routes`, `Community 203`, `Community 204`, `Community 57`, `Community 205`, `Community 53`, `Email Campaigns`, `Community 206`, `Community 125`, `Moderation & Comments`, `Community 66`, `Background Draft Gen`, `Community 207`, `Community 107`, `Community 152`, `Community 208`, `Community 123`, `Community 179`, `Trend Hub Pages`, `Community 180`, `Data API Routes`, `Creator DNA & AI Profiling`, `Community 181`, `Community 209`, `Community 153`, `Platform Connection API`, `Community 169`, `Community 154`, `Community 155`, `Community 211`, `Community 182`, `Community 92`, `Community 183`, `Community 212`, `Community 108`, `Community 78`, `Analytics Insights Engine`, `Composer State`, `Google Trends`, `Community 58`, `Community 97`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._