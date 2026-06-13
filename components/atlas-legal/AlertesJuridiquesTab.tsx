"use client";

import { useState, useEffect } from "react";
import {
  FileText, AlertTriangle, Scale, BookOpen, Plus,
} from "lucide-react";
import { t } from "@/lib/i18n/legal";
import type { LegalUpdate } from "./types";
import { ACTION_LABELS, timeAgo } from "./helpers";

export function AlertesJuridiquesTab({ locale }: { locale: string }) {
  const [updates, setUpdates] = useState<LegalUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/legal/updates");
        const d = await res.json();
        setUpdates(d.updates || []);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)" }} />
      </div>
    );
  }

  if (!updates.length) {
    return (
      <div className="space-y-4">
        <p className="text-xs" style={{ color: "var(--color-ink-secondary)" }}>
          Les alertes juridiques seront alimentées automatiquement par le second cerveau.
          Voici les sujets suivis pour le moment :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: FileText,
              title: "CGU OnlyFans 2026",
              desc: "Mise à jour des conditions générales d'utilisation, section propriété du contenu",
              tag: "CGU",
              color: "var(--accent)",
            },
            {
              icon: Scale,
              title: "Loi française, Droits des créateurs",
              desc: "Proposition de loi visant à renforcer la protection des travailleurs de plateformes",
              tag: "Législation",
              color: "#3b82f6",
            },
            {
              icon: AlertTriangle,
              title: "Décision de justice, Clause de non-concurrence",
              desc: "Tribunal de commerce : clause de non-concurrence sans compensation annulée",
              tag: "Jurisprudence",
              color: "#eab308",
            },
            {
              icon: BookOpen,
              title: "Règlement européen, Transparence algorithmique",
              desc: "Nouvelles obligations pour les plateformes concernant la recommandation de contenu",
              tag: "UE",
              color: "#22c55e",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="rounded-lg p-4"
                style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                      <span
                        className="text-[9px] font-semibold px-1 py-px rounded"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--color-ink-secondary)" }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((u) => (
        <div
          key={u.id}
          className="rounded-lg p-4 flex items-start gap-3"
          style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
            {u.action === "clause_added" ? <Plus size={14} style={{ color: "var(--accent)" }} /> :
             u.action === "cgu_scraped" ? <FileText size={14} style={{ color: "#3b82f6" }} /> :
             <AlertTriangle size={14} style={{ color: "#eab308" }} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {ACTION_LABELS[u.action] || u.action}
              </span>
              <span className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
                {timeAgo(u.created_at)}
              </span>
              {!u.reviewed_by_admin && (
                <span
                  className="text-[9px] font-semibold px-1 py-px rounded"
                  style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#eab308" }}
                >
                  {t("atlas.pending", locale)}
                </span>
              )}
            </div>
            {u.details?.clause_label && (
              <p className="text-xs mt-1" style={{ color: "var(--color-ink-secondary)" }}>
                {u.details.clause_label}
                {u.details.platform && <span className="opacity-60">, {u.details.platform}</span>}
              </p>
            )}
            {u.details?.clause_description && (
              <p className="text-xs mt-0.5 opacity-60" style={{ color: "var(--color-ink-secondary)" }}>
                {u.details.clause_description}
              </p>
            )}
            <p className="text-[10px] mt-1.5" style={{ color: "var(--color-ink-tertiary)" }}>
              {u.items_affected > 0 && `${u.items_affected} élément(s) affecté(s) · `}
              {t("atlas.source", locale).replace("{source}", u.source)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
