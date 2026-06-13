import type { SitePage, BlogPost, RosterItem, Manifesto, SiteBlock, PageVersion } from "./types";

let blockCounter = 0;
function makeBlock(type: SiteBlock["type"], content: Record<string, unknown>, order: number): SiteBlock {
  return { id: `blk-${++blockCounter}`, type, content, order };
}
function makeVersion(id: string, blocks: SiteBlock[], note: string, saved_by = "Admin"): PageVersion {
  return { id, saved_at: new Date().toISOString(), saved_by, blocks, note };
}

const baseBlocks: SiteBlock[] = [
  makeBlock("hero", {
    title: "L'agence qui réinvente le talent",
    subtitle: "Une maison de management premium pour créateurs d'exception",
    image: "/mock/hero-agency.jpg",
    cta_text: "Nous rejoindre",
    cta_link: "/apply",
  }, 0),
  makeBlock("editorial", {
    title: "Notre vision",
    body: "Where Talent Forms est une maison de management créatif qui place l'humain au centre. Nous accompagnons les talents les plus prometteurs dans le développement de leur carrière, avec transparence, bienveillance et exigence.",
  }, 1),
  makeBlock("grid", {
    title: "Nos services",
    cards: [
      { title: "Stratégie de contenu", desc: "Planification éditoriale et conseil" },
      { title: "Production", desc: "Studio créatif et production vidéo" },
      { title: "Business", desc: "Négociation contrats et partenariats" },
    ],
  }, 2),
];

