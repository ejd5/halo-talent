"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { PipelineItem } from "@/lib/mock/admin-dashboard";
import { PIPELINE_STAGE_CONFIG } from "@/lib/mock/admin-dashboard";
import { Users } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface AcquisitionPipelineProps {
  items: PipelineItem[];
}

export function AcquisitionPipeline({ items }: AcquisitionPipelineProps) {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("admin_dashboard.pipeline.title", l)}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {PIPELINE_STAGE_CONFIG.map((stage) => {
          const stageItems = items.filter((item) => item.stage === stage.key);
          return (
            <div
              key={stage.key}
              className="shrink-0 w-[180px]"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Stage header */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ borderBottom: "1px solid var(--border-default)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }} />
                  <span className="text-[9px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {t(stage.labelKey, l)}
                  </span>
                </div>
                <span
                  className="text-[7px] px-1 py-0.5"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
                >
                  {stageItems.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[80px]">
                {stageItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <Users size={12} style={{ color: "rgba(255,255,255,0.06)" }} />
                    <p className="text-[7px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
                      {t("admin_dashboard.pipeline.empty", l)}
                    </p>
                  </div>
                ) : (
                  stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <p className="text-[9px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.country}</span>
                        <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
                        <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.department}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                          J+{item.daysInStage}
                        </span>
                        {item.value && (
                          <span className="text-[7px]" style={{ color: "var(--success)" }}>
                            €{item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
