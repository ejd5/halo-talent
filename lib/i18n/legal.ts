// ─── Bouclier Légal — i18n translations (FR, EN, ES, PT, DE, IT) ───

export type Locale = "fr" | "en" | "es" | "pt" | "de" | "it";

export const LOCALES: Locale[] = ["fr", "en", "es", "pt", "de", "it"];

// ─── Translations ───────────────────────────────────────────────

const translations: Record<string, Record<Locale, string>> = {
  // ── Page title / SEO ──
  "seo.title": {
    fr: "Contrat d'agence abusif ? Analysez gratuitement vos droits | Halo Talent",
    en: "Abusive agency contract? Analyze your rights for free | Halo Talent",
    es: "¿Contrato de agencia abusivo? Analiza tus derechos gratis | Halo Talent",
    pt: "Contrato de agência abusivo? Analise seus direitos grátis | Halo Talent",
    de: "Missbräuchlicher Agenturvertrag? Analysieren Sie Ihre Rechte kostenlos | Halo Talent",
    it: "Contratto d'agenzia abusivo? Analizza i tuoi diritti gratuitamente | Halo Talent",
  },
  "seo.description": {
    fr: "Outil gratuit d'analyse de contrat pour créateurs OnlyFans, Fansly, MYM. Identifiez les clauses abusives et générez une lettre de mise en demeure.",
    en: "Free contract analysis tool for OnlyFans, Fansly, MYM creators. Identify unfair clauses and generate a formal notice letter.",
    es: "Herramienta gratuita de análisis de contratos para creadores de OnlyFans, Fansly, MYM. Identifica cláusulas abusivas y genera una carta de requerimiento.",
    pt: "Ferramenta gratuita de análise de contratos para criadores OnlyFans, Fansly, MYM. Identifique cláusulas abusivas e gere uma notificação formal.",
    de: "Kostenloses Vertragsanalyse-Tool für OnlyFans-, Fansly-, MYM-Creators. Identifizieren Sie missbräuchliche Klauseln und erstellen Sie ein Mahnschreiben.",
    it: "Strumento gratuito di analisi dei contratti per creator di OnlyFans, Fansly, MYM. Identifica clausole abusive e genera una lettera di diffida.",
  },

  // ── Hero section ──
  "hero.badge": {
    fr: "Bouclier Légal",
    en: "Legal Shield",
    es: "Escudo Legal",
    pt: "Escudo Legal",
    de: "Rechtsschutz",
    it: "Scudo Legale",
  },
  "hero.title": {
    fr: "VOTRE CONTRAT\nVOUS PIÈGE ?",
    en: "IS YOUR CONTRACT\nTRAPPING YOU?",
    es: "¿TU CONTRATO\nTE ESTÁ ATRASTANDO?",
    pt: "SEU CONTRATO\nESTÁ TE PRENDENDO?",
    de: "FÄNGT IHR VERTRAG\nSIE EIN?",
    it: "IL TUO CONTRATTO\nTI STA INTRAPPOLANDO?",
  },
  "hero.subtitle": {
    fr: "Analysez gratuitement votre contrat d'agence en 2 minutes. Découvrez vos droits. Reprenez le contrôle.",
    en: "Analyze your agency contract for free in 2 minutes. Know your rights. Take back control.",
    es: "Analiza tu contrato de agencia gratis en 2 minutos. Conoce tus derechos. Recupera el control.",
    pt: "Analise seu contrato de agência grátis em 2 minutos. Conheça seus direitos. Retome o controle.",
    de: "Analysieren Sie Ihren Agenturvertrag kostenlos in 2 Minuten. Kennen Sie Ihre Rechte. Übernehmen Sie die Kontrolle.",
    it: "Analizza gratuitamente il tuo contratto d'agenzia in 2 minuti. Conosci i tuoi diritti. Riprendi il controllo.",
  },
  "hero.cta": {
    fr: "ANALYSER MON CONTRAT",
    en: "ANALYZE MY CONTRACT",
    es: "ANALIZAR MI CONTRATO",
    pt: "ANALISAR MEU CONTRATO",
    de: "MEINEN VERTRAG ANALYSIEREN",
    it: "ANALIZZARE IL MIO CONTRATTO",
  },
  "hero.disclaimer": {
    fr: "100% gratuit · Anonyme · Aucune inscription requise",
    en: "100% free · Anonymous · No account required",
    es: "100% gratis · Anónimo · Sin registro necesario",
    pt: "100% grátis · Anônimo · Sem cadastro necessário",
    de: "100% kostenlos · Anonym · Keine Anmeldung erforderlich",
    it: "100% gratuito · Anonimo · Nessuna registrazione richiesta",
  },
  "hero.stats.analyses_done": {
    fr: "analyses effectuées",
    en: "analyses completed",
    es: "análisis realizados",
    pt: "análises realizadas",
    de: "Analysen durchgeführt",
    it: "analisi effettuate",
  },
  "hero.stats.percent_abusive": {
    fr: "des créateurs sous contrat ont au moins une clause abusive",
    en: "of creators under contract have at least one unfair clause",
    es: "de los creadores bajo contrato tienen al menos una cláusula abusiva",
    pt: "dos criadores contratados têm pelo menos uma cláusula abusiva",
    de: "der Creator mit Vertrag haben mindestens eine missbräuchliche Klausel",
    it: "dei creator sotto contratto hanno almeno una clausola abusiva",
  },

  // ── Stats section ──
  "stats.analyses": {
    fr: "analyses effectuées",
    en: "analyses completed",
    es: "análisis realizados",
    pt: "análises realizadas",
    de: "Analysen durchgeführt",
    it: "analisi effettuate",
  },
  "stats.avg_score": {
    fr: "score moyen de dangerosité",
    en: "average risk score",
    es: "puntuación media de riesgo",
    pt: "pontuação média de risco",
    de: "durchschnittlicher Risikowert",
    it: "punteggio medio di rischio",
  },
  "stats.top_clause": {
    fr: "clause la plus fréquente",
    en: "most frequent clause",
    es: "cláusula más frecuente",
    pt: "cláusula mais frequente",
    de: "häufigste Klausel",
    it: "clausola più frequente",
  },
  "stats.fallback_commission": {
    fr: "de commission moyenne dans le secteur",
    en: "average commission in the industry",
    es: "de comisión media en el sector",
    pt: "de comissão média no setor",
    de: "durchschnittliche Provision in der Branche",
    it: "di commissione media nel settore",
  },
  "stats.fallback_exit": {
    fr: "des contrats n'ont pas de clause de sortie claire",
    en: "of contracts lack a clear exit clause",
    es: "de los contratos no tienen una cláusula de salida clara",
    pt: "dos contratos não têm cláusula de saída clara",
    de: "der Verträge haben keine klare Ausstiegsklausel",
    it: "dei contratti non hanno una clausola di uscita chiara",
  },
  "stats.fallback_access": {
    fr: "des créateurs n'ont pas accès à leurs identifiants",
    en: "of creators don't have access to their credentials",
    es: "de los creadores no tienen acceso a sus credenciales",
    pt: "dos criadores não têm acesso às suas credenciais",
    de: "der Creator haben keinen Zugriff auf ihre Zugangsdaten",
    it: "dei creator non hanno accesso alle proprie credenziali",
  },

  // ── Form section ──
  "form.platform.title": {
    fr: "Sur quelle plateforme exercez-vous ?",
    en: "Which platform do you work on?",
    es: "¿En qué plataforma trabajas?",
    pt: "Em qual plataforma você trabalha?",
    de: "Auf welcher Plattform arbeiten Sie?",
    it: "Su quale piattaforma lavori?",
  },
  "form.platform.subtitle": {
    fr: "Choisissez la plateforme pour laquelle vous avez signé un contrat d'agence.",
    en: "Choose the platform for which you signed an agency contract.",
    es: "Elige la plataforma para la que firmaste un contrato de agencia.",
    pt: "Escolha a plataforma para a qual você assinou um contrato de agência.",
    de: "Wählen Sie die Plattform, für die Sie einen Agenturvertrag unterschrieben haben.",
    it: "Scegli la piattaforma per cui hai firmato un contratto d'agenzia.",
  },
  "form.platform.continue": {
    fr: "CONTINUER",
    en: "CONTINUE",
    es: "CONTINUAR",
    pt: "CONTINUAR",
    de: "WEITER",
    it: "CONTINUA",
  },
  "form.platform.other": {
    fr: "Autre",
    en: "Other",
    es: "Otro",
    pt: "Outro",
    de: "Andere",
    it: "Altro",
  },

  "form.clauses.title": {
    fr: "Cochez ce qui s'applique à vous",
    en: "Check what applies to you",
    es: "Marca lo que se aplica a ti",
    pt: "Marque o que se aplica a você",
    de: "Markieren Sie, was auf Sie zutrifft",
    it: "Segna cosa si applica a te",
  },
  "form.clauses.subtitle": {
    fr: "Sélectionnez toutes les clauses que vous retrouvez dans votre contrat.",
    en: "Select all the clauses you find in your contract.",
    es: "Selecciona todas las cláusulas que encuentres en tu contrato.",
    pt: "Selecione todas as cláusulas que você encontra no seu contrato.",
    de: "Wählen Sie alle Klauseln aus, die in Ihrem Vertrag vorkommen.",
    it: "Seleziona tutte le clausole che trovi nel tuo contratto.",
  },
  "form.clauses.other_label": {
    fr: "Autre clause que vous jugez abusive",
    en: "Other clause you consider unfair",
    es: "Otra cláusula que consideres abusiva",
    pt: "Outra cláusula que você considera abusiva",
    de: "Andere Klausel, die Sie für missbräuchlich halten",
    it: "Altra clausola che ritieni abusiva",
  },
  "form.clauses.other_placeholder": {
    fr: "Décrivez une clause qui vous semble abusive mais qui n'est pas listée ci-dessus...",
    en: "Describe a clause that seems unfair but isn't listed above...",
    es: "Describe una cláusula que te parezca abusiva pero no esté listada arriba...",
    pt: "Descreva uma cláusula que parece abusiva mas não está listada acima...",
    de: "Beschreiben Sie eine Klausel, die missbräuchlich erscheint, aber oben nicht aufgeführt ist...",
    it: "Descrivi una clausola che sembra abusiva ma non è elencata sopra...",
  },
  "form.clauses.agency_label": {
    fr: "Nom de l'agence (optionnel — pour statistiques)",
    en: "Agency name (optional — for statistics)",
    es: "Nombre de la agencia (opcional — para estadísticas)",
    pt: "Nome da agência (opcional — para estatísticas)",
    de: "Agenturname (optional — für Statistiken)",
    it: "Nome dell'agenzia (opzionale — per statistiche)",
  },
  "form.clauses.agency_placeholder": {
    fr: "Ex: MyAgency Management",
    en: "E.g.: MyAgency Management",
    es: "Ej: MyAgency Management",
    pt: "Ex: MyAgency Management",
    de: "Z.B.: MyAgency Management",
    it: "Es: MyAgency Management",
  },
  "form.clauses.submit": {
    fr: "OBTENIR MON DIAGNOSTIC",
    en: "GET MY DIAGNOSIS",
    es: "OBTENER MI DIAGNÓSTICO",
    pt: "OBTER MEU DIAGNÓSTICO",
    de: "MEINE DIAGNOSE ERHALTEN",
    it: "OTTENERE LA MIA DIAGNOSI",
  },
  "form.clauses.analyzing": {
    fr: "Analyse en cours...",
    en: "Analyzing...",
    es: "Analizando...",
    pt: "Analisando...",
    de: "Analysiere...",
    it: "Analisi in corso...",
  },

  // ── Score sticky bar ──
  "score.label": {
    fr: "Score",
    en: "Score",
    es: "Puntuación",
    pt: "Pontuação",
    de: "Punktzahl",
    it: "Punteggio",
  },

  // ── Risk levels ──
  "risk.low": {
    fr: "Gérable",
    en: "Manageable",
    es: "Manejable",
    pt: "Gerenciável",
    de: "Handhabbar",
    it: "Gestibile",
  },
  "risk.medium": {
    fr: "Problématique",
    en: "Concerning",
    es: "Preocupante",
    pt: "Preocupante",
    de: "Bedenklich",
    it: "Preoccupante",
  },
  "risk.high": {
    fr: "Dangereux",
    en: "Dangerous",
    es: "Peligroso",
    pt: "Perigoso",
    de: "Gefährlich",
    it: "Pericoloso",
  },
  "risk.critical": {
    fr: "Urgent",
    en: "Critical",
    es: "Crítico",
    pt: "Crítico",
    de: "Kritisch",
    it: "Critico",
  },
  "risk.situation": {
    fr: "Situation {level}",
    en: "Situation: {level}",
    es: "Situación: {level}",
    pt: "Situação: {level}",
    de: "Situation: {level}",
    it: "Situazione: {level}",
  },

  // ── Result section ──
  "result.diagnosis": {
    fr: "Diagnostic",
    en: "Diagnosis",
    es: "Diagnóstico",
    pt: "Diagnóstico",
    de: "Diagnose",
    it: "Diagnosi",
  },
  "result.clauses_title": {
    fr: "Détail des clauses identifiées",
    en: "Details of identified clauses",
    es: "Detalle de las cláusulas identificadas",
    pt: "Detalhe das cláusulas identificadas",
    de: "Details der identifizierten Klauseln",
    it: "Dettaglio delle clausole identificate",
  },
  "result.severity": {
    fr: "Sévérité {score}/5",
    en: "Severity {score}/5",
    es: "Gravedad {score}/5",
    pt: "Gravidade {score}/5",
    de: "Schweregrad {score}/5",
    it: "Gravità {score}/5",
  },
  "result.actions_title": {
    fr: "3 actions recommandées",
    en: "3 recommended actions",
    es: "3 acciones recomendadas",
    pt: "3 ações recomendadas",
    de: "3 empfohlene Maßnahmen",
    it: "3 azioni raccomandate",
  },
  "result.letter_title": {
    fr: "Générer une lettre",
    en: "Generate a letter",
    es: "Generar una carta",
    pt: "Gerar uma carta",
    de: "Einen Brief erstellen",
    it: "Generare una lettera",
  },
  "result.letter_subtitle": {
    fr: "Obtenez une lettre prête à envoyer pour demander la restitution de vos droits.",
    en: "Get a ready-to-send letter to demand the restoration of your rights.",
    es: "Obtén una carta lista para enviar exigiendo la restitución de tus derechos.",
    pt: "Obtenha uma carta pronta para enviar exigindo a restituição dos seus direitos.",
    de: "Erhalten Sie einen versandbereiten Brief zur Forderung Ihrer Rechte.",
    it: "Ottieni una lettera pronta da inviare per chiedere il ripristino dei tuoi diritti.",
  },
  "result.letter_agency": {
    fr: "Lettre à l'agence",
    en: "Letter to the agency",
    es: "Carta a la agencia",
    pt: "Carta para a agência",
    de: "Brief an die Agentur",
    it: "Lettera all'agenzia",
  },
  "result.letter_platform": {
    fr: "Email au support plateforme",
    en: "Email to platform support",
    es: "Email al soporte de la plataforma",
    pt: "Email para o suporte da plataforma",
    de: "E-Mail an den Plattform-Support",
    it: "Email al supporto della piattaforma",
  },
  "result.letter_generate": {
    fr: "GÉNÉRER MA LETTRE DE MISE EN DEMEURE",
    en: "GENERATE MY FORMAL NOTICE",
    es: "GENERAR MI CARTA DE REQUERIMIENTO",
    pt: "GERAR MINHA NOTIFICAÇÃO FORMAL",
    de: "MEIN MAHNSCHREIBEN ERSTELLEN",
    it: "GENERARE LA MIA DIFFIDA",
  },
  "result.letter_generating": {
    fr: "Génération en cours...",
    en: "Generating...",
    es: "Generando...",
    pt: "Gerando...",
    de: "Erstelle...",
    it: "Generazione in corso...",
  },
  "result.copy": {
    fr: "COPIER",
    en: "COPY",
    es: "COPIAR",
    pt: "COPIAR",
    de: "KOPIEREN",
    it: "COPIARE",
  },
  "result.copied": {
    fr: "COPIÉ ✓",
    en: "COPIED ✓",
    es: "COPIADO ✓",
    pt: "COPIADO ✓",
    de: "KOPIERT ✓",
    it: "COPIATO ✓",
  },

  // ── CGU quotes section ──
  "cgu.title": {
    fr: "Ce que disent les CGU",
    en: "What the ToS say",
    es: "Lo que dicen las CGU",
    pt: "O que dizem os Termos",
    de: "Was die AGB sagen",
    it: "Quello che dicono i Termini",
  },

  // ── Final CTA ──
  "final_cta.title": {
    fr: "REPRENEZ LE CONTRÔLE\nDE VOTRE CARRIÈRE",
    en: "TAKE BACK CONTROL\nOF YOUR CAREER",
    es: "RECUPERA EL CONTROL\nDE TU CARRERA",
    pt: "RETOME O CONTROLE\nDA SUA CARREIRA",
    de: "ÜBERNEHMEN SIE DIE KONTROLLE\nÜBER IHRE KARRIERE",
    it: "RIPRENDI IL CONTROLLO\nDELLA TUA CARRIERA",
  },
  "final_cta.cta": {
    fr: "ANALYSER MON CONTRAT",
    en: "ANALYZE MY CONTRACT",
    es: "ANALIZAR MI CONTRATO",
    pt: "ANALISAR MEU CONTRATO",
    de: "MEINEN VERTRAG ANALYSIEREN",
    it: "ANALIZZARE IL MIO CONTRATTO",
  },
  "final_cta.apply": {
    fr: "POSTULER CHEZ NOUS",
    en: "APPLY WITH US",
    es: "POSTULAR CON NOSOTROS",
    pt: "CANDIDATAR-SE",
    de: "BEI UNS BEWERBEN",
    it: "CANDIDARSI CON NOI",
  },

  // ── Bottom CTA (result page) ──
  "result.bottom_cta.text": {
    fr: "Vous méritez mieux. Chez Halo Talent, la commission baisse quand vous grandissez, le contrat est téléchargeable avant signature, et la sortie se fait en 30 jours.",
    en: "You deserve better. At Halo Talent, commission decreases as you grow, the contract is downloadable before signing, and you can leave in 30 days.",
    es: "Te mereces algo mejor. En Halo Talent, la comisión baja cuando creces, el contrato se descarga antes de firmar y puedes salir en 30 días.",
    pt: "Você merece mais. Na Halo Talent, a comissão diminui quando você cresce, o contrato é baixável antes de assinar e a saída é em 30 dias.",
    de: "Sie verdienen etwas Besseres. Bei Halo Talent sinkt die Provision, wenn Sie wachsen, der Vertrag ist vor Unterzeichnung herunterladbar und der Austritt erfolgt in 30 Tagen.",
    it: "Meriti di meglio. Da Halo Talent, la commissione diminuisce quando cresci, il contratto è scaricabile prima della firma e l'uscita avviene in 30 giorni.",
  },
  "result.bottom_cta.button": {
    fr: "DÉCOUVRIR NOTRE APPROCHE",
    en: "DISCOVER OUR APPROACH",
    es: "DESCUBRE NUESTRO ENFOQUE",
    pt: "DESCUBRA NOSSA ABORDAGEM",
    de: "ENTDECKEN SIE UNSEREN ANSATZ",
    it: "SCOPRI IL NOSTRO APPROCCIO",
  },

  // ── Clause categories ──
  "category.account_control": {
    fr: "CONTRÔLE DE COMPTE",
    en: "ACCOUNT CONTROL",
    es: "CONTROL DE CUENTA",
    pt: "CONTROLE DE CONTA",
    de: "KONTOKONTROLLE",
    it: "CONTROLLO DEL CONTO",
  },
  "category.financial": {
    fr: "FINANCES",
    en: "FINANCIAL",
    es: "FINANZAS",
    pt: "FINANÇAS",
    de: "FINANZEN",
    it: "FINANZE",
  },
  "category.contractual": {
    fr: "CONTRAT",
    en: "CONTRACT",
    es: "CONTRATO",
    pt: "CONTRATO",
    de: "VERTRAG",
    it: "CONTRATTO",
  },
  "category.content_rights": {
    fr: "DROITS SUR LE CONTENU",
    en: "CONTENT RIGHTS",
    es: "DERECHOS DE CONTENIDO",
    pt: "DIREITOS DE CONTEÚDO",
    de: "INHALTSRECHTE",
    it: "DIRITTI SUI CONTENUTI",
  },
  "category.communication": {
    fr: "COMMUNICATION",
    en: "COMMUNICATION",
    es: "COMUNICACIÓN",
    pt: "COMUNICAÇÃO",
    de: "KOMMUNIKATION",
    it: "COMUNICAZIONE",
  },
  "category.psychological": {
    fr: "PSYCHOLOGIQUE",
    en: "PSYCHOLOGICAL",
    es: "PSICOLÓGICO",
    pt: "PSICOLÓGICO",
    de: "PSYCHOLOGISCH",
    it: "PSICOLOGICO",
  },

  // ── Homepage LegalShieldWidget ──
  "home.badge": {
    fr: "Outil gratuit",
    en: "Free tool",
    es: "Herramienta gratuita",
    pt: "Ferramenta gratuita",
    de: "Kostenloses Tool",
    it: "Strumento gratuito",
  },
  "home.title": {
    fr: "Piégé par\nvotre agence ?",
    en: "Trapped by\nyour agency?",
    es: "¿Atrapado por\ntu agencia?",
    pt: "Preso pela\nsua agência?",
    de: "Eingesperrt von\nIhrer Agentur?",
    it: "Intrappolato dalla\ntua agenzia?",
  },
  "home.description": {
    fr: "78% des créateurs sous contrat ont au moins une clause abusive. Notre Bouclier Légal analyse votre contrat en 2 minutes et vous montre exactement vos droits.",
    en: "78% of creators under contract have at least one unfair clause. Our Legal Shield analyzes your contract in 2 minutes and shows you exactly what your rights are.",
    es: "El 78% de los creadores bajo contrato tienen al menos una cláusula abusiva. Nuestro Escudo Legal analiza tu contrato en 2 minutos y te muestra exactamente tus derechos.",
    pt: "78% dos criadores contratados têm pelo menos uma cláusula abusiva. Nosso Escudo Legal analisa seu contrato em 2 minutos e mostra exatamente seus direitos.",
    de: "78% der Creator mit Vertrag haben mindestens eine missbräuchliche Klausel. Unser Rechtsschutz analysiert Ihren Vertrag in 2 Minuten und zeigt Ihnen genau Ihre Rechte.",
    it: "Il 78% dei creator sotto contratto ha almeno una clausola abusiva. Il nostro Scudo Legale analizza il tuo contratto in 2 minuti e ti mostra esattamente i tuoi diritti.",
  },
  "home.cta": {
    fr: "Analyser mon contrat gratuitement",
    en: "Analyze my contract for free",
    es: "Analizar mi contrato gratis",
    pt: "Analisar meu contrato grátis",
    de: "Meinen Vertrag kostenlos analysieren",
    it: "Analizzare il mio contratto gratuitamente",
  },
  "home.mockup.title": {
    fr: "Analyse rapide",
    en: "Quick analysis",
    es: "Análisis rápido",
    pt: "Análise rápida",
    de: "Schnellanalyse",
    it: "Analisi rapida",
  },
  "home.mockup.badge": {
    fr: "Critique",
    en: "Critical",
    es: "Crítico",
    pt: "Crítico",
    de: "Kritisch",
    it: "Critico",
  },
  "home.mockup.score_label": {
    fr: "Score de risque",
    en: "Risk score",
    es: "Puntuación de riesgo",
    pt: "Pontuação de risco",
    de: "Risikobewertung",
    it: "Punteggio di rischio",
  },
  "home.mockup.view_diagnostic": {
    fr: "Voir le diagnostic complet",
    en: "View full diagnosis",
    es: "Ver diagnóstico completo",
    pt: "Ver diagnóstico completo",
    de: "Vollständige Diagnose anzeigen",
    it: "Vedi diagnosi completa",
  },

  // ── Atlas dashboard ──
  "atlas.tab_contract": {
    fr: "Mon contrat",
    en: "My contract",
    es: "Mi contrato",
    pt: "Meu contrato",
    de: "Mein Vertrag",
    it: "Il mio contratto",
  },
  "atlas.tab_knowledge": {
    fr: "Base juridique",
    en: "Legal knowledge",
    es: "Base jurídica",
    pt: "Base jurídica",
    de: "Rechtsgrundlage",
    it: "Base giuridica",
  },
  "atlas.tab_alerts": {
    fr: "Alertes juridiques",
    en: "Legal alerts",
    es: "Alertas legales",
    pt: "Alertas legais",
    de: "Rechtswarnungen",
    it: "Alert legali",
  },
  "atlas.analyze_new": {
    fr: "Nouvelle analyse",
    en: "New analysis",
    es: "Nuevo análisis",
    pt: "Nova análise",
    de: "Neue Analyse",
    it: "Nuova analisi",
  },
  "atlas.no_analyses": {
    fr: "Aucune analyse pour le moment. Lancez votre première analyse de contrat.",
    en: "No analyses yet. Start your first contract analysis.",
    es: "Aún no hay análisis. Inicia tu primer análisis de contrato.",
    pt: "Nenhuma análise ainda. Inicie sua primeira análise de contrato.",
    de: "Noch keine Analysen. Starten Sie Ihre erste Vertragsanalyse.",
    it: "Nessuna analisi ancora. Avvia la tua prima analisi del contratto.",
  },
  "atlas.knowledge_search": {
    fr: "Rechercher dans la base juridique...",
    en: "Search legal knowledge...",
    es: "Buscar en la base jurídica...",
    pt: "Pesquisar na base jurídica...",
    de: "Rechtsgrundlage durchsuchen...",
    it: "Cerca nella base giuridica...",
  },
  "atlas.knowledge_suggest": {
    fr: "Suggérer une clause",
    en: "Suggest a clause",
    es: "Sugerir una cláusula",
    pt: "Sugerir uma cláusula",
    de: "Klausel vorschlagen",
    it: "Suggerire una clausola",
  },
  "atlas.no_alerts": {
    fr: "Aucune alerte pour le moment.",
    en: "No alerts at the moment.",
    es: "No hay alertas por el momento.",
    pt: "Nenhum alerta no momento.",
    de: "Derzeit keine Warnungen.",
    it: "Nessun alerta al momento.",
  },
  "atlas.analysis_of": {
    fr: "Analyse {platform}",
    en: "Analysis {platform}",
    es: "Análisis {platform}",
    pt: "Análise {platform}",
    de: "Analyse {platform}",
    it: "Analisi {platform}",
  },
  "atlas.score_label": {
    fr: "Score {value}",
    en: "Score {value}",
    es: "Puntuación {value}",
    pt: "Pontuação {value}",
    de: "Punktzahl {value}",
    it: "Punteggio {value}",
  },
  "atlas.letter_ready": {
    fr: "Lettre prête",
    en: "Letter ready",
    es: "Carta lista",
    pt: "Carta pronta",
    de: "Brief bereit",
    it: "Lettera pronta",
  },
  "atlas.letters_generated": {
    fr: "Lettres générées",
    en: "Generated letters",
    es: "Cartas generadas",
    pt: "Cartas geradas",
    de: "Generierte Briefe",
    it: "Lettere generate",
  },
  "atlas.helper_copy": {
    fr: "Tu peux copier les lettres ci-dessus",
    en: "You can copy the letters above",
    es: "Puedes copiar las cartas de arriba",
    pt: "Você pode copiar as cartas acima",
    de: "Sie können die Briefe oben kopieren",
    it: "Puoi copiare le lettere sopra",
  },
  "atlas.new_analysis_link": {
    fr: "Nouvelle analyse",
    en: "New analysis",
    es: "Nuevo análisis",
    pt: "Nova análise",
    de: "Neue Analyse",
    it: "Nuova analisi",
  },
  "atlas.no_results": {
    fr: "Aucun résultat trouvé",
    en: "No results found",
    es: "No se encontraron resultados",
    pt: "Nenhum resultado encontrado",
    de: "Keine Ergebnisse gefunden",
    it: "Nessun risultato trovato",
  },
  "atlas.read_more": {
    fr: "Lire plus",
    en: "Read more",
    es: "Leer más",
    pt: "Ler mais",
    de: "Mehr lesen",
    it: "Leggi di più",
  },
  "atlas.collapse": {
    fr: "Réduire",
    en: "Collapse",
    es: "Reducir",
    pt: "Recolher",
    de: "Einklappen",
    it: "Riduci",
  },
  "atlas.pending": {
    fr: "En attente",
    en: "Pending",
    es: "Pendiente",
    pt: "Pendente",
    de: "Ausstehend",
    it: "In attesa",
  },
  "atlas.source": {
    fr: "Source: {source}",
    en: "Source: {source}",
    es: "Fuente: {source}",
    pt: "Fonte: {source}",
    de: "Quelle: {source}",
    it: "Fonte: {source}",
  },
  "atlas.suggest_title": {
    fr: "Suggérer une nouvelle clause abusive",
    en: "Suggest a new unfair clause",
    es: "Sugerir una nueva cláusula abusiva",
    pt: "Sugerir uma nova cláusula abusiva",
    de: "Neue missbräuchliche Klausel vorschlagen",
    it: "Suggerire una nuova clausola abusiva",
  },
  "atlas.suggest_name": {
    fr: "Nom de la clause",
    en: "Clause name",
    es: "Nombre de la cláusula",
    pt: "Nome da cláusula",
    de: "Klauselname",
    it: "Nome della clausola",
  },
  "atlas.suggest_desc_placeholder": {
    fr: "Description de la clause abusive que tu as rencontrée...",
    en: "Description of the unfair clause you encountered...",
    es: "Descripción de la cláusula abusiva que encontraste...",
    pt: "Descrição da cláusula abusiva que você encontrou...",
    de: "Beschreibung der missbräuchlichen Klausel, die Sie gefunden haben...",
    it: "Descrizione della clausola abusiva che hai incontrato...",
  },
  "atlas.suggest_platform": {
    fr: "Plateforme concernée (optionnel)",
    en: "Platform concerned (optional)",
    es: "Plataforma concernida (opcional)",
    pt: "Plataforma concernida (opcional)",
    de: "Betroffene Plattform (optional)",
    it: "Piattaforma interessata (opzionale)",
  },
  "atlas.send": {
    fr: "Suggérer",
    en: "Suggest",
    es: "Sugerir",
    pt: "Sugerir",
    de: "Vorschlagen",
    it: "Suggerire",
  },
  "atlas.sending": {
    fr: "Envoi...",
    en: "Sending...",
    es: "Enviando...",
    pt: "Enviando...",
    de: "Senden...",
    it: "Invio...",
  },
  "atlas.sent": {
    fr: "Envoyé !",
    en: "Sent!",
    es: "¡Enviado!",
    pt: "Enviado!",
    de: "Gesendet!",
    it: "Inviato!",
  },
  "atlas.cancel": {
    fr: "Annuler",
    en: "Cancel",
    es: "Cancelar",
    pt: "Cancelar",
    de: "Abbrechen",
    it: "Annulla",
  },
  "atlas.description": {
    fr: "Analyse tes contrats d'agence, suis tes droits, reste informé",
    en: "Analyze your agency contracts, track your rights, stay informed",
    es: "Analiza tus contratos de agencia, sigue tus derechos, mantente informado",
    pt: "Analise seus contratos de agência, acompanhe seus direitos, mantenha-se informado",
    de: "Analysieren Sie Ihre Agenturverträge, verfolgen Sie Ihre Rechte, bleiben Sie informiert",
    it: "Analizza i tuoi contratti d'agenzia, segui i tuoi diritti, rimani informato",
  },

  // ── Navbar ──
  "nav.label": {
    fr: "Protection",
    en: "Protection",
    es: "Protección",
    pt: "Proteção",
    de: "Schutz",
    it: "Protezione",
  },
  "nav.legal_shield": {
    fr: "Bouclier Légal",
    en: "Legal Shield",
    es: "Escudo Legal",
    pt: "Escudo Legal",
    de: "Rechtsschutz",
    it: "Scudo Legale",
  },
  "nav.legal_shield_desc": {
    fr: "L'outil gratuit d'analyse",
    en: "The free analysis tool",
    es: "La herramienta gratuita de análisis",
    pt: "A ferramenta gratuita de análise",
    de: "Das kostenlose Analysetool",
    it: "Lo strumento gratuito di analisi",
  },
  "nav.your_rights": {
    fr: "Vos droits",
    en: "Your rights",
    es: "Tus derechos",
    pt: "Seus direitos",
    de: "Ihre Rechte",
    it: "I tuoi diritti",
  },
  "nav.your_rights_desc": {
    fr: "CGU & références juridiques",
    en: "ToS & legal references",
    es: "CGU & referencias legales",
    pt: "Termos & referências legais",
    de: "AGB & rechtliche Referenzen",
    it: "Termini & riferimenti legali",
  },
  "nav.contract_template": {
    fr: "Contrat type",
    en: "Template contract",
    es: "Contrato tipo",
    pt: "Contrato modelo",
    de: "Mustervertrag",
    it: "Contratto tipo",
  },
  "nav.contract_template_desc": {
    fr: "PDF téléchargeable",
    en: "Downloadable PDF",
    es: "PDF descargable",
    pt: "PDF para download",
    de: "PDF zum Herunterladen",
    it: "PDF scaricabile",
  },

  // ── Contract-type page ──
  "contrat_type.title": {
    fr: "Contrat type Halo Talent",
    en: "Halo Talent Model Contract",
    es: "Contrato tipo Halo Talent",
    pt: "Contrato modelo Halo Talent",
    de: "Halo Talent Mustervertrag",
    it: "Contratto tipo Halo Talent",
  },

  // ── 404 / error ──
  "error.loading_clauses": {
    fr: "Erreur lors du chargement des clauses",
    en: "Error loading clauses",
    es: "Error al cargar las cláusulas",
    pt: "Erro ao carregar cláusulas",
    de: "Fehler beim Laden der Klauseln",
    it: "Errore nel caricamento delle clausole",
  },
};