const pageData: (Omit<SitePage, "id" | "versions"> & { id: string })[] = [
  {
    id: "page-1", slug: "homepage",
    title_fr: "Homepage", title_en: "Homepage", title_es: "Página de inicio",
    status: "published", updated_at: "2026-06-07T14:00:00Z", updated_by: "Admin",
    blocks: baseBlocks,
  },
  {
    id: "page-2", slug: "manifeste",
    title_fr: "Manifeste", title_en: "Manifesto", title_es: "Manifiesto",
    status: "published", updated_at: "2026-06-05T10:00:00Z", updated_by: "Admin",
    blocks: [
      makeBlock("hero", { title: "Notre manifeste", subtitle: "Ce en quoi nous croyons", image: "/mock/manifesto-hero.jpg", cta_text: null, cta_link: null }, 0),
      makeBlock("editorial", { title: "Pourquoi Where Talent Forms", body: "Nous avons créé cette maison parce que nous croyons en un management différent..." }, 1),
      makeBlock("citation", { text: "Le talent est partout, mais l'opportunité ne l'est pas.", author: "Le fondateur" }, 2),
    ],
  },
  {
    id: "page-3", slug: "departments",
    title_fr: "Départements", title_en: "Departments", title_es: "Departamentos",
    status: "published", updated_at: "2026-06-06T16:00:00Z", updated_by: "Admin",
    blocks: [
      makeBlock("hero", { title: "Nos départements", subtitle: "5 verticales d'excellence", image: "/mock/dept-hero.jpg", cta_text: null, cta_link: null }, 0),
      makeBlock("grid", { title: "Départements", cards: [
        { title: "Music", desc: "Artistes, auteurs, compositeurs" },
        { title: "Sport", desc: "Athlètes, coachs, influenceurs sport" },
        { title: "Beauté & Mode", desc: "Créateurs de contenu beauté, mannequins" },
        { title: "Business", desc: "Entrepreneurs, conférenciers" },
        { title: "Lifestyle", desc: "Créateurs lifestyle, voyage, food" },
      ]}, 1),
    ],
  },
  {
    id: "page-4", slug: "talents",
    title_fr: "Talents", title_en: "Talents", title_es: "Talentos",
    status: "published", updated_at: "2026-06-07T09:00:00Z", updated_by: "Admin",
    blocks: [
      makeBlock("hero", { title: "Nos talents", subtitle: "Découvrez les créateurs accompagnés par Where Talent Forms", image: "/mock/talents-hero.jpg", cta_text: null, cta_link: null }, 0),
      makeBlock("gallery", { title: "Ils nous font confiance", images: ["/mock/talent-1.jpg", "/mock/talent-2.jpg", "/mock/talent-3.jpg"] }, 1),
    ],
  },
  {
    id: "page-5", slug: "commissions",
    title_fr: "Commissions", title_en: "Commissions", title_es: "Comisiones",
    status: "draft", updated_at: "2026-06-04T11:00:00Z", updated_by: "Admin",
    blocks: [
      makeBlock("hero", { title: "Nos commissions", subtitle: "Une transparence radicale", image: "/mock/commissions-hero.jpg", cta_text: null, cta_link: null }, 0),
      makeBlock("table", { title: "Barème des commissions", headers: ["Tranche", "Commission", "Durée"], rows: [
        ["< 5 000€/mois", "20%", "12 mois"],
        ["5 000 - 15 000€/mois", "15%", "24 mois"],
        ["> 15 000€/mois", "10%", "36 mois"],
      ]}, 1),
      makeBlock("editorial", { title: "Pourquoi cette grille", body: "Notre commission est dégressive car nous croyons que plus vous réussissez, plus vous devez garder une part importante de vos revenus." }, 2),
    ],
  },
  {
    id: "page-6", slug: "saas",
    title_fr: "SAAS", title_en: "SAAS", title_es: "SAAS",
    status: "review", updated_at: "2026-06-07T18:00:00Z", updated_by: "Admin",
    blocks: [
      makeBlock("hero", { title: "WTF Studio", subtitle: "La plateforme qui révolutionne la gestion de carrière", image: "/mock/saas-hero.jpg", cta_text: "Demander une démo", cta_link: "/saas/demo" }, 0),
      makeBlock("grid", { title: "Fonctionnalités", cards: [
        { title: "Dashboard temps réel", desc: "Suivez vos performances en direct" },
        { title: "IA Creator Coach", desc: "Un assistant personnel propulsé par Claude" },
        { title: "Gestion des contrats", desc: "Signature électronique et suivi" },
      ]}, 1),
      makeBlock("cta", { text: "Prêt à passer au niveau supérieur ?", button_text: "Réserver une démo", button_link: "/saas/demo" }, 2),
    ],
  },
  {
    id: "page-7", slug: "blog",
    title_fr: "Blog", title_en: "Blog", title_es: "Blog",
    status: "published", updated_at: "2026-06-06T12:00:00Z", updated_by: "Admin",
    blocks: [
      makeBlock("hero", { title: "Le Journal", subtitle: "Actualités, conseils et coulisses", image: "/mock/blog-hero.jpg", cta_text: null, cta_link: null }, 0),
      makeBlock("custom_html", { html: "<!-- Les articles sont gérés depuis la section Blog -->" }, 1),
    ],
  },
];

export const sitePages: SitePage[] = pageData.map((p) => ({
  ...p,
  versions: [makeVersion(`v-${p.id}-1`, p.blocks, "Version initiale")],
}));

