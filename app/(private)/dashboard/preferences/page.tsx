"use client";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Préférences</h1>
        <p className="text-xs opacity-40 mt-1">Page en cours de construction</p>
      </div>
      <div className="p-12 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="text-center">
          <div className="text-xs opacity-20">Contenu à venir</div>
        </div>
      </div>
    </div>
  );
}
