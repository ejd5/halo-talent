import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldAlert, FileText } from "lucide-react";
import { DownloadButton } from "@/components/resources/DownloadButton";

export const metadata: Metadata = {
  title: "Ressources Gratuites pour Créateurs | Where Talent Forms",
  description:
    "Téléchargez nos guides d'accompagnement, checklists de sécurité, modèles de contrats et de media kits créés par la Maison WTF.",
};

const RESOURCES = [
  {
    id: "sec-chk",
    title: "Checklist Sécurité Créateur",
    desc: "Protégez vos accès, configurez la double authentification matérielle et prévenez les piratages.",
    forWho: "Tous les créateurs indépendants",
    content: "Guide 2FA, checklist audit log et protection contre le phishing."
  },
  {
    id: "img-chk",
    title: "Checklist Droit à l'Image",
    desc: "Les clauses et autorisations obligatoires avant de publier des contenus collaboratifs.",
    forWho: "Créateurs lifestyle & glamour",
    content: "Modèle de décharge de droits d'image et clauses contractuelles types."
  },
  {
    id: "med-kit",
    title: "Template Media Kit",
    desc: "Un modèle minimaliste et élégant pour présenter vos statistiques d'audience aux marques.",
    forWho: "Influenceurs et YouTubers",
    content: "Structure PowerPoint / Canva dans les tons crème et champagne."
  },
  {
    id: "com-gui",
    title: "Guide Commissions Créateurs",
    desc: "Comprendre les taux d'agence, les clauses d'exclusivité et les commissions marginales dégressives.",
    forWho: "Créateurs en recherche d'agence",
    content: "Simulateur de revenus nets et conseils de négociation contractuelle."
  },
  {
    id: "aud-img",
    title: "Mini Audit Image Premium",
    desc: "Évaluez la désirabilité de votre grille de contenu et votre positionnement éditorial.",
    forWho: "Créateurs esthétiques & glamour",
    content: "Méthode de notation sur 10 points pour rehausser votre DA."
  },
  {
    id: "age-gui",
    title: "Guide Agence vs Solo",
    desc: "Un outil de décision pour savoir quand s'entourer sans aliéner sa liberté.",
    forWho: "Créateurs en croissance rapide",
    content: "Matrice de décision charge mentale vs délégation opérationnelle."
  },
  {
    id: "eco-glo",
    title: "Glossaire Creator Economy",
    desc: "50 définitions indispensables pour maîtriser le vocabulaire du droit et des outils SaaS.",
    forWho: "Nouveaux professionnels du Web",
    content: "Guide lexique illustré et liens explicatifs."
  },
  {
    id: "cal-edi",
    title: "Template Calendrier Éditorial",
    desc: "Organisez vos publications hebdomadaires sur 4 canaux sans vous épuiser.",
    forWho: "Créateurs multi-plateformes",
    content: "Fichier de planification et d'automatisation des relances."
  },
  {
    id: "avo-chk",
    title: "Checklist Dossier Avocat",
    desc: "Comment compiler vos preuves numériques avant une consultation juridique.",
    forWho: "Créateurs en cours de litige",
    content: "Format d'historique de preuves et capture d'écran juridiquement recevables."
  },
  {
    id: "crm-gui",
    title: "Guide CRM Créateur",
    desc: "Pourquoi la centralisation de vos fans est le levier principal de votre indépendance.",
    forWho: "Créateurs avec une fanbase engagée",
    content: "Techniques de segmentation et de fidélisation automatique."
  }
];

export default function RessourcesGratuitesPage() {
  return (
    <div style={{ backgroundColor: "#0C0A08", color: "#F4EEE3", minHeight: "100vh" }}>
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 24px 80px" }}>
        
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

        {/* Hero */}
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Ressources & Outils Gratuits
          </h1>
          <p
            style={{
              fontFamily: "Instrument Sans, sans-serif",
              fontSize: 16,
              color: "#9C9183",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Des templates opérationnels, guides et documents stratégiques pour vous aider à structurer votre image et protéger votre indépendance.
          </p>
        </div>

        {/* Resources Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginBottom: 60 }}>
          {RESOURCES.map((res) => (
            <div
              key={res.id}
              style={{
                border: "1px solid rgba(216,169,91,0.15)",
                background: "#1C1712",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "Space Grotesk, monospace",
                    textTransform: "uppercase",
                    color: "#D8A95B",
                    letterSpacing: "0.1em"
                  }}
                >
                  Pour : {res.forWho}
                </span>
                <h3
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: 20,
                    fontWeight: 400,
                    marginTop: 8,
                    marginBottom: 12,
                    color: "#F4EEE3"
                  }}
                >
                  {res.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#9C9183",
                    marginBottom: 16
                  }}
                >
                  {res.desc}
                </p>
                <div style={{ fontSize: 11, color: "#9C9183", opacity: 0.8, marginBottom: 20 }}>
                  <strong>Inclus :</strong> {res.content}
                </div>
              </div>

              <DownloadButton title={res.title} />
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ borderTop: "1px solid rgba(244,238,227,0.08)", paddingTop: 32, display: "flex", gap: 16 }}>
          <ShieldAlert size={24} style={{ color: "#D8A95B", flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 10, fontFamily: "Space Grotesk, monospace", textTransform: "uppercase", color: "#D8A95B" }}>
              Disclaimer Juridique
            </span>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "#9C9183", marginTop: 4, margin: 0 }}>
              Les informations, checklists et modèles de documents mis à disposition par WTF ne remplacent en aucun cas l'analyse personnalisée d'un avocat. Nous vous recommandons vivement d'adapter et de soumettre ces éléments à un professionnel réglementé avant tout usage officiel.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