// ── Clause labels (from DB, translated in the UI) ──

export const CLAUSE_LABEL_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  "Clause d'exclusivité totale": {
    fr: "Clause d'exclusivité totale",
    en: "Total exclusivity clause",
    es: "Cláusula de exclusividad total",
    pt: "Cláusula de exclusividade total",
    de: "Klausel zur vollständigen Exklusivität",
    it: "Clausola di esclusività totale",
  },
  "Propriété des comptes": {
    fr: "Propriété des comptes",
    en: "Account ownership",
    es: "Propiedad de las cuentas",
    pt: "Propriedade das contas",
    de: "Kontoinhaberschaft",
    it: "Proprietà degli account",
  },
  "Renouvellement automatique": {
    fr: "Renouvellement automatique",
    en: "Automatic renewal",
    es: "Renovación automática",
    pt: "Renovação automática",
    de: "Automatische Verlängerung",
    it: "Rinnovo automatico",
  },
  "Commission à vie": {
    fr: "Commission à vie",
    en: "Lifetime commission",
    es: "Comisión de por vida",
    pt: "Comissão vitalícia",
    de: "Lebenslange Provision",
    it: "Commissione a vita",
  },
};

// ─── CGU quotes ─────────────────────────────────────────────────

export const CGU_QUOTES: Record<Locale, { text: string; source: string }[]> = {
  fr: [
    { text: "Le titulaire du compte est la personne vérifiée par pièce d'identité.", source: "CGU OnlyFans, 2026" },
    { text: "Les créateurs conservent la propriété de leur contenu. Une licence limitée est accordée à la plateforme.", source: "CGU OnlyFans, 2026" },
    { text: "Le partage de compte est strictement interdit. Chaque compte correspond à une personne physique unique.", source: "CGU Fansly, 2026" },
  ],
  en: [
    { text: "The account holder is the person verified by ID.", source: "OnlyFans ToS, 2026" },
    { text: "Creators retain ownership of their content. A limited license is granted to the platform.", source: "OnlyFans ToS, 2026" },
    { text: "Account sharing is strictly prohibited. Each account corresponds to one natural person.", source: "Fansly ToS, 2026" },
  ],
  es: [
    { text: "El titular de la cuenta es la persona verificada mediante identificación.", source: "CGU OnlyFans, 2026" },
    { text: "Los creadores conservan la propiedad de su contenido. Se concede una licencia limitada a la plataforma.", source: "CGU OnlyFans, 2026" },
    { text: "Compartir la cuenta está estrictamente prohibido. Cada cuenta corresponde a una persona física única.", source: "CGU Fansly, 2026" },
  ],
  pt: [
    { text: "O titular da conta é a pessoa verificada por documento de identidade.", source: "Termos OnlyFans, 2026" },
    { text: "Os criadores mantêm a propriedade do seu conteúdo. Uma licença limitada é concedida à plataforma.", source: "Termos OnlyFans, 2026" },
    { text: "Compartilhar a conta é estritamente proibido. Cada conta corresponde a uma pessoa física única.", source: "Termos Fansly, 2026" },
  ],
  de: [
    { text: "Der Kontoinhaber ist die durch Ausweis verifizierte Person.", source: "OnlyFans AGB, 2026" },
    { text: "Creator behalten das Eigentum an ihren Inhalten. Der Plattform wird eine eingeschränkte Lizenz gewährt.", source: "OnlyFans AGB, 2026" },
    { text: "Die Kontoweitergabe ist strengstens untersagt. Jedes Konto gehört zu einer einzigen natürlichen Person.", source: "Fansly AGB, 2026" },
  ],
  it: [
    { text: "Il titolare del conto è la persona verificata tramite documento d'identità.", source: "Termini OnlyFans, 2026" },
    { text: "I creator mantengono la proprietà dei loro contenuti. Una licenza limitata è concessa alla piattaforma.", source: "Termini OnlyFans, 2026" },
    { text: "La condivisione dell'account è severamente vietata. Ogni account corrisponde a una persona fisica unica.", source: "Termini Fansly, 2026" },
  ],
};

