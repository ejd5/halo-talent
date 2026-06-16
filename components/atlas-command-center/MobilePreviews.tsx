import { ArrowRight, Bell, ChevronLeft, Home, MessageCircle, Users } from "lucide-react";
import { mobileKpis, opportunities } from "./data";
import { Sparkline } from "./charts";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[390px] w-[190px] shrink-0 rounded-[30px] border border-[#3a342d] bg-[#03070b] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
      <div className="absolute left-1/2 top-3 z-10 h-3.5 w-16 -translate-x-1/2 rounded-full bg-black" />
      <div className="h-full overflow-hidden rounded-[24px] border border-white/5 bg-[radial-gradient(circle_at_50%_0%,rgba(224,173,74,0.13),transparent_35%),#071018] px-3 py-5 text-[#f8efe1]">
        {children}
      </div>
    </div>
  );
}

export function MobilePreviews() {
  return (
    <div className="flex max-w-full flex-wrap justify-center gap-3 overflow-hidden pb-1">
      <PhoneFrame>
        <div className="mb-4 flex items-center justify-between text-[10px]"><strong>Command Center</strong><Bell size={12} /></div>
        <div className="mb-3 rounded-xl border border-white/10 bg-white/[0.035] p-2 text-[9px] text-[#aeb5bd]">Jun 16 – Jun 22 <ArrowRight size={10} className="inline" /></div>
        <div className="space-y-2">
          {mobileKpis.map((kpi, index) => (
            <div key={kpi.label} className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
              <p className="text-[10px] text-[#969da7]">{kpi.label}</p>
              <div className="flex items-end justify-between"><strong className="text-lg">{kpi.value}</strong><span className="text-[9px] text-[#75e36d]">{kpi.change}</span></div>
              <Sparkline points={[18, 27, 22, 34, 25, 40, 31, 48]} tone={index === 0 ? "gold" : index === 1 ? "blue" : "mint"} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-around rounded-2xl border border-white/10 bg-black/30 py-2 text-[9px] text-[#d9b663]"><Home size={13} /><Users size={13} /><MessageCircle size={13} /><Bell size={13} /></div>
      </PhoneFrame>

      <PhoneFrame>
        <div className="mb-4 flex items-center gap-2 text-[10px]"><ChevronLeft size={13} /><strong>AI Growth Radar</strong></div>
        <div className="rounded-xl border border-[#c99a3d]/20 bg-[#211c14] p-3">
          <p className="mb-2 text-[9px] text-[#d7b25c]">Today’s Top Action</p>
          <strong className="text-[12px]">25 high-value fans</strong>
          <p className="mt-1 text-[9px] text-[#aeb5bd]">Send a personalized offer</p>
          <p className="mt-2 text-[9px] text-[#f2bf57]">Est. revenue: €1,230</p>
          <button className="mt-3 w-full rounded-lg bg-[#5a431e] py-2 text-[10px] text-[#f8e5b6]">View Fans</button>
        </div>
        <p className="mb-2 mt-5 text-[10px] text-[#f8efe1]">More Opportunities</p>
        <div className="space-y-2">
          {opportunities.map((opportunity) => (
            <div key={opportunity.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[10px]">{opportunity.title}</p>
              <p className="text-[9px] text-[#aeb5bd]">{opportunity.detail}</p>
            </div>
          ))}
        </div>
      </PhoneFrame>

      <PhoneFrame>
        <div className="mb-4 flex items-center gap-2 text-[10px]"><ChevronLeft size={13} /><strong>Fan Profile</strong></div>
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#f2bf57] to-[#7a4b28]" />
          <div><strong className="text-sm">@Alexis93</strong><span className="ml-1 rounded bg-[#493a18] px-1 text-[8px] text-[#f2bf57]">VIP</span></div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[9px]">
          <div><p className="text-[#8f969f]">Total Spent</p><strong>€2,450</strong></div>
          <div><p className="text-[#8f969f]">Orders</p><strong>24</strong></div>
          <div><p className="text-[#8f969f]">Last Active</p><strong>2 min</strong></div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div><p className="text-[9px] text-[#8f969f]">Lifetime Value</p><strong>High</strong><p className="mt-2 text-[9px] text-[#8f969f]">Segment</p><strong className="text-[#f2bf57]">VIP</strong></div>
          <div className="grid h-20 w-20 place-items-center rounded-full border-[6px] border-[#6ad24f] text-xl font-semibold">95</div>
        </div>
        <div className="mt-6 rounded-xl border border-white/10 p-3 text-[9px]"><p className="mb-2 text-[#f8efe1]">Insights</p><p>✦ High spender</p><p>✦ Loves PPV content</p><p>✦ Responds to personalized offers</p></div>
        <button className="mt-5 w-full rounded-lg bg-[#5a431e] py-2 text-[10px] text-[#f8e5b6]">Send Message</button>
      </PhoneFrame>
    </div>
  );
}
