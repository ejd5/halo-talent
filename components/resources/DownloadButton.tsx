"use client";

import React from "react";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  title: string;
}

export function DownloadButton({ title }: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={() => alert(`Téléchargement initié pour : ${title}.`)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 16px",
        border: "1px solid #D8A95B",
        background: "transparent",
        color: "#D8A95B",
        fontFamily: "Space Grotesk, monospace",
        fontSize: 11,
        textTransform: "uppercase",
        cursor: "pointer",
        borderRadius: 2,
        width: "100%"
      }}
    >
      Télécharger
      <Download size={12} />
    </button>
  );
}
