"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Users, RefreshCw, Download, ExternalLink } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string | null;
  type: string;
  rules: any[];
  member_count: number;
  last_calculated_at: string | null;
  created_at: string;
}

interface Fan {
  id: string;
  display_name: string | null;
  email: string | null;
  username_onlyfans: string | null;
  total_spent: number;
  fan_tier: string;
  fan_score: number;
  language: string | null;
  country: string | null;
  last_interaction_at: string | null;
}

export default function SegmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [members, setMembers] = useState<Fan[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/sovereign-chat/segments?id=${id}`).then((r) => r.json()),
      fetch(`/api/sovereign-chat/segments/members?segment_id=${id}`).then((r) => r.json()),
    ]).then(([segData, memData]) => {
      setSegment(segData.segment || null);
      setMembers(memData.members || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const res = await fetch("/api/sovereign-chat/segments/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment_id: id }),
      });
      const data = await res.json();
      const memRes = await fetch(`/api/sovereign-chat/segments/members?segment_id=${id}`);
      const memData = await memRes.json();
      setMembers(memData.members || []);
      setSegment((prev) => prev ? { ...prev, member_count: data.total, last_calculated_at: new Date().toISOString() } : prev);
    } catch {} finally {
      setRecalculating(false);
    }
  };

  const exportCSV = () => {
    const csv = [
      "email,display_name,username_onlyfans,total_spent,fan_tier,fan_score,language,country,last_interaction_at",
      ...members.map((f) =>
        [
          f.email || "", f.display_name || "", f.username_onlyfans || "",
          f.total_spent || 0, f.fan_tier || "", f.fan_score || 0,
          f.language || "", f.country || "", f.last_interaction_at || "",
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${segment?.name?.replace(/\s+/g, "_") || "segment"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sovereign-chat/segments" className="transition-all hover:opacity-70">
            <ArrowLeft size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
                {loading ? "..." : segment?.name || "Introuvable"}
              </h1>
              {segment && (
                <span
                  className="text-[8px] px-1.5 py-0.5 uppercase tracking-wider"
                  style={{
                    backgroundColor: segment.type === "smart" ? "rgba(122,154,101,0.1)" : "rgba(199,91,57,0.1)",
                    color: segment.type === "smart" ? "#7A9A65" : "#C75B39",
                  }}
                >
                  {segment.type === "smart" ? "Smart" : "Static"}
                </span>
              )}
            </div>
            {segment?.description && (
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{segment.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {segment?.type === "smart" && (
            <button
              onClick={handleRecalculate}
              disabled={recalculating}
              className="text-[10px] font-medium py-2 px-3 transition-all hover:opacity-80 flex items-center gap-1.5 disabled:opacity-30"
              style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
            >
              <RefreshCw size={10} className={recalculating ? "animate-spin" : ""} />
              Recalculer
            </button>
          )}
          <button
            onClick={exportCSV}
            className="text-[10px] font-medium py-2 px-3 transition-all hover:opacity-80 flex items-center gap-1.5"
            style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
          >
            <Download size={10} />
            Exporter CSV
          </button>
          <Link
            href={`/dashboard/sovereign-chat/segments/${id}/edit`}
            className="text-[10px] font-semibold py-2 px-3 transition-all hover:opacity-80"
            style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
          >
            Éditer
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-12 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>}

      {/* Segment not found */}
      {!loading && !segment && (
        <div className="p-8 text-center">
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>Segment introuvable</p>
        </div>
      )}

      {/* Rules summary */}
      {segment && (
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
          <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>Règles</p>
          {segment.rules.length === 0 ? (
            <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>Aucune règle (tous les fans)</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {segment.rules.map((rule: any, i: number) => (
                <span key={i} className="text-[9px] px-2 py-1" style={{ backgroundColor: "rgba(199,91,57,0.08)", color: "#C75B39" }}>
                  {rule.field} {rule.operator} {typeof rule.value === "string" && rule.value.startsWith("now-") ? `${rule.value.replace("now-", "")}` : JSON.stringify(rule.value)}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-2 text-[8px]" style={{ color: "rgba(245,240,235,0.15)" }}>
            <span>Créé le {new Date(segment.created_at).toLocaleDateString("fr-FR")}</span>
            {segment.last_calculated_at && <span>Dernier calcul : {new Date(segment.last_calculated_at).toLocaleDateString("fr-FR")}</span>}
            <span>{members.length} membres</span>
          </div>
        </div>
      )}

      {/* Members list */}
      {segment && (
        <div>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "#F5F0EB" }}>
            Membres ({members.length})
          </h2>

          {members.length === 0 ? (
            <div className="p-6 text-center" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <Users size={16} className="mx-auto mb-1" style={{ color: "rgba(245,240,235,0.15)" }} />
              <p className="text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>Aucun membre ne correspond à ce segment pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {members.map((fan) => (
                <div
                  key={fan.id}
                  className="flex items-center justify-between p-2.5"
                  style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 flex items-center justify-center text-[9px] font-medium shrink-0"
                      style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}
                    >
                      {(fan.display_name || fan.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium truncate" style={{ color: "#F5F0EB" }}>
                        {fan.display_name || fan.email || fan.username_onlyfans || "Anonyme"}
                      </p>
                      <p className="text-[8px] truncate" style={{ color: "rgba(245,240,235,0.2)" }}>
                        {fan.email && `${fan.email} · `}{fan.country} · {fan.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-[8px] px-1.5 py-0.5"
                      style={{
                        backgroundColor:
                          fan.fan_tier === "vip" ? "rgba(199,91,57,0.1)" :
                          fan.fan_tier === "whale" ? "rgba(122,154,101,0.1)" :
                          "rgba(245,240,235,0.04)",
                        color:
                          fan.fan_tier === "vip" ? "#C75B39" :
                          fan.fan_tier === "whale" ? "#7A9A65" :
                          "rgba(245,240,235,0.3)",
                      }}
                    >
                      {fan.fan_tier}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>{fan.total_spent}€</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