export const blogPosts: BlogPost[] = [
  {
    id: "post-1", slug: "nouvelle-agence-management",
    title: "Pourquoi nous avons créé Where Talent Forms",
    subtitle: "Le manifeste d'une nouvelle génération de management créatif",
    author: "Admin", cover_url: "/mock/blog-1.jpg",
    tags: ["agence", "management", "créateurs"], category: "Maison",
    content: "## Contexte\n\nLe marché du management de créateurs est en pleine mutation...\n\n## Notre approche\n\nChez Where Talent Forms, nous avons choisi la transparence...",
    status: "published", scheduled_at: null, published_at: "2026-05-20T08:00:00Z",
    views: 1240, seo_title: "Pourquoi Where Talent Forms - Nouvelle agence de management", seo_description: "Découvrez pourquoi nous avons créé Where Talent Forms, une maison de management premium pour créateurs.", seo_image: "/mock/blog-1.jpg",
    created_at: "2026-05-18T10:00:00Z", updated_at: "2026-05-20T08:00:00Z",
  },
  {
    id: "post-2", slug: "guide-commissions-transparentes",
    title: "Guide complet des commissions transparentes",
    subtitle: "Comment nous repensons le modèle économique du management",
    author: "Admin", cover_url: "/mock/blog-2.jpg",
    tags: ["commissions", "transparence", "guide"], category: "Business",
    content: "## Pourquoi la transparence ?\n\nLes commissions opaques sont le problème numéro 1 du secteur...",
    status: "published", scheduled_at: null, published_at: "2026-06-01T10:00:00Z",
    views: 856, seo_title: "Guide commissions transparentes - Where Talent Forms", seo_description: "Notre guide complet sur les commissions transparentes dans le management de créateurs.", seo_image: "/mock/blog-2.jpg",
    created_at: "2026-05-28T14:00:00Z", updated_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "post-3", slug: "interview-fondateur",
    title: "Interview exclusive de notre fondateur",
    subtitle: "Retour sur 3 ans de construction de Where Talent Forms",
    author: "Admin", cover_url: null,
    tags: ["interview", "fondateur", "histoire"], category: "Maison",
    content: "## Les débuts\n\nTout a commencé en 2023, quand j'ai réalisé que...",
    status: "draft", scheduled_at: null, published_at: null,
    views: 0, seo_title: "Interview fondateur Where Talent Forms", seo_description: "Interview exclusive du fondateur de Where Talent Forms sur son parcours.", seo_image: null,
    created_at: "2026-06-05T09:00:00Z", updated_at: "2026-06-05T09:00:00Z",
  },
  {
    id: "post-4", slug: "top-5-outils-createurs-2026",
    title: "Top 5 des outils indispensables pour créateurs en 2026",
    subtitle: "Notre sélection pour optimiser votre productivité",
    author: "Admin", cover_url: "/mock/blog-3.jpg",
    tags: ["outils", "productivité", "guide"], category: "Conseils",
    content: "## Les outils que nous recommandons\n\nAprès avoir testé des dizaines d'outils...",
    status: "scheduled", scheduled_at: "2026-06-15T08:00:00Z", published_at: null,
    views: 0, seo_title: "Top 5 outils créateurs 2026 - Where Talent Forms", seo_description: "Notre sélection des meilleurs outils pour créateurs de contenu en 2026.", seo_image: "/mock/blog-3.jpg",
    created_at: "2026-06-06T11:00:00Z", updated_at: "2026-06-06T11:00:00Z",
  },
  {
    id: "post-5", slug: "ia-et-creation-contenu",
    title: "Comment l'IA transforme la création de contenu",
    subtitle: "Opportunités et pièges à éviter",
    author: "Admin", cover_url: null,
    tags: ["IA", "création", "tendances"], category: "Tech",
    content: "## L'IA comme assistant créatif\n\nL'intelligence artificielle change la donne...",
    status: "published", scheduled_at: null, published_at: "2026-06-03T14:00:00Z",
    views: 2100, seo_title: "IA et création de contenu - Where Talent Forms", seo_description: "Comment l'IA transforme la création de contenu : opportunités et pièges.", seo_image: null,
    created_at: "2026-06-01T16:00:00Z", updated_at: "2026-06-03T14:00:00Z",
  },
];

export const rosterItems: RosterItem[] = [
  { creator_id: "c1", creator_name: "Clara W.", visible: true, order: 0, image_url: null, bio_fr: "Créatrice beauté & lifestyle", bio_en: "Beauty & lifestyle creator", bio_es: "Creadora de belleza y estilo de vida", public_links: [{ platform: "YouTube", url: "https://youtube.com/@claraw" }, { platform: "Instagram", url: "https://instagram.com/claraw" }] },
  { creator_id: "c2", creator_name: "Marc T.", visible: true, order: 1, image_url: null, bio_fr: "Voyageur et aventurier", bio_en: "Traveler and adventurer", bio_es: "Viajero y aventurero", public_links: [{ platform: "YouTube", url: "https://youtube.com/@marct" }] },
  { creator_id: "c3", creator_name: "Léa R.", visible: true, order: 2, image_url: null, bio_fr: "Artiste et musicienne", bio_en: "Artist and musician", bio_es: "Artista y música", public_links: [{ platform: "TikTok", url: "https://tiktok.com/@lear" }] },
  { creator_id: "c4", creator_name: "Inès D.", visible: false, order: 3, image_url: null, bio_fr: "Créatrice de contenu exclusif", bio_en: "Exclusive content creator", bio_es: "Creadora de contenido exclusivo", public_links: [] },
  { creator_id: "c5", creator_name: "Alex M.", visible: true, order: 4, image_url: null, bio_fr: "Coach fitness et nutrition", bio_en: "Fitness and nutrition coach", bio_es: "Entrenador de fitness y nutrición", public_links: [{ platform: "Instagram", url: "https://instagram.com/alexm" }] },
  { creator_id: "c6", creator_name: "Emma V.", visible: true, order: 5, image_url: null, bio_fr: "Productrice musicale", bio_en: "Music producer", bio_es: "Productora musical", public_links: [{ platform: "YouTube", url: "https://youtube.com/@emmav" }] },
  { creator_id: "c7", creator_name: "Hugo P.", visible: false, order: 6, image_url: null, bio_fr: "Entrepreneur et leader", bio_en: "Entrepreneur and leader", bio_es: "Emprendedor y líder", public_links: [] },
];

