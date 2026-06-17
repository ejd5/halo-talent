export const inboxStats = [
  { label: "Human approval", value: "Required", tone: "gold" },
  { label: "Revenue today", value: "€4,820", tone: "green" },
  { label: "Avg response", value: "2m 14s", tone: "blue" },
  { label: "Drafts waiting", value: "18", tone: "rose" },
];

export const filters = ["All", "Online", "VIP", "High Spender", "At Risk", "Expiring", "Unread"];

export const smartLists = [
  { name: "Online now", count: 28 },
  { name: "High spenders", count: 16 },
  { name: "Expiring subscriptions", count: 9 },
  { name: "PPV interested", count: 34 },
  { name: "Winback", count: 12 },
  { name: "Needs reply", count: 7 },
];

export const conversations = [
  { fan: "@Alexis93", platform: "OF", tag: "VIP", unread: 3, assigned: "Olivia", preview: "Loved the teaser. Do you have the full set?", spent: "€2,450", online: true },
  { fan: "@KingMat", platform: "MYM", tag: "High Spender", unread: 1, assigned: "Luna", preview: "Bundle price still available tonight?", spent: "€1,980", online: true },
  { fan: "@Tony_Off", platform: "Instagram", tag: "PPV Interested", unread: 0, assigned: "Mia", preview: "Can you send me something exclusive?", spent: "€1,750", online: false },
  { fan: "@Jameson", platform: "OF", tag: "New", unread: 2, assigned: "Emma", preview: "Hey, I just subscribed 👀", spent: "€480", online: true },
  { fan: "@HunterX", platform: "MYM", tag: "At Risk", unread: 0, assigned: "Sophie", preview: "Maybe next month, not sure yet.", spent: "€1,320", online: false },
];

export const threadMessages = [
  { sender: "fan", name: "@Alexis93", time: "10:42", body: "Loved the teaser. Do you have the full set?" },
  { sender: "chatter", name: "Olivia", time: "10:43", body: "I do — it is more intimate and limited. Want me to show you a preview first?" },
  { sender: "fan", name: "@Alexis93", time: "10:44", body: "Yes, preview first. If it looks good I’ll unlock it." },
];

export const aiDraft = {
  title: "AI draft suggestion",
  body: "I made a private preview for you. Since you always unlock the premium sets, I can offer the full bundle tonight for €79 instead of €99. Want me to attach it?",
  confidence: "92%",
  estimatedRevenue: "€79",
};

export const fanProfile = {
  fan: "@Alexis93",
  platform: "OnlyFans",
  totalSpent: "€2,450",
  arpu: "€118",
  lastPurchase: "€49 PPV · 2 days ago",
  subscriptionStatus: "Active",
  renewalDate: "Jun 24, 2026",
  tier: "VIP",
  purchaseIntent: 94,
  sentiment: "Warm / playful",
  preferredContent: "Premium photo sets, bundles, voice notes",
  lastPpvUnlocked: "Golden Hour Set",
  nextBestAction: "Send personalized PPV preview",
  suggestedOffer: "€79 private bundle",
  churnRisk: "Low",
  opportunity: "€120 estimated today",
};

export const scripts = [
  { category: "Welcome", name: "Warm VIP opener", conversion: "31%", revenue: "€8,420", tags: ["new", "soft sell"] },
  { category: "PPV", name: "High-intent PPV close", conversion: "44%", revenue: "€18,900", tags: ["premium", "bundle"] },
  { category: "Winback", name: "Inactive VIP comeback", conversion: "22%", revenue: "€6,140", tags: ["retention", "credit"] },
  { category: "Renewal", name: "Renewal save", conversion: "28%", revenue: "€5,780", tags: ["subscription", "deadline"] },
  { category: "Tip request", name: "Playful tip prompt", conversion: "19%", revenue: "€3,210", tags: ["tip", "low pressure"] },
  { category: "Bundle offer", name: "Three-pack upsell", conversion: "37%", revenue: "€11,650", tags: ["bundle", "upsell"] },
  { category: "Objections", name: "Price concern reply", conversion: "24%", revenue: "€4,880", tags: ["objection", "value"] },
];

export const vaultItems = [
  { title: "Golden Hour Preview", type: "photo", price: "€19", performance: "38% unlock", tag: "teaser" },
  { title: "VIP Bundle 03", type: "bundle", price: "€79", performance: "44% unlock", tag: "best" },
  { title: "Voice Note Add-on", type: "video", price: "€29", performance: "21% attach", tag: "upsell" },
];

export const chatterPerformance = {
  assigned: "Olivia",
  messagesSent: 148,
  ppvUnlocked: 32,
  revenueToday: "€1,240",
  responseTime: "1m 52s",
  conversionRate: "24.8%",
  shiftStatus: "Live · 3h remaining",
};

export const safetyChecks = [
  "Sensitive words active",
  "No impersonation",
  "No IRL promise",
  "Human approval required",
  "Platform rule check",
  "AI-generated disclosure hint ready",
];
