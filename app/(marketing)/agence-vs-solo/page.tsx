import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, HelpCircle } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Agence, Freelance ou Solo : Le Guide d'Accompagnement Créateur",
  description:
    "Faut-il rester indépendant seul, s'entourer de freelances, ou rejoindre une maison de management ? Analyse complète des avantages, risques et commissions.",
};

export default function AgenceVsSoloPage() {
  const faqData = {
    mainEntity: [
      {
        "@type": "Question",
        name: "Quand doit-on quitter le statut solo pour s'entourer ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dès que les tâches administratives, la négociation de contrats et le montage vidéo occupent plus de 50% de votre temps hebdomadaire, nuisant à la création artistique.",
        },
      },
      {
        "@type": "Question",
        name: "Quelle est la commission moyenne d'une agence ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les commissions varient de 20% à 40% sur les revenus générés selon le niveau d'accompagnement juridique et stratégique.",
        },
      },
    ],
  };

  return (
    <div style={{ backgroundColor: "#0C0A08", color: "#F4EEE3", minHeight: "100vh" }}>
      <StructuredData type="FAQPage" data={faqData} />
      
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "120px 24px 80px" }}>
        {/* Back Link */}
        <Link
          href="/blog"
          style={{
            fontFamily: "Space Grotesk, monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9C9183",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 40,
          }}
        >
          <ArrowLeft size={12} />
          Retour au Journal
        </Link>

        {/* H1 Heading */}
        <h1
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 54px)",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "#F4EEE3",
          }}
        >
          Agence, Freelance ou Solo : quel accompagnement choisir ?
        </h1>

        <p
          style={{
            fontFamily: "Instrument Sans, sans-serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: "#9C9183",
            fontStyle: "italic",
            marginBottom: 48,
          }}
        >
          Une analyse éditoriale objective pour comprendre à quel moment structurer son activité sans perdre son indépendance.
        </p>

        {/* Intro */}
        <section style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#9C9183", marginBottom: 20 }}>
            Pour beaucoup de créateurs de contenu, la question du modèle d'accompagnement se pose rapidement.
            Travailler seul permet un contrôle absolu mais limite la scalabilité et favorise l'épuisement.
            S'entourer de freelances apporte de la flexibilité mais demande une charge managériale lourde.
            Rejoindre une agence délègue la gestion mais comporte des risques d'opacité.
          </p>
        </section>

        {/* H2 Section */}
        <h2
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          Tableau Comparatif des Modèles
        </h2>

        {/* Comparison Table */}
        <div style={{ overflowX: "auto", marginBottom: 40 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #D8A95B" }}>
                <th style={{ textAlign: "left", padding: 12, color: "#D8A95B" }}>Critère</th>
                <th style={{ textAlign: "left", padding: 12, color: "#D8A95B" }}>Solo</th>
                <th style={{ textAlign: "left", padding: 12, color: "#D8A95B" }}>Freelances</th>
                <th style={{ textAlign: "left", padding: 12, color: "#D8A95B" }}>Maison WTF</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(244,238,227,0.06)" }}>
                <td style={{ padding: 12, fontWeight: "bold" }}>Contrôle</td>
                <td style={{ padding: 12 }}>100% libre</td>
                <td style={{ padding: 12 }}>90% libre</td>
                <td style={{ padding: 12 }}>Contrôle & validation</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(244,238,227,0.06)" }}>
                <td style={{ padding: 12, fontWeight: "bold" }}>Charge mentale</td>
                <td style={{ padding: 12 }}>Très élevée</td>
                <td style={{ padding: 12 }}>Élevée (coordination)</td>
                <td style={{ padding: 12 }}>Faible (déléguée)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(244,238,227,0.06)" }}>
                <td style={{ padding: 12, fontWeight: "bold" }}>Sécurité juridique</td>
                <td style={{ padding: 12 }}>Faible</td>
                <td style={{ padding: 12 }}>Moyenne</td>
                <td style={{ padding: 12 }}>Haute (Lex AI & avocats)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Encart WTF */}
        <div
          style={{
            background: "#1C1712",
            borderLeft: "2px solid #D8A95B",
            padding: 32,
            borderRadius: 4,
            marginBottom: 48,
          }}
        >
          <h3 style={{ fontSize: 18, color: "#F4EEE3", marginBottom: 12 }}>Pourquoi WTF change la donne</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#9C9183", margin: 0 }}>
            WTF n'est pas une agence classique. Nous fonctionnons comme une maison de management moderne
            qui s'appuie sur des outils technologiques de pointe (Atlas CRM, Lex AI) tout en plaçant le créateur
            au centre des décisions. Vous gardez 100% de la propriété intellectuelle et le contrôle total de vos accès.
          </p>
        </div>

        {/* FAQs */}
        <h2
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 28,
            fontWeight: 400,
            marginBottom: 20,
          }}
        >
          Questions Fréquentes
        </h2>
        <div style={{ marginBottom: 48 }}>
          <details style={{ padding: "12px 0", borderBottom: "1px solid rgba(244,238,227,0.08)" }}>
            <summary style={{ fontWeight: 500, cursor: "pointer" }}>Quand s'entourer ?</summary>
            <p style={{ color: "#9C9183", padding: "12px 0 0" }}>
              Dès que la gestion opérationnelle et technique empiète sur votre création de contenu.
            </p>
          </details>
          <details style={{ padding: "12px 0", borderBottom: "1px solid rgba(244,238,227,0.08)" }}>
            <summary style={{ fontWeight: 500, cursor: "pointer" }}>Est-ce que WTF gère la comptabilité ?</summary>
            <p style={{ color: "#9C9183", padding: "12px 0 0" }}>
              Nous aidons à structurer vos factures et documents juridiques via nos outils d'IA intégrés, mais la déclaration fiscale reste de votre ressort (ou de votre expert-comptable).
            </p>
          </details>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Link
            href="/apply"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 32px",
              backgroundColor: "#D8A95B",
              color: "#0C0A08",
              fontFamily: "Space Grotesk, monospace",
              textTransform: "uppercase",
              fontSize: 12,
              fontWeight: "bold",
              textDecoration: "none",
              borderRadius: 2,
            }}
          >
            Candidater chez WTF
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
