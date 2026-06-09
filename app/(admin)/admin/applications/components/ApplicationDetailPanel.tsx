"use client";

import { useState } from "react";
import type { Application, ApplicationStatus } from "../types";
import { X, Clock, CheckCircle, XCircle, Send } from "lucide-react";
import { relativeTime, formatDate } from "../utils";
import { ProfileTab } from "./tabs/ProfileTab";
import { ResponsesTab } from "./tabs/ResponsesTab";
import { PlatformsTab } from "./tabs/PlatformsTab";
import { AIScoreTab } from "./tabs/AIScoreTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { NotesTab } from "./tabs/NotesTab";
import { ApproveModal } from "./ApproveModal";
import { RejectModal } from "./RejectModal";

type Props = {
  application: Application;
  onClose: () => void;
  onStatusUpdate: (id: string, status: ApplicationStatus) => void;
};

const tabs = [
  { key: "profile", label: "Profil" },
  { key: "responses", label: "Réponses" },
  { key: "platforms", label: "Plateformes" },
  { key: "ai", label: "Évaluation IA" },
  { key: "history", label: "Historique" },
  { key: "notes", label: "Notes" },
];

const statusStyles: Record<string, { bg: string; fg: string; label: string }> = {
  pending: { bg: "rgba(199,91,57,0.12)", fg: "#C75B39", label: "En attente" },
  review: { bg: "rgba(122,154,101,0.12)", fg: "#7A9A65", label: "En review" },
  approved: { bg: "rgba(122,154,101,0.15)", fg: "#7A9A65", label: "Approuvée" },
  rejected: { bg: "rgba(196,69,54,0.12)", fg: "#C44536", label: "Refusée" },
};

export function ApplicationDetailPanel({ application, onClose, onStatusUpdate }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const app = application;
  const st = statusStyles[app.status];
  const isFinalized = app.status === "approved" || app.status === "rejected";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-screen z-50 flex flex-col shadow-2xl card-accent"
        style={{
          width: 600,
          background: "#0F0D0B",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between shrink-0 px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 flex items-center justify-center text-base font-sans font-bold shrink-0"
              style={{ background: "rgba(199,91,57,0.15)", color: "#C75B39" }}
            >
              {app.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold" style={{ color: "#F5F0EB" }}>
                {app.full_name}
              </h2>
              <p className="text-xs font-sans mt-0.5" style={{ color: "#F5F0EB" }}>
                {app.email}
                {app.phone && ` · ${app.phone}`}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5"
                  style={{ background: st.bg, color: st.fg }}
                >
                  {st.label}
                </span>
                <span className="text-[10px] font-sans" style={{ color: "#E0D8D0" }}>
                  <Clock size={10} strokeWidth={1.5} className="inline mr-1" />
                  {relativeTime(app.created_at)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 transition-colors hover:bg-white/5"
            style={{ color: "#E0D8D0" }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-0 shrink-0 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="px-4 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.08em] whitespace-nowrap transition-colors"
              style={{
                color: activeTab === t.key ? "#C75B39" : "#F5F0EB",
                borderBottom: activeTab === t.key ? "2px solid #C75B39" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "profile" && <ProfileTab application={app} />}
          {activeTab === "responses" && <ResponsesTab application={app} />}
          {activeTab === "platforms" && <PlatformsTab application={app} />}
          {activeTab === "ai" && <AIScoreTab application={app} />}
          {activeTab === "history" && <HistoryTab applicationId={app.id} />}
          {activeTab === "notes" && <NotesTab applicationId={app.id} />}
        </div>

        {/* Footer actions */}
        {!isFinalized && (
          <div
            className="flex items-center gap-3 shrink-0 px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => onStatusUpdate(app.id, "review")}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
              style={{ color: "#E0D8D0", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Clock size={14} strokeWidth={1.5} />
              Mettre en review
            </button>

            <button
              onClick={() => setShowApprove(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-90"
              style={{ background: "#C75B39", color: "#F5F0EB" }}
            >
              <CheckCircle size={14} strokeWidth={1.5} />
              Approuver
            </button>

            <button
              onClick={() => setShowReject(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
              style={{ color: "#C44536", border: "1px solid rgba(196,69,54,0.3)" }}
            >
              <XCircle size={14} strokeWidth={1.5} />
              Refuser
            </button>
          </div>
        )}

        {isFinalized && app.status === "approved" && (
          <div
            className="flex items-center gap-2 shrink-0 px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(122,154,101,0.05)" }}
          >
            <CheckCircle size={14} strokeWidth={1.5} style={{ color: "#7A9A65" }} />
            <span className="text-xs font-sans" style={{ color: "#7A9A65" }}>
              Approuvée — Contrat envoyé le {formatDate(app.created_at)}
            </span>
          </div>
        )}
      </div>

      {/* Modals */}
      {showApprove && (
        <ApproveModal
          application={app}
          onClose={() => setShowApprove(false)}
          onApproved={() => {
            onStatusUpdate(app.id, "approved");
            setShowApprove(false);
          }}
        />
      )}
      {showReject && (
        <RejectModal
          application={app}
          onClose={() => setShowReject(false)}
          onRejected={() => {
            onStatusUpdate(app.id, "rejected");
            setShowReject(false);
          }}
        />
      )}
    </>
  );
}
