"use client";
import { FileSignature, Download, Eye } from "lucide-react";

const contracts = [
  { name: "Contrat d'exclusivité", status: "Signé", date: "15 mars 2024", type: "Principal" },
  { name: "Avenant commission Q2", status: "Signé", date: "1 juin 2025", type: "Avenant" },
  { name: "Contrat marque X", status: "En attente", date: "-", type: "Partenariat" },
];

export default function ContractsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes contrats</h1>
        <p className="text-xs opacity-40 mt-1">Consultez et gérez vos documents contractuels</p>
      </div>
      <div className="border border-[var(--color-border)]">
        <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)]">
          <div>Contrat</div><div>Type</div><div>Date</div><div>Actions</div>
        </div>
        {contracts.map((c) => (
          <div key={c.name} className="grid grid-cols-[1fr_100px_120px_100px] gap-4 px-4 py-3 items-center border-b border-[var(--color-border)] last:border-b-0 text-xs">
            <div>
              <div className="font-medium">{c.name}</div>
              <span className={`text-[10px] font-medium ${c.status === "Signé" ? "text-[#7A9A65]" : "text-[#C7A254]"}`}>{c.status}</span>
            </div>
            <div className="text-[11px] opacity-40">{c.type}</div>
            <div className="text-[11px] opacity-40">{c.date}</div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:opacity-60"><Eye size={12} /></button>
              <button className="p-1 hover:opacity-60"><Download size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
