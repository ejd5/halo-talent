"use client";

import { useMemo } from "react";
import { pickDailyMission, DRAFTS } from "@/lib/mock/studio-dashboard";
import { GreetingHeader } from "./GreetingHeader";
import { DailyMissionCard } from "./DailyMissionCard";
import { StatsRow } from "./StatsRow";
import { WhatWorksNow } from "./WhatWorksNow";
import { PlatformHealthWidget } from "./PlatformHealthWidget";
import { ContentCalendarPreview } from "./ContentCalendarPreview";
import { DraftCard } from "./DraftCard";

export function StudioDashboard() {
  const mission = useMemo(() => pickDailyMission(), []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 stagger-children">
        {/* ROW 1 — Greeting */}
        <GreetingHeader />

        {/* ROW 2 — Daily Mission */}
        <DailyMissionCard mission={mission} onComplete={() => {}} />

        {/* ROW 3 — Stats */}
        <StatsRow />

        {/* ROW 4 — What Works Now (60%) + Platform Health (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <WhatWorksNow />
          </div>
          <div className="lg:col-span-2">
            <PlatformHealthWidget />
          </div>
        </div>

        {/* ROW 5 — Calendar */}
        <ContentCalendarPreview />

        {/* ROW 6 — Drafts */}
        <DraftCard drafts={DRAFTS} />
      </div>
    </div>
  );
}
