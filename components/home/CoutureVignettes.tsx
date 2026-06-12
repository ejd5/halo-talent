"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { VIGNETTES } from "@/lib/marketing/couture-homepage";

export function CoutureVignettes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [active, setActive] = useState<string>(VIGNETTES[0].id);

  const activeVignette = VIGNETTES.find((v) => v.id === active) || VIGNETTES[0];

  return (
    <section
      ref={ref}
      className="py-32 md:py-48 relative"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", color: "var(--encre)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* GAUCHE : Liste interactive */}
          <div className="lg:w-7/12 flex flex-col relative z-10">
            {VIGNETTES.map((v, i) => {
              const isActive = active === v.id;
              return (
                <motion.div
                  key={v.id}
                  className="border-b relative group cursor-pointer"
                  style={{ 
                    borderColor: isActive ? "var(--or)" : "rgba(12,10,8,0.1)", 
                    transition: "border-color 0.5s" 
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setActive(v.id)}
                >
                  <Link href={v.href} className="block py-10 md:py-14 no-underline relative overflow-hidden">
                    {/* Hover Background subtil */}
                    <div 
                      className="absolute inset-0 origin-left transition-transform duration-700 ease-out"
                      style={{ 
                        backgroundColor: "rgba(200,166,110,0.04)", 
                        transform: isActive ? "scaleX(1)" : "scaleX(0)" 
                      }} 
                    />
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 relative z-10">
                      {/* Numéro */}
                      <span
                        className="flex-shrink-0 text-[11px] uppercase tracking-[0.34em]"
                        style={{
                          fontFamily: "var(--font-util), monospace",
                          color: isActive ? "var(--or)" : "var(--pierre)",
                          transition: "color 0.4s ease",
                          width: "40px",
                        }}
                      >
                        {v.num}
                      </span>

                      {/* Titre */}
                      <h3
                        className="flex-grow transition-all duration-700 ease-out"
                        style={{
                          fontFamily: "var(--font-couture), Georgia, serif",
                          fontSize: "clamp(32px, 4vw, 56px)",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          color: isActive ? "var(--or)" : "var(--encre)",
                          lineHeight: 1.1,
                          transform: isActive ? "translateX(16px)" : "translateX(0px)",
                        }}
                      >
                        {v.title}
                      </h3>
                      
                      {/* Flèche (visible sur Desktop uniquement en actif) */}
                      <div className="hidden md:flex overflow-hidden w-[30px] h-[30px] items-center justify-center">
                         <motion.svg 
                           width="24" height="24" viewBox="0 0 24 24" fill="none"
                           animate={{ x: isActive ? 0 : -40, opacity: isActive ? 1 : 0 }}
                           transition={{ duration: 0.5, ease: "easeOut" }}
                         >
                           <path d="M5 12h14M12 5l7 7-7 7" stroke="var(--or)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                         </motion.svg>
                      </div>
                    </div>

                    {/* Description Mobile */}
                    <div 
                      className="block lg:hidden mt-6 overflow-hidden transition-all duration-500"
                      style={{ 
                        maxHeight: isActive ? "200px" : "0px",
                        opacity: isActive ? 1 : 0
                      }}
                    >
                      <p className="text-[14px] leading-relaxed text-[var(--encre)] opacity-70 ml-[56px] border-l border-[var(--or)] pl-4">
                        {v.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* DROITE : Panneau dynamique collant (Desktop uniquement) */}
          <div className="lg:w-5/12 relative hidden lg:block">
            <div 
              className="sticky top-40 h-[640px] w-full p-12 overflow-hidden flex flex-col justify-end"
              style={{
                backgroundColor: "var(--encre)", // Fond sombre très contrasté
                boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
              }}
            >
              {/* Fond Animé Abstrait (Gradients + Numéro Géant) */}
              <AnimatePresence mode="wait">
                 <motion.div
                   key={active}
                   initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                   animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                   exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                   transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                   className="absolute inset-0 z-0 pointer-events-none"
                   style={{
                     background: `radial-gradient(circle at 70% 30%, rgba(200,166,110,0.12) 0%, transparent 60%), 
                                  radial-gradient(circle at 30% 80%, rgba(200,166,110,0.06) 0%, transparent 50%)`
                   }}
                 >
                    {/* Numéro géant en filigrane */}
                    <div 
                      className="absolute -right-12 -top-16 text-[380px] leading-none opacity-[0.03] font-black"
                      style={{ fontFamily: "var(--font-couture), Georgia, serif", color: "var(--or)" }}
                    >
                      {activeVignette.num}
                    </div>
                 </motion.div>
              </AnimatePresence>

              {/* Contenu Texte du panneau */}
              <div className="relative z-10 border-l-2 border-[var(--or)] pl-10 mb-8">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                       <span 
                         className="block text-[10px] uppercase tracking-[0.3em] mb-5"
                         style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
                       >
                         Module Stratégique
                       </span>
                       <h4 
                         className="text-4xl mb-6 text-[#F4EFE7]"
                         style={{ fontFamily: "var(--font-couture), Georgia, serif", letterSpacing: "-0.01em" }}
                       >
                         {activeVignette.title}
                       </h4>
                       <p className="text-[15px] leading-relaxed text-[rgba(239,232,220,0.65)] mb-12 max-w-[320px]">
                         {activeVignette.desc}
                       </p>

                       <Link 
                         href={activeVignette.href} 
                         className="inline-flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-[#F4EFE7] hover:text-[var(--or)] transition-colors" 
                         style={{ fontFamily: "var(--font-util), monospace" }}
                       >
                         Découvrir l'outil
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </Link>
                    </motion.div>
                 </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
