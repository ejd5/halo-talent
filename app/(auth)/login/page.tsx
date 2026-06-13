"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez."
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

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
              «&nbsp;Retrouvez votre espace, vos outils et vos décisions au même endroit.&nbsp;»
            </blockquote>
            <div className="mt-10 flex items-center gap-3 justify-center text-[11px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
              <Shield size={12} style={{ color: "var(--or)" }} />
              Connexion sécurisée et chiffrée
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
            Se connecter à WTF
          </h1>
          <p className="mb-10 text-[0.95rem] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>
            Retrouvez votre espace, vos outils et vos décisions au même endroit.
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
                placeholder="••••••••"
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
                {loading ? "Connexion..." : "Continuer"}
              </Button>
            </div>
          </form>

          <div className="mt-10 p-4" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
            <p className="text-[11px] leading-relaxed text-center" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>
              Vos identifiants sont transmis de manière chiffrée. Nous ne partageons jamais vos données de connexion avec des tiers.
            </p>
          </div>

          <p className="mt-8 text-[12px] text-center" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>
            Pas encore membre&nbsp;?{" "}
            <Link
              href="/apply"
              className="font-medium transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--or)" }}
            >
              Postuler à la maison
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
