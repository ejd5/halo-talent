import { AlertTriangle, Archive, Bot, CalendarClock, CheckCircle2, Clock3, DollarSign, ImageIcon, Lock, MessageCircle, Paperclip, Search, Send, ShieldCheck, Sparkles, UserCheck, Users, Wand2 } from "lucide-react";
import { aiDraft, chatterPerformance, conversations, fanProfile, filters, inboxStats, safetyChecks, scripts, smartLists, threadMessages, vaultItems } from "./data";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`min-w-0 rounded-[22px] border border-white/[0.08] bg-[#0d141c]/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_50px_rgba(0,0,0,0.22)] ${className}`}>{children}</section>;
}

function Pill({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" | "blue" | "rose" | "muted" }) {
  const tones = {
    gold: "border-[#d9a641]/35 bg-[#2a2112] text-[#f2bf57]",
    green: "border-[#70d65d]/25 bg-[#102315] text-[#8ee681]",
    blue: "border-[#6f91ff]/25 bg-[#111a32] text-[#a9bdff]",
    rose: "border-[#ff6f92]/30 bg-[#331522] text-[#ff9aba]",
    muted: "border-white/10 bg-white/[0.04] text-[#aeb5bd]",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${tones[tone]}`}>{children}</span>;
}

export function AtlasInboxV2() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#03070b] text-[#fbf4e8]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(217,166,65,0.16),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(99,135,255,0.1),transparent_34%),linear-gradient(135deg,#03070b_0%,#071018_48%,#020406_100%)]" />
      <main className="relative mx-auto flex w-full max-w-[1680px] flex-col gap-4 px-3 py-4 sm:px-5 xl:px-6">
        <header className="flex flex-col gap-3 rounded-[24px] border border-white/[0.08] bg-[#0a1118]/86 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)] lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2"><Pill>Atlas Inbox v2</Pill><Pill tone="green">Mock preview</Pill><Pill tone="rose">No auto-send</Pill></div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white md:text-[1.9rem]">AI-assisted chatting, human-approved selling system</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#aeb5bd]">AI drafts are suggestions. A human must approve before sending. This preview is fully mocked and does not connect to OF, MYM, Instagram, Supabase, or any messaging API.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
            {inboxStats.map((stat) => <div key={stat.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3"><p className="text-[10px] uppercase tracking-[0.12em] text-[#8f969f]">{stat.label}</p><strong className="mt-1 block text-sm text-white">{stat.value}</strong></div>)}
          </div>
        </header>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="min-w-0 space-y-4">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Inbox / Smart Lists</h2><Archive size={16} className="text-[#f2bf57]" /></div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-[#8f969f]"><Search size={15} /><span>Search fan, tag, platform...</span></div>
              <div className="mt-3 flex flex-wrap gap-2">{filters.map((filter, index) => <button key={filter} className={`rounded-full border px-3 py-1.5 text-[11px] ${index === 0 ? "border-[#d9a641]/50 bg-[#2a2112] text-[#f2bf57]" : "border-white/10 bg-white/[0.03] text-[#aeb5bd]"}`}>{filter}</button>)}</div>
              <div className="mt-4 grid gap-2">{smartLists.map((list) => <button key={list.name} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-left text-sm hover:bg-white/[0.05]"><span>{list.name}</span><span className="rounded-full bg-[#2a2112] px-2 py-0.5 text-[10px] text-[#f2bf57]">{list.count}</span></button>)}</div>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b border-white/[0.07] px-4 py-3"><h2 className="text-sm font-semibold">Priority conversations</h2></div>
              <div className="max-h-[560px] overflow-y-auto">
                {conversations.map((conversation, index) => <button key={conversation.fan} className={`flex w-full min-w-0 gap-3 border-b border-white/[0.055] p-3 text-left transition hover:bg-white/[0.04] ${index === 0 ? "bg-[#2a2112]/60" : ""}`}><span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f2bf57] to-[#6a4327] text-xs font-bold text-[#090b0e]">{conversation.fan.slice(1, 3).toUpperCase()}{conversation.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#70d65d] ring-2 ring-[#0d141c]" />}</span><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><strong className="truncate text-sm text-white">{conversation.fan}</strong><Pill tone={conversation.platform === "OF" ? "gold" : conversation.platform === "MYM" ? "blue" : "muted"}>{conversation.platform}</Pill>{conversation.unread > 0 && <span className="rounded-full bg-[#d9a641] px-1.5 py-0.5 text-[10px] font-bold text-black">{conversation.unread}</span>}</span><span className="mt-1 flex items-center gap-2 text-[11px] text-[#aeb5bd]"><UserCheck size={12} />{conversation.assigned}<span>·</span>{conversation.tag}</span><span className="mt-1 block truncate text-xs text-[#d7dde5]">{conversation.preview}</span></span><span className="shrink-0 text-xs text-[#f2bf57]">{conversation.spent}</span></button>)}
              </div>
            </Card>
          </aside>

          <section className="min-w-0 space-y-4">
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold">Conversation with {fanProfile.fan}</h2><p className="text-xs text-[#aeb5bd]">Assigned to {chatterPerformance.assigned} · {fanProfile.platform} · Human approval required</p></div><Pill tone="rose"><Lock size={12} className="mr-1" /> No automatic send</Pill></div>
              <div className="space-y-4 p-4">
                {threadMessages.map((message) => <div key={`${message.time}-${message.body}`} className={`flex ${message.sender === "fan" ? "justify-start" : "justify-end"}`}><div className={`max-w-[82%] rounded-2xl border px-4 py-3 ${message.sender === "fan" ? "border-white/[0.07] bg-white/[0.04]" : "border-[#d9a641]/20 bg-[#21190f]"}`}><p className="mb-1 text-[11px] text-[#8f969f]">{message.name} · {message.time}</p><p className="text-sm leading-relaxed text-[#f7efe2]">{message.body}</p></div></div>)}
                <div className="rounded-2xl border border-[#d9a641]/25 bg-[#21190f] p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><Bot size={16} className="text-[#f2bf57]" /><h3 className="text-sm font-semibold">{aiDraft.title}</h3></div><div className="flex gap-2"><Pill tone="green">AI {aiDraft.confidence}</Pill><Pill>{aiDraft.estimatedRevenue}</Pill></div></div>
                  <p className="text-sm leading-relaxed text-[#f3e6cf]">{aiDraft.body}</p>
                  <div className="mt-3 rounded-xl border border-[#ff6f92]/25 bg-[#351421]/60 p-3 text-xs text-[#ffbacb]"><AlertTriangle size={14} className="mr-1 inline" />Human approval required before sending. AI drafts are suggestions, not automatic messages.</div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-3">
                  <textarea className="min-h-[96px] w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-[#68717c]" placeholder="Write or edit the human-approved reply..." />
                  <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                    {[
                      [Wand2, "AI Suggest"], [MessageCircle, "Script"], [Paperclip, "Attach Media"], [DollarSign, "Send PPV"], [CalendarClock, "Schedule"], [CheckCircle2, "Approve Draft"],
                    ].map(([Icon, label]) => <button key={String(label)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-[#f8efe1] hover:border-[#d9a641]/40"><Icon size={14} />{label}</button>)}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-4"><div className="mb-3 flex items-center gap-2"><MessageCircle size={16} className="text-[#f2bf57]" /><h2 className="text-sm font-semibold">Scripts Library</h2></div><div className="grid gap-2">{scripts.slice(0, 4).map((script) => <div key={script.name} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-white">{script.name}</p><p className="text-[11px] text-[#aeb5bd]">{script.category} · {script.conversion} conversion · {script.revenue}</p></div><button className="rounded-lg bg-[#2a2112] px-3 py-1.5 text-[11px] font-semibold text-[#f2bf57]">Use script</button></div><div className="mt-2 flex flex-wrap gap-1.5">{script.tags.map((tag) => <span key={tag} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-[#aeb5bd]">{tag}</span>)}</div></div>)}</div></Card>
              <Card className="p-4"><div className="mb-3 flex items-center gap-2"><ImageIcon size={16} className="text-[#f2bf57]" /><h2 className="text-sm font-semibold">Vault / Gallery</h2></div><div className="grid gap-2">{vaultItems.map((item) => <div key={item.title} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.title}</p><p className="text-[11px] text-[#aeb5bd]">{item.type} · {item.price} · {item.performance}</p></div><button className="rounded-lg bg-[#2a2112] px-3 py-1.5 text-[11px] font-semibold text-[#f2bf57]">Attach</button></div>)}</div></Card>
            </div>
          </section>

          <aside className="min-w-0 space-y-4">
            <Card className="p-4"><div className="mb-4 flex items-start justify-between"><div><h2 className="text-sm font-semibold">Fan Intelligence</h2><p className="text-xs text-[#aeb5bd]">{fanProfile.platform} · {fanProfile.tier}</p></div><Pill tone="green">Intent {fanProfile.purchaseIntent}</Pill></div><div className="grid grid-cols-2 gap-2 text-xs">{[["Total spent", fanProfile.totalSpent], ["ARPU", fanProfile.arpu], ["Last purchase", fanProfile.lastPurchase], ["Subscription", fanProfile.subscriptionStatus], ["Renewal", fanProfile.renewalDate], ["Churn risk", fanProfile.churnRisk]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"><p className="text-[#8f969f]">{label}</p><strong className="mt-1 block text-[#f8efe1]">{value}</strong></div>)}</div><div className="mt-3 space-y-2 text-sm"><p><span className="text-[#8f969f]">Sentiment:</span> {fanProfile.sentiment}</p><p><span className="text-[#8f969f]">Preferred content:</span> {fanProfile.preferredContent}</p><p><span className="text-[#8f969f]">Last PPV:</span> {fanProfile.lastPpvUnlocked}</p><p><span className="text-[#8f969f]">Next best action:</span> <span className="text-[#f2bf57]">{fanProfile.nextBestAction}</span></p><p><span className="text-[#8f969f]">Suggested offer:</span> {fanProfile.suggestedOffer}</p><p><span className="text-[#8f969f]">Opportunity:</span> <span className="text-[#70d65d]">{fanProfile.opportunity}</span></p></div></Card>

            <Card className="p-4"><div className="mb-3 flex items-center gap-2"><Users size={16} className="text-[#f2bf57]" /><h2 className="text-sm font-semibold">Chatter Performance</h2></div><div className="grid grid-cols-2 gap-2 text-xs">{[["Assigned", chatterPerformance.assigned], ["Messages", chatterPerformance.messagesSent], ["PPV unlocked", chatterPerformance.ppvUnlocked], ["Revenue", chatterPerformance.revenueToday], ["Response", chatterPerformance.responseTime], ["Conversion", chatterPerformance.conversionRate]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"><p className="text-[#8f969f]">{label}</p><strong className="mt-1 block text-[#f8efe1]">{value}</strong></div>)}</div><p className="mt-3 rounded-xl border border-[#70d65d]/20 bg-[#102315] p-3 text-xs text-[#8ee681]">{chatterPerformance.shiftStatus}</p></Card>

            <Card className="p-4"><div className="mb-3 flex items-center gap-2"><ShieldCheck size={16} className="text-[#f2bf57]" /><h2 className="text-sm font-semibold">Safety Guard</h2></div><div className="space-y-2">{safetyChecks.map((check) => <div key={check} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm"><CheckCircle2 size={14} className="text-[#70d65d]" />{check}</div>)}</div><p className="mt-3 rounded-xl border border-[#d9a641]/20 bg-[#2a2112] p-3 text-xs leading-relaxed text-[#f2d59b]">AI drafts are suggestions. A human must approve before sending. No impersonation, no automatic outreach, no hidden bot behavior.</p></Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
