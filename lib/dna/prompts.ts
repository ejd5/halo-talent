import type { DNASection } from "./types";

// ─── Voice Profile Prompt ───

export function buildVoiceProfilePrompt(
  section1: Record<string, unknown> | null | undefined,
  section2: Record<string, unknown> | null | undefined,
): string {
  return `Tu es un coach en branding personnel. À partir des réponses suivantes, génère un VOICE PROFILE structuré qu'un autre modèle d'IA pourra utiliser pour imiter parfaitement la voix de ce créateur.

RÉPONSES DU CRÉATEUR — Section Identité :
${JSON.stringify(section1 ?? {}, null, 2)}

RÉPONSES DU CRÉATEUR — Section Voice :
${JSON.stringify(section2 ?? {}, null, 2)}

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après, avec cette structure exacte :
{
  "tone": {
    "formality": <0-100>,
    "humor": <0-100>,
    "mystery": <0-100>,
    "warmth": <0-100>,
    "boldness": <0-100>,
    "luxury": <0-100>
  },
  "vocabulary": {
    "signature_phrases": ["...", "..."],
    "favorite_words": ["...", "..."],
    "banned_words": ["...", "..."],
    "emoji_usage": "never|rare|moderate|frequent",
    "signature_emojis": ["...", "..."],
    "sign_off": "<formule de fin habituelle>"
  },
  "writing_style": {
    "sentence_length": "short|medium|long|varied",
    "punctuation_style": "minimal|standard|expressive",
    "use_of_questions": "rare|moderate|frequent",
    "use_of_exclamations": "rare|moderate|frequent",
    "personal_pronouns": "uses je|uses nous|formal vous|mixed"
  },
  "examples": {
    "greeting": "<exemple de salutation typique>",
    "thank_you": "<exemple de remerciement>",
    "vulnerable_moment": "<exemple de partage d'émotion>",
    "promo_message": "<exemple de promo de contenu>",
    "response_to_compliment": "<exemple de réponse à un compliment>"
  },
  "personality_traits": ["trait1", "trait2", "trait3", "trait4", "trait5", "trait6", "trait7"],
  "energy_level": "calm|moderate|high|intense",
  "communication_dna_summary": "<paragraphe de 4-5 phrases qui résume comment cette personne communique>"
}`;
}

// ─── Style Profile Prompt ───

export function buildStyleProfilePrompt(
  section4: Record<string, unknown> | null | undefined,
  section5: Record<string, unknown> | null | undefined,
): string {
  return `Tu es un directeur artistique spécialisé dans l'identité visuelle des créateurs de contenu. À partir des réponses suivantes, génère un STYLE PROFILE structuré.

RÉPONSES DU CRÉATEUR — Section Esthétique :
${JSON.stringify(section4 ?? {}, null, 2)}

RÉPONSES DU CRÉATEUR — Section Contenu :
${JSON.stringify(section5 ?? {}, null, 2)}

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après, avec cette structure exacte :
{
  "visual_universe": "<description de l'univers visuel global>",
  "dominant_colors": ["#hex", "#hex", "#hex", "#hex", "#hex"],
  "aesthetic_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "photography_style": "<style photo : lifestyle, studio, street, nature, etc.>",
  "editing_vibe": "<ambiance de retouche : naturelle, cinématique, vintage, minimaliste, etc.>",
  "inspiration_sources": ["source1", "source2", "source3"],
  "content_categories": ["catégorie1", "catégorie2", "catégorie3"],
  "signature_elements": ["élément récurrent 1", "élément récurrent 2", "élément récurrent 3"],
  "style_dna_summary": "<paragraphe de 3-4 phrases qui résume l'ADN visuel>"
}`;
}

// ─── Audience Profile Prompt ───

export function buildAudienceProfilePrompt(
  section3: Record<string, unknown> | null | undefined,
): string {
  return `Tu es un analyste d'audience spécialisé dans les communautés de créateurs de contenu. À partir des réponses suivantes, génère un AUDIENCE PROFILE structuré.

RÉPONSES DU CRÉATEUR — Section Audience :
${JSON.stringify(section3 ?? {}, null, 2)}

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après, avec cette structure exacte :
{
  "primary_demographic": {
    "age_range": "<tranche d'âge dominante>",
    "gender_skew": "<répartition genre>",
    "location": "<localisation principale>",
    "language": "<langue principale>"
  },
  "audience_personas": [
    {
      "name": "<nom du persona>",
      "description": "<description>",
      "pain_points": ["point1", "point2"],
      "what_they_love": ["ce qu'ils aiment 1", "ce qu'ils aiment 2"]
    }
  ],
  "engagement_patterns": {
    "best_time_to_post": "<meilleur moment pour poster>",
    "best_content_types": ["type1", "type2", "type3"],
    "comment_style": "<style des commentaires>",
    "community_vibe": "<ambiance générale de la communauté>"
  },
  "audience_dna_summary": "<paragraphe de 3-4 phrases qui résume l'audience>"
}`;
}

