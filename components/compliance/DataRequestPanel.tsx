"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  DATA_REQUESTS,
  DATA_REQUEST_TYPE_LABELS,
  DATA_REQUEST_TYPE_COLORS,
  type DataRequest,
  type DataRequestStatus,
} from "@/lib/mock/atlas-compliance";
import { Trash2, Archive, AlertTriangle } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const STATUS_COLORS: Record<DataRequestStatus, string> = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  completed: "var(--success)",
  rejected: "var(--danger)",
};

interface DataRequestPanelProps {
  requests?: DataRequest[];
}

export function DataRequestPanel({ requests = DATA_REQUESTS }: DataRequestPanelProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [reqList, setReqList] = useState(requests);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const pendingCount = reqList.filter((r) => r.status === "pending").length;

  const handleProcess = (id: string) => {
    setReqList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "processing" as const } : r))
    );
    setConfirmId(null);
    setTimeout(() => {
      setReqList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "completed" as const } : r))
      );
    }, 2000);
  };

  const handleArchive = (id: string) => {
    setReqList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.requests.title", l)}
        {pendingCount > 0 && (
          <span className="ml-2 text-[8px] px-1.5 py-0.5" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
            {t("compliance.requests.pending_count", l).replace("{n}", String(pendingCount))}
          </span>
        )}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {reqList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Archive size={16} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("compliance.requests.empty", l)}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reqList.map((req) => {
              const typeColor = DATA_REQUEST_TYPE_COLORS[req.type];
              const statusColor = STATUS_COLORS[req.status];
              const isPending = req.status === "pending";

              return (
                <div
                  key={req.id}
                  className="flex items-center gap-3 px-3 py-2"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    background: confirmId === req.id ? "rgba(245,158,11,0.04)" : "transparent",
                  }}
                >
                  {/* Type badge */}
                  <span
                    className="text-[8px] px-1.5 py-0.5 w-24 text-center"
                    style={{ background: `${typeColor}15`, color: typeColor }}
                  >
                    {t(`compliance.requests.type_${req.type}`, l)}
                  </span>

                  {/* Fan info */}
                  <div className="min-w-[100px]">
                    <p className="text-[9px] font-medium" style={{ color: "var(--text-primary)" }}>{req.fanName}</p>
                    <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>{req.fanEmail}</p>
                  </div>

                  {/* Date */}
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {req.createdAt}
                  </span>

                  {/* Status */}
                  <span
                    className="text-[8px] px-1.5 py-0.5 ml-auto"
                    style={{ background: `${statusColor}15`, color: statusColor }}
                  >
                    {t(`compliance.requests.status_${req.status}`, l)}
                  </span>

                  {/* Actions */}
                  {isPending ? (
                    <>
                      <button
                        onClick={() => setConfirmId(req.id)}
                        className="flex items-center gap-1 text-[8px] px-2 py-1 transition-colors"
                        style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
                      >
                        <Trash2 size={8} />
                        {t("compliance.requests.process", l)}
                      </button>
                      <button
                        onClick={() => handleArchive(req.id)}
                        className="text-[8px] px-1.5 py-1 transition-colors"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        <Archive size={10} />
                      </button>
                    </>
                  ) : req.status === "processing" ? (
                    <span className="text-[8px]" style={{ color: "#3B82F6" }}>En cours...</span>
                  ) : (
                    <button
                      onClick={() => handleArchive(req.id)}
                      className="text-[8px] px-1.5 py-1 transition-colors"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      <Archive size={10} />
                    </button>
                  )}

                  {/* Confirmation */}
                  {confirmId === req.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmId(null)}>
                      <div
                        className="p-6 max-w-sm mx-4"
                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle size={16} style={{ color: "#F59E0B" }} />
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Confirmation</span>
                        </div>
                        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {t("compliance.requests.confirm_deletion", l).replace("{name}", req.fanName)}
                        </p>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-[10px] px-3 py-1.5"
                            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleProcess(req.id)}
                            className="text-[10px] px-3 py-1.5"
                            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
                          >
                            Confirmer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
