import { ArrowRight, Bell, Bot, CalendarDays, ChevronRight, Crown, Search, SlidersHorizontal } from "lucide-react";
import { CampaignChart, DonutChart, RevenueLineChart, Sparkline } from "./charts";
import { atlasNavItems, campaignStats, crmFans, healthScores, kpis, opportunities, sidebarProfile, topChatters, topFans } from "./data";
import { MobilePreviews } from "./MobilePreviews";

function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`min-w-0 rounded-[20px] border border-white/[0.09] bg-[#0d141c]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.24)] ${className}`}>{children}</section>;
}

function Avatar({ label, className = "" }: { label: string; className?: string }) {
  return <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f4c46a] via-[#9e643d] to-[#35221b] text-[11px] font-semibold text-[#fff7e8] ring-1 ring-white/10 ${className}`}>{label}</span>;
}

export function AtlasCommandCenter() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#03070b] text-[#fbf4e8]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(217,166,65,0.16),transparent_28%),radial-gradient(circle_at_78%_14%,rgba(77,125,255,0.09),transparent_32%),linear-gradient(135deg,#03070b_0%,#071018_46%,#020406_100%)]" />
      <div className="relative grid min-h-screen grid-cols-1 xl:grid-cols-[248px_minmax(0,1fr)] 2xl:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden min-w-0 border-r border-white/[0.08] bg-[#081018]/90 xl:flex xl:flex-col">
          <div className="flex h-[88px] items-center gap-3 border-b border-white/[0.07] px-7 py-5">
            <div className="text-4xl font-black leading-none text-[#f1c46d]">A</div>
            <div><p className="font-serif text-3xl tracking-[0.2em] text-[#f7d68d]">ATLAS</p><p className="text-[9px] font-semibold tracking-[0.18em] text-[#f7efe2]">WHERE TALENT FORMS</p></div>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {atlasNavItems.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;
              return <button key={item.label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${active ? "bg-[#3a2c17] text-[#fff1cb] shadow-[inset_3px_0_0_#e3b453]" : "text-[#d7dde5] hover:bg-white/[0.04]"}`}><Icon size={16} />{item.label}</button>;
            })}
          </nav>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <Avatar label="SC" className="h-12 w-12" />
              <div className="min-w-0"><p className="truncate text-sm font-medium">{sidebarProfile.name}</p><p className="text-xs text-[#9aa2ad]">{sidebarProfile.role}</p><span className="mt-2 inline-flex rounded-full border border-[#d9a641]/40 px-3 py-1 text-[10px] text-[#f2bf57]">{sidebarProfile.badge}</span></div>
              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#d7b0bd]" />
            </div>
          </div>
        </aside>

        <main className="relative min-w-0 px-4 py-5 sm:px-5 lg:px-6 xl:px-7">
          <div className="mx-auto w-full max-w-[1540px] min-w-0">
            <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div><h1 className="text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">Welcome back, Sabrina <Crown size={18} className="mb-1 inline text-[#f2bf57]" /></h1><p className="mt-1 text-sm text-[#aeb5bd]">Here’s what’s happening with your empire today.</p></div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm text-[#f8efe1]"><CalendarDays size={16} />Jun 16 - Jun 22, 2025</button>
                <button className="inline-flex items-center gap-2 rounded-full border border-[#e0ad4a]/70 bg-[#20190d] px-6 py-2.5 text-sm font-semibold text-[#ffd676] shadow-[0_0_22px_rgba(224,173,74,0.12)]"><Bot size={16} />AI Assistant</button>
                <button className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><Bell size={18} /><span className="absolute right-1 top-0 grid h-5 w-5 place-items-center rounded-full bg-[#e2af47] text-[10px] font-bold text-black">3</span></button>
              </div>
            </header>

            <section className="mb-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {kpis.map((kpi) => <PremiumCard key={kpi.label} className="p-4"><div className="mb-2 flex items-center justify-between"><p className="text-sm text-[#aeb5bd]">{kpi.label}</p></div><div className="flex items-end gap-2"><strong className="text-xl font-semibold text-white 2xl:text-2xl">{kpi.value}</strong><span className="pb-1 text-xs font-medium text-[#7ee26f]">↑ {kpi.change.replace("+", "")}</span></div><p className="mt-2 text-xs text-[#9aa2ad]">{kpi.sub}</p><div className="mt-3"><Sparkline points={kpi.points} tone={kpi.tone} /></div></PremiumCard>)}
            </section>

            <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] 2xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.78fr)_minmax(280px,0.72fr)]">
              <PremiumCard><div className="flex items-center justify-between px-5 pt-4"><h2 className="text-sm font-semibold">Revenue Overview</h2><div className="flex gap-4 text-xs"><span className="text-[#f2bf57]">● Revenue</span><span className="text-[#9a8d74]">⌁ Profit</span></div></div><RevenueLineChart /></PremiumCard>
              <PremiumCard className="p-5"><h2 className="mb-3 text-sm font-semibold">Revenue by Source</h2><DonutChart /></PremiumCard>
              <PremiumCard className="p-4 2xl:row-span-2"><div className="mb-4 flex items-center gap-3"><h2 className="text-sm font-semibold">AI Growth Radar</h2><span className="rounded-full border border-[#d9a641]/50 px-2 py-0.5 text-[10px] text-[#f2bf57]">New</span></div><div className="rounded-xl border border-[#d9a641]/10 bg-[#211c13] p-4"><p className="text-xs font-semibold text-[#d7b25c]">Top Action for Today</p><strong className="mt-2 block text-sm">You have 25 high-value fans online</strong><p className="mt-2 text-xs text-[#d3d7dc]">Send a personalized offer now.</p><p className="mt-3 text-xs text-[#f8d27f]">Estimated revenue: €1,230</p><button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#d9a641]/60 px-4 py-2 text-xs font-semibold text-[#f2bf57]">View Fans <ArrowRight size={14} /></button></div><div className="mt-3 space-y-3">{opportunities.map((opportunity) => <div key={opportunity.title} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-[#f2bf57]">◎</span><div className="min-w-0 flex-1"><p className="truncate text-sm">{opportunity.title}</p><p className="truncate text-xs text-[#aeb5bd]">{opportunity.detail}</p></div><ChevronRight size={17} /></div>)}</div></PremiumCard>
            </section>

            <section className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <PremiumCard className="p-4"><h2 className="mb-4 text-sm font-semibold">Top Chatters</h2><MiniTable rows={topChatters} columns={["Chatter", "Revenue", "Conversion"]} /></PremiumCard>
              <PremiumCard className="p-4"><h2 className="mb-4 text-sm font-semibold">Top Fans by Value</h2><MiniTable rows={topFans} columns={["Fan", "Revenue", "Score"]} /></PremiumCard>
              <PremiumCard className="p-4 xl:col-span-2 2xl:col-span-1"><h2 className="mb-4 text-sm font-semibold">Creator Health Score</h2><div className="grid items-center gap-5 sm:grid-cols-[130px_1fr]"><div className="mx-auto grid h-32 w-32 place-items-center rounded-full border-[14px] border-[#6ed34f] bg-[#0a1117] text-center"><div><strong className="text-3xl">87</strong><p className="text-xs text-[#dfe9d9]">Excellent</p></div></div><div className="space-y-3">{healthScores.map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs"><span>{item.label}</span><span>{item.value}</span></div><div className="h-1.5 rounded bg-white/10"><div className="h-full rounded bg-gradient-to-r from-[#72d957] to-[#e2b44d]" style={{ width: `${item.value}%` }} /></div></div>)}</div></div></PremiumCard>
            </section>

            <section className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.78fr)_minmax(360px,0.9fr)]">
              <PremiumCard className="p-4"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">CRM - Fans</h2><Search size={17} /></div><div className="mb-4 flex min-w-0 flex-wrap gap-5 text-xs text-[#9aa2ad]"><span className="border-b border-[#e0ad4a] pb-2 text-[#f2bf57]">All Fans</span><span>Segments</span><span>Insights</span><span>Activities</span><button className="ml-auto inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1"><SlidersHorizontal size={12} />Filters</button></div><div className="overflow-x-auto"><table className="w-full min-w-[580px] text-left text-sm"><thead className="text-xs text-[#8f969f]"><tr><th className="py-3">Fan</th><th>Segment</th><th>Total Spent</th><th>Last Active</th><th>Score</th><th>Action</th></tr></thead><tbody>{crmFans.map((fan) => <tr key={fan.fan} className="border-t border-white/[0.06]"><td className="py-3"><span className="flex items-center gap-2"><Avatar label={fan.avatar} />{fan.fan}</span></td><td className={fan.segment === "At Risk" ? "text-[#ff6f92]" : "text-[#d6dce2]"}>{fan.segment}</td><td>{fan.spent}</td><td className="text-[#aeb5bd]">{fan.active}</td><td>{fan.score}</td><td><button className={`rounded-lg px-3 py-1.5 text-xs ${fan.action === "Win Back" ? "bg-[#4b1730] text-[#ff9aba]" : "bg-[#322815] text-[#f2bf57]"}`}>{fan.action}</button></td></tr>)}</tbody></table></div></PremiumCard>
              <PremiumCard className="p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Campaign Analytics</h2><span className="rounded-lg bg-[#14301b] px-2 py-1 text-[10px] text-[#7ee26f]">Active</span></div><div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{campaignStats.map((stat) => <div key={`${stat.label}-${stat.value}`} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-center"><p className="text-[10px] text-[#8f969f]">{stat.label}</p><strong className="text-base">{stat.value}</strong>{stat.sub && <p className="text-[10px] text-[#d3b465]">{stat.sub}</p>}</div>)}</div><CampaignChart /><button className="mx-auto mt-2 block text-xs text-[#f2bf57]">View full campaign report</button></PremiumCard>
              <MobilePreviews />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

type MiniRow = { rank: number; name: string; revenue: string; conversion?: string; score?: number; avatar: string };
function MiniTable({ rows, columns }: { rows: MiniRow[]; columns: string[] }) {
  return <div className="space-y-2"><div className="grid grid-cols-[24px_minmax(0,1fr)_70px_68px] text-xs text-[#8f969f]"><span />{columns.map((column) => <span key={column}>{column}</span>)}</div>{rows.map((row) => <div key={row.name} className="grid grid-cols-[24px_minmax(0,1fr)_70px_68px] items-center text-sm"><span className="text-[#aeb5bd]">{row.rank}</span><span className="flex min-w-0 items-center gap-2"><Avatar label={row.avatar} /><span className="truncate">{row.name}</span></span><span>{row.revenue}</span><span>{row.conversion ?? row.score}</span></div>)}<button className="mx-auto mt-3 block text-xs text-[#aeb5bd]">View all</button></div>;
}