// ─── Category labels ────────────────────────────────────────────

export const CATEGORIES: Record<string, { icon: string } & Record<Locale, string>> = {
  account_control: {
    icon: "🔒",
    fr: "CONTRÔLE DE COMPTE",
    en: "ACCOUNT CONTROL",
    es: "CONTROL DE CUENTA",
    pt: "CONTROLE DE CONTA",
    de: "KONTOKONTROLLE",
    it: "CONTROLLO DEL CONTO",
  },
  financial: {
    icon: "💰",
    fr: "FINANCES",
    en: "FINANCIAL",
    es: "FINANZAS",
    pt: "FINANÇAS",
    de: "FINANZEN",
    it: "FINANZE",
  },
  contractual: {
    icon: "📄",
    fr: "CONTRAT",
    en: "CONTRACT",
    es: "CONTRATO",
    pt: "CONTRATO",
    de: "VERTRAG",
    it: "CONTRATTO",
  },
  content_rights: {
    icon: "🎨",
    fr: "DROITS SUR LE CONTENU",
    en: "CONTENT RIGHTS",
    es: "DERECHOS DE CONTENIDO",
    pt: "DIREITOS DE CONTEÚDO",
    de: "INHALTSRECHTE",
    it: "DIRITTI SUI CONTENUTI",
  },
  communication: {
    icon: "💬",
    fr: "COMMUNICATION",
    en: "COMMUNICATION",
    es: "COMUNICACIÓN",
    pt: "COMUNICAÇÃO",
    de: "KOMMUNIKATION",
    it: "COMUNICAZIONE",
  },
  psychological: {
    icon: "🧠",
    fr: "PSYCHOLOGIQUE",
    en: "PSYCHOLOGICAL",
    es: "PSICOLÓGICO",
    pt: "PSICOLÓGICO",
    de: "PSYCHOLOGISCH",
    it: "PSICOLOGICO",
  },
};

