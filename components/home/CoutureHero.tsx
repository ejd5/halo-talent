"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─── CONSTANTES ─────────────────────────────── */
const NAVBAR_H = 72; // hauteur navbar en px (doit correspondre au layout)
const TRANSITION_MS = 1400;
const CITIES = ["PARIS", "NEW YORK", "MILAN", "TOKYO"];

const SLIDE_A = {
  eyebrow: "Agence de talents, Fondée à Paris",
  lines: ["L'élégance", "est une", "stratégie."],
  sub: "Where Talent Forms élève votre image, structure votre carrière et ouvre les portes qui comptent.",
  ctas: [
    { href: "/demo",    label: "Rejoindre WTF →", variant: "fill"    },
    { href: "#about",   label: "Découvrir",          variant: "outline" },
  ],
};

const SLIDE_B = {
  eyebrow: "Pour les créateurs qui pensent grand",
  lines: ["Votre contenu", "est une force.", "Structurons-la", "ensemble."],
  sub: "Contrats clairs, commissions transparentes, protection proactive. Votre carrière mérite mieux qu'un accord verbal.",
  ctas: [
    { href: "/apply",   label: "Postuler →",         variant: "outline" },
    { href: "/demo",    label: "Voir la démo →",      variant: "fill"    },
  ],
};

const BOTTOM_LABELS_A = ["Sélection", "Stratégie", "Visibilité", "Croissance"];
const BOTTOM_LABELS_B = ["Management", "Protection", "Juridique", "Croissance"];

/* ─── STYLES PARTAGÉS (évite la répétition inline) ─── */
const TOKEN = {
  noir:     "#0A0806",
  encre:    "#0E0C0A",
  ivoire:   "#F4EFE7",
  or:       "#C8A66E",
  orPale:   "#D4B880",
  pierre:   "rgba(239,232,220,0.5)",
};

