import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  Brain,
  CircleDollarSign,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Radio,
  Settings,
  Shield,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

export const atlasNavItems = [
  { label: "Command Center", icon: LayoutDashboard },
  { label: "Revenue", icon: CircleDollarSign },
  { label: "Fans Intelligence", icon: Brain },
  { label: "Chatters", icon: MessageCircle },
  { label: "Campaigns", icon: Radio },
  { label: "CRM", icon: Users },
  { label: "Creator Health", icon: HeartPulse },
  { label: "AI Growth Radar", icon: Sparkles },
  { label: "Analytics", icon: BarChart3 },
  { label: "Alerts & Opportunities", icon: AlertTriangle },
  { label: "Settings", icon: Settings },
];

export const kpis = [
  { label: "Total Revenue", value: "€48,529", change: "+24.5%", sub: "vs Jun 9 - Jun 15, 2025", tone: "gold", points: [24, 38, 31, 42, 54, 39, 30, 45, 58, 50, 77, 66, 86] },
  { label: "Net Profit", value: "€32,920", change: "+18.2%", sub: "Margin 67.8%", tone: "violet", points: [18, 34, 25, 29, 40, 23, 19, 44, 37, 61, 45, 58, 73] },
  { label: "New Fans", value: "1,246", change: "+32.1%", sub: "vs previous 7 days", tone: "blue", points: [14, 33, 22, 29, 37, 24, 20, 42, 35, 55, 43, 50, 60] },
  { label: "ARPU", value: "€71.24", change: "+15.6%", sub: "Average Revenue Per User", tone: "mint", points: [20, 41, 25, 34, 42, 30, 22, 36, 55, 48, 66, 50, 61] },
  { label: "PPV Sales", value: "3,742", change: "+21.3%", sub: "vs previous 7 days", tone: "orange", points: [18, 21, 47, 29, 35, 22, 20, 30, 39, 35, 55, 47, 60] },
  { label: "Retention (30D)", value: "68%", change: "+6.7%", sub: "vs previous 30 days", tone: "rose", points: [22, 19, 31, 24, 29, 40, 25, 36, 32, 58, 34, 64, 55] },
];

export const revenueSeries = [
  { day: "Jun 16", revenue: 28500, profit: 13500 },
  { day: "Jun 17", revenue: 46200, profit: 25200 },
  { day: "Jun 18", revenue: 47500, profit: 26700 },
  { day: "Jun 19", revenue: 49800, profit: 33300 },
  { day: "Jun 20", revenue: 52500, profit: 31800 },
  { day: "Jun 21", revenue: 57900, profit: 36200 },
  { day: "Jun 22", revenue: 50200, profit: 25800 },
];

export const sourceBreakdown = [
  { label: "Subscriptions", value: 45, color: "#f2bf57" },
  { label: "PPV", value: 30, color: "#8f4ed7" },
  { label: "Tips", value: 15, color: "#6487ff" },
  { label: "Bundles", value: 7, color: "#63d7b1" },
  { label: "Other", value: 3, color: "#8c929b" },
];

export const opportunities = [
  { title: "Re-engage 85 inactive fans", detail: "Potential: €2,450", tone: "mint" },
  { title: "Launch ‘Summer Exclusive’ PPV", detail: "Potential: €3,120", tone: "rose" },
  { title: "3 chatters underperforming", detail: "View details", tone: "gold" },
];

export const topChatters = [
  { rank: 1, name: "Olivia", revenue: "€12,450", conversion: "24.8%", avatar: "O" },
  { rank: 2, name: "Luna", revenue: "€9,125", conversion: "21.3%", avatar: "L" },
  { rank: 3, name: "Mia", revenue: "€7,890", conversion: "20.1%", avatar: "M" },
  { rank: 4, name: "Emma", revenue: "€6,320", conversion: "18.7%", avatar: "E" },
  { rank: 5, name: "Sophie", revenue: "€4,210", conversion: "16.2%", avatar: "S" },
];

export const topFans = [
  { rank: 1, name: "@Alexis93", revenue: "€2,450", score: 95, avatar: "A" },
  { rank: 2, name: "@KingMat", revenue: "€1,980", score: 92, avatar: "K" },
  { rank: 3, name: "@Tony_Off", revenue: "€1,750", score: 78, avatar: "T" },
  { rank: 4, name: "@Jameson", revenue: "€1,490", score: 65, avatar: "J" },
  { rank: 5, name: "@HunterX", revenue: "€1,320", score: 40, avatar: "H" },
];

export const healthScores = [
  { label: "Revenue", value: 92 },
  { label: "Growth", value: 85 },
  { label: "Engagement", value: 88 },
  { label: "Content Quality", value: 90 },
  { label: "Fan Retention", value: 78 },
];

export const crmFans = [
  { fan: "@Alexis93", segment: "VIP", spent: "€2,450", active: "2 min ago", score: 95, action: "Message", avatar: "A" },
  { fan: "@KingMat", segment: "High Spender", spent: "€1,980", active: "15 min ago", score: 92, action: "Message", avatar: "K" },
  { fan: "@Tony_Off", segment: "Regular", spent: "€1,750", active: "1 day ago", score: 78, action: "Message", avatar: "T" },
  { fan: "@Jameson", segment: "New", spent: "€1,490", active: "3 hours ago", score: 65, action: "Message", avatar: "J" },
  { fan: "@HunterX", segment: "At Risk", spent: "€1,320", active: "7 days ago", score: 40, action: "Win Back", avatar: "H" },
];

export const campaignBars = [
  { day: "Jun 16", revenue: 820, conversions: 180 },
  { day: "Jun 17", revenue: 1120, conversions: 240 },
  { day: "Jun 18", revenue: 900, conversions: 210 },
  { day: "Jun 19", revenue: 1240, conversions: 260 },
  { day: "Jun 20", revenue: 980, conversions: 310 },
  { day: "Jun 21", revenue: 720, conversions: 390 },
  { day: "Jun 22", revenue: 1020, conversions: 560 },
];

export const campaignStats = [
  { label: "Sent", value: "12,450" },
  { label: "Opened", value: "8,920", sub: "71.6%" },
  { label: "Clicked", value: "4,320", sub: "34.7%" },
  { label: "Converted", value: "1,890", sub: "15.2%" },
  { label: "Converted", value: "€6,230", sub: "revenue" },
];

export const mobileKpis = [
  { label: "Total Revenue", value: "€48,529", change: "+24.5%" },
  { label: "New Fans", value: "1,246", change: "+32.1%" },
  { label: "ARPU", value: "€71,24", change: "+15.6%" },
];

export const sidebarProfile = { name: "Sabrina Carter", role: "Elite Creator", badge: "Pro Plan", icon: Shield, notificationIcon: Bell, walletIcon: WalletCards, botIcon: Bot, activityIcon: Activity };
