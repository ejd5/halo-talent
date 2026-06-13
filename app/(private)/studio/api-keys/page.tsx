"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Eye, EyeOff, Check, X, Loader, RefreshCw, Shield, Info } from "lucide-react";

interface ProviderStatus {
  id: string;
  label: string;
  has_key: boolean;
  enabled: boolean;
  key_preview: string | null;
}

export default function ApiKeysPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [byokEnabled, setByokEnabled] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyValues, setKeyValues] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; error?: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    setLoading(true);
    try {
      const res = await fetch("/api/studio/api-keys");
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers);
        setByokEnabled(data.byok_enabled_for ?? []);
        // Initialize empty key values
        const kv: Record<string, string> = {};
        data.providers.forEach((p: ProviderStatus) => { kv[p.id] = ""; });
        setKeyValues(kv);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, any> = {};
      providers.forEach((p) => {
        if (keyValues[p.id]) {
          payload[p.id] = keyValues[p.id];
        }
      });
      payload.byok_enabled_for = byokEnabled;

      const res = await fetch("/api/studio/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchKeys();
      } else {
        const d = await res.json();
        setError(d.error || "Erreur de sauvegarde");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(providerId: string) {
    const keyValue = keyValues[providerId];
    if (!keyValue) return;

    setTestingKey(providerId);
    setTestResults((prev) => ({ ...prev, [providerId]: undefined as any }));
    try {
      const res = await fetch("/api/studio/api-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_key: providerId, key_value: keyValue }),
      });
      const data = await res.json();
      setTestResults((prev) => ({ ...prev, [providerId]: data }));
    } catch {
      setTestResults((prev) => ({ ...prev, [providerId]: { success: false, error: "Erreur réseau" } }));
    } finally {
      setTestingKey(null);
    }
  }

  function toggleByok(providerId: string) {
    const providerName = providerId.replace("_key", "");
    setByokEnabled((prev) =>
      prev.includes(providerName)
        ? prev.filter((p) => p !== providerName)
        : [...prev, providerName]
    );
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
        <Loader size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/studio" className="p-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-lg italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>BYOK, Clés API</h1>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-sm text-[10px]" style={{ background: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
          <Info size={14} style={{ color: "var(--accent)", marginTop: 1 }} />
          <div>
            <p className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>C'est quoi le BYOK ?</p>
            <p className="mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Bring Your Own Key, tu utilises tes propres clés API des fournisseurs d'IA.
              Quand le BYOK est activé pour une catégorie, tes crédits WTF ne sont PAS déduits.
              Tu paies directement le fournisseur (Anthropic, Replicate, etc.).
              Idéal si tu as déjà un abonnement chez eux ou si tu génères beaucoup.
            </p>
          </div>
        </div>

        {/* Provider cards */}
        <div className="space-y-2">
          {providers.map((provider) => {
            const providerName = provider.id.replace("_key", "");
            const isEnabled = byokEnabled.includes(providerName);
            const testResult = testResults[provider.id];
            const hasValue = !!keyValues[provider.id];

            return (
              <div key={provider.id} className="p-4 border rounded-sm" style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--bg-card)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ background: isEnabled ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)" }}>
                      <KeyRound size={14} style={{ color: isEnabled ? "var(--success)" : "rgba(255,255,255,0.2)" }} />
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{provider.label}</span>
                      {provider.has_key && provider.key_preview && (
                        <span className="text-[9px] ml-2 font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>{provider.key_preview}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${isEnabled ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>
                    {isEnabled ? "BYOK actif" : "Crédits WTF"}
                  </span>
                </div>

                {/* Key input */}
                <div className="flex gap-1.5 mb-2">
                  <div className="relative flex-1">
                    <input
                      type={visibleKeys[provider.id] ? "text" : "password"}
                      value={keyValues[provider.id]}
                      onChange={(e) => setKeyValues((prev) => ({ ...prev, [provider.id]: e.target.value }))}
                      placeholder={provider.has_key ? "Changer la clé..." : `sk-... (clé ${provider.label})`}
                      className="w-full text-[10px] bg-transparent px-2.5 py-1.5 pr-8 rounded-sm outline-none"
                      style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                      autoComplete="off"
                    />
                    <button
                      onClick={() => setVisibleKeys((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {visibleKeys[provider.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>

                  {hasValue && (
                    <>
                      <button
                        onClick={() => handleTest(provider.id)}
                        disabled={testingKey === provider.id}
                        className="flex items-center gap-1 px-2 py-1 text-[9px] rounded-sm transition-colors hover:bg-white/5 disabled:opacity-30"
                        style={{ border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.5)" }}
                      >
                        {testingKey === provider.id ? <Loader size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                        Tester
                      </button>
                    </>
                  )}
                </div>

                {/* Test result */}
                {testResult && (
                  <div className={`flex items-center gap-1.5 text-[9px] mb-2 px-2 py-1 rounded-sm ${testResult.success ? "bg-green-500/5 text-green-400" : "bg-red-500/5 text-red-400"}`}>
                    {testResult.success ? (
                      <><Check size={10} /> Clé valide</>
                    ) : (
                      <><X size={10} /> {testResult.error || "Clé invalide"}</>
                    )}
                  </div>
                )}

                {/* Toggle BYOK */}
                {hasValue && (
                  <button
                    onClick={() => toggleByok(provider.id)}
                    className="flex items-center gap-1.5 text-[9px] transition-opacity hover:opacity-70"
                    style={{ color: isEnabled ? "var(--success)" : "rgba(255,255,255,0.3)" }}
                  >
                    <Shield size={10} />
                    {isEnabled
                      ? "BYOK activé, tes crédits WTF ne sont pas déduits"
                      : "Activer BYOK pour utiliser ta clé (pas de déduction de crédits)"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="px-3 py-2 text-xs rounded-sm" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}>
            {error}
          </div>
        )}

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            {saving ? <Loader size={12} className="animate-spin" /> : <KeyRound size={12} />}
            {saving ? "Sauvegarde..." : "Sauvegarder les clés"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--success)" }}>
              <Check size={10} /> Sauvegardé
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