/* ═════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═════════════════════════════════════════════════════ */
export function CoutureHero() {
  const [current, setCurrent] = useState(0);   // 0 = slide A, 1 = slide B
  const [locked, setLocked]   = useState(false);
  const [progress, setProgress] = useState(0); // 0–100

  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const rafRef    = useRef<number>(0);
  const currentRef = useRef(0);
  const lockedRef  = useRef(false);

  /* Sync refs avec state pour les callbacks */
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { lockedRef.current  = locked;  }, [locked]);

  /* ─── Barre de progression ─── */
  const trackProgress = useCallback((vid: HTMLVideoElement) => {
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    const step = () => {
      if (vid.duration && !vid.paused) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  /* ─── Positions initiales des slides ─── */
  const applyPositions = useCallback((animated: boolean, toIndex: number) => {
    const dur = animated
      ? `transform ${TRANSITION_MS}ms cubic-bezier(0.77,0,0.18,1)`
      : "none";

    const s1 = slide1Ref.current;
    const s2 = slide2Ref.current;
    if (!s1 || !s2) return;

    s1.style.transition = dur;
    s2.style.transition = dur;

    if (toIndex === 0) {
      s1.style.transform = "translateX(0)";
      s2.style.transform = "translateX(100%)";
    } else {
      s1.style.transform = "translateX(-100%)";
      s2.style.transform = "translateX(0)";
    }
  }, []);

  /* ─── Transition bidirectionnelle ─── */
  const go = useCallback((toIndex: number) => {
    if (lockedRef.current || toIndex === currentRef.current) return;
    lockedRef.current = true;
    setLocked(true);

    const fromSlide = toIndex === 1 ? slide1Ref.current : slide2Ref.current;
    const toSlide   = toIndex === 1 ? slide2Ref.current : slide1Ref.current;
    const fromVid   = toIndex === 1 ? video1Ref.current : video2Ref.current;
    const toVid     = toIndex === 1 ? video2Ref.current : video1Ref.current;

    if (!fromSlide || !toSlide || !fromVid || !toVid) return;

    /* Préparer la vidéo entrante */
    toVid.currentTime = 0;
    toVid.play().catch(() => {});

    /* Fade sortant */
    fromSlide.style.opacity = "0";

    /* Slide + fade entrant */
    toSlide.style.transition = "none";
    toSlide.style.opacity = "0";
    toSlide.getBoundingClientRect(); // force reflow
    toSlide.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.77,0,0.18,1), opacity 0.7s ease`;
    toSlide.style.opacity = "1";

    /* Glissement */
    currentRef.current = toIndex;
    setCurrent(toIndex);
    applyPositions(true, toIndex);

    setTimeout(() => {
      fromVid.pause();
      if (fromSlide) {
        fromSlide.style.transition = "none";
        fromSlide.style.opacity = "1";
      }
      trackProgress(toVid);
      lockedRef.current = false;
      setLocked(false);
    }, TRANSITION_MS + 80);
  }, [applyPositions, trackProgress]);

  /* ─── Initialisation ─── */
  useEffect(() => {
    applyPositions(false, 0);

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    v1.play().catch(() => {});
    trackProgress(v1);

    const onV1End = () => { if (currentRef.current === 0 && !lockedRef.current) go(1); };
    const onV2End = () => { if (currentRef.current === 1 && !lockedRef.current) go(0); };

    v1.addEventListener("ended", onV1End);
    v2.addEventListener("ended", onV2End);

    return () => {
      cancelAnimationFrame(rafRef.current);
      v1.removeEventListener("ended", onV1End);
      v2.removeEventListener("ended", onV2End);
    };
  }, [applyPositions, trackProgress, go]);

  const labels = current === 0 ? BOTTOM_LABELS_A : BOTTOM_LABELS_B;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: TOKEN.noir }}
    >
      {/* ══════════════════════════════════════════════
          SLIDE A, Texte GAUCHE · Vidéo DROITE
          ══════════════════════════════════════════════ */}
      <div
        ref={slide1Ref}
        className="absolute inset-0 flex"
        style={{ willChange: "transform, opacity" }}
      >
        {/* ── Texte gauche ── */}
        <TextBlock
          side="left"
          slide={SLIDE_A}
          navbarH={NAVBAR_H}
        />

        {/* ── Vidéo droite ── */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: "36%",
            right: 0,
            top: -NAVBAR_H,
            bottom: 0,
            zIndex: 3,
          }}
        >
          <video
            ref={video1Ref}
            muted
            playsInline
            preload="auto"
            src="/videos/halo-hero.mp4"
            style={{
              position: "absolute",
              width: "122%",
              height: "122%",
              right: "-11%",
              top: 0,
              objectFit: "cover",
              objectPosition: "50% 24%",
              transform: "scale(0.82)",
              transformOrigin: "top center",
            }}
          />
          <MaskLeft />
          <MaskBottom />
          <MaskTopSubtle />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SLIDE B, Vidéo GAUCHE (miroir) · Texte DROITE
          ══════════════════════════════════════════════ */}
      <div
        ref={slide2Ref}
        className="absolute inset-0 flex"
        style={{
          transform: "translateX(100%)",
          willChange: "transform, opacity",
        }}
      >
        {/* ── Vidéo gauche (miroir) ── */}
        <div
          className="absolute overflow-hidden"
          style={{
            right: "36%",
            left: 0,
            top: -NAVBAR_H,
            bottom: 0,
            zIndex: 3,
          }}
        >
          <video
            ref={video2Ref}
            muted
            playsInline
            preload="auto"
            src="/videos/halo-hero-2.mp4"
            style={{
              position: "absolute",
              width: "122%",
              height: "122%",
              left: "-11%",
              top: 0,
              objectFit: "cover",
              objectPosition: "50% 24%",
              transform: "scale(0.82) scaleX(-1)",
              transformOrigin: "top center",
            }}
          />
          <MaskRight />
          <MaskBottom />
          <MaskTopSubtle />
        </div>

        {/* ── Texte droite ── */}
        <TextBlock
          side="right"
          slide={SLIDE_B}
          navbarH={NAVBAR_H}
        />
      </div>

      {/* ══════════════════════════════════════════════
          BARRE DE PROGRESSION
          ══════════════════════════════════════════════ */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 54,
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(200,166,110,0.1)",
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: TOKEN.or,
            transition: "width 0.12s linear",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════
          NAVIGATION DOTS
          ══════════════════════════════════════════════ */}
      <div
        className="absolute flex items-center gap-3"
        style={{
          bottom: 68,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
        }}
      >
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: current === i ? 40 : 24,
              height: 1,
              background: current === i ? TOKEN.or : "rgba(200,166,110,0.25)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM EDITORIAL BAR
          ══════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: 50,
          background: "rgba(10,8,6,0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(200,166,110,0.1)",
          gap: 56,
          zIndex: 40,
        }}
      >
        {labels.map((label, i) => (
          <div key={label} className="flex items-center" style={{ gap: 56 }}>
            {i > 0 && (
              <span
                style={{
                  display: "inline-block",
                  width: 1,
                  height: 16,
                  background: "rgba(200,166,110,0.18)",
                  marginRight: 56,
                }}
              />
            )}
            <span
              style={{
                fontFamily: "var(--font-util), monospace",
                fontSize: 9,
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: i === (current === 0 ? 0 : 2)
                  ? TOKEN.or
                  : "rgba(239,232,220,0.52)",
                transition: "color 0.5s",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   SOUS-COMPOSANT : BLOC TEXTE (gauche ou droite)
   ═════════════════════════════════════════════════════ */
function TextBlock({
  side,
  slide,
  navbarH,
}: {
  side: "left" | "right";
  slide: typeof SLIDE_A;
  navbarH: number;
}) {
  const isLeft = side === "left";

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: "46%",
        minWidth: 420,
        flexShrink: 0,
        marginLeft: isLeft ? 0 : "auto",
        background: TOKEN.noir,
        zIndex: 10,
        padding: isLeft
          ? `0 52px 80px 80px`
          : `0 80px 80px 52px`,
      }}
    >
      {/* Brouillard qui déborde vers la vidéo */}
      <div
        style={{
          content: "",
          position: "absolute",
          top: 0,
          bottom: 0,
          [isLeft ? "right" : "left"]: -160,
          width: 200,
          background: isLeft
            ? `linear-gradient(90deg,
                rgba(10,8,6,1) 0%,
                rgba(10,8,6,0.88) 40%,
                rgba(10,8,6,0.38) 72%,
                transparent 100%)`
            : `linear-gradient(270deg,
                rgba(10,8,6,1) 0%,
                rgba(10,8,6,0.88) 40%,
                rgba(10,8,6,0.38) 72%,
                transparent 100%)`,
          pointerEvents: "none",
          zIndex: 11,
        }}
      />

      {/* Villes, en haut, pleine largeur */}
      <div
        style={{
          position: "absolute",
          top: navbarH + 28,
          left: isLeft ? 80 : 52,
          right: isLeft ? 52 : 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {CITIES.map((city, i) => (
          <div key={city} className="flex items-center" style={{ flex: i < CITIES.length - 1 ? "none" : "none" }}>
            <span
              style={{
                fontFamily: "var(--font-util), monospace",
                fontSize: 8.5,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(200,166,110,0.62)",
                whiteSpace: "nowrap",
              }}
            >
              {city}
            </span>
            {i < CITIES.length - 1 && (
              <span
                style={{
                  display: "inline-block",
                  width: 28,
                  height: 1,
                  background: "rgba(200,166,110,0.18)",
                  margin: "0 10px",
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contenu principal, aligné en bas */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: navbarH + 80,
          textAlign: isLeft ? "left" : "right",
        }}
      >
        {/* Eyebrow */}
        <div
          className="flex items-center"
          style={{
            gap: 12,
            marginBottom: 36,
            justifyContent: isLeft ? "flex-start" : "flex-end",
          }}
        >
          {!isLeft && (
            <span
              style={{ width: 22, height: 1, background: TOKEN.or, opacity: 0.4, flexShrink: 0 }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-util), monospace",
              fontSize: 9,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: TOKEN.or,
            }}
          >
            {slide.eyebrow}
          </span>
          {isLeft && (
            <span
              style={{ width: 22, height: 1, background: TOKEN.or, opacity: 0.4, flexShrink: 0 }}
            />
          )}
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: "var(--font-couture), Georgia, serif",
            fontSize: "clamp(58px, 6.8vw, 112px)",
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            color: TOKEN.ivoire,
            marginBottom: 30,
          }}
        >
          {slide.lines.map((line) => (
            <span key={line} style={{ display: "block" }}>{line}</span>
          ))}
        </h1>

        {/* Sous-titre */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.78,
            color: TOKEN.pierre,
            maxWidth: 360,
            marginBottom: 40,
            marginLeft: isLeft ? 0 : "auto",
          }}
        >
          {slide.sub}
        </p>

        {/* CTAs */}
        <div
          className="flex items-center flex-wrap"
          style={{ gap: 14, justifyContent: isLeft ? "flex-start" : "flex-end" }}
        >
          {slide.ctas.map((cta) =>
            cta.variant === "fill" ? (
              <Link
                key={cta.href}
                href={cta.href}
                style={{
                  fontFamily: "var(--font-util), monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: TOKEN.noir,
                  background: TOKEN.or,
                  padding: "14px 30px",
                  textDecoration: "none",
                  border: `1px solid ${TOKEN.or}`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = TOKEN.or;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = TOKEN.or;
                  e.currentTarget.style.color = TOKEN.noir;
                }}
              >
                {cta.label}
              </Link>
            ) : (
              <Link
                key={cta.href}
                href={cta.href}
                style={{
                  fontFamily: "var(--font-util), monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(239,232,220,0.65)",
                  border: "1px solid rgba(239,232,220,0.18)",
                  padding: "14px 30px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = TOKEN.or;
                  e.currentTarget.style.color = TOKEN.or;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(239,232,220,0.18)";
                  e.currentTarget.style.color = "rgba(239,232,220,0.65)";
                }}
              >
                {cta.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   SOUS-COMPOSANTS : MASQUES GRADIENT
   ═════════════════════════════════════════════════════ */

/** Masque gauche de la vidéo, fondu organique côté texte */
function MaskLeft() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "0 auto 0 0",
        width: "38%",
        background: `linear-gradient(90deg,
          rgba(10,8,6,1)           0%,
          rgba(10,8,6,0.9)        18%,
          rgba(10,8,6,0.58)       42%,
          rgba(10,8,6,0.22)       68%,
          rgba(10,8,6,0.05)       86%,
          transparent            100%)`,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}

/** Masque droit de la vidéo, symétrique au masque gauche */
function MaskRight() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "0 0 0 auto",
        width: "38%",
        background: `linear-gradient(270deg,
          rgba(10,8,6,1)           0%,
          rgba(10,8,6,0.9)        18%,
          rgba(10,8,6,0.58)       42%,
          rgba(10,8,6,0.22)       68%,
          rgba(10,8,6,0.05)       86%,
          transparent            100%)`,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}

/** Masque bas, cache logo Gemini + fondu naturel */
function MaskBottom() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "auto 0 0 0",
        height: "46%",
        background: `linear-gradient(to top,
          rgba(10,8,6,1)           0%,
          rgba(10,8,6,1)          10%,
          rgba(10,8,6,0.95)       22%,
          rgba(10,8,6,0.82)       36%,
          rgba(10,8,6,0.58)       52%,
          rgba(10,8,6,0.28)       70%,
          rgba(10,8,6,0.08)       86%,
          transparent            100%)`,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}

/** Masque haut subtil, fusion avec la navbar */
function MaskTopSubtle() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "0 0 auto 0",
        height: 110,
        background: `linear-gradient(to bottom,
          rgba(10,8,6,0.6) 0%,
          rgba(10,8,6,0.18) 55%,
          transparent 100%)`,
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}
