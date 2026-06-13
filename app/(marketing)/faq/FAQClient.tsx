"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Search } from "lucide-react";
import { FAQ_CATEGORIES } from "@/lib/marketing/faq";
import type { FAQCategory, FAQItem } from "@/lib/marketing/faq";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const fadeItem = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function FAQClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredCategories = search
    ? FAQ_CATEGORIES.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.question.toLowerCase().includes(search.toLowerCase()) ||
            item.answer.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : FAQ_CATEGORIES;

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div style={{ backgroundColor: "var(--creme)" }}>
      <HeroSection />

      {/* Search + Categories */}
      <section className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
          {/* Search */}
          <div className="relative mb-12">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--pierre)" }}
            />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveCategory(null);
              }}
              className="w-full pl-11 pr-4 py-3 text-[0.9rem] outline-none transition-all duration-200"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--ligne)",
                color: "var(--encre)",
                fontFamily: "var(--font-body), sans-serif",
                borderRadius: "2px",
              }}
            />
          </div>

          {!search && (
            <div className="flex flex-wrap gap-2 mb-12">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.categorie}
                  onClick={() => toggleCategory(cat.categorie)}
                  className="px-4 py-2 text-[0.75rem] font-medium transition-all duration-200"
                  style={{
                    backgroundColor:
                      activeCategory === cat.categorie
                        ? "var(--encre)"
                        : "rgba(12,10,8,0.03)",
                    color:
                      activeCategory === cat.categorie
                        ? "var(--creme)"
                        : "var(--encre)",
                    fontFamily: "var(--font-body), sans-serif",
                    border: "1px solid",
                    borderColor:
                      activeCategory === cat.categorie
                        ? "var(--encre)"
                        : "var(--ligne-faible)",
                    borderRadius: "2px",
                  }}
                >
                  {cat.categorie}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <p
                className="text-[1.1rem] mb-2"
                style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
              >
                Aucun résultat
              </p>
              <p
                className="text-[0.9rem]"
                style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
              >
                Essayez avec d'autres termes.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCategories.map((cat) => (
                <CategorySection
                  key={cat.categorie}
                  category={cat}
                  openItems={openItems}
                  onToggle={toggleItem}
                  forceOpen={activeCategory === cat.categorie || !!search}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: "var(--encre)" }}>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, var(--or, #D8A95B) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 md:px-12 text-center">
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeItem}
          transition={{ duration: 0.6 }}
          className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-6"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
        >
          FAQ
        </motion.p>
        <motion.h1
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[2.2rem] md:text-[3.2rem] font-bold leading-[1.08] mb-4"
          style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
        >
          Questions fréquentes
        </motion.h1>
        <motion.p
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeItem}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[1rem] leading-relaxed"
          style={{ color: "var(--ivoire)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}
        >
          10 catégories, {FAQ_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0)} questions. Tout ce que vous voulez savoir sur Where Talent Forms.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Category Section ─── */
function CategorySection({
  category,
  openItems,
  onToggle,
  forceOpen,
}: {
  category: FAQCategory;
  openItems: Set<string>;
  onToggle: (key: string) => void;
  forceOpen: boolean;
}) {
  const { ref, inView } = useReveal();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={riseItem}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6">
        <h2
          className="text-[1.3rem] md:text-[1.5rem] font-bold mb-1"
          style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
        >
          {category.categorie}
        </h2>
        <p
          className="text-[0.85rem]"
          style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
        >
          {category.description}
        </p>
      </div>
      <div className="space-y-1">
        {category.items.map((item, i) => (
          <FAQAccordion
            key={`${category.categorie}-${i}`}
            item={item}
            isOpen={openItems.has(`${category.categorie}-${i}`) || forceOpen}
            onToggle={() => onToggle(`${category.categorie}-${i}`)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── FAQ Accordion Item ─── */
function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
      <button
        onClick={onToggle}
        className="w-full py-4 text-left flex items-start justify-between gap-3"
      >
        <span
          className="text-[0.9rem] md:text-[0.95rem] leading-relaxed flex-1"
          style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}
        >
          {item.question}
        </span>
        <span
          className="text-[0.8rem] mt-0.5 transition-transform duration-300 flex-shrink-0"
          style={{
            color: "var(--or)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            fontFamily: "var(--font-util), monospace",
          }}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pr-8">
          <p
            className="text-[0.85rem] leading-relaxed"
            style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}
          >
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="py-20 md:py-28" style={{ backgroundColor: "var(--encre)" }}>
      <div className="mx-auto w-full max-w-3xl px-6 md:px-12 text-center">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-6"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            Une autre question ?
          </p>
          <h2
            className="text-[1.8rem] md:text-[2.2rem] font-bold leading-[1.1] mb-4"
            style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}
          >
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p
            className="text-[0.95rem] leading-relaxed mb-10"
            style={{ color: "var(--ivoire)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}
          >
            Contactez-nous directement. Nous vous répondrons sous 24 à 48 heures ouvrées.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-[0.8rem] font-semibold transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: "var(--or)",
              color: "var(--encre)",
              fontFamily: "var(--font-body), sans-serif",
              borderRadius: "2px",
            }}
          >
            Nous contacter
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
