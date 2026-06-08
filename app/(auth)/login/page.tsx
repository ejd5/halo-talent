"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(authError.message === "Invalid login credentials"
        ? "Email ou mot de passe incorrect."
        : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* ─── GAUCHE : Image éditoriale ─── */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-black">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        {/* Placeholder image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 border border-white/5 flex items-center justify-center">
            <span className="text-brand-taupe text-xs uppercase tracking-[0.2em]">
              Image éditoriale
            </span>
          </div>
        </div>
        {/* Logo en haut */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 font-display text-2xl italic tracking-wide text-brand-ivory hover:text-brand-gold transition-colors"
        >
          Halo Talent
        </Link>
      </div>

      {/* ─── DROITE : Formulaire ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-brand-black px-8 md:px-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <Link
              href="/"
              className="font-display text-2xl italic tracking-wide text-brand-ivory"
            >
              Halo Talent
            </Link>
          </div>

          <h1 className="font-display text-4xl md:text-5xl italic text-brand-ivory mb-2">
            Connexion
          </h1>
          <p className="text-brand-taupe mb-10">
            à votre espace créateur
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="vous@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-sm text-brand-alert">{error}</p>
            )}

            <div className="pt-4">
              <Button
                variant="filled"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Continuer"}
              </Button>
            </div>
          </form>

          <p className="mt-12 text-sm text-brand-taupe text-center">
            Pas encore membre ?{" "}
            <Link
              href="/apply"
              className="text-brand-gold hover:underline"
            >
              Postuler à la maison
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
