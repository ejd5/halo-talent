"use client";

import { useState, useEffect } from "react";
import { BookmarkCheck, Plus, Trash2, Loader, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import type { WatchlistEntry } from "@/lib/trends/types";

export default function WatchlistPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [keyword, setKeyword] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/dashboard/trends/watchlist");
      const d = await res.json();
      setEntries(d.watchlist ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addEntry() {
    if (!keyword.trim()) return;
    try {
      await fetch("/api/dashboard/trends/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
      setKeyword("");
      setShowAdd(false);
      load();
    } catch {}
  }

  async function removeEntry(id: string) {
    try {
      await fetch("/api/dashboard/trends/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      load();
    } catch {}
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.2)" }} />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Ma watchlist
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            {entries.length}/10 mots-clés surveillés (Premium)
          </p>
        </div>
        {entries.length < 10 && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium"
            style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
          >
            <Plus size={12} /> Ajouter
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <BookmarkCheck size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
            Aucun mot-clé surveillé
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
            Ajoutez des mots-clés depuis la vue d'ensemble des tendances
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 text-xs px-4 py-2 font-medium"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            Surveiller mon premier mot-clé
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 px-4 py-3 transition-colors"
              style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
                <Globe size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{entry.keyword}</p>
                <div className="flex items-center gap-2 text-[10px] mt-0.5">
                  {entry.sources.map((s) => (
                    <span key={s} style={{ color: "rgba(245,240,235,0.25)" }}>{s}</span>
                  ))}
                  <span style={{ color: "rgba(245,240,235,0.15)" }}>·</span>
                  <span style={{ color: "rgba(245,240,235,0.25)" }}>{entry.geo_filter}</span>
                  {entry.last_value !== null && (
                    <>
                      <span style={{ color: "rgba(245,240,235,0.15)" }}>·</span>
                      <span style={{ color: "var(--accent)" }}>Score: {entry.last_value}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeEntry(entry.id)}
                className="p-1.5 transition-all hover:opacity-70"
                style={{ color: "rgba(245,240,235,0.15)" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-sm p-4" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.1)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Nouveau mot-clé
            </h3>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
              placeholder="Mot-clé à surveiller..."
              className="w-full px-3 py-2 text-sm mb-3 bg-transparent border"
              style={{ borderColor: "rgba(245,240,235,0.1)", color: "var(--text-primary)" }}
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="text-xs px-3 py-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>
                Annuler
              </button>
              <button onClick={addEntry} className="text-xs px-3 py-1.5 font-medium" style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
