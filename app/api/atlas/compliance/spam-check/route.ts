import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SPAM_TRIGGERS = [
  { word: "gratuit", score: 15 },
  { word: "free", score: 15 },
  { word: "cliquez ici", score: 10 },
  { word: "click here", score: 10 },
  { word: "offre limitée", score: 20 },
  { word: "limited offer", score: 20 },
  { word: "argent", score: 10 },
  { word: "money", score: 10 },
  { word: "urgent", score: 15 },
  { word: "!!", score: 5 },
  { word: "$$$", score: 10 },
  { word: "garanti", score: 10 },
  { word: "guaranteed", score: 10 },
  { word: "profitez-en", score: 10 },
];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { content, campaign_id, contentType = "email" } = body;

    if (!content) return NextResponse.json({ error: "Contenu requis" }, { status: 400 });

    const lowerContent = content.toLowerCase();
    let score = 0;
    const triggers: { word: string; score: number }[] = [];

    SPAM_TRIGGERS.forEach((t) => {
      if (lowerContent.includes(t.word)) {
        score += t.score;
        triggers.push(t);
      }
    });

    // Check ALL CAPS ratio
    const words = content.split(/\s+/);
    const capsWords = words.filter((w: string) => w.length > 2 && w === w.toUpperCase());
    if (capsWords.length > words.length * 0.2) {
      const capScore = Math.min(20, capsWords.length * 2);
      score += capScore;
      triggers.push({ word: `${capsWords.length} mots en MAJUSCULES`, score: capScore });
    }

    // Check link density
    const linkCount = (content.match(/https?:\/\//g) || []).length;
    if (linkCount > 3) {
      const linkScore = Math.min(15, linkCount * 3);
      score += linkScore;
      triggers.push({ word: `${linkCount} liens externes`, score: linkScore });
    }

    const isBlocked = score >= 60;
    const suggestions: string[] = [];

    if (triggers.some((t) => t.word.toLowerCase().includes("gratuit") || t.word.toLowerCase().includes("free"))) {
      suggestions.push("Remplace 'gratuit' / 'free' par une formulation plus neutre");
    }
    if (triggers.some((t) => t.word.toLowerCase().includes("offre limitée") || t.word.toLowerCase().includes("limited offer"))) {
      suggestions.push("Évite les formules d'urgence trompeuses");
    }
    if (triggers.some((t) => t.word.includes("mots en MAJUSCULES"))) {
      suggestions.push("Réduis le nombre de mots en MAJUSCULES (max 20% du texte)");
    }
    if (linkCount > 3) {
      suggestions.push("Limite le nombre de liens externes à 3 maximum");
    }
    if (score > 40) {
      suggestions.push("Ajoute un lien de désabonnement visible en bas du message");
    }

    // Save check
    await supabase.from("atlas_spam_checks").insert({
      creator_id: user.id,
      campaign_id: campaign_id ?? null,
      content_type: contentType,
      score,
      triggers: triggers,
      suggestions,
      is_blocked: isBlocked,
    });

    return NextResponse.json({
      score: Math.min(100, score),
      is_blocked: isBlocked,
      triggers,
      suggestions,
      status: score < 30 ? "clean" : score < 60 ? "warning" : "blocked",
    });
  } catch (err) {
    console.error("[COMPLIANCE SPAM-CHECK] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
