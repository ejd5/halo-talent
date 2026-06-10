"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { DollarSign, Clock, Send, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RadarOpportunity } from "@/lib/mock/atlas-revenue-radar";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export interface OptimizerResult {
  price: number;
  message: string;
  timing: string;
}

export function PPVOptimizerModal({
  open,
  opportunity,
  onClose,
  onValidate,
}: {
  open: boolean;
  opportunity: RadarOpportunity | null;
  onClose: () => void;
  onValidate: (result: OptimizerResult) => void;
}) {
  const locale = useLocale();
  const l = norm(locale);

  const [price, setPrice] = useState(opportunity?.averageOrderValue || 20);
  const [message, setMessage] = useState(opportunity?.aiSuggestion || "");
  const [timing, setTiming] = useState("ce_soir");

  if (!opportunity) return null;

  const avgAccepted = opportunity.averageOrderValue;
  const minPrice = Math.max(5, Math.round(avgAccepted * 0.5));
  const maxPrice = Math.round(avgAccepted * 2);

  return (
    <Modal open={open} onClose={onClose} title={t("revenue_radar.optimizer_title", l)}>
      <div className="space-y-3" style={{ minWidth: 380, maxWidth: 480 }}>
        {/* Fan info */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div
            className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold rounded-full shrink-0"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {opportunity.fanName.charAt(0)}
          </div>
          <div>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              {opportunity.fanName}
            </p>
            <p style={{ color: "var(--text-tertiary)" }}>
              {opportunity.segment} · {t("revenue_radar.optimizer_avg_price", l)} : {avgAccepted}€
            </p>
          </div>
        </div>

        {/* Price slider */}
        <div>
          <label className="text-[10px] font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("revenue_radar.optimizer_rec_price", l)}
          </label>
          <div className="flex items-center gap-2">
            <DollarSign size={12} style={{ color: "var(--accent)" }} />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={5}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: "var(--accent)" }}
            />
            <span className="text-[13px] font-bold w-12 text-right" style={{ color: "var(--accent)" }}>
              {price}€
            </span>
          </div>
          <div className="flex justify-between text-[8px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            <span>{minPrice}€</span>
            <span>{t("revenue_radar.optimizer_rec_price", l)}</span>
            <span>{maxPrice}€</span>
          </div>
        </div>

        {/* Timing selector */}
        <div>
          <label className="text-[10px] font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("revenue_radar.optimizer_timing", l)}
          </label>
          <div className="flex gap-1">
            {["maintenant", "ce_soir", "cette_semaine"].map((tmg) => (
              <button
                key={tmg}
                onClick={() => setTiming(tmg)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded transition-colors flex-1 justify-center"
                style={{
                  backgroundColor: timing === tmg ? "var(--accent)" : "var(--bg-card)",
                  color: timing === tmg ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <Clock size={10} />
                {t(`revenue_radar.timing_${tmg}`, l)}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-[10px] font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
            {t("revenue_radar.optimizer_message", l)}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full resize-none text-[11px] leading-relaxed outline-none px-2.5 py-1.5"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              borderRadius: "6px",
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onValidate({ price, message, timing })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded transition-opacity flex-1 justify-center"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            <Send size={10} />
            {t("revenue_radar.optimizer_validate", l)}
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded flex-1 justify-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            <X size={10} />
            {t("revenue_radar.optimizer_cancel", l)}
          </button>
        </div>
      </div>
    </Modal>
  );
}
