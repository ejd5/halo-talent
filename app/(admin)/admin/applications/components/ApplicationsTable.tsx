"use client";

import { useState } from "react";
import type { Application } from "../types";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Clock,
  MonitorPlay,
  Camera,
  Music2,
  Globe,
  ExternalLink,
  Briefcase,
  Film,
  Gamepad2,
} from "lucide-react";
import { relativeTime } from "../utils";

type Props = {
  applications: Application[];
  onSelect: (app: Application) => void;
  selectedId: string | null;
  onToggleFilters: () => void;
};

const platformIcon: Record<string, React.ElementType> = {
  YouTube: MonitorPlay,
  Instagram: Camera,
  TikTok: Music2,
  OnlyFans: Globe,
  Twitter: ExternalLink,
  LinkedIn: Briefcase,
  Snapchat: Film,
  Twitch: Gamepad2,
};

const statusStyles: Record<string, { bg: string; fg: string; label: string }> = {
  pending: { bg: "rgba(199,91,57,0.12)", fg: "#C75B39", label: "En attente" },
  review: { bg: "rgba(122,154,101,0.12)", fg: "#7A9A65", label: "En review" },
  approved: { bg: "rgba(122,154,101,0.15)", fg: "#7A9A65", label: "Approuvée" },
  rejected: { bg: "rgba(196,69,54,0.12)", fg: "#C44536", label: "Refusée" },
};

function scoreColor(score: number): string {
  if (score >= 80) return "#7A9A65";
  if (score >= 60) return "#C75B39";
  if (score >= 40) return "#E0D8D0";
  return "#C44536";
}

export function ApplicationsTable({
  applications,
  onSelect,
  selectedId,
  onToggleFilters,
}: Props) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = search.trim()
    ? applications.filter(
        (a) =>
          a.full_name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase()) ||
          a.department.toLowerCase().includes(search.toLowerCase())
      )
    : applications;

  return (
    <div>
      {/* Search bar */}
      <div
        className="flex items-center gap-3 px-4 mb-4 card-accent"
        style={{
          background: "#1A1614",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Search size={15} strokeWidth={1.5} style={{ color: "#E0D8D0" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email ou département..."
          className="flex-1 bg-transparent text-sm font-sans py-3 outline-none"
          style={{ color: "#F5F0EB" }}
        />
        <button
          onClick={onToggleFilters}
          className="p-1.5 transition-colors hover:bg-white/5"
          style={{ color: "#F5F0EB" }}
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto card-accent"
        style={{
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <table className="w-full text-left">
          <thead>
            <tr
              className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em]"
              style={{
                color: "#E0D8D0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Candidat</th>
              <th className="py-3 px-4 font-medium">Département</th>
              <th className="py-3 px-4 font-medium">Plateformes</th>
              <th className="py-3 px-4 font-medium">Revenus</th>
              <th className="py-3 px-4 font-medium">Score IA</th>
              <th className="py-3 px-4 font-medium">Statut</th>
              <th className="py-3 px-4 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm font-sans"
                  style={{ color: "#E0D8D0" }}
                >
                  Aucune candidature trouvée
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const st = statusStyles[app.status];
                return (
                  <tr
                    key={app.id}
                    onClick={() => onSelect(app)}
                    className="cursor-pointer transition-colors"
                    style={{
                      background:
                        selectedId === app.id
                          ? "rgba(199,91,57,0.06)"
                          : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedId !== app.id)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedId !== app.id)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} strokeWidth={1.5} style={{ color: "#E0D8D0" }} />
                        <span className="text-xs font-sans" style={{ color: "#F5F0EB" }}>
                          {relativeTime(app.created_at)}
                        </span>
                      </div>
                    </td>

                    {/* Candidat */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 flex items-center justify-center text-xs font-sans font-semibold shrink-0"
                          style={{
                            background: "rgba(199,91,57,0.15)",
                            color: "#C75B39",
                          }}
                        >
                          {app.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-sans font-medium" style={{ color: "#F5F0EB" }}>
                            {app.full_name}
                          </p>
                          <p className="text-[11px] font-sans" style={{ color: "#E0D8D0" }}>
                            {app.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Département */}
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[11px] font-sans px-2 py-1"
                        style={{
                          background: "rgba(199,91,57,0.08)",
                          color: "#C75B39",
                        }}
                      >
                        {app.department}
                      </span>
                    </td>

                    {/* Plateformes */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {app.platforms.map((p) => {
                          const Icon = platformIcon[p] || Globe;
                          return (
                            <span
                              key={p}
                              className="flex items-center gap-1 text-[10px] font-sans"
                              style={{ color: "#F5F0EB" }}
                              title={p}
                            >
                              <Icon size={12} strokeWidth={1.5} />
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Revenus */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-sans" style={{ color: "#D0CCC6" }}>
                        {app.current_monthly_revenue}
                      </span>
                    </td>

                    {/* Score IA */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-16 h-1.5 rounded-none overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="h-full rounded-none transition-all"
                            style={{
                              width: `${app.ai_score}%`,
                              background: scoreColor(app.ai_score),
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-sans font-semibold tabular-nums"
                          style={{ color: scoreColor(app.ai_score) }}
                        >
                          {app.ai_score}
                        </span>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="py-3.5 px-4">
                      <span
                        className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] px-2 py-1"
                        style={{
                          background: st.bg,
                          color: st.fg,
                        }}
                      >
                        {st.label}
                      </span>
                    </td>

                    {/* Menu */}
                    <td className="py-3.5 px-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === app.id ? null : app.id);
                        }}
                        className="p-1 transition-colors hover:bg-white/5"
                        style={{ color: "#E0D8D0" }}
                      >
                        <MoreHorizontal size={14} strokeWidth={1.5} />
                      </button>
                      {menuOpen === app.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(null)}
                          />
                          <div
                            className="absolute right-0 top-full mt-1 w-40 py-1 z-50"
                            style={{
                              background: "#1A1614",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <button
                              onClick={() => {
                                setMenuOpen(null);
                                onSelect(app);
                              }}
                              className="block w-full text-left px-4 py-2 text-xs font-sans transition-colors hover:bg-white/5"
                              style={{ color: "#D0CCC6" }}
                            >
                              Voir le détail
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-xs font-sans transition-colors hover:bg-white/5"
                              style={{ color: "#C44536" }}
                            >
                              Refuser
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
