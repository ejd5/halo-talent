"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Loader, Plus, Send } from "lucide-react";

interface Campaign { id: string; name: string; status: string; sent_count: number; created_at: string; }

export default function PushPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/atlas/campaigns?channel=push")
      .then((r) => r.json()).then((d) => setCampaigns(d.campaigns ?? [])).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Push notifications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-primary)" }}>{campaigns.length} campagne{campaigns.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/atlas/campaigns/new?channel=push"
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
          <Plus size={14} /> Nouvelle campagne
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Bell size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune campagne push</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>Crée ta première campagne push</p>
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
              <div>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.name}</span>
                <div className="text-xs mt-1" style={{ color: "var(--text-primary)" }}><Send size={10} className="inline mr-1" />{c.sent_count} envoyés</div>
              </div>
              <div className="text-xs" style={{ color: "var(--text-primary)" }}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
