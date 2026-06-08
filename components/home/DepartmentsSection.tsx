"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Data ─── */
const departments = [
  {
    name: "Music & Performing Arts",
    description: "Musiciens, chanteurs, performers",
    slug: "music",
    image: "1511671782779-c97d3d27a1d4",
  },
  {
    name: "Sport & Lifestyle",
    description: "Athlètes, coachs, lifestyle",
    slug: "sport",
    image: "1461896836934-bd45ba8fcf0b",
  },
  {
    name: "Business & Thought Leadership",
    description: "Entrepreneurs, speakers",
    slug: "business",
    image: "1540575467063-178a50c2df87",
  },
  {
    name: "Digital Creators",
    description: "Influenceurs, créateurs de contenu",
    slug: "digital-creators",
    image: "1519389950473-47ba0277781c",
  },
  {
    name: "Talent Premium",
    description: "Créateurs adultes haut de gamme",
    slug: "talent-premium",
    image: "1534528741775-53994a69daeb",
  },
];

/* ─── Animated card wrapper ─── */
function DepartmentCard({
  dept,
  index,
  className,
}: {
  dept: (typeof departments)[number];
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delay = index * 100;

  return (
    <div
      ref={ref}
      className={cn(className, "will-change-transform")}
      style={{
        clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `clip-path 0.8s cubic-bezier(0.77, 0, 0.18, 1) ${delay}ms, transform 0.8s cubic-bezier(0.77, 0, 0.18, 1) ${delay}ms`,
      }}
    >
      <Link
        href={`/departements/${dept.slug}`}
        className="group relative block w-full h-full overflow-hidden bg-surface"
      >
        {/* Photo de couverture */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-${dept.image}?w=800&q=80&auto=format&fit=crop)`,
            filter: "brightness(0.92) saturate(0.75)",
          }}
        />
        {/* Warm overlay — s'éclaircit au hover */}
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0 pointer-events-none" />
        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(26,22,20,0.85)] via-[rgba(26,22,20,0.25)] to-transparent pointer-events-none" />
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white uppercase">
            {dept.name}
          </h3>
          <p className="text-sm text-white/80 mt-1 max-w-[90%]">
            {dept.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

/* ─── Section ─── */
export function DepartmentsSection() {
  /* Header animation */
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="departements" className="py-32 md:py-44 bg-base">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* ─── Header ─── */}
        <div
          ref={headerRef}
          className="mb-16 md:mb-20 max-w-2xl"
          style={{
            clipPath: headerVisible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: `clip-path 0.8s cubic-bezier(0.77, 0, 0.18, 1) 0ms, transform 0.8s cubic-bezier(0.77, 0, 0.18, 1) 0ms`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-accent mb-4 font-sans font-semibold">
            Nos expertises
          </p>
          <h2 className="font-display text-[36px] md:text-[44px] font-bold text-ink tracking-tight leading-[1.1]">
            Cinq départements,<br />une seule exigence.
          </h2>
          <p className="text-lg text-ink-muted leading-relaxed mt-4 max-w-[600px]">
            Quel que soit votre medium, nous avons l&apos;expertise pour vous
            accompagner.
          </p>
        </div>

        {/* ─── Grille asymétrique ─── */}
        {/* Desktop : 2/3 + 1/3 avec sous-grilles */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {/* Colonne gauche — 2/3 */}
          <div className="col-span-2 flex flex-col gap-6">
            <DepartmentCard
              dept={departments[0]}
              index={0}
              className="w-full h-[480px]"
            />
            <div className="grid grid-cols-2 gap-6">
              <DepartmentCard
                dept={departments[2]}
                index={2}
                className="w-full h-[300px]"
              />
              <DepartmentCard
                dept={departments[3]}
                index={3}
                className="w-full h-[300px]"
              />
            </div>
          </div>
          {/* Colonne droite — 1/3 */}
          <div className="col-span-1 flex flex-col gap-6">
            <DepartmentCard
              dept={departments[1]}
              index={1}
              className="w-full h-[300px]"
            />
            <DepartmentCard
              dept={departments[4]}
              index={4}
              className="w-full h-[480px]"
            />
          </div>
        </div>

        {/* ─── Mobile : stack vertical ─── */}
        <div className="md:hidden flex flex-col gap-5">
          {departments.map((dept, i) => (
            <DepartmentCard
              key={dept.slug}
              dept={dept}
              index={i}
              className="w-full h-[280px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
