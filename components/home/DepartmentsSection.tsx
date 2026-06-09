"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    description: "Entrepreneurs, speakers, experts",
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

  const delay = index * 120;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <Link
        href={`/departements/${dept.slug}`}
        className="group relative block w-full h-full overflow-hidden bg-surface"
      >
        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-[0.6s] ease-out group-hover:scale-[1.03]"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-${dept.image}?w=800&q=80&auto=format&fit=crop)`,
            filter: "brightness(0.92) saturate(0.75)",
          }}
        />
        {/* Overlay gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-[0.6s] group-hover:opacity-80 pointer-events-none" />
        {/* Texte en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white uppercase">
            {dept.name}
          </h3>
          <p className="font-sans text-sm text-white/80 mt-1">
            {dept.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

export function DepartmentsSection() {
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
    <section className="bg-base py-32 md:py-44">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16 md:mb-20"
          style={{
            clipPath: headerVisible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transform: headerVisible ? "translateY(0)" : "translateY(30px)",
            transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="font-display text-[2rem] md:text-[2.5rem] font-bold text-ink uppercase tracking-[-0.02em]">
            Nos cinq départements
          </h2>
          <p className="font-sans text-base md:text-lg text-ink-secondary mt-4 max-w-xl mx-auto leading-relaxed">
            Quel que soit votre medium, nous avons l&apos;expertise pour vous accompagner.
          </p>
        </div>

        {/* ─── Desktop : grille asymétrique ─── */}
        <div className="hidden md:grid grid-cols-6 gap-5">
          {/* Row 1 : 4/6 + 2/6 */}
          <div className="col-span-4 h-[400px]">
            <DepartmentCard dept={departments[0]} index={0} className="w-full h-full" />
          </div>
          <div className="col-span-2 h-[400px]">
            <DepartmentCard dept={departments[1]} index={1} className="w-full h-full" />
          </div>

          {/* Row 2 : 2/6 + 2/6 + 2/6 */}
          <div className="col-span-2 h-[350px]">
            <DepartmentCard dept={departments[2]} index={2} className="w-full h-full" />
          </div>
          <div className="col-span-2 h-[350px]">
            <DepartmentCard dept={departments[3]} index={3} className="w-full h-full" />
          </div>
          <div className="col-span-2 h-[350px]">
            <DepartmentCard dept={departments[4]} index={4} className="w-full h-full" />
          </div>
        </div>

        {/* ─── Mobile ─── */}
        <div className="md:hidden flex flex-col gap-4">
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
