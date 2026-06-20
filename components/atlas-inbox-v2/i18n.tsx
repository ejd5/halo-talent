"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

// ═══ Types ═══════════════════════════════════════════════════

export type Locale = "fr" | "en" | "es" | "pt-BR" | "de" | "it";
export const LOCALES: Locale[] = ["fr", "en", "es", "pt-BR", "de", "it"];
export const DEFAULT_LOCALE: Locale = "fr";

const LOCALE_LABELS: Record<Locale, string> = {
  fr: "🇫🇷 Français",
  en: "🇬🇧 English",
  es: "🇪🇸 Español",
  "pt-BR": "🇧🇷 Português",
  de: "🇩🇪 Deutsch",
  it: "🇮🇹 Italiano",
};

type Messages = Record<string, Record<Locale, string>>;

// ═══ Translation Dictionary ═════════════════════════════════

const messages: Messages = {
  // ── Sidebar ────────────────────────────────────────────
  "sidebar.menu": { fr: "Menu", en: "Menu", es: "Menú", "pt-BR": "Menu", de: "Menü", it: "Menu" },
  "sidebar.agencyOs": { fr: "Agency OS", en: "Agency OS", es: "Agency OS", "pt-BR": "Agency OS", de: "Agency OS", it: "Agency OS" },
  "sidebar.footerBadge": { fr: "Creator OS conforme", en: "Compliance-first Creator OS", es: "Creator OS conforme", "pt-BR": "Creator OS em conformidade", de: "Compliance-first Creator OS", it: "Creator OS conforme" },

  // ── Nav Group Labels ────────────────────────────────────
  "nav.inbox": { fr: "BOÎTE DE RÉCEPTION", en: "INBOX", es: "INBOX", "pt-BR": "INBOX", de: "INBOX", it: "INBOX" },
  "nav.aiSalesEngine": { fr: "MOTEUR DE VENTE IA", en: "AI SALES ENGINE", es: "AI SALES ENGINE", "pt-BR": "AI SALES ENGINE", de: "AI SALES ENGINE", it: "AI SALES ENGINE" },
  "nav.campaigns": { fr: "CAMPAGNES", en: "CAMPAIGNS", es: "CAMPAÑAS", "pt-BR": "CAMPANHAS", de: "KAMPAGNEN", it: "CAMPAGNE" },
  "nav.scripts": { fr: "SCRIPTS PPV", en: "SCRIPTS", es: "SCRIPTS", "pt-BR": "SCRIPTS", de: "SCRIPTS", it: "SCRIPTS" },
  "nav.vault": { fr: "COFFRE", en: "VAULT", es: "BÓVEDA", "pt-BR": "COFRE", de: "TRESOR", it: "CAVEAU" },
  "nav.team": { fr: "ÉQUIPE", en: "TEAM", es: "EQUIPO", "pt-BR": "EQUIPE", de: "TEAM", it: "TEAM" },
  "nav.safety": { fr: "SÉCURITÉ", en: "SAFETY", es: "SEGURIDAD", "pt-BR": "SEGURANÇA", de: "SICHERHEIT", it: "SICUREZZA" },
  "nav.settings": { fr: "PARAMÈTRES", en: "SETTINGS", es: "CONFIGURACIÓN", "pt-BR": "CONFIGURAÇÕES", de: "EINSTELLUNGEN", it: "IMPOSTAZIONI" },
  "nav.roadmap": { fr: "FEUILLE DE ROUTE", en: "ROADMAP", es: "ROADMAP", "pt-BR": "ROADMAP", de: "ROADMAP", it: "ROADMAP" },

  // ── Nav Item Labels ─────────────────────────────────────
  "nav.salesEngine": { fr: "Moteur de vente IA", en: "AI Sales Engine", es: "AI Sales Engine", "pt-BR": "AI Sales Engine", de: "AI Sales Engine", it: "AI Sales Engine" },
  "nav.messageLedger": { fr: "Registre des messages", en: "Message Ledger", es: "Registro de mensajes", "pt-BR": "Registro de mensagens", de: "Nachrichten-Ledger", it: "Registro messaggi" },
  "nav.opportunityQueue": { fr: "File d'opportunités", en: "Opportunity Queue", es: "Cola de oportunidades", "pt-BR": "Fila de oportunidades", de: "Opportunity Queue", it: "Coda opportunità" },
  "nav.dynamicLists": { fr: "Listes dynamiques", en: "Dynamic Lists", es: "Listas dinámicas", "pt-BR": "Listas dinâmicas", de: "Dynamische Listen", it: "Liste dinamiche" },
  "nav.scriptBuilder": { fr: "Constructeur de scripts", en: "Script Builder / PPV", es: "Creador de scripts / PPV", "pt-BR": "Construtor de scripts / PPV", de: "Script Builder / PPV", it: "Script Builder / PPV" },
  "nav.campaignBuilder": { fr: "Constructeur de campagnes", en: "Campaign Builder", es: "Creador de campañas", "pt-BR": "Construtor de campanhas", de: "Kampagnen-Builder", it: "Campaign Builder" },
  "nav.creativeEngine": { fr: "Moteur créatif / Reels", en: "Creative Engine / Reels", es: "Motor creativo / Reels", "pt-BR": "Creative Engine / Reels", de: "Creative Engine / Reels", it: "Creative Engine / Reels" },
  "nav.dynamicPricing": { fr: "Tarification dynamique", en: "Dynamic Pricing", es: "Precios dinámicos", "pt-BR": "Precificação dinâmica", de: "Dynamische Preise", it: "Prezzi dinamici" },
  "nav.hybridHandoff": { fr: "Règles de transfert hybride", en: "Hybrid Handoff Rules", es: "Reglas de traspaso híbrido", "pt-BR": "Regras de handoff híbrido", de: "Hybrid-Übergaberegeln", it: "Regole di passaggio ibrido" },
  "nav.aiCoreSettings": { fr: "Paramètres du noyau IA", en: "AI Core Settings", es: "Configuración del núcleo IA", "pt-BR": "Configurações do núcleo IA", de: "AI-Kerneinstellungen", it: "Impostazioni core IA" },
  "nav.creatorProfile": { fr: "Profil de créatrice", en: "Creator Profile", es: "Perfil de creadora", "pt-BR": "Perfil da criadora", de: "Creator-Profil", it: "Profilo creator" },
  "nav.bannedKeywords": { fr: "Mots-clés interdits", en: "Banned Keywords", es: "Palabras prohibidas", "pt-BR": "Palavras banidas", de: "Verbotene Keywords", it: "Parole vietate" },
  "nav.tracking": { fr: "Tracking et attribution", en: "Tracking & Attribution", es: "Seguimiento y atribución", "pt-BR": "Tracking e atribuição", de: "Tracking & Attribution", it: "Tracking e attribuzione" },
  "nav.fanJourney": { fr: "Parcours fan", en: "Fan Journey", es: "Viaje del fan", "pt-BR": "Jornada do fã", de: "Fan Journey", it: "Fan Journey" },
  "nav.teamControl": { fr: "Salle de contrôle équipe", en: "Team Control Room", es: "Sala de control de equipo", "pt-BR": "Sala de controle de equipe", de: "Team Control Room", it: "Sala controllo team" },
  "nav.notifications": { fr: "Centre de notifications", en: "Notifications Center", es: "Centro de notificaciones", "pt-BR": "Centro de notificações", de: "Benachrichtigungscenter", it: "Centro notifiche" },
  "nav.complianceReview": { fr: "Révision de conformité", en: "Compliance Review", es: "Revisión de cumplimiento", "pt-BR": "Revisão de compliance", de: "Compliance-Prüfung", it: "Revisione conformità" },
  "nav.safetyGuard": { fr: "Barrières de sécurité", en: "Safety Guard", es: "Guardia de seguridad", "pt-BR": "Guarda de segurança", de: "Safety Guard", it: "Safety Guard" },
  "nav.automationTriggers": { fr: "Déclencheurs d'automatisation", en: "Automation Triggers", es: "Activadores de automatización", "pt-BR": "Gatilhos de automação", de: "Automatisierungs-Trigger", it: "Trigger di automazione" },
  "nav.whyAtlasSafer": { fr: "Pourquoi Atlas est plus sûr", en: "Why Atlas is Safer", es: "Por qué Atlas es más seguro", "pt-BR": "Por que o Atlas é mais seguro", de: "Warum Atlas sicherer ist", it: "Perché Atlas è più sicuro" },
  "nav.browserWorkspace": { fr: "Espace de navigation", en: "Browser Workspace", es: "Espacio de navegación", "pt-BR": "Workspace de navegação", de: "Browser-Arbeitsbereich", it: "Browser Workspace" },
  "nav.featureRequests": { fr: "Demandes de fonctionnalités", en: "Feature Requests", es: "Solicitudes de funciones", "pt-BR": "Solicitações de recursos", de: "Feature Requests", it: "Richieste funzionalità" },

  // ── Nav Descriptions ────────────────────────────────────
  "nav.desc.salesEngine": { fr: "Priorise les conversations qui peuvent générer du revenu", en: "Prioritize revenue-generating conversations", es: "Prioriza las conversaciones que generan ingresos", "pt-BR": "Prioriza conversas que geram receita", de: "Priorisiert umsatzgenerierende Gespräche", it: "Priorizza le conversazioni che generano ricavi" },
  "nav.desc.messageLedger": { fr: "Historique des brouillons, validations et messages envoyés", en: "History of drafts, approvals, and sent messages", es: "Historial de borradores, validaciones y mensajes enviados", "pt-BR": "Histórico de rascunhos, aprovações e mensagens enviadas", de: "Verlauf von Entwürfen, Freigaben und gesendeten Nachrichten", it: "Cronologia di bozze, approvazioni e messaggi inviati" },
  "nav.desc.opportunityQueue": { fr: "Kanban des opportunités de vente détectées par l'IA", en: "Kanban of AI-detected sales opportunities", es: "Kanban de oportunidades de venta detectadas por IA", "pt-BR": "Kanban de oportunidades de venda detectadas pela IA", de: "Kanban der KI-erkannten Verkaufschancen", it: "Kanban delle opportunità di vendita rilevate dall'IA" },
  "nav.desc.dynamicLists": { fr: "Segments de fans dynamiques basés sur 30+ critères", en: "Dynamic fan segments based on 30+ criteria", es: "Segmentos de fans dinámicos basados en 30+ criterios", "pt-BR": "Segmentos dinâmicos de fãs baseados em 30+ critérios", de: "Dynamische Fan-Segmente basierend auf 30+ Kriterien", it: "Segmenti dinamici di fan basati su 30+ criteri" },
  "nav.desc.scriptBuilder": { fr: "Entonnoirs PPV progressifs avec étapes et pricing", en: "Progressive PPV funnels with steps and pricing", es: "Embudos PPV progresivos con etapas y precios", "pt-BR": "Funis PPV progressivos com etapas e preços", de: "Progressive PPV-Funnel mit Stufen und Preisen", it: "Funnel PPV progressivi con fasi e prezzi" },
  "nav.desc.campaignBuilder": { fr: "Campagnes marketing multi-étapes avec templates", en: "Multi-step marketing campaigns with templates", es: "Campañas de marketing multi-etapa con plantillas", "pt-BR": "Campanhas de marketing multi-etapas com templates", de: "Mehrstufige Marketing-Kampagnen mit Vorlagen", it: "Campagne marketing multi-step con template" },
  "nav.desc.creativeEngine": { fr: "Scripts Reels/TikTok générés par IA, validation humaine", en: "AI-generated Reels/TikTok scripts, human approval", es: "Scripts Reels/TikTok generados por IA, validación humana", "pt-BR": "Scripts Reels/TikTok gerados por IA, aprovação humana", de: "KI-generierte Reels/TikTok-Skripte, menschliche Freigabe", it: "Script Reels/TikTok generati dall'IA, approvazione umana" },
  "nav.desc.dynamicPricing": { fr: "Simule les offres PPV selon l'intention d'achat", en: "Simulate PPV offers based on purchase intent", es: "Simula ofertas PPV según intención de compra", "pt-BR": "Simula ofertas PPV com base na intenção de compra", de: "Simuliert PPV-Angebote basierend auf Kaufabsicht", it: "Simula offerte PPV in base all'intenzione d'acquisto" },
  "nav.desc.hybridHandoff": { fr: "Définit quand l'IA passe le relais à un chatter humain", en: "Define when AI hands off to a human chatter", es: "Define cuándo la IA pasa el relevo a un chatter humano", "pt-BR": "Define quando a IA passa para um chatter humano", de: "Definiert, wann die KI an einen menschlichen Chatter übergibt", it: "Definisce quando l'IA passa a un chatter umano" },
  "nav.desc.aiCoreSettings": { fr: "Contrôle le niveau d'assistance IA, sans envoi automatique", en: "Control AI assistance level, no auto-send", es: "Controla el nivel de asistencia IA sin envío automático", "pt-BR": "Controla o nível de assistência IA, sem envio automático", de: "Steuert das KI-Assistenzniveau, kein automatischer Versand", it: "Controlla il livello di assistenza IA, senza invio automatico" },
  "nav.desc.creatorProfile": { fr: "Persona, ton, limites et règles de la créatrice", en: "Creator persona, tone, boundaries, and rules", es: "Persona, tono, límites y reglas de la creadora", "pt-BR": "Persona, tom, limites e regras da criadora", de: "Persona, Ton, Grenzen und Regeln des Creators", it: "Persona, tono, limiti e regole della creator" },
  "nav.desc.bannedKeywords": { fr: "Mots interdits bloqués dans les brouillons et messages", en: "Forbidden words blocked in drafts and messages", es: "Palabras prohibidas bloqueadas en borradores y mensajes", "pt-BR": "Palavras proibidas bloqueadas em rascunhos e mensagens", de: "Verbotene Wörter in Entwürfen und Nachrichten blockiert", it: "Parole vietate bloccate in bozze e messaggi" },
  "nav.desc.tracking": { fr: "Liens traqués et performance par canal d'acquisition", en: "Tracked links and performance by acquisition channel", es: "Enlaces rastreados y rendimiento por canal de adquisición", "pt-BR": "Links rastreados e desempenho por canal de aquisição", de: "Getrackte Links und Performance pro Akquisitionskanal", it: "Link tracciati e performance per canale di acquisizione" },
  "nav.desc.fanJourney": { fr: "Parcours fan : découverte -> achat -> ambassadeur", en: "Fan journey: discover -> purchase -> ambassador", es: "Viaje del fan: descubrir -> comprar -> embajador", "pt-BR": "Jornada do fã: descobrir -> comprar -> embaixador", de: "Fan-Reise: Entdecken -> Kaufen -> Botschafter", it: "Percorso fan: scoperta -> acquisto -> ambasciatore" },
  "nav.desc.teamControl": { fr: "Activité, perfs et Golden Ratio de chaque chatter", en: "Activity, performance & Golden Ratio per chatter", es: "Actividad, rendimiento y Golden Ratio de cada chatter", "pt-BR": "Atividade, desempenho e Golden Ratio de cada chatter", de: "Aktivität, Leistung & Golden Ratio pro Chatter", it: "Attività, performance e Golden Ratio di ogni chatter" },
  "nav.desc.notifications": { fr: "Alertes achats, messages, conformité et milestones", en: "Purchase, message, compliance, and milestone alerts", es: "Alertas de compras, mensajes, cumplimiento e hitos", "pt-BR": "Alertas de compras, mensagens, compliance e marcos", de: "Benachrichtigungen zu Käufen, Nachrichten, Compliance und Meilensteinen", it: "Avvisi acquisti, messaggi, conformità e milestone" },
  "nav.desc.complianceReview": { fr: "Contenus à risque détectés, file d'attente de révision humaine", en: "Risk content detected, human review queue", es: "Contenido de riesgo detectado, cola de revisión humana", "pt-BR": "Conteúdo de risco detectado, fila de revisão humana", de: "Risikoinhalte erkannt, menschliche Prüfwarteschlange", it: "Contenuti a rischio rilevati, coda di revisione umana" },
  "nav.desc.safetyGuard": { fr: "Barrières qui bloquent promesses interdites, impersonation et risques", en: "Barriers blocking forbidden promises, impersonation, and risks", es: "Barreras que bloquean promesas prohibidas, suplantación y riesgos", "pt-BR": "Barreiras que bloqueiam promessas proibidas, impersonação e riscos", de: "Barrieren, die verbotene Versprechen, Identitätsdiebstahl und Risiken blockieren", it: "Barriere che bloccano promesse vietate, impersonificazione e rischi" },
  "nav.desc.automationTriggers": { fr: "Actions automatiques sur événements (anniversaire, silence, achat)", en: "Automatic actions on events (birthday, silence, purchase)", es: "Acciones automáticas en eventos (cumpleaños, silencio, compra)", "pt-BR": "Ações automáticas em eventos (aniversário, silêncio, compra)", de: "Automatische Aktionen bei Ereignissen (Geburtstag, Stille, Kauf)", it: "Azioni automatiche su eventi (compleanno, silenzio, acquisto)" },
  "nav.desc.whyAtlasSafer": { fr: "Pourquoi le modèle Atlas est le plus sûr du marché", en: "Why the Atlas model is the safest on the market", es: "Por qué el modelo Atlas es el más seguro del mercado", "pt-BR": "Por que o modelo Atlas é o mais seguro do mercado", de: "Warum das Atlas-Modell das sicherste am Markt ist", it: "Perché il modello Atlas è il più sicuro sul mercato" },
  "nav.desc.browserWorkspace": { fr: "Simule l'apparence des messages sur les plateformes", en: "Simulate message appearance on platforms", es: "Simula la apariencia de mensajes en plataformas", "pt-BR": "Simula a aparência das mensagens nas plataformas", de: "Simuliert das Erscheinungsbild von Nachrichten auf Plattformen", it: "Simula l'aspetto dei messaggi sulle piattaforme" },
  "nav.desc.featureRequests": { fr: "Propositions de la communauté, vote pour prioriser", en: "Community proposals, vote to prioritize", es: "Propuestas de la comunidad, vota para priorizar", "pt-BR": "Propostas da comunidade, vote para priorizar", de: "Community-Vorschläge, abstimmen zur Priorisierung", it: "Proposte della community, vota per prioritizzare" },

  // ── Topbar ───────────────────────────────────────────────
  "topbar.title": { fr: "Atlas Inbox", en: "Atlas Inbox", es: "Atlas Inbox", "pt-BR": "Atlas Inbox", de: "Atlas Inbox", it: "Atlas Inbox" },
  "topbar.subtitle": { fr: "Workspace de vente assisté par IA. Approbation humaine obligatoire avant chaque envoi.", en: "AI-assisted sales workspace. Human approval required before every send.", es: "Workspace de ventas asistido por IA. Aprobación humana obligatoria antes de cada envío.", "pt-BR": "Workspace de vendas assistido por IA. Aprovação humana obrigatória antes de cada envio.", de: "KI-gestützter Vertriebs-Arbeitsbereich. Menschliche Freigabe erforderlich vor jedem Versand.", it: "Workspace di vendita assistito da IA. Approvazione umana obbligatoria prima di ogni invio." },
  "topbar.badge.noAutoSend": { fr: "Aucun envoi auto", en: "No auto-send", es: "Sin envío automático", "pt-BR": "Sem envio automático", de: "Kein Autoversand", it: "Nessun invio automatico" },
  "topbar.badge.noScraping": { fr: "Pas de scraping", en: "No scraping", es: "Sin scraping", "pt-BR": "Sem scraping", de: "Kein Scraping", it: "Nessuno scraping" },
  "topbar.badge.humanApproved": { fr: "Approuvé par humain", en: "Human approved", es: "Aprobado por humano", "pt-BR": "Aprovado por humano", de: "Menschlich freigegeben", it: "Approvato da umano" },

  // ── Safety Banner ────────────────────────────────────────
  "safety.propose": { fr: "IA propose, humain valide", en: "AI proposes, human validates", es: "IA propone, humano valida", "pt-BR": "IA propõe, humano valida", de: "KI schlägt vor, Mensch prüft", it: "L'IA propone, l'umano convalida" },
  "safety.noAuto": { fr: "Aucun envoi automatique", en: "No automatic sending", es: "Sin envío automático", "pt-BR": "Nenhum envio automático", de: "Kein automatischer Versand", it: "Nessun invio automatico" },
  "safety.noScraping": { fr: "Pas de scraping", en: "No scraping", es: "Sin scraping", "pt-BR": "Sem scraping", de: "Kein Scraping", it: "Nessuno scraping" },
  "safety.noUsurpation": { fr: "Pas d'usurpation", en: "No impersonation", es: "Sin suplantación", "pt-BR": "Sem usurpação", de: "Keine Identitätstäuschung", it: "Nessuna usurpazione" },

  // ── Onboarding ───────────────────────────────────────────
  "onboarding.getStarted": { fr: "Démarrer", en: "Get Started", es: "Empezar", "pt-BR": "Começar", de: "Loslegen", it: "Inizia" },
  "onboarding.step1.label": { fr: "Configurer la sécurité IA", en: "Configure AI safety", es: "Configurar seguridad IA", "pt-BR": "Configurar segurança IA", de: "KI-Sicherheit konfigurieren", it: "Configura sicurezza IA" },
  "onboarding.step1.desc": { fr: "Définir les barrières de sécurité et les modes IA", en: "Define safety barriers and AI modes", es: "Definir barreras de seguridad y modos IA", "pt-BR": "Definir barreiras de segurança e modos IA", de: "Sicherheitsbarrieren und KI-Modi definieren", it: "Definisci barriere di sicurezza e modalità IA" },
  "onboarding.step2.label": { fr: "Créer un premier script PPV", en: "Create first PPV script", es: "Crear primer script PPV", "pt-BR": "Criar primeiro script PPV", de: "Ersten PPV-Skript erstellen", it: "Crea il primo script PPV" },
  "onboarding.step2.desc": { fr: "Créer un entonnoir PPV pour automatiser les ventes", en: "Create a PPV funnel to automate sales", es: "Crear un embudo PPV para automatizar ventas", "pt-BR": "Criar um funil PPV para automatizar vendas", de: "PPV-Funnel zur Automatisierung von Verkäufen erstellen", it: "Crea un funnel PPV per automatizzare le vendite" },
  "onboarding.step3.label": { fr: "Vérifier les règles de handoff", en: "Review handoff rules", es: "Revisar reglas de traspaso", "pt-BR": "Revisar regras de handoff", de: "Übergaberegeln prüfen", it: "Verifica regole di passaggio" },
  "onboarding.step3.desc": { fr: "Configurer quand l'IA passe la main à l'humain", en: "Configure when AI hands off to human", es: "Configurar cuándo la IA pasa al humano", "pt-BR": "Configurar quando a IA passa para o humano", de: "Konfigurieren, wann die KI an den Menschen übergibt", it: "Configura quando l'IA passa all'umano" },
  "onboarding.step4.label": { fr: "Inviter le premier chatter", en: "Invite first chatter", es: "Invitar primer chatter", "pt-BR": "Convidar primeiro chatter", de: "Ersten Chatter einladen", it: "Invita il primo chatter" },
  "onboarding.step4.desc": { fr: "Ajouter un membre de l'équipe de vente", en: "Add a sales team member", es: "Añadir un miembro del equipo de ventas", "pt-BR": "Adicionar um membro da equipe de vendas", de: "Vertriebsteam-Mitglied hinzufügen", it: "Aggiungi un membro del team vendite" },
  "onboarding.step5.label": { fr: "Vérifier la file conformité", en: "Check compliance queue", es: "Verificar cola de cumplimiento", "pt-BR": "Verificar fila de compliance", de: "Compliance-Warteschlange prüfen", it: "Controlla coda conformità" },
  "onboarding.step5.desc": { fr: "Vérifier les alertes conformité en attente", en: "Check pending compliance alerts", es: "Verificar alertas de cumplimiento pendientes", "pt-BR": "Verificar alertas de compliance pendentes", de: "Ausstehende Compliance-Warnungen prüfen", it: "Verifica avvisi di conformità in sospeso" },

  // ── Section Info Bar ─────────────────────────────────────
  "section.howItWorks": { fr: "Comment ça marche", en: "How it works", es: "Cómo funciona", "pt-BR": "Como funciona", de: "So funktioniert's", it: "Come funziona" },

  // ── Sales Engine ─────────────────────────────────────────
  "salesEngine.heading": { fr: "Sales Engine", en: "Sales Engine", es: "Motor de ventas", "pt-BR": "Motor de vendas", de: "Sales Engine", it: "Sales Engine" },
  "salesEngine.searchPlaceholder": { fr: "Rechercher un fan...", en: "Search a fan...", es: "Buscar un fan...", "pt-BR": "Buscar um fã...", de: "Fan suchen...", it: "Cerca un fan..." },
  "salesEngine.empty": { fr: "Sélectionne une conversation", en: "Select a conversation", es: "Selecciona una conversación", "pt-BR": "Selecione uma conversa", de: "Wähle eine Konversation", it: "Seleziona una conversazione" },
  "salesEngine.emptyHint": { fr: "L'IA te proposera des suggestions de réponse", en: "AI will suggest response drafts for you", es: "La IA te propondrá sugerencias de respuesta", "pt-BR": "A IA sugerirá rascunhos de resposta", de: "Die KI wird Antwortvorschläge vorschlagen", it: "L'IA ti proporrà suggerimenti di risposta" },
  "salesEngine.spent": { fr: "dépensé", en: "spent", es: "gastado", "pt-BR": "gasto", de: "ausgegeben", it: "speso" },
  "salesEngine.score": { fr: "Score", en: "Score", es: "Puntuación", "pt-BR": "Pontuação", de: "Score", it: "Punteggio" },
  "salesEngine.aiDrafts": { fr: "Brouillons IA", en: "AI Drafts", es: "Borradores IA", "pt-BR": "Rascunhos IA", de: "KI-Entwürfe", it: "Bozze IA" },
  "salesEngine.suggestions": { fr: "suggestions", en: "suggestions", es: "sugerencias", "pt-BR": "sugestões", de: "Vorschläge", it: "suggerimenti" },
  "salesEngine.engagementPct": { fr: "% engagement est.", en: "% engagement est.", es: "% compromiso est.", "pt-BR": "% engajamento est.", de: "% Engagement gesch.", it: "% engagement stim." },
  "salesEngine.aiGenerating": { fr: "Génération...", en: "Generating...", es: "Generando...", "pt-BR": "Gerando...", de: "Generierung...", it: "Generazione..." },
  "salesEngine.regenerate": { fr: "Régénérer les drafts IA", en: "Regenerate AI drafts", es: "Regenerar borradores IA", "pt-BR": "Regenerar rascunhos IA", de: "KI-Entwürfe neu generieren", it: "Rigenera bozze IA" },
  "salesEngine.approvalFlow": { fr: "IA propose → tu relis → tu valides → envoi humain", en: "AI proposes → you review → you approve → human send", es: "IA propone → revisas → validas → envío humano", "pt-BR": "IA propõe → você revisa → você aprova → envio humano", de: "KI schlägt vor → du prüfst → du gibst frei → menschlicher Versand", it: "IA propone → rivedi → approvi → invio umano" },
  "salesEngine.readyToSend": { fr: "Approuvé — prêt à envoyer", en: "Approved — ready to send", es: "Aprobado — listo para enviar", "pt-BR": "Aprovado — pronto para enviar", de: "Freigegeben — versandbereit", it: "Approvato — pronto per l'invio" },
  "salesEngine.save": { fr: "Sauver", en: "Save", es: "Guardar", "pt-BR": "Salvar", de: "Speichern", it: "Salva" },
  "salesEngine.cancel": { fr: "Annuler", en: "Cancel", es: "Cancelar", "pt-BR": "Cancelar", de: "Abbrechen", it: "Annulla" },
  "salesEngine.approve": { fr: "Approuver et envoyer", en: "Approve and send", es: "Aprobar y enviar", "pt-BR": "Aprovar e enviar", de: "Freigeben und senden", it: "Approva e invia" },
  "salesEngine.edit": { fr: "Modifier", en: "Edit", es: "Editar", "pt-BR": "Editar", de: "Bearbeiten", it: "Modifica" },
  "salesEngine.reject": { fr: "Refuser", en: "Reject", es: "Rechazar", "pt-BR": "Rejeitar", de: "Ablehnen", it: "Rifiuta" },
  "salesEngine.ai": { fr: "IA", en: "AI", es: "IA", "pt-BR": "IA", de: "KI", it: "IA" },

  // ── Fan Tier Labels ──────────────────────────────────────
  "fanTier.whale": { fr: "Whale", en: "Whale", es: "Ballena", "pt-BR": "Baleia", de: "Wal", it: "Whale" },
  "fanTier.vip": { fr: "VIP", en: "VIP", es: "VIP", "pt-BR": "VIP", de: "VIP", it: "VIP" },
  "fanTier.engaged": { fr: "Engagé", en: "Engaged", es: "Comprometido", "pt-BR": "Engajado", de: "Engagiert", it: "Coinvolto" },
  "fanTier.newFan": { fr: "Nouveau", en: "New", es: "Nuevo", "pt-BR": "Novo", de: "Neu", it: "Nuovo" },
  "fanTier.atRisk": { fr: "À risque", en: "At risk", es: "En riesgo", "pt-BR": "Em risco", de: "Gefährdet", it: "A rischio" },
  "fanTier.dormant": { fr: "Dormant", en: "Dormant", es: "Inactivo", "pt-BR": "Dormente", de: "Inaktiv", it: "Dormiente" },

  // ── Status Labels ────────────────────────────────────────
  "status.aiDraftReady": { fr: "Brouillon IA prêt", en: "AI draft ready", es: "Borrador IA listo", "pt-BR": "Rascunho IA pronto", de: "KI-Entwurf bereit", it: "Bozza IA pronta" },
  "status.reviewing": { fr: "En révision", en: "In review", es: "En revisión", "pt-BR": "Em revisão", de: "In Prüfung", it: "In revisione" },
  "status.approved": { fr: "Approuvé", en: "Approved", es: "Aprobado", "pt-BR": "Aprovado", de: "Freigegeben", it: "Approvato" },
  "status.sent": { fr: "Envoyé", en: "Sent", es: "Enviado", "pt-BR": "Enviado", de: "Gesendet", it: "Inviato" },
  "status.rejected": { fr: "Rejeté", en: "Rejected", es: "Rechazado", "pt-BR": "Rejeitado", de: "Abgelehnt", it: "Rifiutato" },
  "status.waiting": { fr: "En attente", en: "Waiting", es: "En espera", "pt-BR": "Aguardando", de: "Wartend", it: "In attesa" },

  // ── Draft Approach Labels ────────────────────────────────
  "approach.chaleureuse": { fr: "Chaleureuse", en: "Warm", es: "Cálida", "pt-BR": "Calorosa", de: "Herzlich", it: "Calorosa" },
  "approach.directe": { fr: "Directe", en: "Direct", es: "Directa", "pt-BR": "Direta", de: "Direkt", it: "Diretta" },
  "approach.joueuse": { fr: "Joueuse", en: "Playful", es: "Juguetona", "pt-BR": "Divertida", de: "Verspielt", it: "Giocosa" },
  "approach.professionnelle": { fr: "Pro", en: "Pro", es: "Pro", "pt-BR": "Pro", de: "Profi", it: "Pro" },
  "approach.complice": { fr: "Complice", en: "Complicit", es: "Cómplice", "pt-BR": "Cúmplice", de: "Vertraut", it: "Complice" },

  // ── Pricing Lab ──────────────────────────────────────────
  "pricing.heading": { fr: "Dynamic Pricing & Negotiation Engine", en: "Dynamic Pricing & Negotiation Engine", es: "Motor de precios dinámicos y negociación", "pt-BR": "Motor de precificação dinâmica e negociação", de: "Dynamic Pricing & Negotiation Engine", it: "Motore di prezzi dinamici e negoziazione" },
  "pricing.subtitle": { fr: "Simule les prix, commissions et marges de négociation pour maximiser le revenu net", en: "Simulate prices, commissions and negotiation margins to maximize net revenue", es: "Simula precios, comisiones y márgenes de negociación para maximizar el ingreso neto", "pt-BR": "Simula preços, comissões e margens de negociação para maximizar a receita líquida", de: "Simuliert Preise, Provisionen und Verhandlungsspannen zur Maximierung des Nettoertrags", it: "Simula prezzi, commissioni e margini di negoziazione per massimizzare il ricavo netto" },
  "pricing.salesPrice": { fr: "Prix de vente", en: "Sale price", es: "Precio de venta", "pt-BR": "Preço de venda", de: "Verkaufspreis", it: "Prezzo di vendita" },
  "pricing.low": { fr: "Bas", en: "Low", es: "Bajo", "pt-BR": "Baixo", de: "Niedrig", it: "Basso" },
  "pricing.medium": { fr: "Moyen", en: "Medium", es: "Medio", "pt-BR": "Médio", de: "Mittel", it: "Medio" },
  "pricing.high": { fr: "Haut", en: "High", es: "Alto", "pt-BR": "Alto", de: "Hoch", it: "Alto" },
  "pricing.platformFees": { fr: "Frais plateforme", en: "Platform fees", es: "Comisiones plataforma", "pt-BR": "Taxas da plataforma", de: "Plattformgebühren", it: "Commissioni piattaforma" },
  "pricing.baseCost": { fr: "Coût base", en: "Base cost", es: "Coste base", "pt-BR": "Custo base", de: "Basiskosten", it: "Costo base" },
  "pricing.netPerSale": { fr: "Net / vente", en: "Net / sale", es: "Neto / venta", "pt-BR": "Líquido / venda", de: "Netto / Verkauf", it: "Netto / vendita" },
  "pricing.marginPct": { fr: "% marge", en: "% margin", es: "% margen", "pt-BR": "% margem", de: "% Marge", it: "% margine" },
  "pricing.estimatedSales": { fr: "Ventes estimées", en: "Estimated sales", es: "Ventas estimadas", "pt-BR": "Vendas estimadas", de: "Geschätzte Verkäufe", it: "Vendite stimate" },
  "pricing.audiencePct": { fr: "% de l'audience", en: "% of audience", es: "% de la audiencia", "pt-BR": "% da audiência", de: "% des Publikums", it: "% del pubblico" },
  "pricing.commissionTiers": { fr: "Tiers de commission", en: "Commission tiers", es: "Niveles de comisión", "pt-BR": "Níveis de comissão", de: "Provisionsstufen", it: "Livelli di commissione" },
  "pricing.currentTier": { fr: "Tier actuel", en: "Current tier", es: "Nivel actual", "pt-BR": "Nível atual", de: "Aktuelle Stufe", it: "Livello attuale" },
  "pricing.grossRevenue": { fr: "Revenu brut estimé", en: "Estimated gross revenue", es: "Ingreso bruto estimado", "pt-BR": "Receita bruta estimada", de: "Geschätzter Bruttoumsatz", it: "Ricavo lordo stimato" },
  "pricing.netRevenue": { fr: "Revenu net estimé", en: "Estimated net revenue", es: "Ingreso neto estimado", "pt-BR": "Receita líquida estimada", de: "Geschätzter Nettoumsatz", it: "Ricavo netto stimato" },
  "pricing.salesMult": { fr: "ventes ×", en: "sales ×", es: "ventas ×", "pt-BR": "vendas ×", de: "Verkäufe ×", it: "vendite ×" },
  "pricing.netEquals": { fr: "net =", en: "net =", es: "neto =", "pt-BR": "líquido =", de: "netto =", it: "netto =" },
  "pricing.negotiationEngine": { fr: "Négociation Engine", en: "Negotiation Engine", es: "Motor de negociación", "pt-BR": "Motor de negociação", de: "Verhandlungs-Engine", it: "Motore di negoziazione" },
  "pricing.floorPrice": { fr: "Prix plancher", en: "Floor price", es: "Precio mínimo", "pt-BR": "Preço mínimo", de: "Mindestpreis", it: "Prezzo minimo" },
  "pricing.minViable": { fr: "Minimum viable", en: "Minimum viable", es: "Mínimo viable", "pt-BR": "Mínimo viável", de: "Minimum viable", it: "Minimo praticabile" },
  "pricing.optimalPrice": { fr: "Prix optimal", en: "Optimal price", es: "Precio óptimo", "pt-BR": "Preço ótimo", de: "Optimaler Preis", it: "Prezzo ottimale" },
  "pricing.optimalPriceReason": { fr: "Bon équilibre conversion/revenu. Marge confortable.", en: "Good conversion/revenue balance. Comfortable margin.", es: "Buen equilibrio conversión/ingresos. Margen cómodo.", "pt-BR": "Bom equilíbrio conversão/receita. Margem confortável.", de: "Gute Balance zwischen Conversion und Umsatz. Komfortable Marge.", it: "Buon equilibrio conversione/ricavi. Margine confortevole." },
  "pricing.lowerPriceWarning": { fr: "Baisser le prix augmente les conversions. Attention à la rentabilité.", en: "Lowering the price increases conversions. Watch profitability.", es: "Bajar el precio aumenta las conversiones. Cuidado con la rentabilidad.", "pt-BR": "Baixar o preço aumenta as conversões. Cuidado com a rentabilidade.", de: "Preissenkung erhöht Conversions. Rentabilität im Auge behalten.", it: "Abbassare il prezzo aumenta le conversioni. Attenzione alla redditività." },
  "pricing.maxConversion": { fr: "Max conversion", en: "Max conversion", es: "Conversión máxima", "pt-BR": "Conversão máxima", de: "Max Conversion", it: "Massima conversione" },
  "pricing.negoMargin": { fr: "Marge de négo", en: "Negotiation margin", es: "Margen de negociación", "pt-BR": "Margem de negociação", de: "Verhandlungsspanne", it: "Margine di negoziazione" },
  "pricing.flexPct": { fr: "% de flex", en: "% flex", es: "% flex", "pt-BR": "% flex", de: "% Flex", it: "% flex" },
  "pricing.confidence": { fr: "Confiance", en: "Confidence", es: "Confianza", "pt-BR": "Confiança", de: "Vertrauen", it: "Fiducia" },
  "pricing.confidenceHigh": { fr: "Élevée", en: "High", es: "Alta", "pt-BR": "Alta", de: "Hoch", it: "Alta" },
  "pricing.confidenceModerate": { fr: "Modérée", en: "Moderate", es: "Moderada", "pt-BR": "Moderada", de: "Mittel", it: "Moderata" },
  "pricing.aiRecommendation": { fr: "Recommandation IA", en: "AI recommendation", es: "Recomendación IA", "pt-BR": "Recomendação IA", de: "KI-Empfehlung", it: "Raccomandazione IA" },
  "pricing.recoBalanced": { fr: "Prix optimal. Bon équilibre conversion/revenu. Marge confortable.", en: "Optimal price. Good conversion/revenue balance. Comfortable margin.", es: "Precio óptimo. Buen equilibrio conversión/ingresos. Margen cómodo.", "pt-BR": "Preço ótimo. Bom equilíbrio conversão/receita. Margem confortável.", de: "Optimaler Preis. Gute Balance zwischen Conversion und Umsatz. Komfortable Marge.", it: "Prezzo ottimale. Buon equilibrio conversione/ricavi. Margine confortevole." },
  "pricing.recoLower": { fr: "Baisser le prix augmente les conversions. Attention à la rentabilité.", en: "Lowering the price increases conversions. Watch profitability.", es: "Bajar el precio aumenta las conversiones. Atención a la rentabilidad.", "pt-BR": "Reduzir o preço aumenta as conversões. Cuidado com a rentabilidade.", de: "Preissenkung erhöht die Conversion. Rentabilität im Auge behalten.", it: "Abbassare il prezzo aumenta le conversioni. Attenzione alla redditività." },
  "pricing.basedOn": { fr: "Basé sur", en: "Based on", es: "Basado en", "pt-BR": "Baseado em", de: "Basierend auf", it: "Basato su" },

  // ── Lists Builder ────────────────────────────────────────
  "lists.heading": { fr: "Dynamic Lists Builder", en: "Dynamic Lists Builder", es: "Creador de listas dinámicas", "pt-BR": "Construtor de listas dinâmicas", de: "Dynamic Lists Builder", it: "Dynamic Lists Builder" },
  "lists.subtitle": { fr: "Crée des segments de fans dynamiques avec filtres pour campagnes ciblées", en: "Create dynamic fan segments with filters for targeted campaigns", es: "Crea segmentos de fans dinámicos con filtros para campañas segmentadas", "pt-BR": "Crie segmentos dinâmicos de fãs com filtros para campanhas direcionadas", de: "Erstelle dynamische Fan-Segmente mit Filtern für gezielte Kampagnen", it: "Crea segmenti dinamici di fan con filtri per campagne mirate" },
  "lists.fieldPlaceholder": { fr: "Champ...", en: "Field...", es: "Campo...", "pt-BR": "Campo...", de: "Feld...", it: "Campo..." },
  "lists.operatorPlaceholder": { fr: "Opérateur...", en: "Operator...", es: "Operador...", "pt-BR": "Operador...", de: "Operator...", it: "Operatore..." },
  "lists.valuePlaceholder": { fr: "Valeur...", en: "Value...", es: "Valor...", "pt-BR": "Valor...", de: "Wert...", it: "Valore..." },
  "lists.add": { fr: "Ajouter", en: "Add", es: "Añadir", "pt-BR": "Adicionar", de: "Hinzufügen", it: "Aggiungi" },
  "lists.estimatedFans": { fr: "Fans estimés :", en: "Estimated fans:", es: "Fans estimados:", "pt-BR": "Fãs estimados:", de: "Geschätzte Fans:", it: "Fan stimati:" },
  "lists.potentialRevenue": { fr: "Revenu potentiel :", en: "Potential revenue:", es: "Ingreso potencial:", "pt-BR": "Receita potencial:", de: "Potenzielle Einnahmen:", it: "Ricavo potenziale:" },
  "lists.saveSegment": { fr: "Sauvegarder le segment", en: "Save segment", es: "Guardar segmento", "pt-BR": "Salvar segmento", de: "Segment speichern", it: "Salva segmento" },
  "lists.savedSegments": { fr: "Segments sauvegardés", en: "Saved segments", es: "Segmentos guardados", "pt-BR": "Segmentos salvos", de: "Gespeicherte Segmente", it: "Segmenti salvati" },
  "lists.potential": { fr: "potentiel", en: "potential", es: "potencial", "pt-BR": "potencial", de: "Potenzial", it: "potenziale" },
  "lists.created": { fr: "Créé", en: "Created", es: "Creado", "pt-BR": "Criado", de: "Erstellt", it: "Creato" },

  // ── Filter Fields ────────────────────────────────────────
  "filter.totalSpent": { fr: "Dépenses totales", en: "Total spent", es: "Gasto total", "pt-BR": "Total gasto", de: "Gesamtausgaben", it: "Spesa totale" },
  "filter.totalSpentHint": { fr: "Montant en EUR", en: "Amount in EUR", es: "Importe en EUR", "pt-BR": "Valor em EUR", de: "Betrag in EUR", it: "Importo in EUR" },
  "filter.lastActive": { fr: "Dernière activité", en: "Last active", es: "Última actividad", "pt-BR": "Última atividade", de: "Letzte Aktivität", it: "Ultima attività" },
  "filter.lastActiveHint": { fr: "Jours d'inactivité", en: "Days inactive", es: "Días de inactividad", "pt-BR": "Dias de inatividade", de: "Tage inaktiv", it: "Giorni di inattività" },
  "filter.platform": { fr: "Plateforme", en: "Platform", es: "Plataforma", "pt-BR": "Plataforma", de: "Plattform", it: "Piattaforma" },
  "filter.platformHint": { fr: "OF, Fansly, MYM...", en: "OF, Fansly, MYM...", es: "OF, Fansly, MYM...", "pt-BR": "OF, Fansly, MYM...", de: "OF, Fansly, MYM...", it: "OF, Fansly, MYM..." },
  "filter.tier": { fr: "Niveau fan", en: "Fan tier", es: "Nivel fan", "pt-BR": "Nível do fã", de: "Fan-Stufe", it: "Livello fan" },
  "filter.tierHint": { fr: "Whale, VIP, Engagé...", en: "Whale, VIP, Engaged...", es: "Ballena, VIP, Comprometido...", "pt-BR": "Baleia, VIP, Engajado...", de: "Wal, VIP, Engagiert...", it: "Whale, VIP, Coinvolto..." },
  "filter.country": { fr: "Pays", en: "Country", es: "País", "pt-BR": "País", de: "Land", it: "Paese" },
  "filter.countryHint": { fr: "Code pays (FR, US...)", en: "Country code (FR, US...)", es: "Código de país (FR, US...)", "pt-BR": "Código do país (FR, US...)", de: "Ländercode (FR, US...)", it: "Codice paese (FR, US...)" },
  "filter.language": { fr: "Langue", en: "Language", es: "Idioma", "pt-BR": "Idioma", de: "Sprache", it: "Lingua" },
  "filter.languageHint": { fr: "fr, en, es, de...", en: "fr, en, es, de...", es: "fr, en, es, de...", "pt-BR": "fr, en, es, de...", de: "fr, en, es, de...", it: "fr, en, es, de..." },
  "filter.tags": { fr: "Tags", en: "Tags", es: "Etiquetas", "pt-BR": "Tags", de: "Tags", it: "Tag" },
  "filter.tagsHint": { fr: "Mot-clé", en: "Keyword", es: "Palabra clave", "pt-BR": "Palavra-chave", de: "Schlüsselwort", it: "Parola chiave" },

  // ── Automation Triggers ──────────────────────────────────
  "automation.heading": { fr: "Automation Triggers", en: "Automation Triggers", es: "Disparadores de automatización", "pt-BR": "Gatilhos de automação", de: "Automatisierungs-Trigger", it: "Trigger di automazione" },
  "automation.subtitle": { fr: "Règles WHEN → THEN pour automatiser les actions de vente", en: "WHEN → THEN rules to automate sales actions", es: "Reglas WHEN → THEN para automatizar acciones de venta", "pt-BR": "Regras WHEN → THEN para automatizar ações de vendas", de: "WHEN → THEN-Regeln zur Automatisierung von Vertriebsaktionen", it: "Regole WHEN → THEN per automatizzare le azioni di vendita" },
  "automation.newRule": { fr: "Nouvelle règle", en: "New rule", es: "Nueva regla", "pt-BR": "Nova regra", de: "Neue Regel", it: "Nuova regola" },
  "automation.rule": { fr: "Règle", en: "Rule", es: "Regla", "pt-BR": "Regra", de: "Regel", it: "Regola" },
  "automation.when": { fr: "QUAND", en: "WHEN", es: "CUANDO", "pt-BR": "QUANDO", de: "WENN", it: "QUANDO" },
  "automation.if": { fr: "SI", en: "IF", es: "SI", "pt-BR": "SE", de: "FALLS", it: "SE" },
  "automation.then": { fr: "ALORS", en: "THEN", es: "ENTONCES", "pt-BR": "ENTÃO", de: "DANN", it: "ALLORA" },
  "automation.status": { fr: "Statut", en: "Status", es: "Estado", "pt-BR": "Status", de: "Status", it: "Stato" },
  "automation.triggered": { fr: "Déclenché", en: "Triggered", es: "Disparado", "pt-BR": "Acionado", de: "Ausgelöst", it: "Attivato" },

  // ── Trigger Events ───────────────────────────────────────
  "trigger.fanMessage": { fr: "Message fan reçu", en: "Fan message received", es: "Mensaje de fan recibido", "pt-BR": "Mensagem de fã recebida", de: "Fan-Nachricht erhalten", it: "Messaggio fan ricevuto" },
  "trigger.newSub": { fr: "Nouvel abonnement", en: "New subscription", es: "Nueva suscripción", "pt-BR": "Nova assinatura", de: "Neues Abonnement", it: "Nuovo abbonamento" },
  "trigger.unsub": { fr: "Désabonnement", en: "Unsubscription", es: "Cancelación de suscripción", "pt-BR": "Cancelamento de assinatura", de: "Kündigung", it: "Disdetta" },
  "trigger.purchase": { fr: "Achat effectué", en: "Purchase made", es: "Compra realizada", "pt-BR": "Compra realizada", de: "Kauf getätigt", it: "Acquisto effettuato" },
  "trigger.inactive7": { fr: "Inactif depuis 7 jours", en: "Inactive for 7 days", es: "Inactivo por 7 días", "pt-BR": "Inativo há 7 dias", de: "7 Tage inaktiv", it: "Inattivo da 7 giorni" },
  "trigger.inactive30": { fr: "Inactif depuis 30 jours", en: "Inactive for 30 days", es: "Inactivo por 30 días", "pt-BR": "Inativo há 30 dias", de: "30 Tage inaktiv", it: "Inattivo da 30 giorni" },
  "trigger.ppvViewed": { fr: "PPV consulté", en: "PPV viewed", es: "PPV consultado", "pt-BR": "PPV visualizado", de: "PPV angesehen", it: "PPV visualizzato" },
  "trigger.fanBirthday": { fr: "Anniversaire fan", en: "Fan birthday", es: "Cumpleaños del fan", "pt-BR": "Aniversário do fã", de: "Fan-Geburtstag", it: "Compleanno fan" },
  "trigger.vipTier": { fr: "Palier VIP atteint", en: "VIP tier reached", es: "Nivel VIP alcanzado", "pt-BR": "Nível VIP alcançado", de: "VIP-Stufe erreicht", it: "Livello VIP raggiunto" },

  // ── Trigger Actions ──────────────────────────────────────
  "action.welcome": { fr: "Envoyer message de bienvenue", en: "Send welcome message", es: "Enviar mensaje de bienvenida", "pt-BR": "Enviar mensagem de boas-vindas", de: "Willkommensnachricht senden", it: "Invia messaggio di benvenuto" },
  "action.proposePpv": { fr: "Proposer un PPV", en: "Propose a PPV", es: "Proponer un PPV", "pt-BR": "Propor um PPV", de: "PPV vorschlagen", it: "Proponi un PPV" },
  "action.reengage": { fr: "Envoyer message de réengagement", en: "Send re-engagement message", es: "Enviar mensaje de reactivación", "pt-BR": "Enviar mensagem de reengajamento", de: "Reaktivierungsnachricht senden", it: "Invia messaggio di re-engagement" },
  "action.assignChatter": { fr: "Assigner à un chatter", en: "Assign to a chatter", es: "Asignar a un chatter", "pt-BR": "Atribuir a um chatter", de: "Einem Chatter zuweisen", it: "Assegna a un chatter" },
  "action.addTag": { fr: "Ajouter un tag", en: "Add a tag", es: "Añadir etiqueta", "pt-BR": "Adicionar tag", de: "Tag hinzufügen", it: "Aggiungi tag" },
  "action.flagReview": { fr: "Marquer pour révision", en: "Flag for review", es: "Marcar para revisión", "pt-BR": "Marcar para revisão", de: "Zur Prüfung markieren", it: "Segnala per revisione" },
  "action.sendDiscount": { fr: "Envoyer une remise", en: "Send a discount", es: "Enviar un descuento", "pt-BR": "Enviar um desconto", de: "Rabatt senden", it: "Invia uno sconto" },
  "action.birthdayGift": { fr: "Envoyer cadeau d'anniv.", en: "Send birthday gift", es: "Enviar regalo de cumpleaños", "pt-BR": "Enviar presente de aniversário", de: "Geburtstagsgeschenk senden", it: "Invia regalo di compleanno" },

  // ── Tracking Links ───────────────────────────────────────
  "tracking.heading": { fr: "Tracking Links & Attribution", en: "Tracking Links & Attribution", es: "Enlaces de seguimiento y atribución", "pt-BR": "Links de rastreamento e atribuição", de: "Tracking-Links & Attribution", it: "Link di tracking e attribuzione" },
  "tracking.subtitle": { fr: "Suis les clics, conversions et revenus par lien de tracking", en: "Track clicks, conversions, and revenue per tracking link", es: "Sigue clics, conversiones e ingresos por enlace de seguimiento", "pt-BR": "Acompanhe cliques, conversões e receita por link de rastreamento", de: "Verfolge Klicks, Conversions und Einnahmen pro Tracking-Link", it: "Traccia clic, conversioni e ricavi per link di tracking" },
  "tracking.totalClicks": { fr: "Clics totaux", en: "Total clicks", es: "Clics totales", "pt-BR": "Cliques totais", de: "Gesamtklicks", it: "Clic totali" },
  "tracking.conversions": { fr: "Conversions", en: "Conversions", es: "Conversiones", "pt-BR": "Conversões", de: "Conversions", it: "Conversioni" },
  "tracking.convRate": { fr: "Taux de conversion", en: "Conversion rate", es: "Tasa de conversión", "pt-BR": "Taxa de conversão", de: "Conversion-Rate", it: "Tasso di conversione" },
  "tracking.attributedRevenue": { fr: "Revenu attribué", en: "Attributed revenue", es: "Ingreso atribuido", "pt-BR": "Receita atribuída", de: "Zugeordnete Einnahmen", it: "Ricavo attribuito" },
  "tracking.name": { fr: "Nom", en: "Name", es: "Nombre", "pt-BR": "Nome", de: "Name", it: "Nome" },
  "tracking.campaign": { fr: "Campagne", en: "Campaign", es: "Campaña", "pt-BR": "Campanha", de: "Kampagne", it: "Campagna" },
  "tracking.platform": { fr: "Plateforme", en: "Platform", es: "Plataforma", "pt-BR": "Plataforma", de: "Plattform", it: "Piattaforma" },
  "tracking.clicks": { fr: "Clics", en: "Clicks", es: "Clics", "pt-BR": "Cliques", de: "Klicks", it: "Clic" },
  "tracking.convShort": { fr: "Conv.", en: "Conv.", es: "Conv.", "pt-BR": "Conv.", de: "Conv.", it: "Conv." },
  "tracking.rate": { fr: "Taux", en: "Rate", es: "Tasa", "pt-BR": "Taxa", de: "Rate", it: "Tasso" },
  "tracking.revenue": { fr: "Revenu", en: "Revenue", es: "Ingreso", "pt-BR": "Receita", de: "Einnahmen", it: "Ricavo" },
  "tracking.copy": { fr: "Copier", en: "Copy", es: "Copiar", "pt-BR": "Copiar", de: "Kopieren", it: "Copia" },

  // ── Browser Workspace ────────────────────────────────────
  "browser.heading": { fr: "Browser Workspace", en: "Browser Workspace", es: "Espacio de navegación", "pt-BR": "Workspace de navegação", de: "Browser-Arbeitsbereich", it: "Browser Workspace" },
  "browser.subtitle": { fr: "Mock — Interface de navigation simulée des plateformes", en: "Mock — Simulated platform browsing interface", es: "Mock — Interfaz de navegación simulada de plataformas", "pt-BR": "Mock — Interface de navegação simulada das plataformas", de: "Mock — Simulierte Plattform-Browsing-Oberfläche", it: "Mock — Interfaccia di navigazione simulata delle piattaforme" },
  "browser.mockWarning": { fr: "MOCK — Aucune donnée réelle. Aucune connexion aux plateformes.", en: "MOCK — No real data. No platform connection.", es: "MOCK — Sin datos reales. Sin conexión a plataformas.", "pt-BR": "MOCK — Nenhum dado real. Nenhuma conexão com plataformas.", de: "MOCK — Keine echten Daten. Keine Plattform-Verbindung.", it: "MOCK — Nessun dato reale. Nessuna connessione alle piattaforme." },
  "browser.recentPosts": { fr: "Posts récents", en: "Recent posts", es: "Posts recientes", "pt-BR": "Posts recentes", de: "Aktuelle Posts", it: "Post recenti" },
  "browser.directMessages": { fr: "Messages directs", en: "Direct messages", es: "Mensajes directos", "pt-BR": "Mensagens diretas", de: "Direktnachrichten", it: "Messaggi diretti" },
  "browser.ppvInterest": { fr: "Intérêt PPV détecté", en: "PPV interest detected", es: "Interés PPV detectado", "pt-BR": "Interesse PPV detectado", de: "PPV-Interesse erkannt", it: "Interesse PPV rilevato" },

  // ── Campaign Builder ─────────────────────────────────────
  "campaign.heading": { fr: "Campaign Builder", en: "Campaign Builder", es: "Creador de campañas", "pt-BR": "Construtor de campanhas", de: "Kampagnen-Builder", it: "Campaign Builder" },
  "campaign.subtitle": { fr: "Crée et lance des campagnes de vente en 6 étapes", en: "Create and launch sales campaigns in 6 steps", es: "Crea y lanza campañas de ventas en 6 pasos", "pt-BR": "Crie e lance campanhas de vendas em 6 etapas", de: "Erstelle und starte Vertriebskampagnen in 6 Schritten", it: "Crea e lancia campagne di vendita in 6 fasi" },
  "campaign.new": { fr: "Nouvelle", en: "New", es: "Nueva", "pt-BR": "Nova", de: "Neu", it: "Nuova" },
  "campaign.audience": { fr: "Audience", en: "Audience", es: "Audiencia", "pt-BR": "Audiência", de: "Zielgruppe", it: "Pubblico" },
  "campaign.segment": { fr: "Segment", en: "Segment", es: "Segmento", "pt-BR": "Segmento", de: "Segment", it: "Segmento" },
  "campaign.targetedFans": { fr: "Fans ciblés", en: "Targeted fans", es: "Fans objetivo", "pt-BR": "Fãs alvo", de: "Ziel-Fans", it: "Fan targettizzati" },
  "campaign.content": { fr: "Contenu", en: "Content", es: "Contenido", "pt-BR": "Conteúdo", de: "Inhalt", it: "Contenuto" },
  "campaign.medias": { fr: "médias", en: "medias", es: "medios", "pt-BR": "mídias", de: "Medien", it: "media" },
  "campaign.pricing": { fr: "Tarification", en: "Pricing", es: "Precios", "pt-BR": "Precificação", de: "Preisgestaltung", it: "Prezzi" },
  "campaign.basePrice": { fr: "Prix de base", en: "Base price", es: "Precio base", "pt-BR": "Preço base", de: "Grundpreis", it: "Prezzo base" },
  "campaign.discount": { fr: "Remise", en: "Discount", es: "Descuento", "pt-BR": "Desconto", de: "Rabatt", it: "Sconto" },
  "campaign.estimatedRevenue": { fr: "Revenu estimé", en: "Estimated revenue", es: "Ingreso estimado", "pt-BR": "Receita estimada", de: "Geschätzte Einnahmen", it: "Ricavo stimato" },
  "campaign.compliance": { fr: "Conformité", en: "Compliance", es: "Cumplimiento", "pt-BR": "Conformidade", de: "Compliance", it: "Conformità" },
  "campaign.compliant": { fr: "Conforme", en: "Compliant", es: "Conforme", "pt-BR": "Em conformidade", de: "Konform", it: "Conforme" },
  "campaign.issueDetected": { fr: "Problème détecté", en: "Issue detected", es: "Problema detectado", "pt-BR": "Problema detectado", de: "Problem erkannt", it: "Problema rilevato" },
  "campaign.pendingCheck": { fr: "En attente de vérification", en: "Pending verification", es: "Pendiente de verificación", "pt-BR": "Aguardando verificação", de: "Prüfung ausstehend", it: "In attesa di verifica" },
  "campaign.summary": { fr: "Résumé de la campagne", en: "Campaign summary", es: "Resumen de la campaña", "pt-BR": "Resumo da campanha", de: "Kampagnen-Zusammenfassung", it: "Riepilogo campagna" },
  "campaign.type": { fr: "Type", en: "Type", es: "Tipo", "pt-BR": "Tipo", de: "Typ", it: "Tipo" },
  "campaign.price": { fr: "Prix", en: "Price", es: "Precio", "pt-BR": "Preço", de: "Preis", it: "Prezzo" },
  "campaign.readyToLaunch": { fr: "Prêt à lancer", en: "Ready to launch", es: "Listo para lanzar", "pt-BR": "Pronto para lançar", de: "Startbereit", it: "Pronto al lancio" },
  "campaign.readyDesc": { fr: "Tout est vérifié. La campagne sera envoyée à", en: "All verified. Campaign will be sent to", es: "Todo verificado. La campaña se enviará a", "pt-BR": "Tudo verificado. A campanha será enviada para", de: "Alles geprüft. Kampagne wird gesendet an", it: "Tutto verificato. La campagna sarà inviata a" },
  "campaign.launch": { fr: "Lancer la campagne", en: "Launch campaign", es: "Lanzar campaña", "pt-BR": "Lançar campanha", de: "Kampagne starten", it: "Lancia campagna" },
  "campaign.previous": { fr: "Précédent", en: "Previous", es: "Anterior", "pt-BR": "Anterior", de: "Zurück", it: "Precedente" },
  "campaign.next": { fr: "Suivant", en: "Next", es: "Siguiente", "pt-BR": "Próximo", de: "Weiter", it: "Successivo" },

  // ── Campaign Step Labels ─────────────────────────────────
  "step.audience": { fr: "Audience", en: "Audience", es: "Audiencia", "pt-BR": "Audiência", de: "Zielgruppe", it: "Pubblico" },
  "step.content": { fr: "Contenu", en: "Content", es: "Contenido", "pt-BR": "Conteúdo", de: "Inhalt", it: "Contenuto" },
  "step.pricing": { fr: "Tarification", en: "Pricing", es: "Precios", "pt-BR": "Precificação", de: "Preisgestaltung", it: "Prezzi" },
  "step.compliance": { fr: "Conformité", en: "Compliance", es: "Cumplimiento", "pt-BR": "Conformidade", de: "Compliance", it: "Conformità" },
  "step.review": { fr: "Révision", en: "Review", es: "Revisión", "pt-BR": "Revisão", de: "Überprüfung", it: "Revisione" },
  "step.launch": { fr: "Lancement", en: "Launch", es: "Lanzamiento", "pt-BR": "Lançamento", de: "Start", it: "Lancio" },

  // ── Campaign Type Labels ─────────────────────────────────
  "campaignType.ppv_drop": { fr: "Drop PPV", en: "PPV Drop", es: "Lanzamiento PPV", "pt-BR": "Drop PPV", de: "PPV-Drop", it: "Drop PPV" },
  "campaignType.bundle_launch": { fr: "Lancement Bundle", en: "Bundle Launch", es: "Lanzamiento Bundle", "pt-BR": "Lançamento Bundle", de: "Bundle-Start", it: "Lancio Bundle" },
  "campaignType.reengagement": { fr: "Réengagement", en: "Re-engagement", es: "Reactivación", "pt-BR": "Reengajamento", de: "Reaktivierung", it: "Re-engagement" },
  "campaignType.welcome_series": { fr: "Série Bienvenue", en: "Welcome Series", es: "Serie de bienvenida", "pt-BR": "Série de boas-vindas", de: "Willkommens-Serie", it: "Serie benvenuto" },

  // ── Fan Journey ──────────────────────────────────────────
  "journey.heading": { fr: "Fan Journey", en: "Fan Journey", es: "Viaje del fan", "pt-BR": "Jornada do fã", de: "Fan Journey", it: "Fan Journey" },
  "journey.subtitle": { fr: "Visualise le parcours fan de la découverte à l'ambassadeur", en: "Visualize the fan journey from discovery to ambassador", es: "Visualiza el viaje del fan desde el descubrimiento hasta el embajador", "pt-BR": "Visualize a jornada do fã da descoberta ao embaixador", de: "Visualisiere die Fan-Reise von der Entdeckung zum Botschafter", it: "Visualizza il percorso del fan dalla scoperta all'ambasciatore" },
  "journey.fans": { fr: "fans", en: "fans", es: "fans", "pt-BR": "fãs", de: "Fans", it: "fan" },
  "journey.daysAvg": { fr: "j en moyenne", en: "days avg", es: "días en promedio", "pt-BR": "dias em média", de: "Tage im Schnitt", it: "giorni in media" },
  "journey.perFan": { fr: "/fan", en: "/fan", es: "/fan", "pt-BR": "/fã", de: "/Fan", it: "/fan" },

  // ── Fan Journey Stages ───────────────────────────────────
  "journeyStage.discovery": { fr: "Découverte", en: "Discovery", es: "Descubrimiento", "pt-BR": "Descoberta", de: "Entdeckung", it: "Scoperta" },
  "journeyStage.discoveryDesc": { fr: "Découvre le contenu via réseaux sociaux", en: "Discovers content via social media", es: "Descubre el contenido vía redes sociales", "pt-BR": "Descobre o conteúdo via redes sociais", de: "Entdeckt Inhalte über soziale Medien", it: "Scopre i contenuti via social media" },
  "journeyStage.sub": { fr: "Abonnement", en: "Subscription", es: "Suscripción", "pt-BR": "Assinatura", de: "Abonnement", it: "Abbonamento" },
  "journeyStage.subDesc": { fr: "S'abonne à la plateforme", en: "Subscribes to the platform", es: "Se suscribe a la plataforma", "pt-BR": "Assina a plataforma", de: "Abonniert die Plattform", it: "Si abbona alla piattaforma" },
  "journeyStage.firstPurchase": { fr: "Premier achat", en: "First purchase", es: "Primera compra", "pt-BR": "Primeira compra", de: "Erster Kauf", it: "Primo acquisto" },
  "journeyStage.firstPurchaseDesc": { fr: "Achète son premier PPV ou contenu", en: "Buys first PPV or content", es: "Compra su primer PPV o contenido", "pt-BR": "Compra seu primeiro PPV ou conteúdo", de: "Kauft erstes PPV oder Inhalte", it: "Acquista il primo PPV o contenuto" },
  "journeyStage.engagement": { fr: "Engagement", en: "Engagement", es: "Compromiso", "pt-BR": "Engajamento", de: "Engagement", it: "Coinvolgimento" },
  "journeyStage.engagementDesc": { fr: "Achète régulièrement, interagit", en: "Buys regularly, interacts", es: "Compra regularmente, interactúa", "pt-BR": "Compra regularmente, interage", de: "Kauft regelmäßig, interagiert", it: "Acquista regolarmente, interagisce" },
  "journeyStage.loyalty": { fr: "Fidélisation", en: "Loyalty", es: "Fidelización", "pt-BR": "Fidelização", de: "Treue", it: "Fidelizzazione" },
  "journeyStage.loyaltyDesc": { fr: "VIP/Whale, achats fréquents", en: "VIP/Whale, frequent purchases", es: "VIP/Ballena, compras frecuentes", "pt-BR": "VIP/Baleia, compras frequentes", de: "VIP/Wal, häufige Käufe", it: "VIP/Whale, acquisti frequenti" },
  "journeyStage.ambassador": { fr: "Ambassadeur", en: "Ambassador", es: "Embajador", "pt-BR": "Embaixador", de: "Botschafter", it: "Ambasciatore" },
  "journeyStage.ambassadorDesc": { fr: "Recommande, achète tout, fidèle absolu", en: "Recommends, buys everything, absolutely loyal", es: "Recomienda, compra todo, leal absoluto", "pt-BR": "Recomenda, compra tudo, fiel absoluto", de: "Empfiehlt, kauft alles, absolut treu", it: "Raccomanda, compra tutto, fedelissimo" },

  // ── Opportunity Queue ────────────────────────────────────
  "opportunity.heading": { fr: "Opportunity Queue", en: "Opportunity Queue", es: "Cola de oportunidades", "pt-BR": "Fila de oportunidades", de: "Opportunity Queue", it: "Coda opportunità" },
  "opportunity.subtitle": { fr: "File d'opportunités de vente priorisées par l'IA", en: "AI-prioritized sales opportunity queue", es: "Cola de oportunidades de venta priorizadas por IA", "pt-BR": "Fila de oportunidades de venda priorizadas pela IA", de: "KI-priorisierte Verkaufschancen-Warteschlange", it: "Coda di opportunità di vendita priorizzate dall'IA" },
  "opportunity.allTypes": { fr: "Tous les types", en: "All types", es: "Todos los tipos", "pt-BR": "Todos os tipos", de: "Alle Typen", it: "Tutti i tipi" },
  "opportunity.deadline": { fr: "Échéance", en: "Deadline", es: "Fecha límite", "pt-BR": "Prazo", de: "Frist", it: "Scadenza" },

  // ── Opportunity Stage Labels ─────────────────────────────
  "oppStage.to_review": { fr: "À examiner", en: "To review", es: "Por examinar", "pt-BR": "A examinar", de: "Zu prüfen", it: "Da esaminare" },
  "oppStage.in_progress": { fr: "En cours", en: "In progress", es: "En curso", "pt-BR": "Em andamento", de: "In Bearbeitung", it: "In corso" },
  "oppStage.sent": { fr: "Envoyé", en: "Sent", es: "Enviado", "pt-BR": "Enviado", de: "Gesendet", it: "Inviato" },
  "oppStage.converted": { fr: "Converti", en: "Converted", es: "Convertido", "pt-BR": "Convertido", de: "Konvertiert", it: "Convertito" },
  "oppStage.dismissed": { fr: "Ignoré", en: "Ignored", es: "Ignorado", "pt-BR": "Ignorado", de: "Ignoriert", it: "Ignorato" },

  // ── Opportunity Type Labels ──────────────────────────────
  "oppType.ppv_upsell": { fr: "Upsell PPV", en: "PPV Upsell", es: "Upsell PPV", "pt-BR": "Upsell PPV", de: "PPV-Upsell", it: "Upsell PPV" },
  "oppType.reengage": { fr: "Réengagement", en: "Re-engagement", es: "Reactivación", "pt-BR": "Reengajamento", de: "Reaktivierung", it: "Re-engagement" },
  "oppType.upsell_sub": { fr: "Upsell Abo", en: "Subscription Upsell", es: "Upsell suscripción", "pt-BR": "Upsell assinatura", de: "Abo-Upsell", it: "Upsell abbonamento" },
  "oppType.custom_request": { fr: "Demande custom", en: "Custom request", es: "Solicitud personalizada", "pt-BR": "Pedido customizado", de: "Benutzerdefinierte Anfrage", it: "Richiesta personalizzata" },
  "oppType.tip_ask": { fr: "Demande de tip", en: "Tip request", es: "Solicitud de propina", "pt-BR": "Pedido de gorjeta", de: "Trinkgeld-Anfrage", it: "Richiesta di mancia" },
  "oppType.welcome_new": { fr: "Accueil nouveau", en: "New fan welcome", es: "Bienvenida nuevo fan", "pt-BR": "Boas-vindas novo fã", de: "Neuer Fan Willkommen", it: "Benvenuto nuovo fan" },

  // ── Team Control ─────────────────────────────────────────
  "team.heading": { fr: "Team Control Room", en: "Team Control Room", es: "Sala de control de equipo", "pt-BR": "Sala de controle de equipe", de: "Team Control Room", it: "Sala controllo team" },
  "team.subtitle": { fr: "Vue d'ensemble de l'activité de l'équipe", en: "Team activity overview", es: "Vista general de la actividad del equipo", "pt-BR": "Visão geral da atividade da equipe", de: "Übersicht der Team-Aktivität", it: "Panoramica attività del team" },
  "team.activeConvs": { fr: "conversations actives", en: "active conversations", es: "conversaciones activas", "pt-BR": "conversas ativas", de: "aktive Gespräche", it: "conversazioni attive" },
  "team.generated": { fr: "généré", en: "generated", es: "generado", "pt-BR": "gerado", de: "generiert", it: "generato" },
  "team.active": { fr: "Actives", en: "Active", es: "Activas", "pt-BR": "Ativas", de: "Aktiv", it: "Attive" },
  "team.drafts": { fr: "Drafts", en: "Drafts", es: "Borradores", "pt-BR": "Rascunhos", de: "Entwürfe", it: "Bozze" },
  "team.recentActivity": { fr: "Activité récente", en: "Recent activity", es: "Actividad reciente", "pt-BR": "Atividade recente", de: "Letzte Aktivität", it: "Attività recente" },
  "team.goldenRatio": { fr: "Golden Ratio", en: "Golden Ratio", es: "Golden Ratio", "pt-BR": "Golden Ratio", de: "Golden Ratio", it: "Golden Ratio" },
  "team.employee": { fr: "Employé", en: "Employee", es: "Empleado", "pt-BR": "Funcionário", de: "Mitarbeiter", it: "Dipendente" },
  "team.role": { fr: "Rôle", en: "Role", es: "Rol", "pt-BR": "Função", de: "Rolle", it: "Ruolo" },
  "team.revenueGen": { fr: "CA généré", en: "Revenue generated", es: "Ingresos generados", "pt-BR": "Receita gerada", de: "Generierte Einnahmen", it: "Ricavi generati" },
  "team.convsShort": { fr: "Convs.", en: "Convs.", es: "Conv.", "pt-BR": "Conv.", de: "Gespr.", it: "Conv." },
  "team.approvedShort": { fr: "Approuvés", en: "Approved", es: "Aprobados", "pt-BR": "Aprovados", de: "Freigegeben", it: "Approvati" },
  "team.approvalRate": { fr: "Taux appro.", en: "Approval rate", es: "Tasa aprob.", "pt-BR": "Taxa apro.", de: "Freigaberate", it: "Tasso appro." },
  "team.responseTime": { fr: "Tps réponse", en: "Response time", es: "Tiempo resp.", "pt-BR": "Tempo resp.", de: "Antwortzeit", it: "Tempo risp." },
  "team.revPerConv": { fr: "CA/conv", en: "Rev/conv", es: "Ingr/conv", "pt-BR": "Rec/conv", de: "Umsatz/Gespr.", it: "Ric/conv" },
  "team.goldenRatioExplanation": { fr: "Golden Ratio = (Taux d'approbation × CA/conversation) / Temps de réponse. Score > 80 = Excellent, 60-80 = Bon, < 60 = À améliorer.", en: "Golden Ratio = (Approval rate × Revenue/conversation) / Response time. Score > 80 = Excellent, 60-80 = Good, < 60 = Needs improvement.", es: "Golden Ratio = (Tasa de aprobación × Ingresos/conversación) / Tiempo de respuesta. Puntuación > 80 = Excelente, 60-80 = Bueno, < 60 = A mejorar.", "pt-BR": "Golden Ratio = (Taxa de aprovação × Receita/conversa) / Tempo de resposta. Pontuação > 80 = Excelente, 60-80 = Bom, < 60 = A melhorar.", de: "Golden Ratio = (Freigaberate × Umsatz/Gespräch) / Antwortzeit. Score > 80 = Exzellent, 60-80 = Gut, < 60 = Verbesserungswürdig.", it: "Golden Ratio = (Tasso di approvazione × Ricavi/conversazione) / Tempo di risposta. Punteggio > 80 = Eccellente, 60-80 = Buono, < 60 = Da migliorare." },

  // ── Employee Roles ───────────────────────────────────────
  "role.manager": { fr: "Manager", en: "Manager", es: "Manager", "pt-BR": "Gerente", de: "Manager", it: "Manager" },
  "role.chatter": { fr: "Chatter", en: "Chatter", es: "Chatter", "pt-BR": "Chatter", de: "Chatter", it: "Chatter" },
  "role.compliance": { fr: "Compliance", en: "Compliance", es: "Cumplimiento", "pt-BR": "Compliance", de: "Compliance", it: "Compliance" },

  // ── Compliance Review ────────────────────────────────────
  "compliance.heading": { fr: "Compliance Review Queue", en: "Compliance Review Queue", es: "Cola de revisión de cumplimiento", "pt-BR": "Fila de revisão de compliance", de: "Compliance-Prüfwarteschlange", it: "Coda di revisione conformità" },
  "compliance.subtitle": { fr: "Contenus et messages nécessitant une révision humaine", en: "Content and messages requiring human review", es: "Contenidos y mensajes que requieren revisión humana", "pt-BR": "Conteúdos e mensagens que exigem revisão humana", de: "Inhalte und Nachrichten, die menschliche Prüfung erfordern", it: "Contenuti e messaggi che richiedono revisione umana" },
  "compliance.allCategories": { fr: "Toutes les catégories", en: "All categories", es: "Todas las categorías", "pt-BR": "Todas as categorias", de: "Alle Kategorien", it: "Tutte le categorie" },
  "compliance.detectedBy": { fr: "Détecté par :", en: "Detected by:", es: "Detectado por:", "pt-BR": "Detectado por:", de: "Erkannt von:", it: "Rilevato da:" },
  "compliance.ai": { fr: "IA", en: "AI", es: "IA", "pt-BR": "IA", de: "KI", it: "IA" },
  "compliance.human": { fr: "Humain", en: "Human", es: "Humano", "pt-BR": "Humano", de: "Mensch", it: "Umano" },
  "compliance.created": { fr: "Créé :", en: "Created:", es: "Creado:", "pt-BR": "Criado:", de: "Erstellt:", it: "Creato:" },
  "compliance.reviewer": { fr: "Réviseur :", en: "Reviewer:", es: "Revisor:", "pt-BR": "Revisor:", de: "Prüfer:", it: "Revisore:" },
  "compliance.notes": { fr: "Notes :", en: "Notes:", es: "Notas:", "pt-BR": "Notas:", de: "Notizen:", it: "Note:" },
  "compliance.approveCompliant": { fr: "Approuver (conforme)", en: "Approve (compliant)", es: "Aprobar (conforme)", "pt-BR": "Aprovar (em conformidade)", de: "Freigeben (konform)", it: "Approva (conforme)" },
  "compliance.rejectNonCompliant": { fr: "Rejeter (non conforme)", en: "Reject (non-compliant)", es: "Rechazar (no conforme)", "pt-BR": "Rejeitar (não conforme)", de: "Ablehnen (nicht konform)", it: "Rifiuta (non conforme)" },
  "compliance.escalate": { fr: "Escalader au manager", en: "Escalate to manager", es: "Escalar al manager", "pt-BR": "Escalar para o gerente", de: "An Manager eskalieren", it: "Escala al manager" },
  "compliance.statusPending": { fr: "En attente", en: "Pending", es: "Pendiente", "pt-BR": "Pendente", de: "Ausstehend", it: "In attesa" },
  "compliance.statusApproved": { fr: "Approuvé", en: "Approved", es: "Aprobado", "pt-BR": "Aprovado", de: "Freigegeben", it: "Approvato" },
  "compliance.statusEscalated": { fr: "Escaladé", en: "Escalated", es: "Escalado", "pt-BR": "Escalado", de: "Eskaliert", it: "Escalato" },
  "compliance.statusRejected": { fr: "Rejeté", en: "Rejected", es: "Rechazado", "pt-BR": "Rejeitado", de: "Abgelehnt", it: "Rifiutato" },

  // ── Risk Categories ──────────────────────────────────────
  "risk.language": { fr: "Langage", en: "Language", es: "Lenguaje", "pt-BR": "Linguagem", de: "Sprache", it: "Linguaggio" },
  "risk.pricing": { fr: "Tarification", en: "Pricing", es: "Precios", "pt-BR": "Precificação", de: "Preisgestaltung", it: "Prezzi" },
  "risk.boundary": { fr: "Limite", en: "Boundary", es: "Límite", "pt-BR": "Limite", de: "Grenze", it: "Limite" },
  "risk.tos": { fr: "CGU", en: "TOS", es: "TOS", "pt-BR": "Termos", de: "AGB", it: "TOS" },
  "risk.copyright": { fr: "Droits d'auteur", en: "Copyright", es: "Derechos de autor", "pt-BR": "Direitos autorais", de: "Urheberrecht", it: "Diritti d'autore" },

  // ── Why Atlas is Safer ───────────────────────────────────
  "whySafer.heading": { fr: "Why Atlas is Safer", en: "Why Atlas is Safer", es: "Por qué Atlas es más seguro", "pt-BR": "Por que o Atlas é mais seguro", de: "Warum Atlas sicherer ist", it: "Perché Atlas è più sicuro" },
  "whySafer.subtitle": { fr: "Pourquoi les créatrices choisissent Atlas pour gérer leurs ventes en toute sécurité", en: "Why creators choose Atlas to manage their sales safely", es: "Por qué las creadoras eligen Atlas para gestionar sus ventas de forma segura", "pt-BR": "Por que as criadoras escolhem o Atlas para gerenciar suas vendas com segurança", de: "Warum Creator Atlas für sicheres Vertriebsmanagement wählen", it: "Perché i creator scelgono Atlas per gestire le vendite in sicurezza" },
  "whySafer.bottomCta": { fr: "IA propose → Humain vérifie → Humain valide → Envoi humain", en: "AI proposes → Human checks → Human validates → Human sends", es: "IA propone → Humano verifica → Humano valida → Envío humano", "pt-BR": "IA propõe → Humano verifica → Humano valida → Envio humano", de: "KI schlägt vor → Mensch prüft → Mensch validiert → Menschlicher Versand", it: "IA propone → Umano verifica → Umano convalida → Invio umano" },
  "whySafer.bottomSubtitle": { fr: "Aucun envoi automatique. 100% des messages sont validés par un humain.", en: "No automatic sending. 100% of messages are human-validated.", es: "Sin envío automático. El 100% de los mensajes son validados por un humano.", "pt-BR": "Nenhum envio automático. 100% das mensagens são validadas por um humano.", de: "Kein automatischer Versand. 100% der Nachrichten sind menschlich validiert.", it: "Nessun invio automatico. Il 100% dei messaggi è convalidato da un umano." },

  // ── Safety Reasons ───────────────────────────────────────
  "safetyReason.humanValidation": { fr: "Validation humaine obligatoire", en: "Mandatory human validation", es: "Validación humana obligatoria", "pt-BR": "Validação humana obrigatória", de: "Obligatorische menschliche Validierung", it: "Validazione umana obbligatoria" },
  "safetyReason.humanValidationDesc": { fr: "Chaque message proposé par l'IA doit être relu, modifié si besoin, et validé par un humain avant envoi. Aucun envoi automatique.", en: "Every AI-proposed message must be reviewed, edited if needed, and validated by a human before sending. No automatic sending.", es: "Cada mensaje propuesto por la IA debe ser revisado, editado si es necesario y validado por un humano antes del envío. Sin envío automático.", "pt-BR": "Cada mensagem proposta pela IA deve ser revisada, editada se necessário e validada por um humano antes do envio. Nenhum envio automático.", de: "Jede von der KI vorgeschlagene Nachricht muss vor dem Versand überprüft, bei Bedarf bearbeitet und von einem Menschen validiert werden. Kein automatischer Versand.", it: "Ogni messaggio proposto dall'IA deve essere rivisto, modificato se necessario e convalidato da un umano prima dell'invio. Nessun invio automatico." },
  "safetyReason.humanValidationHighlight": { fr: "100% des messages validés par un humain", en: "100% of messages human-validated", es: "100% de mensajes validados por humanos", "pt-BR": "100% das mensagens validadas por humanos", de: "100% der Nachrichten menschlich validiert", it: "100% dei messaggi convalidati da umani" },
  "safetyReason.autoCompliance": { fr: "Conformité automatisée", en: "Automated compliance", es: "Cumplimiento automatizado", "pt-BR": "Conformidade automatizada", de: "Automatisierte Compliance", it: "Conformità automatizzata" },
  "safetyReason.autoComplianceDesc": { fr: "L'IA analyse chaque conversation en temps réel et détecte les risques : demandes IRL, langage interdit, pricing hors normes.", en: "AI analyzes every conversation in real time and detects risks: IRL requests, forbidden language, abnormal pricing.", es: "La IA analiza cada conversación en tiempo real y detecta riesgos: solicitudes IRL, lenguaje prohibido, precios anormales.", "pt-BR": "A IA analisa cada conversa em tempo real e detecta riscos: solicitações IRL, linguagem proibida, preços anormais.", de: "KI analysiert jede Konversation in Echtzeit und erkennt Risiken: IRL-Anfragen, verbotene Sprache, abnormale Preise.", it: "L'IA analizza ogni conversazione in tempo reale e rileva i rischi: richieste IRL, linguaggio proibito, prezzi anomali." },
  "safetyReason.autoComplianceHighlight": { fr: "98,5% des risques détectés avant envoi", en: "98.5% of risks detected before sending", es: "98,5% de los riesgos detectados antes del envío", "pt-BR": "98,5% dos riscos detectados antes do envio", de: "98,5% der Risiken vor dem Versand erkannt", it: "98,5% dei rischi rilevati prima dell'invio" },
  "safetyReason.programmableBarriers": { fr: "Barrières de sécurité programmables", en: "Programmable safety barriers", es: "Barreras de seguridad programables", "pt-BR": "Barreiras de segurança programáveis", de: "Programmierbare Sicherheitsbarrieren", it: "Barriere di sicurezza programmabili" },
  "safetyReason.programmableBarriersDesc": { fr: "Définis tes propres règles : mots interdits, limites de prix, fréquence maximale d'envoi. La plateforme bloque automatiquement.", en: "Define your own rules: forbidden words, price limits, maximum send frequency. The platform blocks automatically.", es: "Define tus propias reglas: palabras prohibidas, límites de precio, frecuencia máxima de envío. La plataforma bloquea automáticamente.", "pt-BR": "Defina suas próprias regras: palavras proibidas, limites de preço, frequência máxima de envio. A plataforma bloqueia automaticamente.", de: "Definiere deine eigenen Regeln: verbotene Wörter, Preisgrenzen, maximale Sendehäufigkeit. Die Plattform blockiert automatisch.", it: "Definisci le tue regole: parole vietate, limiti di prezzo, frequenza massima di invio. La piattaforma blocca automaticamente." },
  "safetyReason.programmableBarriersHighlight": { fr: "12 règles de sécurité actives", en: "12 active safety rules", es: "12 reglas de seguridad activas", "pt-BR": "12 regras de segurança ativas", de: "12 aktive Sicherheitsregeln", it: "12 regole di sicurezza attive" },
  "safetyReason.fullTraceability": { fr: "Traçabilité complète", en: "Full traceability", es: "Trazabilidad completa", "pt-BR": "Rastreabilidade completa", de: "Vollständige Nachverfolgbarkeit", it: "Tracciabilità completa" },
  "safetyReason.fullTraceabilityDesc": { fr: "Chaque action est horodatée et attribuée : qui a généré, qui a modifié, qui a validé, qui a envoyé. Audit trail complet.", en: "Every action is timestamped and attributed: who generated, who edited, who validated, who sent. Complete audit trail.", es: "Cada acción está fechada y atribuida: quién generó, quién editó, quién validó, quién envió. Auditoría completa.", "pt-BR": "Cada ação é carimbada e atribuída: quem gerou, quem editou, quem validou, quem enviou. Trilha de auditoria completa.", de: "Jede Aktion ist zeitgestempelt und zugeordnet: Wer hat generiert, wer bearbeitet, wer validiert, wer gesendet. Vollständiger Audit-Trail.", it: "Ogni azione è timestampata e attribuita: chi ha generato, chi ha modificato, chi ha convalidato, chi ha inviato. Audit trail completo." },
  "safetyReason.fullTraceabilityHighlight": { fr: "100% des actions tracées", en: "100% of actions tracked", es: "100% de las acciones rastreadas", "pt-BR": "100% das ações rastreadas", de: "100% der Aktionen nachverfolgt", it: "100% delle azioni tracciate" },
  "safetyReason.tosRespect": { fr: "Respect des CGU plateformes", en: "Platform TOS compliance", es: "Cumplimiento de los TOS de plataformas", "pt-BR": "Conformidade com os termos das plataformas", de: "Einhaltung der Plattform-AGB", it: "Rispetto dei TOS delle piattaforme" },
  "safetyReason.tosRespectDesc": { fr: "Base de connaissance des CGU OnlyFans, Fansly, MYM, Fanvue. L'IA vérifie chaque contenu avant publication.", en: "Knowledge base of OnlyFans, Fansly, MYM, Fanvue TOS. AI checks every content before publication.", es: "Base de conocimiento de los TOS de OnlyFans, Fansly, MYM, Fanvue. La IA verifica cada contenido antes de la publicación.", "pt-BR": "Base de conhecimento dos termos de OnlyFans, Fansly, MYM, Fanvue. A IA verifica cada conteúdo antes da publicação.", de: "Wissensdatenbank der AGB von OnlyFans, Fansly, MYM, Fanvue. KI prüft jeden Inhalt vor der Veröffentlichung.", it: "Base di conoscenza dei TOS di OnlyFans, Fansly, MYM, Fanvue. L'IA verifica ogni contenuto prima della pubblicazione." },
  "safetyReason.tosRespectHighlight": { fr: "0 infractions CGU depuis le lancement", en: "0 TOS violations since launch", es: "0 infracciones de TOS desde el lanzamiento", "pt-BR": "0 violações de termos desde o lançamento", de: "0 AGB-Verstöße seit dem Start", it: "0 violazioni TOS dal lancio" },
  "safetyReason.creatorProtection": { fr: "Protection des créatrices", en: "Creator protection", es: "Protección de creadoras", "pt-BR": "Proteção das criadoras", de: "Creator-Schutz", it: "Protezione dei creator" },
  "safetyReason.creatorProtectionDesc": { fr: "Détection proactive du harcèlement, des demandes abusives, et des comportements toxiques. Escalade automatique au manager.", en: "Proactive detection of harassment, abusive requests, and toxic behavior. Automatic escalation to manager.", es: "Detección proactiva de acoso, solicitudes abusivas y comportamientos tóxicos. Escalada automática al manager.", "pt-BR": "Detecção proativa de assédio, solicitações abusivas e comportamentos tóxicos. Escalação automática para o gerente.", de: "Proaktive Erkennung von Belästigung, missbräuchlichen Anfragen und toxischem Verhalten. Automatische Eskalation an den Manager.", it: "Rilevamento proattivo di molestie, richieste abusive e comportamenti tossici. Escalation automatica al manager." },
  "safetyReason.creatorProtectionHighlight": { fr: "45 incidents évités ce mois", en: "45 incidents prevented this month", es: "45 incidentes evitados este mes", "pt-BR": "45 incidentes evitados este mês", de: "45 Vorfälle diesen Monat verhindert", it: "45 incidenti evitati questo mese" },

  // ── Safety Guard ─────────────────────────────────────────
  "safetyGuard.heading": { fr: "Safety Guard", en: "Safety Guard", es: "Guardia de seguridad", "pt-BR": "Guarda de segurança", de: "Safety Guard", it: "Safety Guard" },
  "safetyGuard.subtitle": { fr: "Barrières de sécurité configurables pour protéger la créatrice", en: "Configurable safety barriers to protect the creator", es: "Barreras de seguridad configurables para proteger a la creadora", "pt-BR": "Barreiras de segurança configuráveis para proteger a criadora", de: "Konfigurierbare Sicherheitsbarrieren zum Schutz des Creators", it: "Barriere di sicurezza configurabili per proteggere la creator" },
  "safetyGuard.adminOnly": { fr: "Admin uniquement", en: "Admin only", es: "Solo admin", "pt-BR": "Apenas admin", de: "Nur Admin", it: "Solo admin" },

  // ── Guard Category Labels ────────────────────────────────
  "guardCat.content": { fr: "Contenu", en: "Content", es: "Contenido", "pt-BR": "Conteúdo", de: "Inhalt", it: "Contenuto" },
  "guardCat.pricing": { fr: "Tarification", en: "Pricing", es: "Precios", "pt-BR": "Precificação", de: "Preisgestaltung", it: "Prezzi" },
  "guardCat.frequency": { fr: "Fréquence", en: "Frequency", es: "Frecuencia", "pt-BR": "Frequência", de: "Häufigkeit", it: "Frequenza" },
  "guardCat.tos": { fr: "CGU", en: "TOS", es: "TOS", "pt-BR": "Termos", de: "AGB", it: "TOS" },
  "guardCat.boundary": { fr: "Limites", en: "Boundaries", es: "Límites", "pt-BR": "Limites", de: "Grenzen", it: "Limiti" },

  // ── Guard Settings ───────────────────────────────────────
  "guard.irlBlock": { fr: "Blocage demande IRL", en: "IRL request blocking", es: "Bloqueo de solicitud IRL", "pt-BR": "Bloqueio de solicitação IRL", de: "IRL-Anfrage-Blockierung", it: "Blocco richieste IRL" },
  "guard.irlBlockDesc": { fr: "Détecte et bloque les messages contenant des demandes de rencontre physique", en: "Detects and blocks messages containing physical meeting requests", es: "Detecta y bloquea mensajes con solicitudes de encuentro físico", "pt-BR": "Detecta e bloqueia mensagens com solicitações de encontro físico", de: "Erkennt und blockiert Nachrichten mit Anfragen für physische Treffen", it: "Rileva e blocca i messaggi con richieste di incontro fisico" },
  "guard.priceLimit": { fr: "Limite de prix PPV", en: "PPV price limit", es: "Límite de precio PPV", "pt-BR": "Limite de preço PPV", de: "PPV-Preislimit", it: "Limite prezzo PPV" },
  "guard.priceLimitDesc": { fr: "Alerte si un prix suggéré dépasse 500€ (custom) ou 200€ (standard)", en: "Alert if a suggested price exceeds €500 (custom) or €200 (standard)", es: "Alerta si un precio sugerido supera 500€ (custom) o 200€ (estándar)", "pt-BR": "Alerta se um preço sugerido exceder 500€ (custom) ou 200€ (padrão)", de: "Warnung wenn ein vorgeschlagener Preis 500€ (Custom) oder 200€ (Standard) überschreitet", it: "Avviso se un prezzo suggerito supera 500€ (custom) o 200€ (standard)" },
  "guard.abusiveFilter": { fr: "Filtre langage abusif", en: "Abusive language filter", es: "Filtro de lenguaje abusivo", "pt-BR": "Filtro de linguagem abusiva", de: "Filter für beleidigende Sprache", it: "Filtro linguaggio abusivo" },
  "guard.abusiveFilterDesc": { fr: "Détecte les insultes, menaces, et langage toxique dans les deux sens", en: "Detects insults, threats, and toxic language in both directions", es: "Detecta insultos, amenazas y lenguaje tóxico en ambos sentidos", "pt-BR": "Detecta insultos, ameaças e linguagem tóxica em ambas as direções", de: "Erkennt Beleidigungen, Drohungen und toxische Sprache in beide Richtungen", it: "Rileva insulti, minacce e linguaggio tossico in entrambe le direzioni" },
  "guard.sendLimit": { fr: "Limite fréquence envoi", en: "Send frequency limit", es: "Límite de frecuencia de envío", "pt-BR": "Limite de frequência de envio", de: "Sendehäufigkeitslimit", it: "Limite frequenza invio" },
  "guard.sendLimitDesc": { fr: "Max 3 messages par fan par jour pour éviter le spam", en: "Max 3 messages per fan per day to prevent spam", es: "Máx 3 mensajes por fan por día para evitar spam", "pt-BR": "Máx 3 mensagens por fã por dia para evitar spam", de: "Max 3 Nachrichten pro Fan pro Tag zur Spam-Vermeidung", it: "Max 3 messaggi per fan al giorno per evitare spam" },
  "guard.personalInfo": { fr: "Détection coordonnées perso", en: "Personal info detection", es: "Detección de datos personales", "pt-BR": "Detecção de dados pessoais", de: "Erkennung persönlicher Daten", it: "Rilevamento dati personali" },
  "guard.personalInfoDesc": { fr: "Bloque les messages contenant numéro de téléphone, adresse, email personnel", en: "Blocks messages containing phone number, address, personal email", es: "Bloquea mensajes con número de teléfono, dirección, email personal", "pt-BR": "Bloqueia mensagens com número de telefone, endereço, email pessoal", de: "Blockiert Nachrichten mit Telefonnummer, Adresse, persönlicher E-Mail", it: "Blocca i messaggi con numero di telefono, indirizzo, email personale" },
  "guard.ageVerification": { fr: "Vérification âge contenu", en: "Content age verification", es: "Verificación de edad del contenido", "pt-BR": "Verificação de idade do conteúdo", de: "Altersprüfung für Inhalte", it: "Verifica età contenuti" },
  "guard.ageVerificationDesc": { fr: "Vérifie que le contenu PPV est adapté et ne contient pas de matériel restreint", en: "Checks that PPV content is appropriate and does not contain restricted material", es: "Verifica que el contenido PPV sea apropiado y no contenga material restringido", "pt-BR": "Verifica se o conteúdo PPV é apropriado e não contém material restrito", de: "Prüft, ob PPV-Inhalte angemessen sind und kein eingeschränktes Material enthalten", it: "Verifica che il contenuto PPV sia appropriato e non contenga materiale soggetto a restrizioni" },
  "guard.abnormalPrice": { fr: "Alerte prix anormal", en: "Abnormal price alert", es: "Alerta de precio anormal", "pt-BR": "Alerta de preço anormal", de: "Warnung bei abnormalem Preis", it: "Avviso prezzo anomalo" },
  "guard.abnormalPriceDesc": { fr: "Alerte si un prix est 50% au-dessus ou en-dessous de la moyenne du marché", en: "Alert if a price is 50% above or below the market average", es: "Alerta si un precio está 50% por encima o por debajo del promedio del mercado", "pt-BR": "Alerta se um preço estiver 50% acima ou abaixo da média do mercado", de: "Warnung wenn ein Preis 50% über oder unter dem Marktdurchschnitt liegt", it: "Avviso se un prezzo è del 50% sopra o sotto la media di mercato" },
  "guard.spamDetection": { fr: "Détection spam", en: "Spam detection", es: "Detección de spam", "pt-BR": "Detecção de spam", de: "Spam-Erkennung", it: "Rilevamento spam" },
  "guard.spamDetectionDesc": { fr: "Détecte les messages répétitifs ou trop similaires envoyés à plusieurs fans", en: "Detects repetitive or overly similar messages sent to multiple fans", es: "Detecta mensajes repetitivos o demasiado similares enviados a varios fans", "pt-BR": "Detecta mensagens repetitivas ou muito similares enviadas a vários fãs", de: "Erkennt wiederholte oder zu ähnliche Nachrichten an mehrere Fans", it: "Rileva messaggi ripetitivi o troppo simili inviati a più fan" },
  "guard.copyrightMusic": { fr: "Vérification copyright musique", en: "Music copyright check", es: "Verificación de copyright musical", "pt-BR": "Verificação de copyright musical", de: "Musik-Urheberrechtsprüfung", it: "Verifica copyright musicale" },
  "guard.copyrightMusicDesc": { fr: "Analyse automatique des pistes audio dans les PPV vidéo", en: "Automatic analysis of audio tracks in PPV videos", es: "Análisis automático de pistas de audio en videos PPV", "pt-BR": "Análise automática de faixas de áudio em vídeos PPV", de: "Automatische Analyse von Audiospuren in PPV-Videos", it: "Analisi automatica delle tracce audio nei video PPV" },
  "guard.minorProtection": { fr: "Protection mineurs", en: "Minor protection", es: "Protección de menores", "pt-BR": "Proteção de menores", de: "Minderjährigenschutz", it: "Protezione minori" },
  "guard.minorProtectionDesc": { fr: "Vérification renforcée de l'âge des fans pour tout contenu sensible", en: "Enhanced fan age verification for all sensitive content", es: "Verificación reforzada de la edad de los fans para contenido sensible", "pt-BR": "Verificação reforçada da idade dos fãs para conteúdo sensível", de: "Verstärkte Altersprüfung der Fans für sensible Inhalte", it: "Verifica rafforzata dell'età dei fan per contenuti sensibili" },

  // ── AI Core Settings ─────────────────────────────────────
  "aiCore.heading": { fr: "AI Core Settings", en: "AI Core Settings", es: "Configuración del núcleo IA", "pt-BR": "Configurações do núcleo IA", de: "KI-Kerneinstellungen", it: "Impostazioni core IA" },
  "aiCore.subtitle": { fr: "Configure le niveau d'assistance IA pour les conversations", en: "Configure AI assistance level for conversations", es: "Configura el nivel de asistencia IA para conversaciones", "pt-BR": "Configure o nível de assistência IA para conversas", de: "Konfiguriere das KI-Assistenzniveau für Konversationen", it: "Configura il livello di assistenza IA per le conversazioni" },
  "aiCore.modeSelector": { fr: "Mode opératoire", en: "Operating mode", es: "Modo operativo", "pt-BR": "Modo operacional", de: "Betriebsmodus", it: "Modalità operativa" },
  "aiCore.configHeading": { fr: "Paramètres IA", en: "AI Settings", es: "Configuración IA", "pt-BR": "Configurações IA", de: "KI-Einstellungen", it: "Impostazioni IA" },
  "aiCore.autoGenerate": { fr: "Auto-génération sur nouveau message", en: "Auto-generate on new message", es: "Auto-generar en nuevo mensaje", "pt-BR": "Auto-gerar em nova mensagem", de: "Auto-Generierung bei neuer Nachricht", it: "Auto-generazione su nuovo messaggio" },
  "aiCore.autoGenerateDesc": { fr: "L'IA génère des brouillons dès qu'un nouveau message arrive", en: "AI generates drafts as soon as a new message arrives", es: "La IA genera borradores en cuanto llega un nuevo mensaje", "pt-BR": "A IA gera rascunhos assim que uma nova mensagem chega", de: "KI generiert Entwürfe, sobald eine neue Nachricht eingeht", it: "L'IA genera bozze non appena arriva un nuovo messaggio" },
  "aiCore.humanApprovalRequired": { fr: "Approbation humaine obligatoire", en: "Mandatory human approval", es: "Aprobación humana obligatoria", "pt-BR": "Aprovação humana obrigatória", de: "Menschliche Freigabe erforderlich", it: "Approvazione umana obbligatoria" },
  "aiCore.humanApprovalRequiredDesc": { fr: "Chaque brouillon IA doit être validé avant envoi", en: "Every AI draft must be approved before sending", es: "Cada borrador IA debe ser validado antes del envío", "pt-BR": "Cada rascunho IA deve ser aprovado antes do envio", de: "Jeder KI-Entwurf muss vor dem Versand freigegeben werden", it: "Ogni bozza IA deve essere approvata prima dell'invio" },
  "aiCore.simulationOnly": { fr: "Mode simulation uniquement", en: "Simulation mode only", es: "Modo solo simulación", "pt-BR": "Modo apenas simulação", de: "Nur Simulationsmodus", it: "Solo modalità simulazione" },
  "aiCore.simulationOnlyDesc": { fr: "L'IA génère mais rien n'est envoyable — preview pure", en: "AI generates but nothing is sendable — pure preview", es: "La IA genera pero nada es enviable — solo previsualización", "pt-BR": "A IA gera mas nada é enviável — apenas preview", de: "KI generiert, aber nichts ist versandfähig — reine Vorschau", it: "L'IA genera ma nulla è inviabile — solo anteprima" },
  "aiCore.modelTemperature": { fr: "Température du modèle", en: "Model temperature", es: "Temperatura del modelo", "pt-BR": "Temperatura do modelo", de: "Modell-Temperatur", it: "Temperatura del modello" },
  "aiCore.precise": { fr: "Précis (0)", en: "Precise (0)", es: "Preciso (0)", "pt-BR": "Preciso (0)", de: "Präzise (0)", it: "Preciso (0)" },
  "aiCore.creative": { fr: "Créatif (1.5)", en: "Creative (1.5)", es: "Creativo (1.5)", "pt-BR": "Criativo (1.5)", de: "Kreativ (1.5)", it: "Creativo (1.5)" },
  "aiCore.languages": { fr: "Langues :", en: "Languages:", es: "Idiomas:", "pt-BR": "Idiomas:", de: "Sprachen:", it: "Lingue:" },

  // ── AI Core Modes ────────────────────────────────────────
  "aiMode.manual_only": { fr: "Manual Only — Aucune IA, 100% humain", en: "Manual Only — No AI, 100% human", es: "Solo manual — Sin IA, 100% humano", "pt-BR": "Apenas manual — Sem IA, 100% humano", de: "Nur manuell — Keine KI, 100% Mensch", it: "Solo manuale — Nessuna IA, 100% umano" },
  "aiMode.ai_draft_assist": { fr: "AI Draft Assist — L'IA suggère, l'humain valide", en: "AI Draft Assist — AI suggests, human validates", es: "AI Draft Assist — La IA sugiere, el humano valida", "pt-BR": "AI Draft Assist — A IA sugere, o humano valida", de: "KI-Entwurfsassistenz — KI schlägt vor, Mensch validiert", it: "AI Draft Assist — L'IA suggerisce, l'umano convalida" },
  "aiMode.hybrid_qualification": { fr: "Hybrid Qualification — IA qualifie + draft, humain approuve", en: "Hybrid Qualification — AI qualifies + drafts, human approves", es: "Calificación híbrida — IA califica + borrador, humano aprueba", "pt-BR": "Qualificação híbrida — IA qualifica + rascunho, humano aprova", de: "Hybrid-Qualifikation — KI qualifiziert + entwirft, Mensch gibt frei", it: "Qualificazione ibrida — IA qualifica + bozze, umano approva" },
  "aiMode.full_ai_simulation": { fr: "Full AI Simulation — Preview only, aucun envoi", en: "Full AI Simulation — Preview only, no sending", es: "Simulación IA completa — Solo previsualización, sin envío", "pt-BR": "Simulação IA completa — Apenas preview, sem envio", de: "Volle KI-Simulation — Nur Vorschau, kein Versand", it: "Simulazione IA completa — Solo anteprima, nessun invio" },

  // ── Hybrid Handoff ───────────────────────────────────────
  "handoff.heading": { fr: "Hybrid Handoff Rules", en: "Hybrid Handoff Rules", es: "Reglas de traspaso híbrido", "pt-BR": "Regras de handoff híbrido", de: "Hybrid-Übergaberegeln", it: "Regole di passaggio ibrido" },
  "handoff.subtitle": { fr: "Définis quand les conversations doivent être gérées par un humain ou assistées par l'IA", en: "Define when conversations should be handled by a human or assisted by AI", es: "Define cuándo las conversaciones deben ser gestionadas por un humano o asistidas por IA", "pt-BR": "Defina quando as conversas devem ser gerenciadas por um humano ou assistidas pela IA", de: "Definiere, wann Gespräche von einem Menschen geführt oder von KI unterstützt werden sollen", it: "Definisci quando le conversazioni devono essere gestite da un umano o assistite dall'IA" },
  "handoff.logicExplanation": { fr: "AND = toutes les règles doivent matcher . OR = au moins une règle doit matcher", en: "AND = all rules must match . OR = at least one rule must match", es: "AND = todas las reglas deben coincidir . OR = al menos una regla debe coincidir", "pt-BR": "AND = todas as regras devem corresponder . OR = pelo menos uma regra deve corresponder", de: "AND = alle Regeln müssen zutreffen . OR = mindestens eine Regel muss zutreffen", it: "AND = tutte le regole devono corrispondere . OR = almeno una regola deve corrispondere" },

  // ── Handoff Rule Groups ──────────────────────────────────
  "handoffGroup.bigSpenders": { fr: "Gros dépensiers", en: "Big spenders", es: "Grandes gastadores", "pt-BR": "Grandes gastadores", de: "Großverdiener", it: "Grandi spenditori" },
  "handoffGroup.newFans": { fr: "Nouveaux fans", en: "New fans", es: "Nuevos fans", "pt-BR": "Novos fãs", de: "Neue Fans", it: "Nuovi fan" },
  "handoffGroup.atRiskFans": { fr: "Fans à risque", en: "At-risk fans", es: "Fans en riesgo", "pt-BR": "Fãs em risco", de: "Gefährdete Fans", it: "Fan a rischio" },
  "handoffGroup.complexCustom": { fr: "Demandes custom complexes", en: "Complex custom requests", es: "Solicitudes custom complejas", "pt-BR": "Solicitações custom complexas", de: "Komplexe Custom-Anfragen", it: "Richieste custom complesse" },

  // ── Handoff Actions ──────────────────────────────────────
  "handoffAction.human_only": { fr: "Humain uniquement", en: "Human only", es: "Solo humano", "pt-BR": "Apenas humano", de: "Nur Mensch", it: "Solo umano" },
  "handoffAction.ai_suggest": { fr: "IA suggère", en: "AI suggests", es: "IA sugiere", "pt-BR": "IA sugere", de: "KI schlägt vor", it: "IA suggerisce" },
  "handoffAction.ai_full": { fr: "IA gère (preview)", en: "AI manages (preview)", es: "IA gestiona (preview)", "pt-BR": "IA gerencia (preview)", de: "KI verwaltet (Vorschau)", it: "IA gestisce (anteprima)" },
  "handoffAction.flag_review": { fr: "Marquer révision", en: "Flag for review", es: "Marcar para revisión", "pt-BR": "Marcar para revisão", de: "Zur Prüfung markieren", it: "Segnala per revisione" },

  // ── Script Builder ───────────────────────────────────────
  "script.heading": { fr: "Script Builder / PPV Ladder", en: "Script Builder / PPV Ladder", es: "Creador de scripts / Escalera PPV", "pt-BR": "Construtor de scripts / Escada PPV", de: "Script Builder / PPV-Ladder", it: "Script Builder / PPV Ladder" },
  "script.subtitle": { fr: "Crée des entonnoirs PPV progressifs avec étapes et templates", en: "Create progressive PPV funnels with steps and templates", es: "Crea embudos PPV progresivos con etapas y plantillas", "pt-BR": "Crie funis PPV progressivos com etapas e templates", de: "Erstelle progressive PPV-Funnel mit Stufen und Vorlagen", it: "Crea funnel PPV progressivi con fasi e template" },
  "script.create": { fr: "Créer un script PPV", en: "Create a PPV script", es: "Crear un script PPV", "pt-BR": "Criar um script PPV", de: "PPV-Skript erstellen", it: "Crea uno script PPV" },
  "script.steps": { fr: "étapes", en: "steps", es: "etapas", "pt-BR": "etapas", de: "Schritte", it: "fasi" },
  "script.etapes": { fr: "Étapes", en: "Steps", es: "Etapas", "pt-BR": "Etapas", de: "Schritte", it: "Fasi" },
  "script.convRate": { fr: "Taux de conversion", en: "Conversion rate", es: "Tasa de conversión", "pt-BR": "Taxa de conversão", de: "Conversion-Rate", it: "Tasso di conversione" },
  "script.estimatedRevenue": { fr: "Revenu estimé", en: "Estimated revenue", es: "Ingreso estimado", "pt-BR": "Receita estimada", de: "Geschätzte Einnahmen", it: "Ricavo stimato" },
  "script.status": { fr: "Statut", en: "Status", es: "Estado", "pt-BR": "Status", de: "Status", it: "Stato" },
  "script.active": { fr: "Actif", en: "Active", es: "Activo", "pt-BR": "Ativo", de: "Aktiv", it: "Attivo" },
  "script.inactive": { fr: "Inactif", en: "Inactive", es: "Inactivo", "pt-BR": "Inativo", de: "Inaktiv", it: "Inattivo" },
  "script.required": { fr: "Requis", en: "Required", es: "Requerido", "pt-BR": "Obrigatório", de: "Erforderlich", it: "Richiesto" },
  "script.delayAfterPrevious": { fr: "Délai après précédent :", en: "Delay after previous:", es: "Retraso tras anterior:", "pt-BR": "Atraso após anterior:", de: "Verzögerung nach vorherigem:", it: "Ritardo dopo precedente:" },
  "script.move": { fr: "Déplacer", en: "Move", es: "Mover", "pt-BR": "Mover", de: "Verschieben", it: "Sposta" },
  "script.finalCta": { fr: "CTA final mock", en: "Final CTA mock", es: "CTA final mock", "pt-BR": "CTA final mock", de: "Finaler CTA-Mock", it: "CTA finale mock" },
  "script.finalCtaText": { fr: "Merci pour ton soutien ! Les offres exclusives expirent dans 24h", en: "Thanks for your support! Exclusive offers expire in 24h", es: "¡Gracias por tu apoyo! Las ofertas exclusivas expiran en 24h", "pt-BR": "Obrigado pelo seu apoio! As ofertas exclusivas expiram em 24h", de: "Danke für deine Unterstützung! Exklusive Angebote laufen in 24h ab", it: "Grazie per il tuo supporto! Le offerte esclusive scadono tra 24h" },
  "script.finalCtaSub": { fr: "Ce message sera envoyé 72h après l'étape précédente", en: "This message will be sent 72h after the previous step", es: "Este mensaje se enviará 72h después del paso anterior", "pt-BR": "Esta mensagem será enviada 72h após a etapa anterior", de: "Diese Nachricht wird 72h nach dem vorherigen Schritt gesendet", it: "Questo messaggio sarà inviato 72h dopo la fase precedente" },

  // ── Message Ledger ───────────────────────────────────────
  "ledger.heading": { fr: "Message Ledger", en: "Message Ledger", es: "Registro de mensajes", "pt-BR": "Registro de mensagens", de: "Nachrichten-Ledger", it: "Registro messaggi" },
  "ledger.subtitle": { fr: "Registre complet de tous les messages envoyés et reçus", en: "Complete registry of all sent and received messages", es: "Registro completo de todos los mensajes enviados y recibidos", "pt-BR": "Registro completo de todas as mensagens enviadas e recebidas", de: "Vollständiges Register aller gesendeten und empfangenen Nachrichten", it: "Registro completo di tutti i messaggi inviati e ricevuti" },
  "ledger.allStatuses": { fr: "Tous les statuts", en: "All statuses", es: "Todos los estados", "pt-BR": "Todos os status", de: "Alle Status", it: "Tutti gli stati" },
  "ledger.drafts": { fr: "Brouillons", en: "Drafts", es: "Borradores", "pt-BR": "Rascunhos", de: "Entwürfe", it: "Bozze" },
  "ledger.approved": { fr: "Approuvés", en: "Approved", es: "Aprobados", "pt-BR": "Aprovados", de: "Freigegeben", it: "Approvati" },
  "ledger.sent": { fr: "Envoyés", en: "Sent", es: "Enviados", "pt-BR": "Enviados", de: "Gesendet", it: "Inviati" },
  "ledger.flagged": { fr: "Signalés", en: "Flagged", es: "Marcados", "pt-BR": "Sinalizados", de: "Markiert", it: "Segnalati" },
  "ledger.fan": { fr: "Fan", en: "Fan", es: "Fan", "pt-BR": "Fã", de: "Fan", it: "Fan" },
  "ledger.message": { fr: "Message", en: "Message", es: "Mensaje", "pt-BR": "Mensagem", de: "Nachricht", it: "Messaggio" },
  "ledger.direction": { fr: "Direction", en: "Direction", es: "Dirección", "pt-BR": "Direção", de: "Richtung", it: "Direzione" },
  "ledger.creator": { fr: "Créateur", en: "Creator", es: "Creador", "pt-BR": "Criador", de: "Ersteller", it: "Creatore" },
  "ledger.statusCol": { fr: "Statut", en: "Status", es: "Estado", "pt-BR": "Status", de: "Status", it: "Stato" },
  "ledger.revenue": { fr: "Revenu", en: "Revenue", es: "Ingreso", "pt-BR": "Receita", de: "Einnahmen", it: "Ricavo" },
  "ledger.date": { fr: "Date", en: "Date", es: "Fecha", "pt-BR": "Data", de: "Datum", it: "Data" },
  "ledger.inbound": { fr: "Entrant", en: "Inbound", es: "Entrante", "pt-BR": "Entrada", de: "Eingehend", it: "In entrata" },
  "ledger.outbound": { fr: "Sortant", en: "Outbound", es: "Saliente", "pt-BR": "Saída", de: "Ausgehend", it: "In uscita" },
  "ledger.draft": { fr: "Brouillon", en: "Draft", es: "Borrador", "pt-BR": "Rascunho", de: "Entwurf", it: "Bozza" },
  "ledger.stats": { fr: "envoyés · brouillons · signalés", en: "sent · drafts · flagged", es: "enviados · borradores · marcados", "pt-BR": "enviados · rascunhos · sinalizados", de: "gesendet · Entwürfe · markiert", it: "inviati · bozze · segnalati" },

  // ── Banned Keywords ──────────────────────────────────────
  "banned.heading": { fr: "Banned Keywords & Safety Rules", en: "Banned Keywords & Safety Rules", es: "Palabras prohibidas y reglas de seguridad", "pt-BR": "Palavras banidas e regras de segurança", de: "Verbotene Keywords & Sicherheitsregeln", it: "Parole vietate e regole di sicurezza" },
  "banned.subtitle": { fr: "Mots-clés interdits appliqués aux brouillons IA, templates et messages manuels", en: "Forbidden keywords applied to AI drafts, templates, and manual messages", es: "Palabras clave prohibidas aplicadas a borradores IA, plantillas y mensajes manuales", "pt-BR": "Palavras-chave proibidas aplicadas a rascunhos IA, templates e mensagens manuais", de: "Verbotene Keywords für KI-Entwürfe, Vorlagen und manuelle Nachrichten", it: "Parole chiave vietate applicate a bozze IA, template e messaggi manuali" },
  "banned.addKeywordPlaceholder": { fr: "Ajouter un mot-clé personnalisé...", en: "Add a custom keyword...", es: "Añadir palabra clave personalizada...", "pt-BR": "Adicionar palavra-chave personalizada...", de: "Benutzerdefiniertes Keyword hinzufügen...", it: "Aggiungi parola chiave personalizzata..." },
  "banned.add": { fr: "Ajouter", en: "Add", es: "Añadir", "pt-BR": "Adicionar", de: "Hinzufügen", it: "Aggiungi" },
  "banned.keyword": { fr: "Mot-clé", en: "Keyword", es: "Palabra clave", "pt-BR": "Palavra-chave", de: "Keyword", it: "Parola chiave" },
  "banned.category": { fr: "Catégorie", en: "Category", es: "Categoría", "pt-BR": "Categoria", de: "Kategorie", it: "Categoria" },
  "banned.severity": { fr: "Sévérité", en: "Severity", es: "Severidad", "pt-BR": "Severidade", de: "Schweregrad", it: "Severità" },
  "banned.appliedTo": { fr: "Appliqué à", en: "Applied to", es: "Aplicado a", "pt-BR": "Aplicado a", de: "Angewendet auf", it: "Applicato a" },
  "banned.replacement": { fr: "Remplacement", en: "Replacement", es: "Reemplazo", "pt-BR": "Substituição", de: "Ersatz", it: "Sostituzione" },
  "banned.active": { fr: "Actif", en: "Active", es: "Activo", "pt-BR": "Ativo", de: "Aktiv", it: "Attivo" },
  "banned.inactive": { fr: "Inactif", en: "Inactive", es: "Inactivo", "pt-BR": "Inativo", de: "Inaktiv", it: "Inattivo" },
  "banned.blocked": { fr: "-- (bloqué)", en: "-- (blocked)", es: "-- (bloqueado)", "pt-BR": "-- (bloqueado)", de: "-- (blockiert)", it: "-- (bloccato)" },

  // ── Banned Categories ────────────────────────────────────
  "bannedCat.system": { fr: "Système", en: "System", es: "Sistema", "pt-BR": "Sistema", de: "System", it: "Sistema" },
  "bannedCat.custom": { fr: "Personnalisé", en: "Custom", es: "Personalizado", "pt-BR": "Personalizado", de: "Benutzerdefiniert", it: "Personalizzato" },

  // ── Banned Applies To ────────────────────────────────────
  "bannedApplies.drafts": { fr: "Brouillons IA", en: "AI drafts", es: "Borradores IA", "pt-BR": "Rascunhos IA", de: "KI-Entwürfe", it: "Bozze IA" },
  "bannedApplies.templates": { fr: "Templates", en: "Templates", es: "Plantillas", "pt-BR": "Templates", de: "Vorlagen", it: "Template" },
  "bannedApplies.manual": { fr: "Messages manuels", en: "Manual messages", es: "Mensajes manuales", "pt-BR": "Mensagens manuais", de: "Manuelle Nachrichten", it: "Messaggi manuali" },

  // ── Creator Profile ──────────────────────────────────────
  "creatorProfile.heading": { fr: "Creator Intelligence Profile", en: "Creator Intelligence Profile", es: "Perfil de inteligencia de la creadora", "pt-BR": "Perfil de inteligência da criadora", de: "Creator Intelligence Profile", it: "Profilo intelligence creator" },
  "creatorProfile.subtitle": { fr: "Profil IA de la créatrice — persona, limites, règles et préférences", en: "Creator AI profile — persona, boundaries, rules, and preferences", es: "Perfil IA de la creadora — persona, límites, reglas y preferencias", "pt-BR": "Perfil IA da criadora — persona, limites, regras e preferências", de: "Creator-KI-Profil — Persona, Grenzen, Regeln und Präferenzen", it: "Profilo IA della creator — persona, limiti, regole e preferenze" },
  "creatorProfile.persona": { fr: "Persona", en: "Persona", es: "Persona", "pt-BR": "Persona", de: "Persona", it: "Persona" },
  "creatorProfile.timezone": { fr: "Timezone", en: "Timezone", es: "Zona horaria", "pt-BR": "Fuso horário", de: "Zeitzone", it: "Fuso orario" },
  "creatorProfile.activeHours": { fr: "Horaires actifs", en: "Active hours", es: "Horarios activos", "pt-BR": "Horários ativos", de: "Aktive Zeiten", it: "Orari attivi" },
  "creatorProfile.tone": { fr: "Ton", en: "Tone", es: "Tono", "pt-BR": "Tom", de: "Ton", it: "Tono" },
  "creatorProfile.languages": { fr: "Langues", en: "Languages", es: "Idiomas", "pt-BR": "Idiomas", de: "Sprachen", it: "Lingue" },
  "creatorProfile.activePlatforms": { fr: "Plateformes actives", en: "Active platforms", es: "Plataformas activas", "pt-BR": "Plataformas ativas", de: "Aktive Plattformen", it: "Piattaforme attive" },
  "creatorProfile.bio": { fr: "Bio", en: "Bio", es: "Bio", "pt-BR": "Bio", de: "Bio", it: "Bio" },
  "creatorProfile.strictBoundaries": { fr: "Limites strictes", en: "Strict boundaries", es: "Límites estrictos", "pt-BR": "Limites estritos", de: "Strenge Grenzen", it: "Limiti rigorosi" },
  "creatorProfile.toDo": { fr: "À faire", en: "To do", es: "Por hacer", "pt-BR": "A fazer", de: "Zu tun", it: "Da fare" },
  "creatorProfile.notToDo": { fr: "À ne pas faire", en: "Not to do", es: "A no hacer", "pt-BR": "A não fazer", de: "Nicht zu tun", it: "Da non fare" },

  // ── Creator Tone Labels ──────────────────────────────────
  "tone.chaleureux": { fr: "Chaleureux", en: "Warm", es: "Cálido", "pt-BR": "Caloroso", de: "Herzlich", it: "Caloroso" },
  "tone.professionnel": { fr: "Professionnel", en: "Professional", es: "Profesional", "pt-BR": "Profissional", de: "Professionell", it: "Professionale" },
  "tone.joueuse": { fr: "Joueuse", en: "Playful", es: "Juguetón", "pt-BR": "Divertido", de: "Verspielt", it: "Giocoso" },
  "tone.intime": { fr: "Intime", en: "Intimate", es: "Íntimo", "pt-BR": "Íntimo", de: "Intim", it: "Intimo" },
  "tone.minimal": { fr: "Minimal", en: "Minimal", es: "Minimal", "pt-BR": "Minimal", de: "Minimal", it: "Minimale" },

  // ── Notifications Center ─────────────────────────────────
  "notifications.heading": { fr: "Notifications Center", en: "Notifications Center", es: "Centro de notificaciones", "pt-BR": "Centro de notificações", de: "Benachrichtigungscenter", it: "Centro notifiche" },
  "notifications.unread": { fr: "non lues sur", en: "unread out of", es: "no leídas de", "pt-BR": "não lidas de", de: "ungelesen von", it: "non lette su" },
  "notifications.notifications": { fr: "notifications", en: "notifications", es: "notificaciones", "pt-BR": "notificações", de: "Benachrichtigungen", it: "notifiche" },
  "notifications.allTypes": { fr: "Tous les types", en: "All types", es: "Todos los tipos", "pt-BR": "Todos os tipos", de: "Alle Typen", it: "Tutti i tipi" },
  "notifications.markAllRead": { fr: "Marquer tout comme lu", en: "Mark all as read", es: "Marcar todo como leído", "pt-BR": "Marcar tudo como lido", de: "Alle als gelesen markieren", it: "Segna tutto come letto" },
  "notifications.high": { fr: "Haute", en: "High", es: "Alta", "pt-BR": "Alta", de: "Hoch", it: "Alta" },
  "notifications.medium": { fr: "Moy.", en: "Med.", es: "Med.", "pt-BR": "Méd.", de: "Mittel", it: "Med." },
  "notifications.low": { fr: "Basse", en: "Low", es: "Baja", "pt-BR": "Baixa", de: "Niedrig", it: "Bassa" },

  // ── Notification Types ───────────────────────────────────
  "notifType.purchase": { fr: "Achat", en: "Purchase", es: "Compra", "pt-BR": "Compra", de: "Kauf", it: "Acquisto" },
  "notifType.new_message": { fr: "Nouveau message", en: "New message", es: "Nuevo mensaje", "pt-BR": "Nova mensagem", de: "Neue Nachricht", it: "Nuovo messaggio" },
  "notifType.handover": { fr: "Transfert", en: "Transfer", es: "Transferencia", "pt-BR": "Transferência", de: "Überweisung", it: "Bonifico" },
  "notifType.new_subscriber": { fr: "Nouvel abonné", en: "New subscriber", es: "Nuevo suscriptor", "pt-BR": "Novo assinante", de: "Neuer Abonnent", it: "Nuovo iscritto" },
  "notifType.draft_ready": { fr: "Brouillon IA prêt", en: "AI draft ready", es: "Borrador IA listo", "pt-BR": "Rascunho IA pronto", de: "KI-Entwurf bereit", it: "Bozza IA pronta" },
  "notifType.compliance_flag": { fr: "Alerte conformité", en: "Compliance alert", es: "Alerta de cumplimiento", "pt-BR": "Alerta de conformidade", de: "Compliance-Warnung", it: "Avviso conformità" },
  "notifType.revenue_milestone": { fr: "Palier de revenu", en: "Revenue milestone", es: "Hito de ingresos", "pt-BR": "Marco de receita", de: "Umsatz-Meilenstein", it: "Traguardo di ricavi" },

  // ── Notification Channels ────────────────────────────────
  "notifChannel.in_app": { fr: "In-app", en: "In-app", es: "En la app", "pt-BR": "No app", de: "In-App", it: "In-app" },
  "notifChannel.email": { fr: "Email", en: "Email", es: "Email", "pt-BR": "Email", de: "E-Mail", it: "Email" },
  "notifChannel.push": { fr: "Push", en: "Push", es: "Push", "pt-BR": "Push", de: "Push", it: "Push" },
  "notifChannel.slack": { fr: "Slack", en: "Slack", es: "Slack", "pt-BR": "Slack", de: "Slack", it: "Slack" },

  // ── Creative Engine ──────────────────────────────────────
  "creative.heading": { fr: "Creative Engine / AI Reels", en: "Creative Engine / AI Reels", es: "Motor creativo / AI Reels", "pt-BR": "Creative Engine / AI Reels", de: "Creative Engine / KI-Reels", it: "Creative Engine / AI Reels" },
  "creative.subtitle": { fr: "Scripts Reels/TikTok générés par IA — preview seulement, approbation humaine obligatoire", en: "AI-generated Reels/TikTok scripts — preview only, human approval required", es: "Scripts Reels/TikTok generados por IA — solo previsualización, aprobación humana obligatoria", "pt-BR": "Scripts Reels/TikTok gerados por IA — apenas preview, aprovação humana obrigatória", de: "KI-generierte Reels/TikTok-Skripte — nur Vorschau, menschliche Freigabe erforderlich", it: "Script Reels/TikTok generati dall'IA — solo anteprima, approvazione umana obbligatoria" },
  "creative.warningBanner": { fr: "IA propose → Humain valide → Créatrice publie. Aucune publication automatique.", en: "AI proposes → Human validates → Creator publishes. No automatic publishing.", es: "IA propone → Humano valida → Creadora publica. Sin publicación automática.", "pt-BR": "IA propõe → Humano valida → Criadora publica. Nenhuma publicação automática.", de: "KI schlägt vor → Mensch validiert → Creator veröffentlicht. Keine automatische Veröffentlichung.", it: "IA propone → Umano convalida → Creator pubblica. Nessuna pubblicazione automatica." },
  "creative.platform": { fr: "Plateforme", en: "Platform", es: "Plataforma", "pt-BR": "Plataforma", de: "Plattform", it: "Piattaforma" },
  "creative.duration": { fr: "Durée", en: "Duration", es: "Duración", "pt-BR": "Duração", de: "Dauer", it: "Durata" },
  "creative.viralScore": { fr: "Score viral", en: "Viral score", es: "Puntuación viral", "pt-BR": "Pontuação viral", de: "Viralitätsscore", it: "Punteggio virale" },
  "creative.hook": { fr: "ACCROCHE", en: "HOOK", es: "GANCHO", "pt-BR": "GANCHO", de: "HOOK", it: "HOOK" },
  "creative.body": { fr: "CORPS", en: "BODY", es: "CUERPO", "pt-BR": "CORPO", de: "HAUPTTEIL", it: "CORPO" },
  "creative.cta": { fr: "CTA", en: "CTA", es: "CTA", "pt-BR": "CTA", de: "CTA", it: "CTA" },
  "creative.trend": { fr: "Tendance :", en: "Trend:", es: "Tendencia:", "pt-BR": "Tendência:", de: "Trend:", it: "Trend:" },
  "creative.reviewedBy": { fr: "Relu par", en: "Reviewed by", es: "Revisado por", "pt-BR": "Revisado por", de: "Geprüft von", it: "Rivisto da" },
  "creative.reviewed": { fr: "Révisé", en: "Reviewed", es: "Revisado", "pt-BR": "Revisado", de: "Überprüft", it: "Rivisto" },
  "creative.published": { fr: "Publié", en: "Published", es: "Publicado", "pt-BR": "Publicado", de: "Veröffentlicht", it: "Pubblicato" },
  "creative.approveScript": { fr: "Approuver le script", en: "Approve script", es: "Aprobar script", "pt-BR": "Aprovar script", de: "Skript freigeben", it: "Approva script" },
  "creative.edit": { fr: "Modifier", en: "Edit", es: "Editar", "pt-BR": "Editar", de: "Bearbeiten", it: "Modifica" },
  "creative.ignore": { fr: "Ignorer", en: "Ignore", es: "Ignorar", "pt-BR": "Ignorar", de: "Ignorieren", it: "Ignora" },
  "creative.viral": { fr: "Viral :", en: "Viral:", es: "Viral:", "pt-BR": "Viral:", de: "Viral:", it: "Virale:" },
  "creative.consentReminder": { fr: "Toute publication nécessite l'approbation explicite de la créatrice. L'IA ne publie jamais automatiquement.", en: "All publishing requires explicit creator approval. AI never publishes automatically.", es: "Toda publicación requiere la aprobación explícita de la creadora. La IA nunca publica automáticamente.", "pt-BR": "Toda publicação requer aprovação explícita da criadora. A IA nunca publica automaticamente.", de: "Jede Veröffentlichung erfordert die ausdrückliche Zustimmung des Creators. KI veröffentlicht niemals automatisch.", it: "Ogni pubblicazione richiede l'approvazione esplicita della creator. L'IA non pubblica mai automaticamente." },

  // ── Reel Status Labels ───────────────────────────────────
  "reelStatus.draft": { fr: "Brouillon", en: "Draft", es: "Borrador", "pt-BR": "Rascunho", de: "Entwurf", it: "Bozza" },
  "reelStatus.reviewed": { fr: "Révisé", en: "Reviewed", es: "Revisado", "pt-BR": "Revisado", de: "Geprüft", it: "Rivisto" },
  "reelStatus.approved": { fr: "Approuvé", en: "Approved", es: "Aprobado", "pt-BR": "Aprovado", de: "Freigegeben", it: "Approvato" },
  "reelStatus.published": { fr: "Publié", en: "Published", es: "Publicado", "pt-BR": "Publicado", de: "Veröffentlicht", it: "Pubblicato" },

  // ── Reel Platform Labels ─────────────────────────────────
  "reelPlatform.IG": { fr: "Instagram Reels", en: "Instagram Reels", es: "Instagram Reels", "pt-BR": "Instagram Reels", de: "Instagram Reels", it: "Instagram Reels" },
  "reelPlatform.TT": { fr: "TikTok", en: "TikTok", es: "TikTok", "pt-BR": "TikTok", de: "TikTok", it: "TikTok" },
  "reelPlatform.YT_Shorts": { fr: "YouTube Shorts", en: "YouTube Shorts", es: "YouTube Shorts", "pt-BR": "YouTube Shorts", de: "YouTube Shorts", it: "YouTube Shorts" },

  // ── Roadmap ──────────────────────────────────────────────
  "roadmap.heading": { fr: "Roadmap & Feature Requests", en: "Roadmap & Feature Requests", es: "Roadmap y solicitudes de funciones", "pt-BR": "Roadmap e solicitações de recursos", de: "Roadmap & Feature Requests", it: "Roadmap e richieste funzionalità" },
  "roadmap.subtitle": { fr: "Suggestions et demandes de fonctionnalités par la communauté d'agences", en: "Suggestions and feature requests from the agency community", es: "Sugerencias y solicitudes de funciones de la comunidad de agencias", "pt-BR": "Sugestões e solicitações de recursos da comunidade de agências", de: "Vorschläge und Funktionswünsche der Agentur-Community", it: "Suggerimenti e richieste di funzionalità dalla community di agenzie" },
  "roadmap.allCategories": { fr: "Toutes les catégories", en: "All categories", es: "Todas las categorías", "pt-BR": "Todas as categorias", de: "Alle Kategorien", it: "Tutte le categorie" },
  "roadmap.topAgencyRequests": { fr: "Top demandes agences", en: "Top agency requests", es: "Principales solicitudes de agencias", "pt-BR": "Principais solicitações de agências", de: "Top-Agentur-Anfragen", it: "Richieste top agenzie" },
  "roadmap.agencyRequest": { fr: "Demande agence", en: "Agency request", es: "Solicitud de agencia", "pt-BR": "Solicitação de agência", de: "Agentur-Anfrage", it: "Richiesta agenzia" },
  "roadmap.submitIdea": { fr: "Soumettre une idée", en: "Submit an idea", es: "Enviar una idea", "pt-BR": "Enviar uma ideia", de: "Idee einreichen", it: "Invia un'idea" },

  // ── Feature Status Labels ────────────────────────────────
  "featureStatus.planned": { fr: "Planifié", en: "Planned", es: "Planificado", "pt-BR": "Planejado", de: "Geplant", it: "Pianificato" },
  "featureStatus.in_progress": { fr: "En cours", en: "In progress", es: "En curso", "pt-BR": "Em andamento", de: "In Bearbeitung", it: "In corso" },
  "featureStatus.shipped": { fr: "Livré", en: "Delivered", es: "Entregado", "pt-BR": "Entregue", de: "Ausgeliefert", it: "Consegnato" },
  "featureStatus.under_review": { fr: "En revue", en: "In review", es: "En revisión", "pt-BR": "Em revisão", de: "In Prüfung", it: "In revisione" },

  // ── Feature Category Labels ──────────────────────────────
  "featureCat.ai": { fr: "IA", en: "AI", es: "IA", "pt-BR": "IA", de: "KI", it: "IA" },
  "featureCat.automation": { fr: "Automation", en: "Automation", es: "Automatización", "pt-BR": "Automação", de: "Automatisierung", it: "Automazione" },
  "featureCat.compliance": { fr: "Conformité", en: "Compliance", es: "Cumplimiento", "pt-BR": "Conformidade", de: "Compliance", it: "Conformità" },
  "featureCat.revenue": { fr: "Revenu", en: "Revenue", es: "Ingresos", "pt-BR": "Receita", de: "Einnahmen", it: "Ricavi" },
  "featureCat.team": { fr: "Équipe", en: "Team", es: "Equipo", "pt-BR": "Equipe", de: "Team", it: "Team" },
  "featureCat.platforms": { fr: "Plateformes", en: "Platforms", es: "Plataformas", "pt-BR": "Plataformas", de: "Plattformen", it: "Piattaforme" },
  "featureCat.creative": { fr: "Création", en: "Creation", es: "Creación", "pt-BR": "Criação", de: "Kreation", it: "Creazione" },

  // ── Section Descriptions ─────────────────────────────────
  "sectionDesc.salesEngine": { fr: "L'IA génère des brouillons de réponses pour chaque fan. Tu relis, modifies si besoin, puis valides l'envoi. Aucun message ne part sans ton approbation explicite.", en: "AI generates response drafts for each fan. You review, edit if needed, then approve sending. No message goes out without your explicit approval.", es: "La IA genera borradores de respuestas para cada fan. Revisas, modificas si es necesario y luego validas el envío. Ningún mensaje sale sin tu aprobación explícita.", "pt-BR": "A IA gera rascunhos de respostas para cada fã. Você revisa, edita se necessário e aprova o envio. Nenhuma mensagem sai sem sua aprovação explícita.", de: "KI generiert Antwortentwürfe für jeden Fan. Du prüfst, bearbeitest bei Bedarf und gibst den Versand frei. Keine Nachricht geht ohne deine ausdrückliche Zustimmung raus.", it: "L'IA genera bozze di risposta per ogni fan. Rivedi, modifichi se necessario, poi approvi l'invio. Nessun messaggio parte senza la tua approvazione esplicita." },
  "sectionDesc.campaignBuilder": { fr: "Crée des campagnes marketing multi-étapes avec templates et planification. Visualise le flow avant lancement.", en: "Create multi-step marketing campaigns with templates and scheduling. Visualize the flow before launch.", es: "Crea campañas de marketing multi-etapa con plantillas y planificación. Visualiza el flujo antes del lanzamiento.", "pt-BR": "Crie campanhas de marketing multi-etapas com templates e planejamento. Visualize o fluxo antes do lançamento.", de: "Erstelle mehrstufige Marketing-Kampagnen mit Vorlagen und Planung. Visualisiere den Ablauf vor dem Start.", it: "Crea campagne marketing multi-step con template e pianificazione. Visualizza il flusso prima del lancio." },
  "sectionDesc.opportunityQueue": { fr: "L'IA identifie les opportunités de vente (upsell, cross-sell, réengagement) et les priorise par potentiel de revenu.", en: "AI identifies sales opportunities (upsell, cross-sell, re-engagement) and prioritizes them by revenue potential.", es: "La IA identifica oportunidades de venta (upsell, cross-sell, reactivación) y las prioriza por potencial de ingresos.", "pt-BR": "A IA identifica oportunidades de venda (upsell, cross-sell, reengajamento) e as prioriza por potencial de receita.", de: "KI identifiziert Verkaufschancen (Upsell, Cross-Sell, Reaktivierung) und priorisiert sie nach Umsatzpotenzial.", it: "L'IA identifica le opportunità di vendita (upsell, cross-sell, re-engagement) e le priorizza per potenziale di ricavo." },
  "sectionDesc.pricingLab": { fr: "Teste différents scénarios de prix pour maximiser le revenu sans perdre de fans. Simulation de pricing PPV avec taux de conversion.", en: "Test different pricing scenarios to maximize revenue without losing fans. PPV pricing simulation with conversion rates.", es: "Prueba diferentes escenarios de precios para maximizar ingresos sin perder fans. Simulación de precios PPV con tasas de conversión.", "pt-BR": "Teste diferentes cenários de preços para maximizar a receita sem perder fãs. Simulação de precificação PPV com taxas de conversão.", de: "Teste verschiedene Preisszenarien zur Maximierung des Umsatzes ohne Fans zu verlieren. PPV-Preissimulation mit Conversion-Raten.", it: "Testa diversi scenari di prezzo per massimizzare i ricavi senza perdere fan. Simulazione di prezzi PPV con tassi di conversione." },
  "sectionDesc.trackingLinks": { fr: "Génère des liens traqués pour mesurer la performance de chaque canal d'acquisition.", en: "Generate tracked links to measure the performance of each acquisition channel.", es: "Genera enlaces rastreados para medir el rendimiento de cada canal de adquisición.", "pt-BR": "Gere links rastreados para medir o desempenho de cada canal de aquisição.", de: "Generiert getrackte Links zur Messung der Performance jedes Akquisitionskanals.", it: "Genera link tracciati per misurare le performance di ogni canale di acquisizione." },
  "sectionDesc.listsBuilder": { fr: "Crée des segments dynamiques de fans basés sur plus de 30 critères comportementaux et transactionnels.", en: "Create dynamic fan segments based on 30+ behavioral and transactional criteria.", es: "Crea segmentos dinámicos de fans basados en más de 30 criterios comportamentales y transaccionales.", "pt-BR": "Crie segmentos dinâmicos de fãs baseados em mais de 30 critérios comportamentais e transacionais.", de: "Erstelle dynamische Fan-Segmente basierend auf über 30 Verhaltens- und Transaktionskriterien.", it: "Crea segmenti dinamici di fan basati su oltre 30 criteri comportamentali e transazionali." },
  "sectionDesc.fanJourney": { fr: "Visualise le parcours de tes fans, de la découverte à l'ambassadeur, avec les taux de conversion par étape.", en: "Visualize your fans' journey, from discovery to ambassador, with conversion rates per stage.", es: "Visualiza el viaje de tus fans, desde el descubrimiento hasta el embajador, con tasas de conversión por etapa.", "pt-BR": "Visualize a jornada dos seus fãs, da descoberta ao embaixador, com taxas de conversão por etapa.", de: "Visualisiere die Reise deiner Fans, von der Entdeckung bis zum Botschafter, mit Conversion-Raten pro Stufe.", it: "Visualizza il percorso dei tuoi fan, dalla scoperta all'ambasciatore, con tassi di conversione per fase." },
  "sectionDesc.automationTriggers": { fr: "Configure des actions automatiques basées sur des événements (anniversaire, silence, achat...).", en: "Configure automatic actions based on events (birthday, silence, purchase...).", es: "Configura acciones automáticas basadas en eventos (cumpleaños, silencio, compra...).", "pt-BR": "Configure ações automáticas baseadas em eventos (aniversário, silêncio, compra...).", de: "Konfiguriere automatische Aktionen basierend auf Ereignissen (Geburtstag, Stille, Kauf...).", it: "Configura azioni automatiche basate su eventi (compleanno, silenzio, acquisto...)." },
  "sectionDesc.browserMock": { fr: "Simule l'apparence de tes messages sur les plateformes avant envoi. Aucune connexion réelle.", en: "Simulate the appearance of your messages on platforms before sending. No real connection.", es: "Simula la apariencia de tus mensajes en las plataformas antes del envío. Sin conexión real.", "pt-BR": "Simula a aparência das suas mensagens nas plataformas antes do envio. Nenhuma conexão real.", de: "Simuliert das Erscheinungsbild deiner Nachrichten auf Plattformen vor dem Versand. Keine echte Verbindung.", it: "Simula l'aspetto dei tuoi messaggi sulle piattaforme prima dell'invio. Nessuna connessione reale." },
  "sectionDesc.teamControl": { fr: "Supervise l'activité de ton équipe, les performances, et le Golden Ratio de chaque membre.", en: "Monitor your team's activity, performance, and each member's Golden Ratio.", es: "Supervisa la actividad de tu equipo, el rendimiento y el Golden Ratio de cada miembro.", "pt-BR": "Monitore a atividade da sua equipe, o desempenho e o Golden Ratio de cada membro.", de: "Überwache die Aktivität deines Teams, die Leistung und das Golden Ratio jedes Mitglieds.", it: "Monitora l'attività del tuo team, le performance e il Golden Ratio di ogni membro." },
  "sectionDesc.complianceReview": { fr: "Les contenus à risque sont automatiquement détectés et placés en file d'attente pour révision humaine.", en: "At-risk content is automatically detected and queued for human review.", es: "El contenido de riesgo se detecta automáticamente y se pone en cola para revisión humana.", "pt-BR": "Conteúdo de risco é automaticamente detectado e colocado na fila para revisão humana.", de: "Risikoinhalte werden automatisch erkannt und zur menschlichen Prüfung in die Warteschlange gestellt.", it: "I contenuti a rischio vengono automaticamente rilevati e messi in coda per la revisione umana." },
  "sectionDesc.whyAtlasSafer": { fr: "Découvre pourquoi le modèle Atlas (IA propose, humain valide, humain envoie) est le plus sûr du marché.", en: "Discover why the Atlas model (AI proposes, human validates, human sends) is the safest on the market.", es: "Descubre por qué el modelo Atlas (IA propone, humano valida, humano envía) es el más seguro del mercado.", "pt-BR": "Descubra por que o modelo Atlas (IA propõe, humano valida, humano envia) é o mais seguro do mercado.", de: "Entdecke, warum das Atlas-Modell (KI schlägt vor, Mensch validiert, Mensch sendet) das sicherste am Markt ist.", it: "Scopri perché il modello Atlas (IA propone, umano convalida, umano invia) è il più sicuro sul mercato." },
  "sectionDesc.safetyGuard": { fr: "Configure les barrières de sécurité qui bloquent automatiquement les contenus interdits et protègent tes comptes.", en: "Configure safety barriers that automatically block prohibited content and protect your accounts.", es: "Configura las barreras de seguridad que bloquean automáticamente el contenido prohibido y protegen tus cuentas.", "pt-BR": "Configure as barreiras de segurança que bloqueiam automaticamente o conteúdo proibido e protegem suas contas.", de: "Konfiguriere Sicherheitsbarrieren, die verbotene Inhalte automatisch blockieren und deine Konten schützen.", it: "Configura le barriere di sicurezza che bloccano automaticamente i contenuti proibiti e proteggono i tuoi account." },
  "sectionDesc.aiCoreSettings": { fr: "Choisis le niveau d'assistance IA : manuel, brouillons, hybride ou simulation complète. L'envoi reste toujours humain.", en: "Choose the AI assistance level: manual, drafts, hybrid, or full simulation. Sending always remains human.", es: "Elige el nivel de asistencia IA: manual, borradores, híbrido o simulación completa. El envío siempre es humano.", "pt-BR": "Escolha o nível de assistência IA: manual, rascunhos, híbrido ou simulação completa. O envio sempre permanece humano.", de: "Wähle das KI-Assistenzniveau: manuell, Entwürfe, hybrid oder vollständige Simulation. Der Versand bleibt immer menschlich.", it: "Scegli il livello di assistenza IA: manuale, bozze, ibrido o simulazione completa. L'invio rimane sempre umano." },
  "sectionDesc.hybridHandoff": { fr: "Définis les règles qui déterminent quand une conversation passe de l'IA à un humain (seuils, segments, conditions).", en: "Define the rules that determine when a conversation switches from AI to a human (thresholds, segments, conditions).", es: "Define las reglas que determinan cuándo una conversación pasa de la IA a un humano (umbrales, segmentos, condiciones).", "pt-BR": "Defina as regras que determinam quando uma conversa passa da IA para um humano (limiares, segmentos, condições).", de: "Definiere die Regeln, die bestimmen, wann ein Gespräch von KI auf Mensch wechselt (Schwellen, Segmente, Bedingungen).", it: "Definisci le regole che determinano quando una conversazione passa dall'IA a un umano (soglie, segmenti, condizioni)." },
  "sectionDesc.scriptBuilder": { fr: "Crée des entonnoirs PPV progressifs avec étapes, prix et délais. Templates réutilisables par ton équipe.", en: "Create progressive PPV funnels with steps, prices, and delays. Reusable templates for your team.", es: "Crea embudos PPV progresivos con etapas, precios y plazos. Plantillas reutilizables para tu equipo.", "pt-BR": "Crie funis PPV progressivos com etapas, preços e prazos. Templates reutilizáveis para sua equipe.", de: "Erstelle progressive PPV-Funnel mit Stufen, Preisen und Verzögerungen. Wiederverwendbare Vorlagen für dein Team.", it: "Crea funnel PPV progressivi con fasi, prezzi e ritardi. Template riutilizzabili per il tuo team." },
  "sectionDesc.messageLedger": { fr: "Registre complet de tous les messages envoyés et reçus, avec statuts et revenus associés.", en: "Complete registry of all sent and received messages, with associated statuses and revenue.", es: "Registro completo de todos los mensajes enviados y recibidos, con estados e ingresos asociados.", "pt-BR": "Registro completo de todas as mensagens enviadas e recebidas, com status e receitas associados.", de: "Vollständiges Register aller gesendeten und empfangenen Nachrichten mit zugehörigen Status und Einnahmen.", it: "Registro completo di tutti i messaggi inviati e ricevuti, con stati e ricavi associati." },
  "sectionDesc.bannedKeywords": { fr: "Liste des mots et expressions interdits dans les brouillons IA et messages manuels. Appliqué à tous les canaux.", en: "List of forbidden words and expressions in AI drafts and manual messages. Applied to all channels.", es: "Lista de palabras y expresiones prohibidas en borradores IA y mensajes manuales. Aplicado a todos los canales.", "pt-BR": "Lista de palavras e expressões proibidas em rascunhos IA e mensagens manuais. Aplicado a todos os canais.", de: "Liste verbotener Wörter und Ausdrücke in KI-Entwürfen und manuellen Nachrichten. Auf alle Kanäle angewendet.", it: "Elenco di parole ed espressioni vietate nelle bozze IA e nei messaggi manuali. Applicato a tutti i canali." },
  "sectionDesc.creatorProfile": { fr: "Profil IA de la créatrice : persona, ton, limites strictes, règles éditoriales et préférences.", en: "Creator AI profile: persona, tone, strict boundaries, editorial rules, and preferences.", es: "Perfil IA de la creadora: persona, tono, límites estrictos, reglas editoriales y preferencias.", "pt-BR": "Perfil IA da criadora: persona, tom, limites estritos, regras editoriais e preferências.", de: "Creator-KI-Profil: Persona, Ton, strenge Grenzen, redaktionelle Regeln und Präferenzen.", it: "Profilo IA della creator: persona, tono, limiti rigorosi, regole editoriali e preferenze." },
  "sectionDesc.notificationsCenter": { fr: "Toutes les alertes et notifications (achats, messages, conformité, milestones) centralisées.", en: "All alerts and notifications (purchases, messages, compliance, milestones) centralized.", es: "Todas las alertas y notificaciones (compras, mensajes, cumplimiento, hitos) centralizadas.", "pt-BR": "Todos os alertas e notificações (compras, mensagens, conformidade, marcos) centralizados.", de: "Alle Benachrichtigungen (Käufe, Nachrichten, Compliance, Meilensteine) zentralisiert.", it: "Tutti gli avvisi e le notifiche (acquisti, messaggi, conformità, milestone) centralizzati." },
  "sectionDesc.creativeEngine": { fr: "L'IA génère des scripts Reels/TikTok basés sur les tendances. Approbation humaine obligatoire avant publication.", en: "AI generates Reels/TikTok scripts based on trends. Human approval required before publishing.", es: "La IA genera scripts Reels/TikTok basados en tendencias. Aprobación humana obligatoria antes de la publicación.", "pt-BR": "A IA gera scripts Reels/TikTok baseados em tendências. Aprovação humana obrigatória antes da publicação.", de: "KI generiert Reels/TikTok-Skripte basierend auf Trends. Menschliche Freigabe vor Veröffentlichung erforderlich.", it: "L'IA genera script Reels/TikTok basati sulle tendenze. Approvazione umana obbligatoria prima della pubblicazione." },
  "sectionDesc.roadmap": { fr: "Propositions de fonctionnalités par la communauté d'agences. Vote pour prioriser les développements.", en: "Feature proposals from the agency community. Vote to prioritize developments.", es: "Propuestas de funciones de la comunidad de agencias. Vota para priorizar los desarrollos.", "pt-BR": "Propostas de recursos da comunidade de agências. Vote para priorizar os desenvolvimentos.", de: "Funktionsvorschläge der Agentur-Community. Stimme ab, um Entwicklungen zu priorisieren.", it: "Proposte di funzionalità dalla community di agenzie. Vota per prioritizzare gli sviluppi." },
  "platform.OF": { fr: "OnlyFans", en: "OnlyFans", es: "OnlyFans", "pt-BR": "OnlyFans", de: "OnlyFans", it: "OnlyFans" },
  "platform.Fansly": { fr: "Fansly", en: "Fansly", es: "Fansly", "pt-BR": "Fansly", de: "Fansly", it: "Fansly" },
  "platform.MYM": { fr: "MYM", en: "MYM", es: "MYM", "pt-BR": "MYM", de: "MYM", it: "MYM" },
  "platform.Fanvue": { fr: "Fanvue", en: "Fanvue", es: "Fanvue", "pt-BR": "Fanvue", de: "Fanvue", it: "Fanvue" },
  "platform.IG": { fr: "Instagram", en: "Instagram", es: "Instagram", "pt-BR": "Instagram", de: "Instagram", it: "Instagram" },
  "platform.TT": { fr: "TikTok", en: "TikTok", es: "TikTok", "pt-BR": "TikTok", de: "TikTok", it: "TikTok" },
  "commission.bronze": { fr: "Bronze", en: "Bronze", es: "Bronce", "pt-BR": "Bronze", de: "Bronze", it: "Bronzo" },
  "commission.silver": { fr: "Silver", en: "Silver", es: "Plata", "pt-BR": "Prata", de: "Silber", it: "Argento" },
  "commission.gold": { fr: "Gold", en: "Gold", es: "Oro", "pt-BR": "Ouro", de: "Gold", it: "Oro" },
  "commission.platinum": { fr: "Platinum", en: "Platinum", es: "Platino", "pt-BR": "Platina", de: "Platin", it: "Platino" },
  "onboarding.configureAi": { fr: "Configurer la sécurité IA", en: "Configure AI safety", es: "Configurar seguridad IA", "pt-BR": "Configurar segurança IA", de: "KI-Sicherheit einrichten", it: "Configura sicurezza IA" },
  "onboarding.createScript": { fr: "Créer un script PPV", en: "Create first PPV script", es: "Crear primer script PPV", "pt-BR": "Criar primeiro script PPV", de: "Ersten PPV-Script erstellen", it: "Crea primo script PPV" },
  "onboarding.reviewHandoff": { fr: "Vérifier les règles de handoff", en: "Review handoff rules", es: "Revisar reglas de transferencia", "pt-BR": "Revisar regras de handoff", de: "Übergaberegeln prüfen", it: "Verifica regole handoff" },
  "onboarding.inviteChatter": { fr: "Inviter un premier chatter", en: "Invite first chatter", es: "Invitar primer chatter", "pt-BR": "Convidar primeiro chatter", de: "Ersten Chatter einladen", it: "Invita primo chatter" },
  "onboarding.checkCompliance": { fr: "Vérifier la file conformité", en: "Check compliance queue", es: "Revisar cola de cumplimiento", "pt-BR": "Verificar fila de conformidade", de: "Compliance-Warteschlange prüfen", it: "Controlla coda conformità" },
};

// ═══ Context ════════════════════════════════════════════════

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>(null!);

export function getLocaleLabel(locale: Locale): string {
  return LOCALE_LABELS[locale];
}

// ═══ Provider ═══════════════════════════════════════════════

export function AtlasLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  const t = useCallback(
    (key: string): string => {
      const entry = messages[key];
      if (!entry) return key;
      return entry[locale] || entry[DEFAULT_LOCALE] || key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// ═══ Hooks ══════════════════════════════════════════════════

export function useT(): (key: string) => string {
  return useContext(LocaleContext).t;
}

export function useAtlasLocale(): { locale: Locale; setLocale: (l: Locale) => void } {
  const { locale, setLocale } = useContext(LocaleContext);
  return { locale, setLocale };
}

export function useLocaleLabel(): string {
  const { locale } = useContext(LocaleContext);
  return LOCALE_LABELS[locale];
}

// ═══ Locale Switcher Component ══════════════════════════════

export function LocaleSwitcher() {
  const { locale, setLocale } = useAtlasLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="text-[11px] px-2 py-1 rounded-sm border bg-transparent cursor-pointer"
      style={{ color: "#5F5145", borderColor: "#E5D7C3", backgroundColor: "#FFFBF4" }}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