// ─── Platform labels ────────────────────────────────────────────

export const PLATFORM_LABELS: Record<string, Record<Locale, string>> = {
  onlyfans: { fr: "OnlyFans", en: "OnlyFans", es: "OnlyFans", pt: "OnlyFans", de: "OnlyFans", it: "OnlyFans" },
  fansly: { fr: "Fansly", en: "Fansly", es: "Fansly", pt: "Fansly", de: "Fansly", it: "Fansly" },
  mym: { fr: "MYM", en: "MYM", es: "MYM", pt: "MYM", de: "MYM", it: "MYM" },
  instagram: { fr: "Instagram", en: "Instagram", es: "Instagram", pt: "Instagram", de: "Instagram", it: "Instagram" },
  other: {
    fr: "Autre",
    en: "Other",
    es: "Otro",
    pt: "Outro",
    de: "Andere",
    it: "Altro",
  },
};

// ─── Translation helper ─────────────────────────────────────────

let currentLocale: Locale = "fr";

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string, locale?: string): string {
  const l = (locale as Locale) ?? currentLocale;
  return (translations as Record<string, Record<Locale, string>>)[key]?.[l] ?? key;
}

export function translateClauseLabel(label: string, locale?: string): string {
  const l = (locale as Locale) ?? currentLocale;
  return CLAUSE_LABEL_TRANSLATIONS[label]?.[l] ?? label;
}

export function translateCategory(key: string, locale?: string): { icon: string; label: string } {
  const l = (locale as Locale) ?? currentLocale;
  const cat = CATEGORIES[key];
  if (!cat) return { icon: "📋", label: key };
  return { icon: cat.icon, label: cat[l] };
}

export function translatePlatform(id: string, locale?: string): string {
  const l = (locale as Locale) ?? currentLocale;
  return PLATFORM_LABELS[id]?.[l] ?? id;
}

export function riskLabel(level: string, locale?: string): string {
  const l = (locale as Locale) ?? currentLocale;
  return (translations as Record<string, Record<Locale, string>>)[`risk.${level}`]?.[l] ?? level;
}

export function cguQuotes(locale?: string): { text: string; source: string }[] {
  const l = (locale as Locale) ?? currentLocale;
  return CGU_QUOTES[l] ?? CGU_QUOTES.fr;
}
