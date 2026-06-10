// ─── Shared i18n messages for all marketing pages ───
// Architecture ready for 6 languages: fr, en, es, de, pt-BR, it

export type Locale = "fr" | "en" | "es" | "pt-BR" | "de" | "it";
export const LOCALES: Locale[] = ["fr", "en", "es", "pt-BR", "de", "it"];

let currentLocale: Locale = "fr";
export function setCommonLocale(l: Locale) { currentLocale = l; }
export function getCommonLocale(): Locale { return currentLocale; }

type Messages = Record<string, Record<Locale, string>>;

const messages: Messages = {
  // ─── Navigation ───
  "nav.home": { fr: "Accueil", en: "Home", es: "Inicio", "pt-BR": "Início", de: "Start", it: "Home" },
  "nav.pricing": { fr: "Tarifs", en: "Pricing", es: "Precios", "pt-BR": "Preços", de: "Preise", it: "Prezzi" },
  "nav.studio": { fr: "Studio", en: "Studio", es: "Studio", "pt-BR": "Studio", de: "Studio", it: "Studio" },
  "nav.atlas": { fr: "Atlas", en: "Atlas", es: "Atlas", "pt-BR": "Atlas", de: "Atlas", it: "Atlas" },
  "nav.protection": { fr: "Protection", en: "Protection", es: "Protección", "pt-BR": "Proteção", de: "Schutz", it: "Protezione" },
  "nav.security": { fr: "Sécurité", en: "Security", es: "Seguridad", "pt-BR": "Segurança", de: "Sicherheit", it: "Sicurezza" },
  "nav.demo": { fr: "Démo", en: "Demo", es: "Demo", "pt-BR": "Demo", de: "Demo", it: "Demo" },
  "nav.apply": { fr: "Postuler", en: "Apply", es: "Postular", "pt-BR": "Candidatar", de: "Bewerben", it: "Candidati" },

  // ─── Pricing (existing) ───
  "pricing.title": { fr: "Tout est public. Comparez.", en: "Everything is public. Compare.", es: "Todo es público. Compara.", "pt-BR": "Tudo é público. Compare.", de: "Alles ist öffentlich. Vergleichen Sie.", it: "Tutto è pubblico. Confronta." },
  "pricing.subtitle": { fr: "Commissions, abonnements, crédits IA. Aucun frais caché.", en: "Commissions, subscriptions, AI credits. No hidden fees.", es: "Comisiones, suscripciones, créditos IA. Sin cargos ocultos.", "pt-BR": "Comissões, assinaturas, créditos IA. Sem taxas ocultas.", de: "Provisionen, Abos, KI-Credits. Keine versteckten Gebühren.", it: "Commissioni, abbonamenti, crediti IA. Nessun costo nascosto." },
  "pricing.commissions": { fr: "Commissions de management", en: "Management commissions", es: "Comisiones de management", "pt-BR": "Comissões de management", de: "Management-Provisionen", it: "Commissioni di management" },

  // ─── Pricing (new) ───
  "pricing.hero_badge": { fr: "Tarifs transparents", en: "Transparent pricing", es: "Precios transparentes", "pt-BR": "Preços transparentes", de: "Transparente Preise", it: "Prezzi trasparenti" },
  "pricing.hero_title": { fr: "Tout est public.\nRien n'est caché.", en: "Everything is public.\nNothing is hidden.", es: "Todo es público.\nNada está oculto.", "pt-BR": "Tudo é público.\nNada está escondido.", de: "Alles ist öffentlich.\nNichts ist versteckt.", it: "Tutto è pubblico.\nNiente è nascosto." },
  "pricing.hero_desc": { fr: "Commissions dégressives, abonnements clairs, crédits IA. Comparez avec ce que votre agence vous prend vraiment.", en: "Decreasing commissions, clear subscriptions, AI credits. Compare with what your agency really takes.", es: "Comisiones decrecientes, suscripciones claras, créditos IA. Compara con lo que tu agencia realmente te quita.", "pt-BR": "Comissões decrescentes, assinaturas claras, créditos IA. Compare com o que sua agência realmente leva.", de: "Sinkende Provisionen, klare Abos, KI-Credits. Vergleichen Sie mit dem, was Ihre Agentur wirklich nimmt.", it: "Commissioni decrescenti, abbonamenti chiari, crediti IA. Confronta con ciò che la tua agenzia prende davvero." },
  "pricing.calculator_title": { fr: "Simulez votre commission", en: "Simulate your commission", es: "Simula tu comisión", "pt-BR": "Simule sua comissão", de: "Simulieren Sie Ihre Provision", it: "Simula la tua commissione" },
  "pricing.calculator_desc": { fr: "Plus vous générez de revenus, moins le pourcentage prélevé est élevé.", en: "The more revenue you generate, the lower the percentage taken.", es: "Cuanto más generas, menor es el porcentaje que se lleva.", "pt-BR": "Quanto mais receita você gera, menor a porcentagem cobrada.", de: "Je mehr Umsatz Sie machen, desto niedriger der Prozentsatz.", it: "Più guadagni, più bassa è la percentuale trattenuta." },
  "pricing.studio_title": { fr: "Studio IA", en: "AI Studio", es: "Studio IA", "pt-BR": "Studio IA", de: "KI-Studio", it: "Studio IA" },
  "pricing.studio_desc": { fr: "Créez, éditez et publiez avec des agents IA personnalisés à votre ADN créatif.", en: "Create, edit, and publish with AI agents personalized to your creative DNA.", es: "Crea, edita y publica con agentes de IA personalizados según tu ADN creativo.", "pt-BR": "Crie, edite e publique com agentes de IA personalizados ao seu DNA criativo.", de: "Erstellen, bearbeiten und veröffentlichen Sie mit KI-Agenten, die auf Ihre kreative DNA abgestimmt sind.", it: "Crea, modifica e pubblica con agenti IA personalizzati sul tuo DNA creativo." },
  "pricing.atlas_title": { fr: "Atlas CRM", en: "Atlas CRM", es: "Atlas CRM", "pt-BR": "Atlas CRM", de: "Atlas CRM", it: "Atlas CRM" },
  "pricing.atlas_desc": { fr: "Automatisation marketing, segmentation fans et campagnes multi-canal.", en: "Marketing automation, fan segmentation, and multi-channel campaigns.", es: "Automatización de marketing, segmentación de fans y campañas multicanal.", "pt-BR": "Automação de marketing, segmentação de fãs e campanhas multicanal.", de: "Marketing-Automatisierung, Fan-Segmentierung und Multi-Channel-Kampagnen.", it: "Automazione marketing, segmentazione fan e campagne multicanale." },
  "pricing.faq_title": { fr: "Questions fréquentes", en: "Frequently asked questions", es: "Preguntas frecuentes", "pt-BR": "Perguntas frequentes", de: "Häufige Fragen", it: "Domande frequenti" },
  "pricing.cta_title": { fr: "Prêt à reprendre le contrôle ?", en: "Ready to take back control?", es: "¿Listo para recuperar el control?", "pt-BR": "Pronto para retomar o controle?", de: "Bereit, die Kontrolle zurückzuholen?", it: "Pronto a riprendere il controllo?" },
  "pricing.cta_apply": { fr: "Postuler à la maison", en: "Apply to the house", es: "Postular a la maison", "pt-BR": "Candidatar-se", de: "Bei der Maison bewerben", it: "Candidati alla maison" },
  "pricing.cta_studio": { fr: "Essayer le Studio", en: "Try Studio", es: "Probar Studio", "pt-BR": "Experimentar Studio", de: "Studio testen", it: "Prova Studio" },

  // ─── Trust Center (existing) ───
  "trust.title": { fr: "Centre de Confiance", en: "Trust Center", es: "Centro de Confianza", "pt-BR": "Centro de Confiança", de: "Vertrauenszentrum", it: "Centro Fiduciario" },

  // ─── Demo (existing) ───
  "demo.title": { fr: "Démo Halo Talent", en: "Halo Talent Demo", es: "Demo Halo Talent", "pt-BR": "Demo Halo Talent", de: "Halo Talent Demo", it: "Demo Halo Talent" },
  "demo.disclaimer": { fr: "Données de démonstration", en: "Demo data", es: "Datos de demostración", "pt-BR": "Dados de demonstração", de: "Demodaten", it: "Dati dimostrativi" },

  // ─── Shared CTAs (existing) ───
  "cta.apply": { fr: "Postuler à la maison", en: "Apply to the house", es: "Postular a la maison", "pt-BR": "Candidatar-se", de: "Bei der Maison bewerben", it: "Candidati alla maison" },
  "cta.try_studio": { fr: "Essayer le Studio", en: "Try Studio", es: "Probar Studio", "pt-BR": "Experimentar Studio", de: "Studio testen", it: "Prova Studio" },
  "cta.start_free": { fr: "Commencer gratuitement", en: "Start for free", es: "Comenzar gratis", "pt-BR": "Começar grátis", de: "Kostenlos starten", it: "Inizia gratis" },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Hero
  // ═══════════════════════════════════════════════════════════════
  "home.hero.title": {
    fr: "L'operating system des créateurs qui veulent grandir sans perdre le contrôle.",
    en: "The operating system for creators who want to grow without losing control.",
    es: "El sistema operativo para creadores que quieren crecer sin perder el control.",
    "pt-BR": "O operating system para criadores que querem crescer sem perder o controle.",
    de: "Das Betriebssystem für Creator, die wachsen wollen, ohne die Kontrolle zu verlieren.",
    it: "Il sistema operativo per i creator che vogliono crescere senza perdere il controllo.",
  },
  "home.hero.subtitle": {
    fr: "Studio IA, CRM, management, analytics et protection dans une seule plateforme internationale. Créez plus vite, vendez mieux, gardez vos comptes.",
    en: "AI Studio, CRM, management, analytics, and protection in a single international platform. Create faster, sell better, keep your accounts.",
    es: "Studio IA, CRM, management, analíticas y protección en una sola plataforma internacional. Crea más rápido, vende mejor, conserva tus cuentas.",
    "pt-BR": "Studio IA, CRM, gestão, analytics e proteção em uma única plataforma internacional. Crie mais rápido, venda melhor, mantenha suas contas.",
    de: "KI-Studio, CRM, Management, Analytics und Schutz in einer einzigen internationalen Plattform. Schneller erstellen, besser verkaufen, Ihre Konten behalten.",
    it: "Studio IA, CRM, management, analytics e protezione in un'unica piattaforma internazionale. Crea più velocemente, vendi meglio, tieni i tuoi account.",
  },
  "home.hero.cta_analyze": {
    fr: "Analyser mon contrat gratuitement",
    en: "Analyze my contract for free",
    es: "Analizar mi contrato gratis",
    "pt-BR": "Analisar meu contrato grátis",
    de: "Meinen Vertrag kostenlos analysieren",
    it: "Analizza il mio contratto gratuitamente",
  },
  "home.hero.cta_demo": {
    fr: "Voir la démo produit",
    en: "See product demo",
    es: "Ver demo del producto",
    "pt-BR": "Ver demo do produto",
    de: "Produktdemo ansehen",
    it: "Guarda la demo del prodotto",
  },
  "home.hero.micro_proofs": {
    fr: "Commissions publiques · Données exportables · Validation humaine · 6 langues",
    en: "Public commissions · Exportable data · Human validation · 6 languages",
    es: "Comisiones públicas · Datos exportables · Validación humana · 6 idiomas",
    "pt-BR": "Comissões públicas · Dados exportáveis · Validação humana · 6 idiomas",
    de: "Öffentliche Provisionen · Exportierbare Daten · Menschliche Validierung · 6 Sprachen",
    it: "Commissioni pubbliche · Dati esportabili · Validazione umana · 6 lingue",
  },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Pain Points
  // ═══════════════════════════════════════════════════════════════
  "home.pain.title": {
    fr: "Pourquoi les outils actuels ne suffisent plus",
    en: "Why current tools aren't enough anymore",
    es: "Por qué las herramientas actuales ya no son suficientes",
    "pt-BR": "Por que as ferramentas atuais não são mais suficientes",
    de: "Warum aktuelle Tools nicht mehr ausreichen",
    it: "Perché gli strumenti attuali non bastano più",
  },
  "home.pain.subtitle": {
    fr: "Les créateurs utilisent 5 à 8 outils différents. Aucun ne communique avec les autres. Halo unifie tout.",
    en: "Creators use 5 to 8 different tools. None of them talk to each other. Halo unifies everything.",
    es: "Los creadores usan de 5 a 8 herramientas diferentes. Ninguna se comunica con las demás. Halo lo unifica todo.",
    "pt-BR": "Criadores usam de 5 a 8 ferramentas diferentes. Nenhuma conversa com a outra. Halo unifica tudo.",
    de: "Creator nutzen 5 bis 8 verschiedene Tools. Keines kommuniziert mit den anderen. Halo vereint alles.",
    it: "I creator usano da 5 a 8 strumenti diversi. Nessuno comunica con gli altri. Halo unifica tutto.",
  },
  "home.pain.card1_title": {
    fr: "Vous ne savez pas quels fans contacter en priorité",
    en: "You don't know which fans to contact first",
    es: "No sabes a qué fans contactar primero",
    "pt-BR": "Você não sabe quais fãs contatar primeiro",
    de: "Sie wissen nicht, welche Fans Sie zuerst kontaktieren sollen",
    it: "Non sai quali fan contattare per primi",
  },
  "home.pain.card1_desc": {
    fr: "Les inboxes classiques mélangent tout le monde. Impossible de prioriser les fans qui génèrent le plus de revenus.",
    en: "Classic inboxes mix everyone together. Impossible to prioritize the fans who generate the most revenue.",
    es: "Las bandejas de entrada clásicas mezclan a todos. Imposible priorizar a los fans que más ingresos generan.",
    "pt-BR": "As inboxes clássicas misturam todo mundo. Impossível priorizar os fãs que mais geram receita.",
    de: "Klassische Posteingänge mischen alle zusammen. Unmöglich, die umsatzstärksten Fans zu priorisieren.",
    it: "Le inbox classiche mescolano tutti. Impossibile dare priorità ai fan che generano più entrate.",
  },
  "home.pain.card2_title": {
    fr: "Vos médias sont dispersés dans un vault mal organisé",
    en: "Your media is scattered across a poorly organized vault",
    es: "Tus medios están dispersos en un vault mal organizado",
    "pt-BR": "Suas mídias estão espalhadas em um vault mal organizado",
    de: "Ihre Medien sind in einem schlecht organisierten Vault verstreut",
    it: "I tuoi media sono sparsi in un vault mal organizzato",
  },
  "home.pain.card2_desc": {
    fr: "Vous perdez du temps à chercher vos contenus. Sans tags, sans recherche, sans versioning.",
    en: "You waste time searching for your content. No tags, no search, no versioning.",
    es: "Pierdes tiempo buscando tu contenido. Sin etiquetas, sin búsqueda, sin versiones.",
    "pt-BR": "Você perde tempo procurando seu conteúdo. Sem tags, sem busca, sem versionamento.",
    de: "Sie verschwenden Zeit mit der Suche nach Ihren Inhalten. Keine Tags, keine Suche, keine Versionierung.",
    it: "Perdi tempo a cercare i tuoi contenuti. Nessun tag, nessuna ricerca, nessun versioning.",
  },
  "home.pain.card3_title": {
    fr: "Vos chatters vendent, mais vous ne savez pas qui performe",
    en: "Your chatters are selling, but you don't know who's performing",
    es: "Tus chatters venden, pero no sabes quién está rindiendo",
    "pt-BR": "Seus chatters estão vendendo, mas você não sabe quem está performando",
    de: "Ihre Chatter verkaufen, aber Sie wissen nicht, wer performt",
    it: "I tuoi chatter vendono, ma non sai chi sta performando",
  },
  "home.pain.card3_desc": {
    fr: "Sans attribution claire, vous ne pouvez pas coacher, récompenser ou remplacer efficacement.",
    en: "Without clear attribution, you can't coach, reward, or replace effectively.",
    es: "Sin atribución clara, no puedes entrenar, recompensar o reemplazar eficazmente.",
    "pt-BR": "Sem atribuição clara, você não pode treinar, recompensar ou substituir eficazmente.",
    de: "Ohne klare Zuordnung können Sie nicht effektiv coachen, belohnen oder ersetzen.",
    it: "Senza un'attribuzione chiara, non puoi allenare, premiare o sostituire efficacemente.",
  },
  "home.pain.card4_title": {
    fr: "Votre agence prend une commission sans vous donner les données",
    en: "Your agency takes a commission without giving you the data",
    es: "Tu agencia cobra una comisión sin darte los datos",
    "pt-BR": "Sua agência cobra comissão sem te dar os dados",
    de: "Ihre Agentur kassiert Provision, ohne Ihnen die Daten zu geben",
    it: "La tua agenzia prende una commissione senza darti i dati",
  },
  "home.pain.card4_desc": {
    fr: "Vous ne savez pas combien vous générez vraiment, ni ce que l'agence prélève. L'écart peut être énorme.",
    en: "You don't know how much you're really generating, or what the agency is taking. The gap can be huge.",
    es: "No sabes cuánto generas realmente ni lo que la agencia se lleva. La diferencia puede ser enorme.",
    "pt-BR": "Você não sabe quanto realmente gera, nem o que a agência está levando. A diferença pode ser enorme.",
    de: "Sie wissen nicht, wie viel Sie wirklich generieren oder was die Agentur einbehält. Die Lücke kann riesig sein.",
    it: "Non sai quanto stai veramente generando, né cosa l'agenzia sta prendendo. Il divario può essere enorme.",
  },
  "home.pain.cta": {
    fr: "Voir comment Halo résout ça",
    en: "See how Halo solves this",
    es: "Ver cómo Halo resuelve esto",
    "pt-BR": "Ver como Halo resolve isso",
    de: "Sehen, wie Halo das löst",
    it: "Scopri come Halo risolve questo",
  },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Tools (replaces 5)
  // ═══════════════════════════════════════════════════════════════
  "home.tools.title": {
    fr: "Halo remplace 5 outils",
    en: "Halo replaces 5 tools",
    es: "Halo reemplaza 5 herramientas",
    "pt-BR": "Halo substitui 5 ferramentas",
    de: "Halo ersetzt 5 Tools",
    it: "Halo sostituisce 5 strumenti",
  },
  "home.tools.subtitle": {
    fr: "Une plateforme. Tout intégré. Zéro couture entre les briques.",
    en: "One platform. Fully integrated. Zero seams between modules.",
    es: "Una plataforma. Todo integrado. Cero costuras entre módulos.",
    "pt-BR": "Uma plataforma. Tudo integrado. Zero costuras entre módulos.",
    de: "Eine Plattform. Vollständig integriert. Keine Nähte zwischen den Modulen.",
    it: "Una piattaforma. Tutto integrato. Zero cuciture tra i moduli.",
  },
  "home.tools.card1_title": { fr: "Studio IA", en: "AI Studio", es: "Studio IA", "pt-BR": "Studio IA", de: "KI-Studio", it: "Studio IA" },
  "home.tools.card1_desc": {
    fr: "Créez des posts, stories, reels et scripts avec une IA formée sur votre style.",
    en: "Create posts, stories, reels, and scripts with AI trained on your style.",
    es: "Crea posts, stories, reels y scripts con IA entrenada en tu estilo.",
    "pt-BR": "Crie posts, stories, reels e scripts com IA treinada no seu estilo.",
    de: "Erstellen Sie Posts, Stories, Reels und Skripte mit KI, die auf Ihren Stil trainiert ist.",
    it: "Crea post, stories, reel e script con IA addestrata sul tuo stile.",
  },
  "home.tools.card2_title": { fr: "Revenue Inbox", en: "Revenue Inbox", es: "Revenue Inbox", "pt-BR": "Revenue Inbox", de: "Revenue Inbox", it: "Revenue Inbox" },
  "home.tools.card2_desc": {
    fr: "Une inbox qui classe vos fans par priorité de revenu, pas par ordre chronologique.",
    en: "An inbox that ranks your fans by revenue priority, not by chronological order.",
    es: "Una bandeja que clasifica a tus fans por prioridad de ingresos, no por orden cronológico.",
    "pt-BR": "Uma inbox que classifica seus fãs por prioridade de receita, não por ordem cronológica.",
    de: "Ein Posteingang, der Ihre Fans nach Umsatzpriorität ordnet, nicht chronologisch.",
    it: "Una inbox che classifica i tuoi fan per priorità di entrate, non in ordine cronologico.",
  },
  "home.tools.card3_title": { fr: "Atlas CRM", en: "Atlas CRM", es: "Atlas CRM", "pt-BR": "Atlas CRM", de: "Atlas CRM", it: "Atlas CRM" },
  "home.tools.card3_desc": {
    fr: "Segmentez, scorez et automatisez vos campagnes. Du funnel de vente au message personnalisé.",
    en: "Segment, score, and automate your campaigns. From sales funnel to personalized message.",
    es: "Segmenta, puntúa y automatiza tus campañas. Del funnel de ventas al mensaje personalizado.",
    "pt-BR": "Segmente, pontue e automatize suas campanhas. Do funil de vendas à mensagem personalizada.",
    de: "Segmentieren, bewerten und automatisieren Sie Ihre Kampagnen. Vom Verkaufstrichter zur personalisierten Nachricht.",
    it: "Segmenta, assegna punteggi e automatizza le tue campagne. Dal funnel di vendita al messaggio personalizzato.",
  },
  "home.tools.card4_title": { fr: "Content Vault", en: "Content Vault", es: "Content Vault", "pt-BR": "Content Vault", de: "Content Vault", it: "Content Vault" },
  "home.tools.card4_desc": {
    fr: "Stockez, taguez, versionnez et retrouvez tous vos médias en une seconde.",
    en: "Store, tag, version, and find all your media in one second.",
    es: "Almacena, etiqueta, versiona y encuentra todos tus medios en un segundo.",
    "pt-BR": "Armazene, tagueie, versione e encontre todas as suas mídias em um segundo.",
    de: "Speichern, taggen, versionieren und finden Sie alle Ihre Medien in einer Sekunde.",
    it: "Archivia, tagga, versiona e trova tutti i tuoi media in un secondo.",
  },
  "home.tools.card5_title": { fr: "Bouclier Légal", en: "Legal Shield", es: "Escudo Legal", "pt-BR": "Escudo Legal", de: "Rechtsschutz", it: "Scudo Legale" },
  "home.tools.card5_desc": {
    fr: "Analysez vos contrats d'agence, identifiez les clauses abusives et générez des lettres de mise en demeure.",
    en: "Analyze agency contracts, identify unfair clauses, and generate formal notice letters.",
    es: "Analiza contratos de agencia, identifica cláusulas abusivas y genera cartas de requerimiento.",
    "pt-BR": "Analise contratos de agência, identifique cláusulas abusivas e gere notificações formais.",
    de: "Analysieren Sie Agenturverträge, identifizieren Sie missbräuchliche Klauseln und erstellen Sie Mahnschreiben.",
    it: "Analizza i contratti d'agenzia, identifica le clausole abusive e genera lettere di diffida.",
  },
  "home.tools.cta": {
    fr: "Explorer tous les outils",
    en: "Explore all tools",
    es: "Explorar todas las herramientas",
    "pt-BR": "Explorar todas as ferramentas",
    de: "Alle Tools erkunden",
    it: "Esplora tutti gli strumenti",
  },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Comparison
  // ═══════════════════════════════════════════════════════════════
  "home.comparison.title": {
    fr: "Ce que Halo fait mieux",
    en: "What Halo does better",
    es: "Lo que Halo hace mejor",
    "pt-BR": "O que Halo faz melhor",
    de: "Was Halo besser macht",
    it: "Cosa Halo fa meglio",
  },
  "home.comparison.subtitle": {
    fr: "Pas de magie. Juste une approche différente de la création et de la vente.",
    en: "No magic. Just a different approach to creating and selling.",
    es: "Sin magia. Solo un enfoque diferente para crear y vender.",
    "pt-BR": "Sem mágica. Apenas uma abordagem diferente para criar e vender.",
    de: "Keine Magie. Nur ein anderer Ansatz zum Erstellen und Verkaufen.",
    it: "Nessuna magia. Solo un approccio diverso alla creazione e alla vendita.",
  },
  "home.comparison.cta": {
    fr: "Voir la comparaison complète",
    en: "See full comparison",
    es: "Ver comparación completa",
    "pt-BR": "Ver comparação completa",
    de: "Vollständigen Vergleich ansehen",
    it: "Vedi confronto completo",
  },
  "home.comparison.row1_label": { fr: "Messagerie", en: "Messaging", es: "Mensajería", "pt-BR": "Mensagens", de: "Nachrichten", it: "Messaggistica" },
  "home.comparison.row1_bad": { fr: "Inboxes classiques mélangent tout le monde", en: "Classic inboxes mix everyone together", es: "Las bandejas clásicas mezclan a todos", "pt-BR": "Inboxes clássicas misturam todo mundo", de: "Klassische Posteingänge mischen alle", it: "Le inbox classiche mescolano tutti" },
  "home.comparison.row1_good": { fr: "Revenue Inbox priorise par valeur et intention d'achat", en: "Revenue Inbox prioritizes by value and purchase intent", es: "Revenue Inbox prioriza por valor e intención de compra", "pt-BR": "Revenue Inbox prioriza por valor e intenção de compra", de: "Revenue Inbox priorisiert nach Wert und Kaufabsicht", it: "Revenue Inbox dà priorità per valore e intenzione d'acquisto" },
  "home.comparison.row2_label": { fr: "Scripts", en: "Scripts", es: "Guiones", "pt-BR": "Scripts", de: "Skripte", it: "Script" },
  "home.comparison.row2_bad": { fr: "Scripts génériques copiés-collés sans personnalité", en: "Generic copy-pasted scripts with no personality", es: "Guiones genéricos copiados sin personalidad", "pt-BR": "Scripts genéricos copiados sem personalidade", de: "Generische Copy-Paste-Skripte ohne Persönlichkeit", it: "Script generici copia-incolla senza personalità" },
  "home.comparison.row2_good": { fr: "ADN créatif : chaque script reflète votre voix et votre style", en: "Creative DNA: every script reflects your voice and style", es: "ADN creativo: cada guion refleja tu voz y tu estilo", "pt-BR": "DNA criativo: cada script reflete sua voz e seu estilo", de: "Kreative DNA: Jedes Skript spiegelt Ihre Stimme und Ihren Stil wider", it: "DNA creativo: ogni script riflette la tua voce e il tuo stile" },
  "home.comparison.row3_label": { fr: "Prix", en: "Pricing", es: "Precios", "pt-BR": "Preços", de: "Preise", it: "Prezzi" },
  "home.comparison.row3_bad": { fr: "Commissions opaques, frais cachés, pourcentages qui ne baissent jamais", en: "Opaque commissions, hidden fees, percentages that never drop", es: "Comisiones opacas, tarifas ocultas, porcentajes que nunca bajan", "pt-BR": "Comissões opacas, taxas ocultas, percentuais que nunca caem", de: "Undurchsichtige Provisionen, versteckte Gebühren, Prozentsätze die nie sinken", it: "Commissioni opache, costi nascosti, percentuali che non scendono mai" },
  "home.comparison.row3_good": { fr: "Commission publique et dégressive : plus vous gagnez, moins nous prenons", en: "Public, decreasing commission: the more you earn, the less we take", es: "Comisión pública y decreciente: cuanto más ganas, menos tomamos", "pt-BR": "Comissão pública e decrescente: quanto mais você ganha, menos levamos", de: "Öffentliche, sinkende Provision: Je mehr Sie verdienen, desto weniger nehmen wir", it: "Commissione pubblica e decrescente: più guadagni, meno prendiamo" },
  "home.comparison.row4_label": { fr: "IA", en: "AI", es: "IA", "pt-BR": "IA", de: "KI", it: "IA" },
  "home.comparison.row4_bad": { fr: "Bot automatique qui spamme sans discernement", en: "Automated bot that spams indiscriminately", es: "Bot automático que spamea sin criterio", "pt-BR": "Bot automático que spamma sem critério", de: "Automatisierter Bot, der wahllos spammt", it: "Bot automatico che spamma indiscriminatamente" },
  "home.comparison.row4_good": { fr: "IA assistée : vous validez chaque message avant envoi", en: "Assisted AI: you validate every message before sending", es: "IA asistida: validas cada mensaje antes de enviar", "pt-BR": "IA assistida: você valida cada mensagem antes de enviar", de: "Assistierte KI: Sie validieren jede Nachricht vor dem Senden", it: "IA assistita: convalidi ogni messaggio prima dell'invio" },
  "home.comparison.row5_label": { fr: "Dashboard", en: "Dashboard", es: "Dashboard", "pt-BR": "Dashboard", de: "Dashboard", it: "Dashboard" },
  "home.comparison.row5_bad": { fr: "Dashboard statique qui montre ce qui s'est passé il y a 3 jours", en: "Static dashboard showing what happened 3 days ago", es: "Dashboard estático que muestra lo que pasó hace 3 días", "pt-BR": "Dashboard estático mostrando o que aconteceu há 3 dias", de: "Statisches Dashboard, das zeigt, was vor 3 Tagen passiert ist", it: "Dashboard statico che mostra cosa è successo 3 giorni fa" },
  "home.comparison.row5_good": { fr: "Cockpit temps réel avec actions recommandées", en: "Real-time cockpit with recommended actions", es: "Cockpit en tiempo real con acciones recomendadas", "pt-BR": "Cockpit em tempo real com ações recomendadas", de: "Echtzeit-Cockpit mit empfohlenen Aktionen", it: "Cruscotto in tempo reale con azioni raccomandate" },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Workflow
  // ═══════════════════════════════════════════════════════════════
  "home.workflow.title": {
    fr: "Comment ça marche",
    en: "How it works",
    es: "Cómo funciona",
    "pt-BR": "Como funciona",
    de: "So funktioniert's",
    it: "Come funziona",
  },
  "home.workflow.subtitle": {
    fr: "De la découverte de votre ADN créatif au pilotage de votre croissance. Un processus en 8 étapes.",
    en: "From discovering your creative DNA to piloting your growth. An 8-step process.",
    es: "Del descubrimiento de tu ADN creativo al pilotaje de tu crecimiento. Un proceso de 8 pasos.",
    "pt-BR": "Da descoberta do seu DNA criativo à pilotagem do seu crescimento. Um processo de 8 etapas.",
    de: "Von der Entdeckung Ihrer kreativen DNA bis zur Steuerung Ihres Wachstums. Ein 8-Schritte-Prozess.",
    it: "Dalla scoperta del tuo DNA creativo al pilotaggio della tua crescita. Un processo in 8 fasi.",
  },
  "home.workflow.step1_label": { fr: "Onboard ADN", en: "Onboard DNA", es: "Onboard ADN", "pt-BR": "Onboard DNA", de: "DNA-Onboarding", it: "Onboard DNA" },
  "home.workflow.step1_desc": { fr: "Définissez votre voix, votre audience et vos objectifs", en: "Define your voice, audience, and goals", es: "Define tu voz, tu audiencia y tus objetivos", "pt-BR": "Defina sua voz, audiência e objetivos", de: "Definieren Sie Ihre Stimme, Zielgruppe und Ziele", it: "Definisci la tua voce, il tuo pubblico e i tuoi obiettivi" },
  "home.workflow.step2_label": { fr: "Connectez", en: "Connect", es: "Conecta", "pt-BR": "Conecte", de: "Verbinden", it: "Connetti" },
  "home.workflow.step2_desc": { fr: "Liez vos plateformes en 2 clics", en: "Link your platforms in 2 clicks", es: "Vincula tus plataformas en 2 clics", "pt-BR": "Vincule suas plataformas em 2 cliques", de: "Verknüpfen Sie Ihre Plattformen mit 2 Klicks", it: "Collega le tue piattaforme in 2 clic" },
  "home.workflow.step3_label": { fr: "Importez", en: "Import", es: "Importa", "pt-BR": "Importe", de: "Importieren", it: "Importa" },
  "home.workflow.step3_desc": { fr: "Importez fans et médias automatiquement", en: "Import fans and media automatically", es: "Importa fans y medios automáticamente", "pt-BR": "Importe fãs e mídias automaticamente", de: "Importieren Sie Fans und Medien automatisch", it: "Importa fan e media automaticamente" },
  "home.workflow.step4_label": { fr: "Scorez", en: "Score", es: "Puntúa", "pt-BR": "Pontue", de: "Bewerten", it: "Valuta" },
  "home.workflow.step4_desc": { fr: "Identifiez les opportunités de vente prioritaires", en: "Identify priority sales opportunities", es: "Identifica oportunidades de venta prioritarias", "pt-BR": "Identifique oportunidades de venda prioritárias", de: "Identifizieren Sie priorisierte Verkaufschancen", it: "Identifica le opportunità di vendita prioritarie" },
  "home.workflow.step5_label": { fr: "Générez", en: "Generate", es: "Genera", "pt-BR": "Gere", de: "Generieren", it: "Genera" },
  "home.workflow.step5_desc": { fr: "Créez des scripts personnalisés avec l'IA", en: "Create personalized scripts with AI", es: "Crea guiones personalizados con IA", "pt-BR": "Crie scripts personalizados com IA", de: "Erstellen Sie personalisierte Skripte mit KI", it: "Crea script personalizzati con l'IA" },
  "home.workflow.step6_label": { fr: "Approuvez", en: "Approve", es: "Aprueba", "pt-BR": "Aprove", de: "Genehmigen", it: "Approva" },
  "home.workflow.step6_desc": { fr: "Validez chaque message avant envoi", en: "Validate every message before sending", es: "Valida cada mensaje antes de enviar", "pt-BR": "Valide cada mensagem antes de enviar", de: "Validieren Sie jede Nachricht vor dem Senden", it: "Convalida ogni messaggio prima dell'invio" },
  "home.workflow.step7_label": { fr: "Trackez", en: "Track", es: "Rastrea", "pt-BR": "Rastreie", de: "Verfolgen", it: "Traccia" },
  "home.workflow.step7_desc": { fr: "Mesurez le revenu généré par chaque action", en: "Measure revenue generated by each action", es: "Mide los ingresos generados por cada acción", "pt-BR": "Meça a receita gerada por cada ação", de: "Messen Sie den Umsatz jeder Aktion", it: "Misura le entrate generate da ogni azione" },
  "home.workflow.step8_label": { fr: "Améliorez", en: "Improve", es: "Mejora", "pt-BR": "Melhore", de: "Verbessern", it: "Migliora" },
  "home.workflow.step8_desc": { fr: "Ajustez votre stratégie avec les données réelles", en: "Adjust your strategy with real data", es: "Ajusta tu estrategia con datos reales", "pt-BR": "Ajuste sua estratégia com dados reais", de: "Passen Sie Ihre Strategie mit echten Daten an", it: "Adatta la tua strategia con dati reali" },
  "home.workflow.cta": {
    fr: "Commencer maintenant",
    en: "Start now",
    es: "Comenzar ahora",
    "pt-BR": "Começar agora",
    de: "Jetzt starten",
    it: "Inizia ora",
  },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Trust
  // ═══════════════════════════════════════════════════════════════
  "home.trust.title": {
    fr: "Construit sur la confiance",
    en: "Built on trust",
    es: "Construido sobre la confianza",
    "pt-BR": "Construído sobre confiança",
    de: "Auf Vertrauen gebaut",
    it: "Costruito sulla fiducia",
  },
  "home.trust.subtitle": {
    fr: "Pas de logos fictifs. Pas de promesses impossibles. Juste des engagements vérifiables.",
    en: "No fake logos. No impossible promises. Just verifiable commitments.",
    es: "Sin logos falsos. Sin promesas imposibles. Solo compromisos verificables.",
    "pt-BR": "Sem logos falsos. Sem promessas impossíveis. Apenas compromissos verificáveis.",
    de: "Keine gefälschten Logos. Keine unmöglichen Versprechen. Nur überprüfbare Verpflichtungen.",
    it: "Nessun logo falso. Nessuna promessa impossibile. Solo impegni verificabili.",
  },
  "home.trust.point1": { fr: "Export de données", en: "Data export", es: "Exportación de datos", "pt-BR": "Exportação de dados", de: "Datenexport", it: "Esportazione dati" },
  "home.trust.point2": { fr: "Logs d'audit", en: "Audit logs", es: "Registros de auditoría", "pt-BR": "Logs de auditoria", de: "Audit-Logs", it: "Log di audit" },
  "home.trust.point3": { fr: "Permissions", en: "Permissions", es: "Permisos", "pt-BR": "Permissões", de: "Berechtigungen", it: "Permessi" },
  "home.trust.point4": { fr: "Contrat clair", en: "Clear contract", es: "Contrato claro", "pt-BR": "Contrato claro", de: "Klare Verträge", it: "Contratto chiaro" },
  "home.trust.point5": { fr: "Sortie 30 jours", en: "30-day exit", es: "Salida en 30 días", "pt-BR": "Saída em 30 dias", de: "30-Tage-Ausstieg", it: "Uscita in 30 giorni" },
  "home.trust.point6": { fr: "RGPD & ePrivacy", en: "GDPR & ePrivacy", es: "RGPD & ePrivacy", "pt-BR": "LGPD & ePrivacy", de: "DSGVO & ePrivacy", it: "GDPR & ePrivacy" },
  "home.trust.point7": { fr: "Suppression ADN", en: "DNA deletion", es: "Eliminación de ADN", "pt-BR": "Remoção de DNA", de: "DNA-Löschung", it: "Cancellazione DNA" },
  "home.trust.point8": { fr: "BYOK", en: "BYOK", es: "BYOK", "pt-BR": "BYOK", de: "BYOK", it: "BYOK" },
  "home.trust.cta": {
    fr: "Centre de confiance",
    en: "Trust Center",
    es: "Centro de confianza",
    "pt-BR": "Centro de confiança",
    de: "Vertrauenszentrum",
    it: "Centro fiduciario",
  },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — FAQ
  // ═══════════════════════════════════════════════════════════════
  "home.faq.title": {
    fr: "Questions fréquentes",
    en: "Frequently asked questions",
    es: "Preguntas frecuentes",
    "pt-BR": "Perguntas frequentes",
    de: "Häufige Fragen",
    it: "Domande frequenti",
  },
  "home.faq.subtitle": {
    fr: "Tout ce que vous devez savoir avant de nous rejoindre.",
    en: "Everything you need to know before joining us.",
    es: "Todo lo que necesitas saber antes de unirte.",
    "pt-BR": "Tudo que você precisa saber antes de se juntar a nós.",
    de: "Alles, was Sie wissen müssen, bevor Sie zu uns kommen.",
    it: "Tutto ciò che devi sapere prima di unirti a noi.",
  },
  "home.faq.q1": {
    fr: "Est-ce que Halo répond à ma place ?",
    en: "Does Halo reply for me?",
    es: "¿Halo responde por mí?",
    "pt-BR": "Halo responde por mim?",
    de: "Antwortet Halo für mich?",
    it: "Halo risponde al posto mio?",
  },
  "home.faq.a1": {
    fr: "Non. Halo génère des suggestions et des scripts que vous validez avant envoi. Rien n'est automatique sans votre approbation. Vous gardez le contrôle total de chaque message.",
    en: "No. Halo generates suggestions and scripts that you validate before sending. Nothing is automatic without your approval. You keep full control of every message.",
    es: "No. Halo genera sugerencias y guiones que tú validas antes de enviar. Nada es automático sin tu aprobación. Mantienes el control total de cada mensaje.",
    "pt-BR": "Não. Halo gera sugestões e scripts que você valida antes de enviar. Nada é automático sem sua aprovação. Você mantém controle total de cada mensagem.",
    de: "Nein. Halo generiert Vorschläge und Skripte, die Sie vor dem Senden validieren. Nichts geschieht automatisch ohne Ihre Zustimmung. Sie behalten die volle Kontrolle über jede Nachricht.",
    it: "No. Halo genera suggerimenti e script che convalidi prima dell'invio. Niente è automatico senza la tua approvazione. Mantieni il pieno controllo di ogni messaggio.",
  },
  "home.faq.q2": {
    fr: "Est-ce que mes comptes sont en danger ?",
    en: "Are my accounts at risk?",
    es: "¿Están en peligro mis cuentas?",
    "pt-BR": "Minhas contas estão em risco?",
    de: "Sind meine Konten in Gefahr?",
    it: "I miei account sono a rischio?",
  },
  "home.faq.a2": {
    fr: "Nous ne vous demandons jamais vos identifiants. Nos outils respectent les CGU de chaque plateforme. Nous utilisons les APIs officielles quand elles existent. Votre compte reste le vôtre.",
    en: "We never ask for your login credentials. Our tools respect each platform's ToS. We use official APIs when available. Your account remains yours.",
    es: "Nunca te pedimos tus credenciales. Nuestras herramientas respetan las CGU de cada plataforma. Usamos APIs oficiales cuando existen. Tu cuenta sigue siendo tuya.",
    "pt-BR": "Nunca pedimos suas credenciais. Nossas ferramentas respeitam os Termos de cada plataforma. Usamos APIs oficiais quando existem. Sua conta continua sendo sua.",
    de: "Wir fragen niemals nach Ihren Zugangsdaten. Unsere Tools respektieren die AGB jeder Plattform. Wir nutzen offizielle APIs, wenn verfügbar. Ihr Konto bleibt Ihres.",
    it: "Non ti chiediamo mai le tue credenziali. I nostri strumenti rispettano i termini di ogni piattaforma. Usiamo API ufficiali quando disponibili. Il tuo account rimane tuo.",
  },
  "home.faq.q3": {
    fr: "Qui voit mes données ?",
    en: "Who sees my data?",
    es: "¿Quién ve mis datos?",
    "pt-BR": "Quem vê meus dados?",
    de: "Wer sieht meine Daten?",
    it: "Chi vede i miei dati?",
  },
  "home.faq.a3": {
    fr: "Vous choisissez. Notre système de permissions vous permet de décider qui accède à quoi : rien, tout, ou seulement certains modules. Les logs d'audit tracent chaque accès.",
    en: "You choose. Our permission system lets you decide who accesses what: nothing, everything, or only specific modules. Audit logs track every access.",
    es: "Tú eliges. Nuestro sistema de permisos te permite decidir quién accede a qué: nada, todo o solo ciertos módulos. Los registros de auditoría rastrean cada acceso.",
    "pt-BR": "Você escolhe. Nosso sistema de permissões permite decidir quem acessa o quê: nada, tudo ou apenas módulos específicos. Logs de auditoria rastreiam cada acesso.",
    de: "Sie entscheiden. Unser Berechtigungssystem lässt Sie festlegen, wer worauf zugreift: nichts, alles oder nur bestimmte Module. Audit-Logs zeichnen jeden Zugriff auf.",
    it: "Scegli tu. Il nostro sistema di permessi ti permette di decidere chi accede a cosa: niente, tutto o solo moduli specifici. I log di audit tracciano ogni accesso.",
  },
  "home.faq.q4": {
    fr: "Est-ce réservé à OnlyFans ?",
    en: "Is this only for OnlyFans?",
    es: "¿Es solo para OnlyFans?",
    "pt-BR": "É só para OnlyFans?",
    de: "Ist das nur für OnlyFans?",
    it: "È solo per OnlyFans?",
  },
  "home.faq.a4": {
    fr: "Non. Halo est conçu pour tous les créateurs de contenu : TikTok, Instagram, YouTube, MYM, Fansly et plus. Nos outils s'adaptent à votre plateforme.",
    en: "No. Halo is designed for all content creators: TikTok, Instagram, YouTube, MYM, Fansly, and more. Our tools adapt to your platform.",
    es: "No. Halo está diseñado para todos los creadores de contenido: TikTok, Instagram, YouTube, MYM, Fansly y más. Nuestras herramientas se adaptan a tu plataforma.",
    "pt-BR": "Não. Halo é projetado para todos os criadores de conteúdo: TikTok, Instagram, YouTube, MYM, Fansly e mais. Nossas ferramentas se adaptam à sua plataforma.",
    de: "Nein. Halo ist für alle Content Creator gemacht: TikTok, Instagram, YouTube, MYM, Fansly und mehr. Unsere Tools passen sich Ihrer Plattform an.",
    it: "No. Halo è progettato per tutti i content creator: TikTok, Instagram, YouTube, MYM, Fansly e altro. I nostri strumenti si adattano alla tua piattaforma.",
  },
  "home.faq.q5": {
    fr: "Puis-je utiliser seulement le SaaS, sans management ?",
    en: "Can I use just the SaaS, without management?",
    es: "¿Puedo usar solo el SaaS, sin management?",
    "pt-BR": "Posso usar apenas o SaaS, sem gestão?",
    de: "Kann ich nur die SaaS-Tools nutzen, ohne Management?",
    it: "Posso usare solo il SaaS, senza management?",
  },
  "home.faq.a5": {
    fr: "Oui. Le Studio IA et Atlas CRM sont disponibles en SaaS pur, sans commission sur vos revenus. Vous payez un abonnement fixe et gardez 100% de ce que vous générez.",
    en: "Yes. AI Studio and Atlas CRM are available as pure SaaS, with no commission on your revenue. You pay a fixed subscription and keep 100% of what you generate.",
    es: "Sí. Studio IA y Atlas CRM están disponibles como SaaS puro, sin comisión sobre tus ingresos. Pagas una suscripción fija y te quedas con el 100% de lo que generas.",
    "pt-BR": "Sim. Studio IA e Atlas CRM estão disponíveis como SaaS puro, sem comissão sobre sua receita. Você paga uma assinatura fixa e fica com 100% do que gera.",
    de: "Ja. KI-Studio und Atlas CRM sind als reines SaaS verfügbar, ohne Provision auf Ihre Einnahmen. Sie zahlen ein festes Abo und behalten 100% Ihrer Einnahmen.",
    it: "Sì. Studio IA e Atlas CRM sono disponibili come SaaS puro, senza commissioni sulle tue entrate. Paghi un abbonamento fisso e tieni il 100% di ciò che generi.",
  },
  "home.faq.q6": {
    fr: "Puis-je partir quand je veux ?",
    en: "Can I leave whenever I want?",
    es: "¿Puedo irme cuando quiera?",
    "pt-BR": "Posso sair quando quiser?",
    de: "Kann ich jederzeit gehen?",
    it: "Posso andarmene quando voglio?",
  },
  "home.faq.a6": {
    fr: "Oui. Notre contrat prévoit une sortie en 30 jours, sans pénalité. Vous exportez vos données et récupérez vos comptes. Pas de frais de sortie, pas de clause d'exclusivité.",
    en: "Yes. Our contract provides a 30-day exit, with no penalty. You export your data and recover your accounts. No exit fees, no exclusivity clause.",
    es: "Sí. Nuestro contrato prevé una salida en 30 días, sin penalización. Exportas tus datos y recuperas tus cuentas. Sin tarifas de salida, sin cláusula de exclusividad.",
    "pt-BR": "Sim. Nosso contrato prevê saída em 30 dias, sem penalidade. Você exporta seus dados e recupera suas contas. Sem taxas de saída, sem cláusula de exclusividade.",
    de: "Ja. Unser Vertrag sieht einen 30-Tage-Ausstieg vor, ohne Vertragsstrafe. Sie exportieren Ihre Daten und erhalten Ihre Konten zurück. Keine Ausstiegsgebühren, keine Exklusivitätsklausel.",
    it: "Sì. Il nostro contratto prevede un'uscita in 30 giorni, senza penali. Esporti i tuoi dati e recuperi i tuoi account. Nessuna tassa di uscita, nessuna clausola di esclusività.",
  },
  "home.faq.q7": {
    fr: "Comment sont calculées les commissions ?",
    en: "How are commissions calculated?",
    es: "¿Cómo se calculan las comisiones?",
    "pt-BR": "Como as comissões são calculadas?",
    de: "Wie werden die Provisionen berechnet?",
    it: "Come vengono calcolate le commissioni?",
  },
  "home.faq.a7": {
    fr: "Nos commissions sont marginales par tranche. Vous payez 30% sur vos premiers 5000€, puis 25% jusqu'à 20000€, et ainsi de suite jusqu'à 10%. Plus vous gagnez, moins le taux effectif est élevé. Tout est public sur notre page tarifs.",
    en: "Our commissions are marginal per bracket. You pay 30% on your first €5000, then 25% up to €20000, and so on down to 10%. The more you earn, the lower your effective rate. Everything is public on our pricing page.",
    es: "Nuestras comisiones son marginales por tramo. Pagas 30% en tus primeros 5000€, luego 25% hasta 20000€, y así hasta 10%. Cuanto más ganas, menor es tu tasa efectiva. Todo está publicado en nuestra página de precios.",
    "pt-BR": "Nossas comissões são marginais por faixa. Você paga 30% nos primeiros €5000, depois 25% até €20000, e assim por diante até 10%. Quanto mais você ganha, menor sua taxa efetiva. Tudo está público na nossa página de preços.",
    de: "Unsere Provisionen sind marginal pro Stufe. Sie zahlen 30% auf die ersten 5.000€, dann 25% bis 20.000€, und so weiter bis 10%. Je mehr Sie verdienen, desto niedriger Ihr effektiver Satz. Alles ist öffentlich auf unserer Preisseite.",
    it: "Le nostre commissioni sono marginali per scaglione. Paghi il 30% sui primi 5000€, poi il 25% fino a 20000€, e così via fino al 10%. Più guadagni, più basso è il tuo tasso effettivo. Tutto è pubblico sulla nostra pagina prezzi.",
  },
  "home.faq.q8": {
    fr: "Que fait le Bouclier Légal ?",
    en: "What does the Legal Shield do?",
    es: "¿Qué hace el Escudo Legal?",
    "pt-BR": "O que o Escudo Legal faz?",
    de: "Was macht der Rechtsschutz?",
    it: "Cosa fa lo Scudo Legale?",
  },
  "home.faq.a8": {
    fr: "C'est un outil gratuit qui analyse votre contrat d'agence en 2 minutes. Il identifie les clauses abusives, calcule un score de risque, et génère une lettre de mise en demeure si nécessaire. 100% anonyme, sans inscription.",
    en: "It's a free tool that analyzes your agency contract in 2 minutes. It identifies unfair clauses, calculates a risk score, and generates a formal notice letter if needed. 100% anonymous, no registration required.",
    es: "Es una herramienta gratuita que analiza tu contrato de agencia en 2 minutos. Identifica cláusulas abusivas, calcula un puntaje de riesgo y genera una carta de requerimiento si es necesario. 100% anónimo, sin registro.",
    "pt-BR": "É uma ferramenta gratuita que analisa seu contrato de agência em 2 minutos. Identifica cláusulas abusivas, calcula uma pontuação de risco e gera uma notificação formal se necessário. 100% anônimo, sem cadastro.",
    de: "Es ist ein kostenloses Tool, das Ihren Agenturvertrag in 2 Minuten analysiert. Es identifiziert missbräuchliche Klauseln, berechnet einen Risikowert und erstellt bei Bedarf ein Mahnschreiben. 100% anonym, keine Anmeldung.",
    it: "È uno strumento gratuito che analizza il tuo contratto d'agenzia in 2 minuti. Identifica clausole abusive, calcola un punteggio di rischio e genera una diffida se necessario. 100% anonimo, senza registrazione.",
  },
  "home.faq.q9": {
    fr: "Est-ce disponible en anglais, espagnol, allemand, portugais, italien ?",
    en: "Is it available in English, Spanish, German, Portuguese, Italian?",
    es: "¿Está disponible en inglés, español, alemán, portugués, italiano?",
    "pt-BR": "Está disponível em inglês, espanhol, alemão, português, italiano?",
    de: "Ist es auf Englisch, Spanisch, Deutsch, Portugiesisch, Italienisch verfügbar?",
    it: "È disponibile in inglese, spagnolo, tedesco, portoghese, italiano?",
  },
  "home.faq.a9": {
    fr: "Oui. L'interface Halo est disponible en 6 langues. Le Bouclier Légal, les contrats, et les communications sont traduits. Nous opérons et accompagnons des créateurs dans toute l'Europe et au Brésil.",
    en: "Yes. The Halo interface is available in 6 languages. The Legal Shield, contracts, and communications are translated. We operate and support creators across Europe and Brazil.",
    es: "Sí. La interfaz de Halo está disponible en 6 idiomas. El Escudo Legal, los contratos y las comunicaciones están traducidos. Operamos y apoyamos a creadores en toda Europa y Brasil.",
    "pt-BR": "Sim. A interface Halo está disponível em 6 idiomas. O Escudo Legal, contratos e comunicações são traduzidos. Operamos e apoiamos criadores em toda Europa e Brasil.",
    de: "Ja. Die Halo-Oberfläche ist in 6 Sprachen verfügbar. Der Rechtsschutz, die Verträge und die Kommunikation sind übersetzt. Wir betreuen Creator in ganz Europa und Brasilien.",
    it: "Sì. L'interfaccia Halo è disponibile in 6 lingue. Lo Scudo Legale, i contratti e le comunicazioni sono tradotti. Operiamo e supportiamo creator in tutta Europa e Brasile.",
  },
  "home.faq.cta": {
    fr: "Une autre question ?",
    en: "Another question?",
    es: "¿Otra pregunta?",
    "pt-BR": "Outra pergunta?",
    de: "Noch eine Frage?",
    it: "Un'altra domanda?",
  },

  // ═══════════════════════════════════════════════════════════════
  // HOMEPAGE — Final CTA
  // ═══════════════════════════════════════════════════════════════
  "home.final_cta.title": {
    fr: "Prêt à reprendre le contrôle de votre carrière ?",
    en: "Ready to take back control of your career?",
    es: "¿Listo para retomar el control de tu carrera?",
    "pt-BR": "Pronto para retomar o controle da sua carreira?",
    de: "Bereit, die Kontrolle über Ihre Karriere zurückzuholen?",
    it: "Pronto a riprendere il controllo della tua carriera?",
  },
  "home.final_cta.subtitle": {
    fr: "Créez, vendez, gérez et protégez votre activité depuis une seule plateforme. Sans perdre le contrôle.",
    en: "Create, sell, manage, and protect your business from a single platform. Without losing control.",
    es: "Crea, vende, gestiona y protege tu negocio desde una sola plataforma. Sin perder el control.",
    "pt-BR": "Crie, venda, gerencie e proteja seu negócio a partir de uma única plataforma. Sem perder o controle.",
    de: "Erstellen, verkaufen, verwalten und schützen Sie Ihr Business von einer Plattform aus. Ohne die Kontrolle zu verlieren.",
    it: "Crea, vendi, gestisci e proteggi la tua attività da un'unica piattaforma. Senza perdere il controllo.",
  },
  "home.final_cta.analyze": {
    fr: "Analyser mon contrat",
    en: "Analyze my contract",
    es: "Analizar mi contrato",
    "pt-BR": "Analisar meu contrato",
    de: "Meinen Vertrag analysieren",
    it: "Analizza il mio contratto",
  },
  "home.final_cta.apply": {
    fr: "Postuler à la maison",
    en: "Apply to the house",
    es: "Postular a la maison",
    "pt-BR": "Candidatar-se",
    de: "Bei der Maison bewerben",
    it: "Candidati alla maison",
  },

  // ═══════════════════════════════════════════════════════════════
  // ATLAS PAGE
  // ═══════════════════════════════════════════════════════════════
  "atlas.hero_title": {
    fr: "Connaissez vos fans.\nAutomatisez sans risque.",
    en: "Know your fans.\nAutomate without risk.",
    es: "Conoce a tus fans.\nAutomatiza sin riesgo.",
    "pt-BR": "Conheça seus fãs.\nAutomatize sem risco.",
    de: "Kennen Sie Ihre Fans.\nAutomatisieren Sie ohne Risiko.",
    it: "Conosci i tuoi fan.\nAutomatizza senza rischi.",
  },
  "atlas.hero_subtitle": {
    fr: "Le CRM conçu pour les créateurs qui veulent vendre plus sans risquer leurs comptes.",
    en: "The CRM designed for creators who want to sell more without risking their accounts.",
    es: "El CRM diseñado para creadores que quieren vender más sin arriesgar sus cuentas.",
    "pt-BR": "O CRM projetado para criadores que querem vender mais sem arriscar suas contas.",
    de: "Das CRM für Creator, die mehr verkaufen wollen, ohne ihre Konten zu riskieren.",
    it: "Il CRM progettato per i creator che vogliono vendere di più senza rischiare i propri account.",
  },
  "atlas.hero_cta": { fr: "Commencer", en: "Get started", es: "Comenzar", "pt-BR": "Começar", de: "Starten", it: "Inizia" },
  "atlas.hero_secondary": { fr: "Voir les fonctionnalités", en: "See features", es: "Ver funcionalidades", "pt-BR": "Ver funcionalidades", de: "Funktionen ansehen", it: "Vedi funzionalità" },

  // ═══════════════════════════════════════════════════════════════
  // STUDIO PAGE
  // ═══════════════════════════════════════════════════════════════
  "studio.hero_title": {
    fr: "Créez avec une IA\nqui connaît votre ADN.",
    en: "Create with AI\nthat knows your DNA.",
    es: "Crea con IA\nque conoce tu ADN.",
    "pt-BR": "Crie com IA\nque conhece seu DNA.",
    de: "Erstellen Sie mit KI,\ndie Ihre DNA kennt.",
    it: "Crea con un'IA\nche conosce il tuo DNA.",
  },
  "studio.hero_subtitle": {
    fr: "Le Studio IA qui apprend votre style, votre voix et votre audience pour générer du contenu qui vous ressemble vraiment.",
    en: "The AI Studio that learns your style, voice, and audience to generate content that truly sounds like you.",
    es: "El Studio IA que aprende tu estilo, tu voz y tu audiencia para generar contenido que realmente se parece a ti.",
    "pt-BR": "O Studio IA que aprende seu estilo, sua voz e sua audiência para gerar conteúdo que realmente soa como você.",
    de: "Das KI-Studio, das Ihren Stil, Ihre Stimme und Ihr Publikum lernt, um Inhalte zu generieren, die wirklich nach Ihnen klingen.",
    it: "Lo Studio IA che impara il tuo stile, la tua voce e il tuo pubblico per generare contenuti che ti assomigliano davvero.",
  },
  "studio.hero_cta": { fr: "Essayer le Studio", en: "Try Studio", es: "Probar Studio", "pt-BR": "Experimentar Studio", de: "Studio testen", it: "Prova Studio" },
  "studio.hero_secondary": { fr: "Voir la démo", en: "See demo", es: "Ver demo", "pt-BR": "Ver demo", de: "Demo ansehen", it: "Guarda demo" },

  // ═══════════════════════════════════════════════════════════════
  // SECURITY PAGE
  // ═══════════════════════════════════════════════════════════════
  "security.hero_title": {
    fr: "Centre de Confiance",
    en: "Trust Center",
    es: "Centro de Confianza",
    "pt-BR": "Centro de Confiança",
    de: "Vertrauenszentrum",
    it: "Centro Fiduciario",
  },
  "security.hero_subtitle": {
    fr: "Tout ce que vous devez savoir sur la sécurité, la confidentialité et le contrôle de vos données.",
    en: "Everything you need to know about security, privacy, and control of your data.",
    es: "Todo lo que necesitas saber sobre seguridad, privacidad y control de tus datos.",
    "pt-BR": "Tudo que você precisa saber sobre segurança, privacidade e controle dos seus dados.",
    de: "Alles, was Sie über Sicherheit, Datenschutz und Kontrolle Ihrer Daten wissen müssen.",
    it: "Tutto ciò che devi sapere su sicurezza, privacy e controllo dei tuoi dati.",
  },
  "security.cta_title": {
    fr: "Des questions sur la sécurité ?",
    en: "Questions about security?",
    es: "¿Preguntas sobre seguridad?",
    "pt-BR": "Perguntas sobre segurança?",
    de: "Fragen zur Sicherheit?",
    it: "Domande sulla sicurezza?",
  },
  "security.cta_pricing": { fr: "Voir les offres", en: "See plans", es: "Ver planes", "pt-BR": "Ver planos", de: "Pläne ansehen", it: "Vedi piani" },
  "security.cta_contact": { fr: "Contacter l'équipe", en: "Contact the team", es: "Contactar al equipo", "pt-BR": "Contatar a equipe", de: "Team kontaktieren", it: "Contatta il team" },
  "security.updated": {
    fr: "Dernière mise à jour : Juin 2026.",
    en: "Last updated: June 2026.",
    es: "Última actualización: Junio 2026.",
    "pt-BR": "Última atualização: Junho 2026.",
    de: "Letzte Aktualisierung: Juni 2026.",
    it: "Ultimo aggiornamento: Giugno 2026.",
  },

  // ═══════════════════════════════════════════════════════════════
  // APPLY PAGE
  // ═══════════════════════════════════════════════════════════════
  "apply.hero_title": {
    fr: "Rejoignez la première maison\nde management transparente.",
    en: "Join the first transparent\nmanagement house.",
    es: "Únete a la primera maison\nde management transparente.",
    "pt-BR": "Junte-se à primeira maison\nde gestão transparente.",
    de: "Werden Sie Teil der ersten transparenten\nManagement-Maison.",
    it: "Unisciti alla prima maison\ndi management trasparente.",
  },
  "apply.hero_subtitle": {
    fr: "Commissions publiques, contrat clair, sortie en 30 jours. Postulez pour être accompagné par une équipe qui ne vous cache rien.",
    en: "Public commissions, clear contract, 30-day exit. Apply to be supported by a team that hides nothing from you.",
    es: "Comisiones públicas, contrato claro, salida en 30 días. Postula para ser acompañado por un equipo que no te oculta nada.",
    "pt-BR": "Comissões públicas, contrato claro, saída em 30 dias. Candidate-se para ser acompanhado por uma equipe que não esconde nada de você.",
    de: "Öffentliche Provisionen, klarer Vertrag, 30-Tage-Ausstieg. Bewerben Sie sich für die Betreuung durch ein Team, das Ihnen nichts verheimlicht.",
    it: "Commissioni pubbliche, contratto chiaro, uscita in 30 giorni. Candidati per essere supportato da un team che non ti nasconde nulla.",
  },
  "apply.hero_cta": {
    fr: "Postuler maintenant",
    en: "Apply now",
    es: "Postular ahora",
    "pt-BR": "Candidatar-se agora",
    de: "Jetzt bewerben",
    it: "Candidati ora",
  },
  "apply.value1_title": { fr: "Commissions publiques", en: "Public commissions", es: "Comisiones públicas", "pt-BR": "Comissões públicas", de: "Öffentliche Provisionen", it: "Commissioni pubbliche" },
  "apply.value1_desc": { fr: "Tout est visible, de 30% à 10%. Pas de surprise.", en: "Everything is visible, from 30% to 10%. No surprises.", es: "Todo está visible, del 30% al 10%. Sin sorpresas.", "pt-BR": "Tudo está visível, de 30% a 10%. Sem surpresas.", de: "Alles ist sichtbar, von 30% bis 10%. Keine Überraschungen.", it: "Tutto è visibile, dal 30% al 10%. Nessuna sorpresa." },
  "apply.value2_title": { fr: "Sortie 30 jours", en: "30-day exit", es: "Salida en 30 días", "pt-BR": "Saída em 30 dias", de: "30-Tage-Ausstieg", it: "Uscita in 30 giorni" },
  "apply.value2_desc": { fr: "Pas de pénalité. Pas de clause d'exclusivité.", en: "No penalty. No exclusivity clause.", es: "Sin penalización. Sin cláusula de exclusividad.", "pt-BR": "Sem penalidade. Sem cláusula de exclusividade.", de: "Keine Vertragsstrafe. Keine Exklusivitätsklausel.", it: "Nessuna penale. Nessuna clausola di esclusività." },
  "apply.value3_title": { fr: "Contrat clair", en: "Clear contract", es: "Contrato claro", "pt-BR": "Contrato claro", de: "Klarer Vertrag", it: "Contratto chiaro" },
  "apply.value3_desc": { fr: "Téléchargeable avant signature. Pas de jargon juridique.", en: "Downloadable before signing. No legal jargon.", es: "Descargable antes de firmar. Sin jerga legal.", "pt-BR": "Baixável antes de assinar. Sem jargão jurídico.", de: "Vor Unterzeichnung herunterladbar. Kein Juristenjargon.", it: "Scaricabile prima della firma. Nessun gergo legale." },
  "apply.process_title": {
    fr: "Un processus de sélection en 3 étapes",
    en: "A 3-step selection process",
    es: "Un proceso de selección en 3 pasos",
    "pt-BR": "Um processo de seleção em 3 etapas",
    de: "Ein 3-stufiger Auswahlprozess",
    it: "Un processo di selezione in 3 fasi",
  },
  "apply.step1_title": { fr: "1. Candidature", en: "1. Application", es: "1. Candidatura", "pt-BR": "1. Candidatura", de: "1. Bewerbung", it: "1. Candidatura" },
  "apply.step1_desc": { fr: "Remplissez le formulaire en 10 minutes. Nous voulons comprendre votre activité et vos objectifs.", en: "Fill out the form in 10 minutes. We want to understand your business and goals.", es: "Completa el formulario en 10 minutos. Queremos entender tu actividad y tus objetivos.", "pt-BR": "Preencha o formulário em 10 minutos. Queremos entender seu negócio e objetivos.", de: "Füllen Sie das Formular in 10 Minuten aus. Wir möchten Ihr Business und Ihre Ziele verstehen.", it: "Compila il modulo in 10 minuti. Vogliamo capire la tua attività e i tuoi obiettivi." },
  "apply.step2_title": { fr: "2. Échange", en: "2. Conversation", es: "2. Conversación", "pt-BR": "2. Conversa", de: "2. Gespräch", it: "2. Conversazione" },
  "apply.step2_desc": { fr: "Un appel de 30 minutes avec un membre de l'équipe pour répondre à vos questions et comprendre vos besoins.", en: "A 30-minute call with a team member to answer your questions and understand your needs.", es: "Una llamada de 30 minutos con un miembro del equipo para responder a tus preguntas y entender tus necesidades.", "pt-BR": "Uma conversa de 30 minutos com um membro da equipe para responder suas perguntas e entender suas necessidades.", de: "Ein 30-minütiges Gespräch mit einem Teammitglied, um Ihre Fragen zu beantworten und Ihre Bedürfnisse zu verstehen.", it: "Una chiamata di 30 minuti con un membro del team per rispondere alle tue domande e capire le tue esigenze." },
  "apply.step3_title": { fr: "3. Onboarding", en: "3. Onboarding", es: "3. Onboarding", "pt-BR": "3. Onboarding", de: "3. Onboarding", it: "3. Onboarding" },
  "apply.step3_desc": { fr: "Si la collaboration démarre, vous avez accès à la plateforme et à votre équipe en 48h.", en: "If the collaboration starts, you get access to the platform and your team within 48 hours.", es: "Si la colaboración comienza, tienes acceso a la plataforma y a tu equipo en 48h.", "pt-BR": "Se a colaboração começar, você tem acesso à plataforma e à sua equipe em 48h.", de: "Wenn die Zusammenarbeit startet, erhalten Sie innerhalb von 48 Stunden Zugang zur Plattform und Ihrem Team.", it: "Se la collaborazione inizia, hai accesso alla piattaforma e al tuo team entro 48 ore." },
  "apply.final_cta": {
    fr: "Prêt à nous rejoindre ?",
    en: "Ready to join us?",
    es: "¿Listo para unirte?",
    "pt-BR": "Pronto para se juntar a nós?",
    de: "Bereit, zu uns zu kommen?",
    it: "Pronto a unirti a noi?",
  },
};

export function t(key: string, locale?: Locale): string {
  const l = locale || currentLocale;
  return messages[key]?.[l] || messages[key]?.fr || key;
}

export function useCommonT() {
  return { t: (key: string) => t(key, currentLocale), locale: currentLocale };
}