// ─── Mock results when API keys missing ───

export function buildMockVoiceProfile() {
  return {
    tone: {
      formality: 40,
      humor: 65,
      mystery: 30,
      warmth: 80,
      boldness: 60,
      luxury: 25,
    },
    vocabulary: {
      signature_phrases: ["Franchement", "Tu savais que", "J'avoue que"],
      favorite_words: ["incroyable", "genial", "super"],
      banned_words: [],
      emoji_usage: "moderate" as const,
      signature_emojis: ["🔥", "✨", "💫"],
      sign_off: "Je t'embrasse",
    },
    writing_style: {
      sentence_length: "varied" as const,
      punctuation_style: "expressive" as const,
      use_of_questions: "frequent" as const,
      use_of_exclamations: "frequent" as const,
      personal_pronouns: "uses je" as const,
    },
    examples: {
      greeting: "Salut tout le monde !",
      thank_you: "Merci du fond du coeur pour votre soutien incroyable ✨",
      vulnerable_moment: "J'avoue que j'ai eu un peu peur avant de publier ça...",
      promo_message: "Nouvelle vidéo dispo ! J'ai tout donné sur celle-ci 🔥",
      response_to_compliment: "Oh merci mille fois ça me touche vraiment !",
    },
    personality_traits: ["Authentique", "Chaleureuse", "Spontanée", "Proche de sa communauté", "Créative", "Optimiste", "Transparente"],
    energy_level: "high" as const,
    communication_dna_summary: "Cette personne communique avec authenticité et chaleur. Elle utilise un langage spontané et direct, ponctué d'expressions familières et de questions à sa communauté. Son ton est enthousiaste et engageant, avec une préférence pour les phrases variées et les points d'exclamation. Elle partage ses vulnérabilités sans filtre, ce qui crée une connexion forte avec son audience.",
  };
}

export function buildMockStyleProfile() {
  return {
    visual_universe: "Univers lumineux et naturel avec des tons chauds",
    dominant_colors: ["#F5E6D3", "#C75B39", "#2A1A0A", "#8FA98B", "#E8D5C4"],
    aesthetic_tags: ["naturel", "lumineux", "authentique", "minimal", "chaleureux"],
    photography_style: "Lifestyle naturel, lumière du jour",
    editing_vibe: "Naturelle avec tons chauds, peu de filtres",
    inspiration_sources: ["Voyages", "Nature", "Architecture moderne"],
    content_categories: ["Daily life", "Coulisses", "Tutoriels", "Routines"],
    signature_elements: ["Lumière dorée", "Plans rapprochés", "Couleurs terreuses"],
    style_dna_summary: "Style visuel authentique privilégiant la lumière naturelle et les tons chauds. Les compositions sont épurées mais chaleureuses, avec une préférence pour les plans rapprochés qui créent de l'intimité avec le spectateur.",
  };
}

export function buildMockAudienceProfile() {
  return {
    primary_demographic: {
      age_range: "18-34",
      gender_skew: "60% femmes, 40% hommes",
      location: "France, Belgique, Suisse",
      language: "Français",
    },
    audience_personas: [
      {
        name: "Jeune créative",
        description: "Femme 22-28 ans, urbaine, intéressée par le développement personnel et la création de contenu",
        pain_points: ["Manque de confiance en soi", "Difficulté à trouver son style"],
        what_they_love: ["L'authenticité", "Les conseils pratiques", "Les coulisses"],
      },
      {
        name: "Curieuse engagée",
        description: "Homme ou femme 25-34 ans, suit pour le contenu de qualité",
        pain_points: ["Trop de contenu superficiel", "Manque de temps"],
        what_they_love: ["Le format long", "Les analyses approfondies", "La transparence"],
      },
    ],
    engagement_patterns: {
      best_time_to_post: "Soirée 18h-21h en semaine",
      best_content_types: ["Stories", "Vlogs", "Tutoriels"],
      comment_style: "Bienveillant et engagé, beaucoup de questions",
      community_vibe: "Communauté soudée et bienveillante, les membres interagissent entre eux",
    },
    audience_dna_summary: "Audience majoritairement féminine, jeune et engagée. La communauté est soudée et bienveillante, avec un fort taux d'interaction. Les followers apprécient particulièrement l'authenticité et les formats longs qui créent une véritable connexion.",
  };
}
