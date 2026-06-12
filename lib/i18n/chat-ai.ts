// ─── Halo Sovereign Chat AI — i18n namespace ─────────────
// 6 languages: fr, en, es, de, pt-BR, it

import type { Locale } from "./common";

type Messages = Record<string, Record<Locale, string>>;

export const chatAIMessages: Messages = {
  // ─── Module ──────────────────────────────────────────────
  "chatAI.title": { fr: "Sovereign Chat AI", en: "Sovereign Chat AI", es: "Sovereign Chat AI", "pt-BR": "Sovereign Chat AI", de: "Sovereign Chat AI", it: "Sovereign Chat AI" },
  "chatAI.tagline": { fr: "L'IA prépare. Vous validez. Halo mesure.", en: "AI prepares. You approve. Halo measures.", es: "La IA prepara. Usted valida. Halo mide.", "pt-BR": "A IA prepara. Você valida. A Halo mede.", de: "KI bereitet vor. Sie genehmigen. Halo misst.", it: "L'IA prepara. Tu approvi. Halo misura." },
  "chatAI.demo_badge": { fr: "Demo Data", en: "Demo Data", es: "Datos Demo", "pt-BR": "Dados Demo", de: "Demo-Daten", it: "Dati Demo" },

  // ─── Modes ───────────────────────────────────────────────
  "chatAI.mode.copilot_only": { fr: "Copilot Only", en: "Copilot Only", es: "Solo Copiloto", "pt-BR": "Apenas Copiloto", de: "Nur Copilot", it: "Solo Copilota" },
  "chatAI.mode.assisted_sales": { fr: "Assisted Sales", en: "Assisted Sales", es: "Ventas Asistidas", "pt-BR": "Vendas Assistidas", de: "Unterstützter Verkauf", it: "Vendite Assistite" },
  "chatAI.mode.agency": { fr: "Agency", en: "Agency", es: "Agencia", "pt-BR": "Agência", de: "Agentur", it: "Agenzia" },
  "chatAI.mode.elite": { fr: "Elite", en: "Elite", es: "Elite", "pt-BR": "Elite", de: "Elite", it: "Elite" },

  // ─── Disclosure ──────────────────────────────────────────
  "chatAI.disclosure.private_copilot": { fr: "Copilot Privé", en: "Private Copilot", es: "Copiloto Privado", "pt-BR": "Copiloto Privado", de: "Privater Copilot", it: "Copilota Privato" },
  "chatAI.disclosure.team_assisted": { fr: "Équipe Assistée", en: "Team Assisted", es: "Equipo Asistido", "pt-BR": "Equipe Assistida", de: "Team-unterstützt", it: "Team Assistito" },
  "chatAI.disclosure.disclosed_assistant": { fr: "Assistant Transparent", en: "Disclosed Assistant", es: "Asistente Transparente", "pt-BR": "Assistente Transparente", de: "Offengelegter Assistent", it: "Assistente Dichiarato" },
  "chatAI.disclosure.platform_restricted": { fr: "Mode Restreint", en: "Platform Restricted", es: "Modo Restringido", "pt-BR": "Modo Restrito", de: "Plattform-beschränkt", it: "Modalità Limitata" },

  // ─── Fan Status ──────────────────────────────────────────
  "chatAI.fan.new": { fr: "Nouveau", en: "New", es: "Nuevo", "pt-BR": "Novo", de: "Neu", it: "Nuovo" },
  "chatAI.fan.active": { fr: "Actif", en: "Active", es: "Activo", "pt-BR": "Ativo", de: "Aktiv", it: "Attivo" },
  "chatAI.fan.vip": { fr: "VIP", en: "VIP", es: "VIP", "pt-BR": "VIP", de: "VIP", it: "VIP" },
  "chatAI.fan.whale": { fr: "Whale", en: "Whale", es: "Whale", "pt-BR": "Whale", de: "Whale", it: "Whale" },
  "chatAI.fan.dormant": { fr: "Dormant", en: "Dormant", es: "Inactivo", "pt-BR": "Adormecido", de: "Inaktiv", it: "Dormiente" },
  "chatAI.fan.churn_risk": { fr: "Risque churn", en: "Churn Risk", es: "Riesgo fuga", "pt-BR": "Risco churn", de: "Abwanderungsrisiko", it: "Rischio abbandono" },
  "chatAI.fan.do_not_contact": { fr: "Ne pas contacter", en: "Do Not Contact", es: "No contactar", "pt-BR": "Não contactar", de: "Nicht kontaktieren", it: "Non contattare" },

  // ─── Dashboard ───────────────────────────────────────────
  "chatAI.overview": { fr: "Vue d'ensemble", en: "Overview", es: "Vista general", "pt-BR": "Visão geral", de: "Übersicht", it: "Panoramica" },
  "chatAI.revenue_inbox": { fr: "Revenue Inbox", en: "Revenue Inbox", es: "Bandeja de ingresos", "pt-BR": "Caixa de receita", de: "Umsatz-Posteingang", it: "Inbox ricavi" },
  "chatAI.fan_brain": { fr: "Fan Brain", en: "Fan Brain", es: "Cerebro Fan", "pt-BR": "Cérebro Fan", de: "Fan-Gehirn", it: "Cervello Fan" },
  "chatAI.ppv_copilot": { fr: "PPV Sales Copilot", en: "PPV Sales Copilot", es: "Copiloto PPV", "pt-BR": "Copiloto PPV", de: "PPV-Verkaufs-Copilot", it: "Copilota Vendite PPV" },
  "chatAI.followups": { fr: "Smart Follow-ups", en: "Smart Follow-ups", es: "Seguimientos inteligentes", "pt-BR": "Follow-ups inteligentes", de: "Intelligente Follow-ups", it: "Follow-up intelligenti" },
  "chatAI.vault_check": { fr: "Content Vault Check", en: "Content Vault Check", es: "Verificación Vault", "pt-BR": "Verificação Vault", de: "Inhalts-Vault-Prüfung", it: "Verifica Vault" },
  "chatAI.playbooks": { fr: "Playbook Builder", en: "Playbook Builder", es: "Constructor Playbook", "pt-BR": "Construtor Playbook", de: "Playbook-Builder", it: "Costruttore Playbook" },
  "chatAI.qa": { fr: "QA Review", en: "QA Review", es: "Revisión QA", "pt-BR": "Revisão QA", de: "QA-Prüfung", it: "Revisione QA" },
  "chatAI.compliance": { fr: "Compliance Center", en: "Compliance Center", es: "Centro Compliance", "pt-BR": "Centro Compliance", de: "Compliance-Center", it: "Centro Compliance" },
  "chatAI.settings": { fr: "Paramètres", en: "Settings", es: "Configuración", "pt-BR": "Configurações", de: "Einstellungen", it: "Impostazioni" },
  "chatAI.plans": { fr: "Plans & Tarifs", en: "Plans & Pricing", es: "Planes y Precios", "pt-BR": "Planos e Preços", de: "Pläne & Preise", it: "Piani e Prezzi" },

  // ─── Compliance ──────────────────────────────────────────
  "chatAI.emergency_pause": { fr: "Pause d'urgence", en: "Emergency Pause", es: "Pausa de emergencia", "pt-BR": "Pausa de emergência", de: "Notfall-Pause", it: "Pausa di emergenza" },
  "chatAI.human_approval_required": { fr: "Validation humaine requise", en: "Human approval required", es: "Validación humana requerida", "pt-BR": "Validação humana necessária", de: "Menschliche Genehmigung erforderlich", it: "Approvazione umana richiesta" },
  "chatAI.consent_required": { fr: "Checklist de consentement obligatoire", en: "Consent checklist required", es: "Checklist de consentimiento obligatoria", "pt-BR": "Checklist de consentimento obrigatória", de: "Einwilligungs-Checkliste erforderlich", it: "Checklist consenso obbligatoria" },

  // ─── Consent Checklist (11 items) ────────────────────────
  "chatAI.consent.1": { fr: "Je confirme être autorisé(e) à gérer ce compte ou disposer d'une autorisation écrite.", en: "I confirm I am authorized to manage this account or have written authorization.", es: "Confirmo estar autorizado(a) a gestionar esta cuenta o tener autorización escrita.", "pt-BR": "Confirmo estar autorizado(a) a gerenciar esta conta ou ter autorização escrita.", de: "Ich bestätige, dass ich berechtigt bin, dieses Konto zu verwalten oder eine schriftliche Genehmigung habe.", it: "Confermo di essere autorizzato(a) a gestire questo account o di avere un'autorizzazione scritta." },
  "chatAI.consent.2": { fr: "Je confirme que les règles des plateformes utilisées restent applicables.", en: "I confirm that the rules of the platforms used remain applicable.", es: "Confirmo que las reglas de las plataformas utilizadas siguen siendo aplicables.", "pt-BR": "Confirmo que as regras das plataformas utilizadas permanecem aplicáveis.", de: "Ich bestätige, dass die Regeln der genutzten Plattformen weiterhin gelten.", it: "Confermo che le regole delle piattaforme utilizzate restano applicabili." },
  "chatAI.consent.3": { fr: "Je comprends que certaines plateformes peuvent limiter ou interdire l'usage d'IA dans les messages.", en: "I understand that some platforms may limit or prohibit the use of AI in messages.", es: "Entiendo que algunas plataformas pueden limitar o prohibir el uso de IA en mensajes.", "pt-BR": "Entendo que algumas plataformas podem limitar ou proibir o uso de IA em mensagens.", de: "Ich verstehe, dass einige Plattformen die Nutzung von KI in Nachrichten einschränken oder verbieten können.", it: "Comprendo che alcune piattaforme possono limitare o vietare l'uso dell'IA nei messaggi." },
  "chatAI.consent.4": { fr: "Je comprends que Halo ne garantit pas l'absence de restriction, suspension ou sanction de plateforme.", en: "I understand that Halo does not guarantee the absence of platform restrictions, suspensions, or sanctions.", es: "Entiendo que Halo no garantiza la ausencia de restricciones, suspensiones o sanciones de plataforma.", "pt-BR": "Entendo que a Halo não garante a ausência de restrições, suspensões ou sanções de plataforma.", de: "Ich verstehe, dass Halo keine Garantie für die Abwesenheit von Plattform-Einschränkungen, -Sperrungen oder -Sanktionen gibt.", it: "Comprendo che Halo non garantisce l'assenza di restrizioni, sospensioni o sanzioni della piattaforma." },
  "chatAI.consent.5": { fr: "Je comprends que Halo ne garantit pas de revenus.", en: "I understand that Halo does not guarantee revenue.", es: "Entiendo que Halo no garantiza ingresos.", "pt-BR": "Entendo que a Halo não garante receita.", de: "Ich verstehe, dass Halo keine Einnahmen garantiert.", it: "Comprendo che Halo non garantisce ricavi." },
  "chatAI.consent.6": { fr: "Je comprends que les suggestions IA doivent être validées humainement avant envoi.", en: "I understand that AI suggestions must be human-validated before sending.", es: "Entiendo que las sugerencias de IA deben ser validadas humanamente antes del envío.", "pt-BR": "Entendo que as sugestões de IA devem ser validadas humanamente antes do envio.", de: "Ich verstehe, dass KI-Vorschläge vor dem Senden menschlich validiert werden müssen.", it: "Comprendo che i suggerimenti IA devono essere convalidati umanamente prima dell'invio." },
  "chatAI.consent.7": { fr: "Je choisis le niveau de disclosure adapté à ma juridiction et mes plateformes.", en: "I choose the disclosure level suited to my jurisdiction and platforms.", es: "Elijo el nivel de divulgación adecuado a mi jurisdicción y plataformas.", "pt-BR": "Escolho o nível de divulgação adequado à minha jurisdição e plataformas.", de: "Ich wähle das für meine Gerichtsbarkeit und Plattformen geeignete Offenlegungsniveau.", it: "Scelgo il livello di divulgazione adatto alla mia giurisdizione e piattaforme." },
  "chatAI.consent.8": { fr: "Je confirme avoir défini les limites, tabous et règles de ton.", en: "I confirm I have defined boundaries, taboos, and tone rules.", es: "Confirmo haber definido límites, tabúes y reglas de tono.", "pt-BR": "Confirmo ter definido limites, tabus e regras de tom.", de: "Ich bestätige, dass ich Grenzen, Tabus und Tonregeln definiert habe.", it: "Confermo di aver definito limiti, tabù e regole di tono." },
  "chatAI.consent.9": { fr: "Je comprends que les actions sont journalisées pour sécurité et audit.", en: "I understand that actions are logged for security and audit.", es: "Entiendo que las acciones se registran por seguridad y auditoría.", "pt-BR": "Entendo que as ações são registradas para segurança e auditoria.", de: "Ich verstehe, dass Aktionen zu Sicherheits- und Prüfzwecken protokolliert werden.", it: "Comprendo che le azioni sono registrate per sicurezza e audit." },
  "chatAI.consent.10": { fr: "Je comprends que je peux désactiver le module à tout moment.", en: "I understand that I can disable the module at any time.", es: "Entiendo que puedo desactivar el módulo en cualquier momento.", "pt-BR": "Entendo que posso desativar o módulo a qualquer momento.", de: "Ich verstehe, dass ich das Modul jederzeit deaktivieren kann.", it: "Comprendo che posso disattivare il modulo in qualsiasi momento." },
  "chatAI.consent.11": { fr: "Je comprends que cet outil fournit une assistance opérationnelle et ne remplace pas un avis juridique.", en: "I understand that this tool provides operational assistance and does not replace legal advice.", es: "Entiendo que esta herramienta proporciona asistencia operativa y no reemplaza el asesoramiento legal.", "pt-BR": "Entendo que esta ferramenta fornece assistência operacional e não substitui aconselhamento jurídico.", de: "Ich verstehe, dass dieses Tool operative Unterstützung bietet und keine Rechtsberatung ersetzt.", it: "Comprendo che questo strumento fornisce assistenza operativa e non sostituisce la consulenza legale." },

  // ─── Plans ───────────────────────────────────────────────
  "chatAI.plans.starter.name": { fr: "Starter", en: "Starter", es: "Starter", "pt-BR": "Starter", de: "Starter", it: "Starter" },
  "chatAI.plans.growth.name": { fr: "Growth", en: "Growth", es: "Growth", "pt-BR": "Growth", de: "Growth", it: "Growth" },
  "chatAI.plans.pro_agency.name": { fr: "Pro Agency", en: "Pro Agency", es: "Pro Agency", "pt-BR": "Pro Agency", de: "Pro Agency", it: "Pro Agency" },
  "chatAI.plans.elite.name": { fr: "Elite", en: "Elite", es: "Elite", "pt-BR": "Elite", de: "Elite", it: "Elite" },
  "chatAI.plans.popular": { fr: "Populaire", en: "Popular", es: "Popular", "pt-BR": "Popular", de: "Beliebt", it: "Popolare" },
  "chatAI.plans.agencies": { fr: "Agences", en: "Agencies", es: "Agencias", "pt-BR": "Agências", de: "Agenturen", it: "Agenzie" },

  // ─── Disclaimers ─────────────────────────────────────────
  "chatAI.disclaimer.pricing": { fr: "Prix indicatifs. Les commissions s'appliquent uniquement aux ventes attribuées au module lorsque le tracking est activé. Aucun revenu garanti.", en: "Indicative pricing. Commissions apply only to sales attributed to the module when tracking is enabled. No revenue guaranteed.", es: "Precios indicativos. Las comisiones se aplican solo a ventas atribuidas al módulo con tracking activado. Ningún ingreso garantizado.", "pt-BR": "Preços indicativos. Comissões aplicam-se apenas a vendas atribuídas ao módulo com tracking ativado. Nenhuma receita garantida.", de: "Richtpreise. Provisionen gelten nur für dem Modul zugeordnete Verkäufe bei aktiviertem Tracking. Keine Einnahmen garantiert.", it: "Prezzi indicativi. Le commissioni si applicano solo alle vendite attribuite al modulo con tracking attivo. Nessun ricavo garantito." },
  "chatAI.disclaimer.general": { fr: "Halo fournit une assistance opérationnelle. Ne remplace pas un avis juridique. Les CGU des plateformes restent applicables. Le créateur est responsable des messages envoyés.", en: "Halo provides operational assistance. Does not replace legal advice. Platform ToS remain applicable. The creator is responsible for messages sent.", es: "Halo proporciona asistencia operativa. No reemplaza asesoría legal. Los TdS de las plataformas siguen siendo aplicables. El creador es responsable de los mensajes enviados.", "pt-BR": "A Halo fornece assistência operacional. Não substitui aconselhamento jurídico. Os ToS das plataformas permanecem aplicáveis. O criador é responsável pelas mensagens enviadas.", de: "Halo bietet operative Unterstützung. Ersetzt keine Rechtsberatung. Die AGB der Plattformen bleiben anwendbar. Der Ersteller ist für gesendete Nachrichten verantwortlich.", it: "Halo fornisce assistenza operativa. Non sostituisce la consulenza legale. I TdS delle piattaforme restano applicabili. Il creatore è responsabile dei messaggi inviati." },
  "chatAI.disclaimer.no_auto_send": { fr: "Halo ne permet pas l'envoi automatique de messages. Toute action d'envoi nécessite une validation humaine.", en: "Halo does not allow automatic message sending. Any send action requires human validation.", es: "Halo no permite el envío automático de mensajes. Cualquier acción de envío requiere validación humana.", "pt-BR": "A Halo não permite o envio automático de mensagens. Qualquer ação de envio requer validação humana.", de: "Halo erlaubt kein automatisches Senden von Nachrichten. Jede Sendeaktion erfordert eine menschliche Validierung.", it: "Halo non consente l'invio automatico di messaggi. Qualsiasi azione di invio richiede la convalida umana." },

  // ─── Actions ─────────────────────────────────────────────
  "chatAI.action.generate": { fr: "Générer une réponse", en: "Generate response", es: "Generar respuesta", "pt-BR": "Gerar resposta", de: "Antwort generieren", it: "Genera risposta" },
  "chatAI.action.approve": { fr: "Approuver", en: "Approve", es: "Aprobar", "pt-BR": "Aprovar", de: "Genehmigen", it: "Approva" },
  "chatAI.action.copy": { fr: "Copier", en: "Copy", es: "Copiar", "pt-BR": "Copiar", de: "Kopieren", it: "Copia" },
  "chatAI.action.block": { fr: "Bloquer", en: "Block", es: "Bloquear", "pt-BR": "Bloquear", de: "Blockieren", it: "Blocca" },
  "chatAI.action.escalate": { fr: "Escalader", en: "Escalate", es: "Escalar", "pt-BR": "Escalar", de: "Eskalieren", it: "Escala" },
  "chatAI.action.export": { fr: "Exporter", en: "Export", es: "Exportar", "pt-BR": "Exportar", de: "Exportieren", it: "Esporta" },
  "chatAI.action.delete": { fr: "Supprimer les données", en: "Delete data", es: "Eliminar datos", "pt-BR": "Excluir dados", de: "Daten löschen", it: "Elimina dati" },

  // ─── Risk Levels ─────────────────────────────────────────
  "chatAI.risk.low": { fr: "Risque faible", en: "Low risk", es: "Riesgo bajo", "pt-BR": "Risco baixo", de: "Geringes Risiko", it: "Rischio basso" },
  "chatAI.risk.medium": { fr: "Risque moyen", en: "Medium risk", es: "Riesgo medio", "pt-BR": "Risco médio", de: "Mittleres Risiko", it: "Rischio medio" },
  "chatAI.risk.high": { fr: "Risque élevé", en: "High risk", es: "Riesgo alto", "pt-BR": "Risco alto", de: "Hohes Risiko", it: "Rischio alto" },

  // ─── PPV ─────────────────────────────────────────────────
  "chatAI.ppv.estimate_disclaimer": { fr: "Estimation non garantie", en: "Non-guaranteed estimate", es: "Estimación no garantizada", "pt-BR": "Estimativa não garantida", de: "Unverbindliche Schätzung", it: "Stima non garantita" },
  "chatAI.ppv.already_sold": { fr: "Déjà vendu à ce fan", en: "Already sold to this fan", es: "Ya vendido a este fan", "pt-BR": "Já vendido a este fã", de: "Bereits an diesen Fan verkauft", it: "Già venduto a questo fan" },

  // ─── Errors ──────────────────────────────────────────────
  "chatAI.error.consent_required": { fr: "La checklist de consentement doit être complétée avant activation.", en: "Consent checklist must be completed before activation.", es: "La checklist de consentimiento debe completarse antes de la activación.", "pt-BR": "A checklist de consentimento deve ser concluída antes da ativação.", de: "Die Einwilligungs-Checkliste muss vor der Aktivierung abgeschlossen sein.", it: "La checklist di consenso deve essere completata prima dell'attivazione." },

  // ─── Page Titles ──────────────────────────────────────────
  "chatAI.page.fans": { fr: "Fan Brain", en: "Fan Brain", es: "Cerebro Fan", "pt-BR": "Cérebro Fan", de: "Fan-Gehirn", it: "Cervello Fan" },
  "chatAI.page.fansDesc": { fr: "Profils enrichis, scores et signaux comportementaux pour chaque fan.", en: "Enriched profiles, scores and behavioral signals for every fan.", es: "Perfiles enriquecidos, puntuaciones y señales de comportamiento para cada fan.", "pt-BR": "Perfis enriquecidos, pontuações e sinais comportamentais para cada fã.", de: "Angereicherte Profile, Scores und Verhaltenssignale für jeden Fan.", it: "Profili arricchiti, punteggi e segnali comportamentali per ogni fan." },
  "chatAI.page.conversation": { fr: "Conversation", en: "Conversation", es: "Conversación", "pt-BR": "Conversa", de: "Konversation", it: "Conversazione" },
  "chatAI.page.withFan": { fr: "avec", en: "with", es: "con", "pt-BR": "com", de: "mit", it: "con" },

  // ─── Filters ───────────────────────────────────────────────
  "chatAI.filter.allPlatforms": { fr: "Toutes plateformes", en: "All platforms", es: "Todas las plataformas", "pt-BR": "Todas plataformas", de: "Alle Plattformen", it: "Tutte le piattaforme" },
  "chatAI.filter.allStatus": { fr: "Tous statuts", en: "All statuses", es: "Todos los estados", "pt-BR": "Todos os status", de: "Alle Status", it: "Tutti gli stati" },
  "chatAI.filter.allLanguages": { fr: "Toutes langues", en: "All languages", es: "Todos los idiomas", "pt-BR": "Todos os idiomas", de: "Alle Sprachen", it: "Tutte le lingue" },
  "chatAI.filter.allRisks": { fr: "Tout risque", en: "All risks", es: "Todo riesgo", "pt-BR": "Todo risco", de: "Alle Risiken", it: "Tutti i rischi" },
  "chatAI.filter.highRisk": { fr: "Risque élevé", en: "High risk", es: "Riesgo alto", "pt-BR": "Risco alto", de: "Hohes Risiko", it: "Rischio alto" },
  "chatAI.filter.searchFan": { fr: "Rechercher un fan...", en: "Search a fan...", es: "Buscar un fan...", "pt-BR": "Buscar um fã...", de: "Fan suchen...", it: "Cerca un fan..." },

  // ─── Sort ──────────────────────────────────────────────────
  "chatAI.sort.ltv": { fr: "LTV décroissant", en: "LTV descending", es: "LTV descendente", "pt-BR": "LTV decrescente", de: "LTV absteigend", it: "LTV decrescente" },
  "chatAI.sort.churn": { fr: "Risque churn", en: "Churn risk", es: "Riesgo fuga", "pt-BR": "Risco churn", de: "Abwanderungsrisiko", it: "Rischio abbandono" },
  "chatAI.sort.intent": { fr: "Intention", en: "Intent", es: "Intención", "pt-BR": "Intenção", de: "Absicht", it: "Intento" },
  "chatAI.sort.name": { fr: "Nom", en: "Name", es: "Nombre", "pt-BR": "Nome", de: "Name", it: "Nome" },

  // ─── Composer ──────────────────────────────────────────────
  "chatAI.composer.title": { fr: "Assistant de rédaction", en: "Drafting assistant", es: "Asistente de redacción", "pt-BR": "Assistente de redação", de: "Schreibassistent", it: "Assistente di scrittura" },
  "chatAI.composer.forFan": { fr: "Pour", en: "For", es: "Para", "pt-BR": "Para", de: "Für", it: "Per" },
  "chatAI.composer.objectivePlaceholder": { fr: "Objectif du message...", en: "Message objective...", es: "Objetivo del mensaje...", "pt-BR": "Objetivo da mensagem...", de: "Nachrichtenziel...", it: "Obiettivo del messaggio..." },
  "chatAI.composer.generate": { fr: "Générer", en: "Generate", es: "Generar", "pt-BR": "Gerar", de: "Generieren", it: "Genera" },
  "chatAI.composer.generating": { fr: "Génération...", en: "Generating...", es: "Generando...", "pt-BR": "Gerando...", de: "Generierung...", it: "Generazione..." },
  "chatAI.composer.approve": { fr: "Approuver", en: "Approve", es: "Aprobar", "pt-BR": "Aprovar", de: "Genehmigen", it: "Approva" },
  "chatAI.composer.approved": { fr: "Approuvé", en: "Approved", es: "Aprobado", "pt-BR": "Aprovado", de: "Genehmigt", it: "Approvato" },
  "chatAI.composer.copy": { fr: "Copier", en: "Copy", es: "Copiar", "pt-BR": "Copiar", de: "Kopieren", it: "Copia" },
  "chatAI.composer.copied": { fr: "Copié", en: "Copied", es: "Copiado", "pt-BR": "Copiado", de: "Kopiert", it: "Copiato" },
  "chatAI.composer.regenerate": { fr: "Régénérer", en: "Regenerate", es: "Regenerar", "pt-BR": "Regenerar", de: "Neu generieren", it: "Rigenera" },
  "chatAI.composer.tone": { fr: "Ton", en: "Tone", es: "Tono", "pt-BR": "Tom", de: "Ton", it: "Tono" },
  "chatAI.composer.blocked": { fr: "Brouillon bloqué", en: "Draft blocked", es: "Borrador bloqueado", "pt-BR": "Rascunho bloqueado", de: "Entwurf blockiert", it: "Bozza bloccata" },
  "chatAI.composer.generated": { fr: "Brouillon généré", en: "Draft generated", es: "Borrador generado", "pt-BR": "Rascunho gerado", de: "Entwurf generiert", it: "Bozza generata" },

  // ─── Composer Objectives ────────────────────────────────────
  "chatAI.objective.relance": { fr: "Relance douce", en: "Soft follow-up", es: "Seguimiento suave", "pt-BR": "Follow-up suave", de: "Sanfte Nachfassung", it: "Follow-up morbido" },
  "chatAI.objective.ppv_tease": { fr: "Tease PPV", en: "PPV Tease", es: "Tease PPV", "pt-BR": "Tease PPV", de: "PPV-Teaser", it: "Tease PPV" },
  "chatAI.objective.remerciement": { fr: "Remerciement", en: "Thank you", es: "Agradecimiento", "pt-BR": "Agradecimento", de: "Dankeschön", it: "Ringraziamento" },
  "chatAI.objective.engagement": { fr: "Engagement", en: "Engagement", es: "Engagement", "pt-BR": "Engajamento", de: "Engagement", it: "Coinvolgimento" },
  "chatAI.objective.reactivation": { fr: "Réactivation", en: "Reactivation", es: "Reactivación", "pt-BR": "Reativação", de: "Reaktivierung", it: "Riattivazione" },

  // ─── Composer Tones ────────────────────────────────────────
  "chatAI.tone.warm": { fr: "Chaleureux", en: "Warm", es: "Cálido", "pt-BR": "Caloroso", de: "Warm", it: "Caloroso" },
  "chatAI.tone.bold": { fr: "Audacieux", en: "Bold", es: "Audaz", "pt-BR": "Audacioso", de: "Kühn", it: "Audace" },
  "chatAI.tone.gentle": { fr: "Doux", en: "Gentle", es: "Suave", "pt-BR": "Suave", de: "Sanft", it: "Dolce" },
  "chatAI.tone.professional": { fr: "Pro", en: "Pro", es: "Pro", "pt-BR": "Pro", de: "Pro", it: "Pro" },

  // ─── Compliance Panel ───────────────────────────────────────
  "chatAI.compliance.scanning": { fr: "Analyse en cours...", en: "Scanning...", es: "Analizando...", "pt-BR": "Analisando...", de: "Analyse läuft...", it: "Scansione in corso..." },
  "chatAI.compliance.noAnalysis": { fr: "Aucune analyse de conformité", en: "No compliance analysis", es: "Sin análisis de conformidad", "pt-BR": "Nenhuma análise de conformidade", de: "Keine Compliance-Analyse", it: "Nessuna analisi di conformità" },
  "chatAI.compliance.compliant": { fr: "Conforme", en: "Compliant", es: "Conforme", "pt-BR": "Conforme", de: "Konform", it: "Conforme" },
  "chatAI.compliance.nonCompliant": { fr: "Non conforme", en: "Non-compliant", es: "No conforme", "pt-BR": "Não conforme", de: "Nicht konform", it: "Non conforme" },
  "chatAI.compliance.actionsRequired": { fr: "Actions requises", en: "Required actions", es: "Acciones requeridas", "pt-BR": "Ações necessárias", de: "Erforderliche Aktionen", it: "Azioni richieste" },
  "chatAI.compliance.alternative": { fr: "Alternative suggérée", en: "Suggested alternative", es: "Alternativa sugerida", "pt-BR": "Alternativa sugerida", de: "Vorgeschlagene Alternative", it: "Alternativa suggerita" },

  // ─── Thread ─────────────────────────────────────────────────
  "chatAI.thread.title": { fr: "Fil de discussion", en: "Thread", es: "Hilo de discusión", "pt-BR": "Fio de discussão", de: "Diskussionsfaden", it: "Thread di discussione" },
  "chatAI.thread.noMessages": { fr: "Aucun message", en: "No messages", es: "Sin mensajes", "pt-BR": "Nenhuma mensagem", de: "Keine Nachrichten", it: "Nessun messaggio" },
  "chatAI.thread.draftLabel": { fr: "Brouillon IA", en: "AI Draft", es: "Borrador IA", "pt-BR": "Rascunho IA", de: "KI-Entwurf", it: "Bozza IA" },
  "chatAI.thread.blocked": { fr: "Bloqué", en: "Blocked", es: "Bloqueado", "pt-BR": "Bloqueado", de: "Blockiert", it: "Bloccato" },

  // ─── Fan Brain Labels ───────────────────────────────────────
  "chatAI.fan.vulnerableWarning": { fr: "Fan vulnérable — actions commerciales bloquées", en: "Vulnerable fan — commercial actions blocked", es: "Fan vulnerable — acciones comerciales bloqueadas", "pt-BR": "Fã vulnerável — ações comerciais bloqueadas", de: "Verletzlicher Fan — kommerzielle Aktionen blockiert", it: "Fan vulnerabile — azioni commerciali bloccate" },
  "chatAI.fan.doNotContactBanner": { fr: "Ne pas contacter", en: "Do not contact", es: "No contactar", "pt-BR": "Não contactar", de: "Nicht kontaktieren", it: "Non contattare" },
  "chatAI.fan.preferences": { fr: "PRÉFÉRENCES", en: "PREFERENCES", es: "PREFERENCIAS", "pt-BR": "PREFERÊNCIAS", de: "PRÄFERENZEN", it: "PREFERENZE" },
  "chatAI.fan.avoid": { fr: "À ÉVITER", en: "AVOID", es: "EVITAR", "pt-BR": "EVITAR", de: "VERMEIDEN", it: "EVITARE" },
  "chatAI.fan.notAvailable": { fr: "Fan non disponible", en: "Fan not available", es: "Fan no disponible", "pt-BR": "Fã não disponível", de: "Fan nicht verfügbar", it: "Fan non disponibile" },

  // ─── Table Columns ──────────────────────────────────────────
  "chatAI.table.fan": { fr: "Fan", en: "Fan", es: "Fan", "pt-BR": "Fã", de: "Fan", it: "Fan" },
  "chatAI.table.platform": { fr: "Plateforme", en: "Platform", es: "Plataforma", "pt-BR": "Plataforma", de: "Plattform", it: "Piattaforma" },
  "chatAI.table.language": { fr: "Langue", en: "Language", es: "Idioma", "pt-BR": "Idioma", de: "Sprache", it: "Lingua" },
  "chatAI.table.status": { fr: "Statut", en: "Status", es: "Estado", "pt-BR": "Status", de: "Status", it: "Stato" },
  "chatAI.table.intent": { fr: "Intention", en: "Intent", es: "Intención", "pt-BR": "Intenção", de: "Absicht", it: "Intento" },
  "chatAI.table.churn": { fr: "Churn", en: "Churn", es: "Fuga", "pt-BR": "Churn", de: "Churn", it: "Churn" },
  "chatAI.table.relation": { fr: "Relation", en: "Relation", es: "Relación", "pt-BR": "Relação", de: "Beziehung", it: "Relazione" },

  // ─── Score Labels ───────────────────────────────────────────
  "chatAI.score.relationship": { fr: "Relationnel", en: "Relationship", es: "Relacional", "pt-BR": "Relacional", de: "Beziehungsmäßig", it: "Relazionale" },
  "chatAI.score.commercial": { fr: "Commercial", en: "Commercial", es: "Comercial", "pt-BR": "Comercial", de: "Kommerziell", it: "Commerciale" },
  "chatAI.score.intent": { fr: "Intention", en: "Intent", es: "Intención", "pt-BR": "Intenção", de: "Absicht", it: "Intento" },

  // ─── Empty States ───────────────────────────────────────────
  "chatAI.empty.noConversations": { fr: "Aucune conversation", en: "No conversations", es: "Sin conversaciones", "pt-BR": "Nenhuma conversa", de: "Keine Konversationen", it: "Nessuna conversazione" },
  "chatAI.empty.noConversationsDesc": { fr: "Lance le seed demo pour peupler la base avec des données de test, ou connecte un vrai compte créateur.", en: "Run the seed demo to populate the database with test data, or connect a real creator account.", es: "Ejecuta la demo seed para poblar la base con datos de prueba, o conecta una cuenta de creador real.", "pt-BR": "Execute o seed demo para preencher o banco com dados de teste, ou conecte uma conta de criador real.", de: "Führe den Seed-Demo aus, um die Datenbank mit Testdaten zu füllen, oder verbinde ein echtes Creator-Konto.", it: "Esegui il seed demo per popolare il database con dati di test, o connetti un account creatore reale." },
  "chatAI.empty.noFans": { fr: "Aucun fan trouvé", en: "No fans found", es: "No se encontraron fans", "pt-BR": "Nenhum fã encontrado", de: "Keine Fans gefunden", it: "Nessun fan trovato" },
  "chatAI.empty.noFansDesc": { fr: "Aucun fan ne correspond aux filtres sélectionnés.", en: "No fans match the selected filters.", es: "Ningún fan coincide con los filtros seleccionados.", "pt-BR": "Nenhum fã corresponde aos filtros selecionados.", de: "Keine Fans entsprechen den ausgewählten Filtern.", it: "Nessun fan corrisponde ai filtri selezionati." },
  "chatAI.empty.seedAction": { fr: "Lancer le seed demo", en: "Run seed demo", es: "Ejecutar seed demo", "pt-BR": "Executar seed demo", de: "Seed-Demo ausführen", it: "Esegui seed demo" },

  // ─── Navigation ─────────────────────────────────────────────
  "chatAI.nav.back": { fr: "Retour", en: "Back", es: "Volver", "pt-BR": "Voltar", de: "Zurück", it: "Indietro" },

  // ─── Pause Button ───────────────────────────────────────────
  "chatAI.pause.confirm": { fr: "Confirmer la pause ?", en: "Confirm pause?", es: "¿Confirmar pausa?", "pt-BR": "Confirmar pausa?", de: "Pause bestätigen?", it: "Confermare pausa?" },
  "chatAI.pause.yes": { fr: "Oui, pauser", en: "Yes, pause", es: "Sí, pausar", "pt-BR": "Sim, pausar", de: "Ja, pausieren", it: "Sì, pausa" },
  "chatAI.pause.cancel": { fr: "Annuler", en: "Cancel", es: "Cancelar", "pt-BR": "Cancelar", de: "Abbrechen", it: "Annulla" },
  "chatAI.pause.reactivate": { fr: "Réactiver", en: "Reactivate", es: "Reactivar", "pt-BR": "Reativar", de: "Reaktivieren", it: "Riattiva" },
  "chatAI.pause.button": { fr: "Pause urgence", en: "Emergency pause", es: "Pausa emergencia", "pt-BR": "Pausa emergência", de: "Notfallpause", it: "Pausa emergenza" },

  // ─── Activity Feed ──────────────────────────────────────────
  "chatAI.activity.title": { fr: "Activité récente", en: "Recent Activity", es: "Actividad reciente", "pt-BR": "Atividade recente", de: "Letzte Aktivität", it: "Attività recente" },
  "chatAI.activity.empty": { fr: "Aucune activité", en: "No activity", es: "Sin actividad", "pt-BR": "Nenhuma atividade", de: "Keine Aktivität", it: "Nessuna attività" },
  "chatAI.activity.loading": { fr: "Chargement...", en: "Loading...", es: "Cargando...", "pt-BR": "Carregando...", de: "Laden...", it: "Caricamento..." },

  // ─── Action Labels (for audit feed) ─────────────────────────
  "chatAI.audit.ai_draft_generated": { fr: "Brouillon généré", en: "Draft generated", es: "Borrador generado", "pt-BR": "Rascunho gerado", de: "Entwurf erstellt", it: "Bozza generata" },
  "chatAI.audit.ai_draft_approved": { fr: "Brouillon approuvé", en: "Draft approved", es: "Borrador aprobado", "pt-BR": "Rascunho aprovado", de: "Entwurf genehmigt", it: "Bozza approvata" },
  "chatAI.audit.ai_draft_copied": { fr: "Brouillon copié", en: "Draft copied", es: "Borrador copiado", "pt-BR": "Rascunho copiado", de: "Entwurf kopiert", it: "Bozza copiata" },
  "chatAI.audit.ai_draft_blocked": { fr: "Brouillon bloqué", en: "Draft blocked", es: "Borrador bloqueado", "pt-BR": "Rascunho bloqueado", de: "Entwurf blockiert", it: "Bozza bloccata" },
  "chatAI.audit.compliance_block_triggered": { fr: "Conformité : bloqué", en: "Compliance: blocked", es: "Conformidad: bloqueado", "pt-BR": "Conformidade: bloqueado", de: "Compliance: blockiert", it: "Conformità: bloccato" },
  "chatAI.audit.compliance_scan_passed": { fr: "Conformité : OK", en: "Compliance: OK", es: "Conformidad: OK", "pt-BR": "Conformidade: OK", de: "Compliance: OK", it: "Conformità: OK" },
  "chatAI.audit.ppv_recommendation_created": { fr: "PPV créé", en: "PPV created", es: "PPV creado", "pt-BR": "PPV criado", de: "PPV erstellt", it: "PPV creato" },
  "chatAI.audit.module_activated": { fr: "Module activé", en: "Module activated", es: "Módulo activado", "pt-BR": "Módulo ativado", de: "Modul aktiviert", it: "Modulo attivato" },
  "chatAI.audit.consent_checklist_completed": { fr: "Consentement validé", en: "Consent validated", es: "Consentimiento validado", "pt-BR": "Consentimento validado", de: "Einwilligung validiert", it: "Consenso convalidato" },
};
