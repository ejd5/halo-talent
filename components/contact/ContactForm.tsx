"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!name || name.length < 2) {
      setFieldErrors((prev) => ({ ...prev, name: "Nom requis" }));
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors((prev) => ({ ...prev, email: "Email valide requis" }));
      return;
    }
    if (!subject || subject.length < 3) {
      setFieldErrors((prev) => ({ ...prev, subject: "Sujet requis" }));
      return;
    }
    if (!message || message.length < 10) {
      setFieldErrors((prev) => ({ ...prev, message: "Message trop court (10 caractères minimum)" }));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          profile: profile || undefined,
          subject,
          message,
          consent_contact: consent,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        setError(d.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "var(--color-success)" }} />
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: "var(--color-dark-text)" }}>
          Message envoyé
        </h3>
        <p style={{ color: "rgba(245, 240, 235, 0.55)" }}>
          Merci pour votre message. Nous vous répondrons dans les 48h ouvrées.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="name"
          label="Nom"
          placeholder="Votre nom"
          theme="dark"
          value={name}
          onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
          error={fieldErrors.name}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="vous@email.com"
          theme="dark"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
          error={fieldErrors.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="profile"
          label="Profil (optionnel)"
          placeholder="Créateur, Agence, Partenaire..."
          theme="dark"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
        />
        <Input
          id="subject"
          label="Sujet"
          placeholder="De quoi voulez-vous parler ?"
          theme="dark"
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setFieldErrors((p) => ({ ...p, subject: "" })); }}
          error={fieldErrors.subject}
        />
      </div>

      <Textarea
        id="message"
        label="Message"
        placeholder="Votre message..."
        theme="dark"
        value={message}
        onChange={(e) => { setMessage(e.target.value); setFieldErrors((p) => ({ ...p, message: "" })); }}
        error={fieldErrors.message}
      />

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-[var(--or, #D8A95B)]"
        />
        <span className="text-xs leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.5)" }}>
          J'accepte d'être contacté(e) en réponse à ce message. Vos données ne seront pas utilisées à d'autres fins.
        </span>
      </label>

      {error && (
        <p className="text-sm" style={{ color: "#C44536" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
        style={{
          background: "var(--color-accent)",
          color: "#F5F0EB",
        }}
      >
        {submitting ? "Envoi..." : (
          <>
            Envoyer le message
            <Send size={14} />
          </>
        )}
      </button>
    </form>
  );
}
