"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { manifestoData as initialData } from "../../data";
import type { Manifesto, LangCode } from "../../types";
import { LANGUAGES } from "../../types";
import { TextEditor } from "../../pages/components/TextEditor";

export function ManifestoEditor() {
  const [data, setData] = useState<Manifesto>(initialData);
  const [lang, setLang] = useState<LangCode>("fr");
  const [saved, setSaved] = useState(false);

  const contentKey = `content_${lang}` as keyof Manifesto;

  const addCommitment = () => {
    setData((prev) => ({
      ...prev,
      commitments: [...prev.commitments, { text_fr: "", text_en: "", text_es: "" }],
    }));
  };

  const removeCommitment = (i: number) => {
    setData((prev) => ({ ...prev, commitments: prev.commitments.filter((_, idx) => idx !== i) }));
  };

  const updateCommitment = (i: number, val: string) => {
    setData((prev) => {
      const next = [...prev.commitments];
      next[i] = { ...next[i], [`text_${lang}`]: val };
      return { ...prev, commitments: next };
    });
  };

  const handleSave = () => {
    setData((prev) => ({ ...prev, updated_at: new Date().toISOString() }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-3xl card-accent">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Manifeste</h1>
          <p className="text-xs opacity-40 mt-0.5">Dernière modification : {new Date(data.updated_at).toLocaleDateString("fr-FR")}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <div className="flex border border-[var(--color-border)] divide-x divide-[var(--color-border)]">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`px-3 py-1 text-[11px] font-medium transition-colors ${lang === l.key ? "bg-[var(--color-accent)] text-white" : "hover:bg-[var(--color-card)]"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
          >
            <Save size={12} />
            {saved ? "Enregistré !" : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1.5 block">
            Texte du manifeste ({lang.toUpperCase()})
          </label>
          <TextEditor
            value={data[contentKey] as string}
            onChange={(v) => setData((prev) => ({ ...prev, [contentKey]: v }))}
            minHeight={300}
            placeholder="Écrivez le manifeste..."
          />
        </div>

        {/* Commitments */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider opacity-40">
              Engagements ({data.commitments.length})
            </h3>
            <button onClick={addCommitment} className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors">
              <Plus size={10} /> Ajouter un engagement
            </button>
          </div>
          <div className="space-y-1.5">
            {data.commitments.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-mono opacity-20 w-5">#{i + 1}</span>
                <input
                  type="text"
                  value={(c as Record<string, string>)[`text_${lang}`]}
                  onChange={(e) => updateCommitment(i, e.target.value)}
                  placeholder={`Engagement en ${lang.toUpperCase()}...`}
                  className="flex-1 p-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px]"
                />
                <button onClick={() => removeCommitment(i)} className="p-1 hover:opacity-60 transition-opacity">
                  <Trash2 size={12} className="opacity-30" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Founder */}
        <div className="grid grid-cols-2 gap-4 border border-[var(--color-border)] p-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Nom du fondateur</label>
            <input
              type="text" value={data.founder_name}
              onChange={(e) => setData((prev) => ({ ...prev, founder_name: e.target.value }))}
              className="w-full p-2 text-sm border border-[var(--color-border)] bg-transparent rounded-[0px]"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-1 block">Signature / Titre</label>
            <input
              type="text" value={data.founder_signature}
              onChange={(e) => setData((prev) => ({ ...prev, founder_signature: e.target.value }))}
              className="w-full p-2 text-sm border border-[var(--color-border)] bg-transparent rounded-[0px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
