"use client";

import { useState, useEffect } from "react";
import { Bell, Loader } from "lucide-react";

interface PushOptInProps {
  creatorHandle: string;
  creatorName?: string;
  creatorId?: string;  // optionnel, pour envoyer à l'API
}

export default function PushOptIn({ creatorHandle, creatorName, creatorId }: PushOptInProps) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if push is supported
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setSupported(false);
      return;
    }

    // Check if already subscribed
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) setSubscribed(true);
    } catch {}
  }

  async function handleSubscribe() {
    setLoading(true);
    setError("");

    try {
      // 1. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Permission refusée");
        setLoading(false);
        return;
      }

      // 2. Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Wait for it to be active
      await navigator.serviceWorker.ready;

      // 3. Get VAPID public key
      // Fetch it from the server to keep the env var server-side
      let vapidKey: string;

      try {
        const keyRes = await fetch("/api/atlas/push/vapid-key");
        const keyData = await keyRes.json();
        vapidKey = keyData.publicKey;
      } catch {
        // Fallback: read from meta tag or env (for client-side builds)
        const metaKey = document.querySelector('meta[name="vapid-public-key"]')?.getAttribute("content");
        if (metaKey) {
          vapidKey = metaKey;
        } else {
          setError("Configuration manquante");
          setLoading(false);
          return;
        }
      }

      // 4. Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      // 5. Send to server
      const res = await fetch("/api/atlas/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_handle: creatorHandle,
          creator_id: creatorId,
          subscription: subscription.toJSON(),
          user_agent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur d'inscription");
      }

      setSubscribed(true);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-sm"
        style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        <Bell size={14} />
        <span>Notifications activées ✓</span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm transition-all hover:opacity-90 disabled:opacity-50 w-full justify-center"
        style={{ backgroundColor: "#C75B39", color: "#FFFFFF" }}
      >
        {loading ? (
          <Loader size={16} className="animate-spin" />
        ) : (
          <Bell size={16} />
        )}
        {loading ? "Activation..." : `🔔 Activer les notifications${creatorName ? ` de ${creatorName}` : ""}`}
      </button>
      {error && (
        <p className="text-xs mt-1.5" style={{ color: "#C44536" }}>{error}</p>
      )}
    </div>
  );
}
