"use client";

// ─── Media Kit — utilities ───

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toString();
}

export function generateShareUrl(pseudo: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/mediakit/${pseudo}`;
}
