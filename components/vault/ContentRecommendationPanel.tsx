"use client";

import { Rocket, DollarSign, Copy, Archive, AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ContentAsset, SmartLabel, SmartLabelType } from "@/lib/mock/content-vault";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const LABEL_DETAILS: Record<SmartLabelType, { icon: React.ElementType; description: string }> = {
  already_sent: { icon: Rocket, description: "Ce média a déjà été envoyé à des fans" },
  already_sold: { icon: DollarSign, description: "Ce média a déjà généré des ventes" },
  fatigue_risk: { icon: AlertTriangle, description: "Ce média a été utilisé récemment, alterner avec d'autres contenus" },
  reactivation_candidate: { icon: Rocket, description: "Ce média performant n'a pas été utilisé depuis longtemps" },
  vip_candidate: { icon: DollarSign, description: "Contenu premium à fort potentiel pour vos meilleurs fans" },
  rights_issue: { icon: AlertTriangle, description: "Problème de droits détecté, vérifier avant utilisation" },
  sensitive: { icon: AlertTriangle, description: "Contenu nécessitant une validation avant envoi" },
};

interface ContentRecommendationPanelProps {
  asset: ContentAsset;
  smartLabels: SmartLabel[];
  onAction: (action: string) => void;
  onClose: () => void;
}

export function ContentRecommendationPanel({ asset, smartLabels, onAction, onClose }: ContentRecommendationPanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  const canUseInCampaign = asset.rightsStatus === "validated" && asset.sensitivityLevel === "standard";

  return (
    <div className="space-y-4">
      {/* Smart labels */}
      {smartLabels.length > 0 && (
        <div>
          <p className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            {t("content_vault.reco.title", l)}
          </p>
          <div className="space-y-2">
            {smartLabels.map((label) => {
              const detail = LABEL_DETAILS[label.type];
              const Icon = detail?.icon || AlertTriangle;
              return (
                <div
                  key={label.type}
                  className="px-3 py-2 rounded-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                    <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {t(label.labelKey, l)}
                    </span>
                  </div>
                  <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {detail?.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-1.5">
        <ActionButton
          label={t("content_vault.reco.use_campaign", l)}
          icon={<Rocket size={12} />}
          disabled={!canUseInCampaign}
          onClick={() => onAction("campaign")}
          variant="primary"
          tooltip={!canUseInCampaign ? t("content_vault.action.blocked", l) : undefined}
        />
        <ActionButton
          label={t("content_vault.reco.use_ppv", l)}
          icon={<DollarSign size={12} />}
          disabled={!canUseInCampaign}
          onClick={() => onAction("ppv")}
          variant="primary"
          tooltip={!canUseInCampaign ? t("content_vault.action.blocked", l) : undefined}
        />
        <ActionButton
          label={t("content_vault.reco.create_variant", l)}
          icon={<Copy size={12} />}
          onClick={() => onAction("variant")}
          variant="secondary"
        />
        <ActionButton
          label={t("content_vault.reco.archive", l)}
          icon={<Archive size={12} />}
          onClick={() => {
            onAction("archive");
            onClose();
          }}
          variant="secondary"
        />
        {asset.sensitivityLevel === "standard" && (
          <ActionButton
            label={t("content_vault.reco.mark_sensitive", l)}
            icon={<AlertTriangle size={12} />}
            onClick={() => onAction("mark_sensitive")}
            variant="danger"
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  disabled,
  onClick,
  variant,
  tooltip,
}: {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: "primary" | "secondary" | "danger";
  tooltip?: string;
}) {
  const styles = {
    primary: { bg: "rgba(199,91,57,0.12)", color: "var(--accent)", border: "1px solid rgba(199,91,57,0.2)" },
    secondary: { bg: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" },
    danger: { bg: "rgba(229,72,77,0.1)", color: "var(--danger)", border: "1px solid rgba(229,72,77,0.15)" },
  };
  const s = styles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-[10px] font-medium transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ backgroundColor: s.bg, color: s.color, border: s.border }}
    >
      {icon}
      {label}
    </button>
  );
}
