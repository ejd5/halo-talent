import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { AIAssistantCard } from "@/components/dashboard/AIAssistantCard";

export default function DashboardPage() {
  return (
    <div className="space-y-20">
      {/* ─── Salutation ─── */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-brand-ivory italic">
          Bonjour Jean,
        </h1>
        <p className="text-brand-taupe mt-2">
          Voici l&apos;état de votre maison aujourd&apos;hui.
        </p>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Ce mois"
          value="12 450€"
          trend={{ value: "+18% vs mois dernier", positive: true }}
        />
        <StatsCard
          label="Cumul année"
          value="87 320€"
          trend={{ value: "+32% vs N-1", positive: true }}
        />
        <StatsCard
          label="Palier actuel"
          value="Croissance"
          mono={false}
        >
          <div className="absolute top-full left-0 right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="bg-brand-espresso border border-white/10 p-4 mx-4 shadow-xl">
              <p className="text-xs text-brand-taupe uppercase tracking-[0.1em] mb-2">
                Commission : 25%
              </p>
              <p className="text-xs text-brand-success">
                Prochain palier (Scale) : 20% à 20 000€/mois
              </p>
            </div>
          </div>
        </StatsCard>
        <StatsCard
          label="Engagement"
          value="4.7K"
          trend={{ value: "+5% cette semaine", positive: true }}
        />
      </div>

      {/* ─── Graphique ─── */}
      <RevenueChart />

      {/* ─── Activité récente ─── */}
      <ActivityTimeline />

      {/* ─── Plateformes ─── */}
      <PlatformCards />

      {/* ─── Assistant IA ─── */}
      <AIAssistantCard />
    </div>
  );
}