export const manifestoData: Manifesto = {
  content_fr: "Nous croyons que le talent mérite un management à la hauteur de son ambition.\n\nWhere Talent Forms est né d'une conviction : les créateurs de contenu sont les artistes de notre époque, et ils méritent un accompagnement professionnel, transparent et bienveillant.\n\nNous refusons les pratiques prédatrices qui ont trop longtemps gangréné l'industrie. Pas de commissions opaques, pas de contrats pièges, pas de « chatter » qui se fait passer pour le créateur.\n\nNotre maison est construite sur trois piliers :\n\n1. **Transparence radicale**, chaque créateur a accès à ses données, ses revenus, ses contrats en temps réel.\n2. **Commission dégressive**, plus vous réussissez, moins vous payez.\n3. **Liberté**, vous restez propriétaire de vos comptes et de votre image.",
  content_en: "We believe talent deserves management that matches its ambition.\n\nWhere Talent Forms was born from a conviction: content creators are the artists of our era, and they deserve professional, transparent, and caring support.\n\nWe refuse the predatory practices that have plagued the industry for too long. No opaque commissions, no trap contracts, no chatters impersonating the creator.\n\nOur house is built on three pillars:\n\n1. **Radical transparency**, every creator has access to their data, revenue, and contracts in real time.\n2. **Degressive commission**, the more you succeed, the less you pay.\n3. **Freedom**, you remain the owner of your accounts and your image.",
  content_es: "Creemos que el talento merece una gestión a la altura de su ambición.\n\nWhere Talent Forms nació de una convicción: los creadores de contenido son los artistas de nuestra época, y merecen un acompañamiento profesional, transparente y benevolente.\n\nRechazamos las prácticas predatorias que durante demasiado tiempo han gangrenado la industria. Sin comisiones opacas, sin contratos trampa, sin «chatters» que se hagan pasar por el creador.\n\nNuestra casa se construye sobre tres pilares:\n\n1. **Transparencia radical**, cada creador tiene acceso a sus datos, ingresos y contratos en tiempo real.\n2. **Comisión decreciente**, cuanto más éxito tienes, menos pagas.\n3. **Libertad**, sigues siendo propietario de tus cuentas y de tu imagen.",
  commitments: [
    { text_fr: "Transparence totale sur les revenus et les contrats", text_en: "Total transparency on revenue and contracts", text_es: "Transparencia total sobre ingresos y contratos" },
    { text_fr: "Commission dégressive et plafonnée", text_en: "Degressive and capped commission", text_es: "Comisión decreciente y limitada" },
    { text_fr: "Propriété des comptes conservée par le créateur", text_en: "Account ownership retained by the creator", text_es: "Propiedad de cuentas conservada por el creador" },
    { text_fr: "Accompagnement personnalisé 24/7", text_en: "Personalized 24/7 support", text_es: "Acompañamiento personalizado 24/7" },
  ],
  founder_name: "Thomas Delacroix",
  founder_signature: "Fondateur, Where Talent Forms",
  updated_at: "2026-06-07T12:00:00Z",
};
