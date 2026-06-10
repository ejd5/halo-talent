"use client";

import { Suspense, useState, useMemo } from "react";
import { Loader } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { mockFans, mockSegments } from "@/lib/mock/atlas-fans";
import type { FanIntel, FanSegment } from "@/lib/mock/atlas-fans";
import { FanSegmentCards } from "@/components/atlas/FanSegmentCards";
import { FanIntelligenceTable } from "@/components/atlas/FanIntelligenceTable";
import { FanProfileDrawer } from "@/components/atlas/FanProfileDrawer";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function FanIntelligenceContent() {
  const locale = useLocale();
  const l = norm(locale);

  const [fans, setFans] = useState<FanIntel[]>(mockFans);
  const [selectedFan, setSelectedFan] = useState<FanIntel | null>(null);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [selectedFanIds, setSelectedFanIds] = useState<string[]>([]);

  const activeSegment = useMemo(
    () => mockSegments.find((s) => s.id === activeSegmentId) || null,
    [activeSegmentId],
  );

  const handleSegmentClick = (segment: FanSegment) => {
    setActiveSegmentId(segment.id);
    setSelectedFanIds([]);
  };

  const handleClearSegment = () => {
    setActiveSegmentId(null);
    setSelectedFanIds([]);
  };

  const handleSelectFan = (fan: FanIntel) => {
    setSelectedFan(fan);
  };

  const handleCloseDrawer = () => {
    setSelectedFan(null);
  };

  const handleAddNote = (fanId: string, content: string) => {
    const updated = fans.map((f) =>
      f.id === fanId
        ? {
            ...f,
            notes: [
              ...f.notes,
              {
                content,
                author: "Moi",
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : f,
    );
    setFans(updated);
    const fresh = updated.find((f) => f.id === fanId);
    if (fresh) setSelectedFan(fresh);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {t("fan_intel.title", l)}
          </h1>
          <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fans.length} fans · {mockSegments.length} segments
          </p>
        </div>
      </div>

      {/* Segments */}
      <FanSegmentCards
        segments={mockSegments}
        activeSegmentId={activeSegmentId}
        onSegmentClick={handleSegmentClick}
        onClearSegment={handleClearSegment}
      />

      {/* Table */}
      <FanIntelligenceTable
        fans={fans}
        activeSegment={activeSegment}
        onClearSegment={handleClearSegment}
        onSelectFan={handleSelectFan}
        selectedFanIds={selectedFanIds}
        onSelectionChange={setSelectedFanIds}
      />

      {/* Drawer */}
      <FanProfileDrawer
        fan={selectedFan}
        onClose={handleCloseDrawer}
        onAddNote={handleAddNote}
      />
    </div>
  );
}

export default function FansPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Loader
            size={16}
            className="animate-spin"
            style={{ color: "rgba(255,255,255,0.2)" }}
          />
        </div>
      }
    >
      <FanIntelligenceContent />
    </Suspense>
  );
}
