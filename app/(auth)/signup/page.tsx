"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Shield, Eye, EyeOff, Check } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        setError("Un compte avec cet email existe déjà. Essayez de vous connecter.");
      } else if (authError.message.includes("password")) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "var(--creme)" }}>
        <div className="w-full max-w-md text-center">
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(216,169,91,0.1)", borderRadius: "50%" }}>
            <Check size={24} style={{ color: "var(--or)" }} />
          </div>
          <h1 className="text-[2rem] font-bold mb-4" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>
            Vérifiez votre email
          </h1>
          <p className="text-[0.95rem] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>
            Un email de confirmation a été envoyé à <strong style={{ color: "var(--encre)", opacity: 0.8 }}>{email}</strong>. Cliquez sur le lien dans l'email pour activer votre compte.
          </p>
          <p className="text-[12px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
            Vous avez déjà un compte&nbsp;?{" "}
            <Link href="/login" style={{ color: "var(--or)", fontWeight: 500 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--encre)" }}>
      <div className="hidden lg:flex w-1/2 relative" style={{ backgroundColor: "var(--encre)" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 max-w-md text-center">
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] mb-8" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
              Where Talent Forms
            </p>
            <blockquote className="text-[1.6rem] leading-tight" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}>
              «&nbsp;Un espace pensé pour structurer votre activité avec plus de clarté et de contrôle.&nbsp;»
            </blockquote>
            <div className="mt-10 flex items-center gap-3 justify-center text-[11px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
              <Shield size={12} style={{ color: "var(--or)" }} />
              Inscription sécurisée et chiffrée
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 text-[1.1rem] font-bold tracking-tight transition-colors duration-200 hover:opacity-80"
          style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
        >
          Where Talent Forms
        </Link>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16" style={{ backgroundColor: "var(--creme)" }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 text-center">
            <Link
              href="/"
              className="text-[1.1rem] font-bold tracking-tight"
              style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
            >
              Where Talent Forms
            </Link>
          </div>

          <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
            Accès
          </p>
          <h1 className="text-[2.2rem] md:text-[2.8rem] font-bold leading-[1.08] mb-3" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>
            Créer un accès WTF
          </h1>
          <p className="mb-10 text-[0.95rem] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>
            Un espace pensé pour structurer votre activité avec plus de clarté et de contrôle.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="vous@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                id="password"
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="6 caractères minimum"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] transition-colors duration-200"
                style={{ color: "var(--pierre)" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div className="p-3" style={{ borderLeft: "2px solid #C75B39", background: "rgba(199,91,57,0.04)" }}>
                <p className="text-[12px]" style={{ color: "#C75B39", fontFamily: "var(--font-body), sans-serif" }}>{error}</p>
              </div>
            )}

            <div className="pt-4">
              <Button
                variant="primary"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer mon accès"}
              </Button>
            </div>
          </form>

          <div className="mt-10 p-4" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
            <p className="text-[11px] leading-relaxed text-center" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>
              Vos identifiants sont transmis de manière chiffrée. Vous recevrez un email de confirmation pour activer votre compte. Nous ne partageons jamais vos données avec des tiers.
            </p>
          </div>

          <p className="mt-8 text-[12px] text-center" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>
            Déjà membre&nbsp;?{" "}
            <Link
              href="/login"
              className="font-medium transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--or)" }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
