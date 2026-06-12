// ─── Seed Chat AI Demo Data — Supabase ──────────────────────
// Usage: npx tsx scripts/seed-chat-ai-demo.ts
// Inserts demo user + full Chat AI dataset into Supabase.
//
// Prerequisites:
//   - SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
//   - Migrations 038 + 039 applied
//   - profiles table must exist (the demo user needs a profile row)
//
// The script creates one demo creator account and seeds all tables
// with coherent, interrelated data so the dev-test page works.

import crypto from "crypto";
import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

// Polyfill WebSocket for Node.js v20 (required by @supabase/realtime-js)
if (!globalThis.WebSocket) {
  (globalThis as Record<string, unknown>).WebSocket = WebSocket;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Demo user ──────────────────────────────────────────────
const DEMO_EMAIL = "demo-creator@halo-talent.com";
const DEMO_PASSWORD = "DemoChatAI2026!";

async function main() {
  console.log("🚀 Seed Chat AI — Démarrage...\n");

  // 1. Get or create demo user
  console.log("1. Création/vérification du compte demo...");
  let userId: string;

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === DEMO_EMAIL);

  if (existing) {
    userId = existing.id;
    console.log(`   ✅ Utilisateur existant: ${userId}`);
  } else {
    const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Créateur Démo", role: "creator" },
    });
    if (userError || !newUser.user) {
      console.error("   ❌ Erreur création utilisateur:", userError);
      process.exit(1);
    }
    userId = newUser.user.id;
    console.log(`   ✅ Utilisateur créé: ${userId}`);
  }

  // 2. Ensure profile row (required for RLS admin policies)
  console.log("\n2. Vérification profil...");
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (!existingProfile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      email: DEMO_EMAIL,
      full_name: "Créateur Démo",
      role: "creator",
    });
    if (profileError) {
      console.log(`   ⚠️ Erreur création profil (peut être OK si profiles diffère): ${profileError.message}`);
    } else {
      console.log("   ✅ Profil créé");
    }
  } else {
    console.log("   ✅ Profil existant");
  }

  // ── ID generators (deterministic UUID v5-like) ──────────
  const toUUID = (seed: string): string => {
    const hash = crypto.createHash("sha256").update(seed).digest("hex").substring(0, 32);
    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
  };
  const fid = (n: number) => toUUID(`${userId}-fan-${String(n).padStart(2, "0")}`);
  const cid = (n: number) => toUUID(`${userId}-conv-${String(n).padStart(2, "0")}`);
  const vid = (n: number) => toUUID(`${userId}-vault-${String(n).padStart(2, "0")}`);
  const mid = (c: number, m: number) => toUUID(`${userId}-msg-${String(c).padStart(2, "0")}-${String(m).padStart(2, "0")}`);

  // ── 3. Fans (40) ─────────────────────────────────────────
  console.log("\n3. Insertion des 40 fans...");

  const fanDefs: Array<Record<string, unknown>> = [
    // Whales (3)
    { n: 1, pseudonym: "Alex.M", status: "whale", country: "FR", language: "fr", ltv: 4820, totalSpend: 5240, spend7d: 340, spend30d: 1280, relationshipScore: 88, commercialScore: 92, churnRisk: 5, intentScore: 85, sentiment: 0.9, notes: "Fan le plus fidèle. Aime les contenus exclusifs photo." },
    { n: 2, pseudonym: "James.W", status: "whale", country: "US", language: "en", ltv: 3150, totalSpend: 3450, spend7d: 150, spend30d: 890, relationshipScore: 75, commercialScore: 88, churnRisk: 12, intentScore: 80, sentiment: 0.7, notes: "Américain, préfère les vidéos." },
    { n: 3, pseudonym: "Rico_Brasil", status: "whale", country: "BR", language: "pt-BR", ltv: 2800, totalSpend: 3100, spend7d: 200, spend30d: 750, relationshipScore: 70, commercialScore: 85, churnRisk: 8, intentScore: 78, sentiment: 0.8 },
    // VIP (8)
    { n: 4, pseudonym: "Luna_Star", status: "vip", country: "FR", language: "fr", ltv: 980, totalSpend: 1100, relationshipScore: 82, commercialScore: 70, churnRisk: 10, intentScore: 72 },
    { n: 5, pseudonym: "ChrisFit", status: "vip", country: "DE", language: "de", ltv: 850, totalSpend: 920, relationshipScore: 65, commercialScore: 68, churnRisk: 15, intentScore: 65 },
    { n: 6, pseudonym: "Emma.B", status: "vip", country: "UK", language: "en", ltv: 720, totalSpend: 800, relationshipScore: 78, commercialScore: 62, churnRisk: 8, intentScore: 70 },
    { n: 7, pseudonym: "Marco94", status: "vip", country: "IT", language: "it", ltv: 680, totalSpend: 750, relationshipScore: 72, commercialScore: 60, churnRisk: 12, intentScore: 68 },
    { n: 8, pseudonym: "Sofia_Lux", status: "vip", country: "ES", language: "es", ltv: 650, totalSpend: 700, relationshipScore: 74, commercialScore: 58, churnRisk: 14, intentScore: 62 },
    { n: 9, pseudonym: "Diamond_D", status: "vip", country: "FR", language: "fr", ltv: 590, totalSpend: 620, relationshipScore: 68, commercialScore: 55, churnRisk: 18, intentScore: 55 },
    { n: 10, pseudonym: "KingKai", status: "vip", country: "DE", language: "de", ltv: 540, totalSpend: 580, relationshipScore: 60, commercialScore: 52, churnRisk: 20, intentScore: 50 },
    { n: 11, pseudonym: "Mia.Paris", status: "vip", country: "FR", language: "fr", ltv: 510, totalSpend: 540, relationshipScore: 71, commercialScore: 50, churnRisk: 10, intentScore: 60 },
    // Active (12)
    { n: 12, pseudonym: "Tommy_G", status: "active", country: "FR", language: "fr", ltv: 280, totalSpend: 320, relationshipScore: 55, commercialScore: 40, churnRisk: 25, intentScore: 45 },
    { n: 13, pseudonym: "Nico_Beast", status: "active", country: "FR", language: "fr", ltv: 240, totalSpend: 260, relationshipScore: 50, commercialScore: 38, churnRisk: 30, intentScore: 40 },
    { n: 14, pseudonym: "Raul_MX", status: "active", country: "MX", language: "es", ltv: 210, totalSpend: 230, relationshipScore: 48, commercialScore: 35, churnRisk: 28, intentScore: 42 },
    { n: 15, pseudonym: "Leo_88", status: "active", country: "IT", language: "it", ltv: 190, totalSpend: 200, relationshipScore: 45, commercialScore: 32, churnRisk: 32, intentScore: 38 },
    { n: 16, pseudonym: "Sam_Sun", status: "active", country: "US", language: "en", ltv: 170, totalSpend: 180, relationshipScore: 42, commercialScore: 30, churnRisk: 35, intentScore: 35 },
    { n: 17, pseudonym: "Jade.Rose", status: "active", country: "FR", language: "fr", ltv: 150, totalSpend: 160, relationshipScore: 40, commercialScore: 28, churnRisk: 38, intentScore: 32 },
    { n: 18, pseudonym: "Benji.Pro", status: "active", country: "DE", language: "de", ltv: 130, totalSpend: 140, relationshipScore: 38, commercialScore: 25, churnRisk: 40, intentScore: 30 },
    { n: 19, pseudonym: "Anna_Bella", status: "active", country: "ES", language: "es", ltv: 120, totalSpend: 130, relationshipScore: 35, commercialScore: 22, churnRisk: 42, intentScore: 28 },
    { n: 20, pseudonym: "Max_Power", status: "active", country: "UK", language: "en", ltv: 110, totalSpend: 115, relationshipScore: 32, commercialScore: 20, churnRisk: 45, intentScore: 25 },
    { n: 21, pseudonym: "Victor_7", status: "active", country: "BR", language: "pt-BR", ltv: 90, totalSpend: 95, relationshipScore: 30, commercialScore: 18, churnRisk: 48, intentScore: 22 },
    { n: 22, pseudonym: "Pierre.D", status: "active", country: "FR", language: "fr", ltv: 80, totalSpend: 85, relationshipScore: 28, commercialScore: 15, churnRisk: 50, intentScore: 20 },
    { n: 23, pseudonym: "Hugo_Boss", status: "active", country: "FR", language: "fr", ltv: 70, totalSpend: 72, relationshipScore: 25, commercialScore: 12, churnRisk: 55, intentScore: 18 },
    // New (6)
    { n: 24, pseudonym: "New_Fan_01", status: "new", country: "FR", language: "fr", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 10, commercialScore: 5, churnRisk: 80, intentScore: 30 },
    { n: 25, pseudonym: "Nuevo_ES", status: "new", country: "ES", language: "es", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 8, commercialScore: 5, churnRisk: 85, intentScore: 25 },
    { n: 26, pseudonym: "Neu_Berlin", status: "new", country: "DE", language: "de", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 12, commercialScore: 8, churnRisk: 75, intentScore: 35 },
    { n: 27, pseudonym: "Newbie_US", status: "new", country: "US", language: "en", ltv: 15, totalSpend: 15, spend7d: 15, spend30d: 15, relationshipScore: 15, commercialScore: 10, churnRisk: 70, intentScore: 40 },
    { n: 28, pseudonym: "Novo_BR", status: "new", country: "BR", language: "pt-BR", ltv: 10, totalSpend: 10, spend7d: 10, spend30d: 10, relationshipScore: 10, commercialScore: 8, churnRisk: 72, intentScore: 32 },
    { n: 29, pseudonym: "Nouveau_IT", status: "new", country: "IT", language: "it", ltv: 0, totalSpend: 0, spend7d: 0, spend30d: 0, relationshipScore: 5, commercialScore: 3, churnRisk: 90, intentScore: 15 },
    // Dormant (6)
    { n: 30, pseudonym: "Sleepy_J", status: "dormant", country: "FR", language: "fr", ltv: 350, totalSpend: 380, spend7d: 0, spend30d: 0, relationshipScore: 30, commercialScore: 25, churnRisk: 85, intentScore: 12, lastMessageAt: "2026-04-15T10:00:00Z" },
    { n: 31, pseudonym: "Ghost_Fan", status: "dormant", country: "US", language: "en", ltv: 420, totalSpend: 450, spend7d: 0, spend30d: 0, relationshipScore: 25, commercialScore: 22, churnRisk: 90, intentScore: 8, lastMessageAt: "2026-03-20T14:00:00Z" },
    { n: 32, pseudonym: "MIA_2025", status: "dormant", country: "DE", language: "de", ltv: 280, totalSpend: 300, spend7d: 0, spend30d: 0, relationshipScore: 20, commercialScore: 18, churnRisk: 88, intentScore: 10, lastMessageAt: "2026-05-01T09:00:00Z" },
    { n: 33, pseudonym: "Old_School", status: "dormant", country: "FR", language: "fr", ltv: 550, totalSpend: 600, spend7d: 0, spend30d: 0, relationshipScore: 35, commercialScore: 28, churnRisk: 82, intentScore: 15, lastMessageAt: "2026-02-10T11:00:00Z" },
    { n: 34, pseudonym: "Inactive_BR", status: "dormant", country: "BR", language: "pt-BR", ltv: 180, totalSpend: 200, spend7d: 0, spend30d: 0, relationshipScore: 18, commercialScore: 15, churnRisk: 92, intentScore: 5, lastMessageAt: "2026-03-01T16:00:00Z" },
    { n: 35, pseudonym: "Silent_ES", status: "dormant", country: "ES", language: "es", ltv: 220, totalSpend: 240, spend7d: 0, spend30d: 0, relationshipScore: 22, commercialScore: 20, churnRisk: 87, intentScore: 8, lastMessageAt: "2026-04-20T12:00:00Z" },
    // Churn Risk (4)
    { n: 36, pseudonym: "Angry_Mike", status: "churn_risk", country: "FR", language: "fr", ltv: 450, totalSpend: 500, spend7d: 0, spend30d: 15, relationshipScore: 18, commercialScore: 20, churnRisk: 95, intentScore: 8, sentiment: -0.6, notes: "Mécontent du dernier contenu. A envoyé un message négatif.", riskFlags: ["negative_sentiment"] },
    { n: 37, pseudonym: "Fading_Fan", status: "churn_risk", country: "US", language: "en", ltv: 380, totalSpend: 400, spend7d: 0, spend30d: 5, relationshipScore: 15, commercialScore: 15, churnRisk: 92, intentScore: 10, sentiment: -0.4 },
    { n: 38, pseudonym: "Price_Watch", status: "churn_risk", country: "DE", language: "de", ltv: 320, totalSpend: 350, spend7d: 0, spend30d: 10, relationshipScore: 20, commercialScore: 18, churnRisk: 88, intentScore: 12, sentiment: -0.3, notes: "S'est plaint des prix." },
    { n: 39, pseudonym: "Leaving_Soon", status: "churn_risk", country: "IT", language: "it", ltv: 290, totalSpend: 310, spend7d: 0, spend30d: 0, relationshipScore: 10, commercialScore: 10, churnRisk: 98, intentScore: 3, sentiment: -0.8, notes: "Plus de réponse aux messages depuis 3 semaines." },
    // Do Not Contact (2) — critical for compliance tests
    { n: 40, pseudonym: "Blocked_User", status: "do_not_contact", country: "FR", language: "fr", ltv: 50, totalSpend: 60, spend7d: 0, spend30d: 0, relationshipScore: 0, commercialScore: 0, churnRisk: 100, intentScore: 0, sentiment: -1, riskFlags: ["do_not_contact", "explicit_request"], notes: "A demandé explicitement à ne plus être contacté." },
    { n: 41, pseudonym: "Vulnerable_Fan", status: "do_not_contact", country: "FR", language: "fr", ltv: 890, totalSpend: 950, spend7d: 0, spend30d: 0, relationshipScore: 5, commercialScore: 0, churnRisk: 100, intentScore: 0, sentiment: -0.9, riskFlags: ["vulnerable_fan", "financial_distress", "blocked_commercial"], notes: "Détection automatique : signaux de détresse financière." },
  ];

  const fans: Array<{ id: string; pseudonym: string; status: string; riskFlags: string[] }> = [];

  for (const f of fanDefs) {
    const fanId = fid(f.n as number);
    const { error } = await supabase.from("chat_ai_fans").upsert({
      id: fanId,
      user_id: userId,
      pseudonym: f.pseudonym,
      platform: "onlyfans",
      country: f.country,
      language: f.language,
      status: f.status,
      ltv: f.ltv,
      total_spend: f.totalSpend,
      spend_7d: f.spend7d || 0,
      spend_30d: f.spend30d || 0,
      sentiment: f.sentiment || 0,
      relationship_score: f.relationshipScore || 50,
      commercial_score: f.commercialScore || 30,
      churn_risk: f.churnRisk || 0,
      intent_score: f.intentScore || 0,
      risk_flags: f.riskFlags || [],
      notes: f.notes || null,
      last_message_at: f.lastMessageAt || null,
      last_purchase_at: null,
    }, { onConflict: "id" });

    if (error) {
      console.error(`   ❌ Fan ${f.pseudonym}: ${error.message}`);
    } else {
      fans.push({ id: fanId, pseudonym: f.pseudonym as string, status: f.status as string, riskFlags: (f.riskFlags || []) as string[] });
    }
  }
  console.log(`   ✅ ${fans.length} fans insérés`);

  // ── 4. Conversations (25) ─────────────────────────────────
  console.log("\n4. Insertion des 25 conversations...");

  const activeFans = fans.filter((f) => f.status !== "do_not_contact");
  const convIds: string[] = [];

  for (let i = 0; i < Math.min(activeFans.length, 25); i++) {
    const f = activeFans[i];
    const convId = cid(i + 1);
    convIds.push(convId);

    const priorityScore = f.status === "whale" ? 95 : f.status === "vip" ? 80 : f.status === "churn_risk" ? 85 : f.status === "dormant" ? 60 : f.status === "new" ? 40 : 50;

    await supabase.from("chat_ai_conversations").upsert({
      id: convId,
      user_id: userId,
      fan_id: f.id,
      platform: "onlyfans",
      priority_score: priorityScore,
      last_message_preview: f.status === "whale" ? "Merci pour le contenu d'hier !" : f.status === "churn_risk" ? "Je ne suis pas sûr de continuer..." : "Salut, comment ça va ?",
      unread: f.status === "whale" ? 2 : f.status === "vip" ? 1 : 0,
      recommended_action: f.status === "dormant" ? "reactivate" : f.status === "churn_risk" ? "retention_offer" : f.status === "whale" ? "ppv_upsell" : "engage",
      status: "open",
    }, { onConflict: "id" });
  }
  console.log(`   ✅ ${convIds.length} conversations insérées`);

  // ── 5. Messages (8-10 per conversation) ──────────────────
  console.log("\n5. Insertion des messages...");

  const msgTemplates: Array<{ dir: string; texts: string[] }> = [
    { dir: "in", texts: ["Salut ! J'adore ton contenu 😍", "Tu proposes quoi comme exclusivité ?", "Merci pour la réponse !", "Je suis intéressé par tes contenus premium"] },
    { dir: "out", texts: ["Merci beaucoup ! Ça me fait très plaisir 🌸", "J'ai un contenu exclusif qui sort cette semaine...", "Tu veux un aperçu ?", "Je te réserve quelque chose de spécial 💫"] },
    { dir: "in", texts: ["Oui je suis intéressé !", "C'est quel prix ?", "OK je prends !", "Super, j'attends ça avec impatience"] },
  ];

  let totalMsgs = 0;
  for (const convId of convIds.slice(0, 8)) {
    const msgCount = 8 + Math.floor(Math.random() * 4); // 8-11 messages
    for (let m = 0; m < msgCount; m++) {
      const tmpl = msgTemplates[m % msgTemplates.length];
      const text = tmpl.texts[m % tmpl.texts.length];
      const { error } = await supabase.from("chat_ai_messages").upsert({
        id: mid(convIds.indexOf(convId) + 1, m + 1),
        conversation_id: convId,
        direction: tmpl.dir,
        text,
        source: tmpl.dir === "in" ? "fan" : "human",
        seq: m + 1,
        created_at: new Date(Date.now() - (msgCount - m) * 3600000).toISOString(),
      }, { onConflict: "id" });
      if (!error) totalMsgs++;
    }
  }
  console.log(`   ✅ ${totalMsgs} messages insérés (8 conversations)`);

  // ── 6. Playbooks (3) ──────────────────────────────────────
  console.log("\n6. Insertion des 3 playbooks...");

  const playbookIds = {
    solo: toUUID(`${userId}-playbook-solo`),
    vip: toUUID(`${userId}-playbook-vip`),
    agency: toUUID(`${userId}-playbook-agency`),
  };

  await supabase.from("chat_ai_playbooks").upsert([
    {
      id: playbookIds.solo, user_id: userId, name: "Solo Standard",
      global_tone: "Chaleureux et complice",
      allowed_words: ["merci", "exclusif", "VIP", "spécial", "surprise", "cœur"],
      forbidden_words: ["explicite", "nu", "tarif", "négocie", "garanti"],
      emoji_policy: "moderate", signature_phrases: ["À très vite 💫", "Ravie de te compter parmi nous 🌸"],
      boundaries: ["Pas de contenu explicite", "Pas de promesse de rencontre"],
      forbidden_topics: ["politique", "religion", "rencontre physique"],
      boldness_level: 3, ppv_min_price: 5, ppv_max_price: 100, is_active: true,
    },
    {
      id: playbookIds.vip, user_id: userId, name: "VIP Premium",
      global_tone: "Premium et exclusif",
      allowed_words: ["privilège", "avant-première", "sur-mesure", "élite"],
      forbidden_words: ["promo", "réduction", "gratuit", "pas cher"],
      emoji_policy: "premium", signature_phrases: ["Avec toute mon attention ✨", "Exclusivement pour vous 💎"],
      boundaries: ["Pas de contenu hors limites créateur", "Prix minimum 15€"],
      forbidden_topics: ["négociation de prix", "contenu gratuit"],
      boldness_level: 4, ppv_min_price: 15, ppv_max_price: 200, is_active: false,
    },
    {
      id: playbookIds.agency, user_id: userId, name: "Agency Safe",
      global_tone: "Professionnel et engageant",
      allowed_words: ["apprécie", "qualité", "professionnel", "sur-mesure"],
      forbidden_words: ["explicite", "garanti", "promis"],
      emoji_policy: "minimal", signature_phrases: ["L'équipe vous remercie", "À votre disposition"],
      boundaries: ["Tout message relu par un superviseur", "Conformité stricte CGU"],
      forbidden_topics: ["rencontre", "échange perso", "promesses de revenus"],
      boldness_level: 2, ppv_min_price: 10, ppv_max_price: 150, is_active: false,
    },
  ], { onConflict: "id" });
  console.log("   ✅ 3 playbooks insérés");

  // ── 7. Vault Assets (20) ──────────────────────────────────
  console.log("\n7. Insertion des 20 vault assets...");

  const vaultDefs = [
    { n: 1, title: "Set Photo Exclusif Été 2026", type: "photo", sensitivity: "standard", price: 19.99 },
    { n: 2, title: "Vidéo Personnalisée Bonjour", type: "video", sensitivity: "standard", price: 29.99 },
    { n: 3, title: "Bundle VIP Mensuel Juin", type: "bundle", sensitivity: "standard", price: 49.99 },
    { n: 4, title: "Audio Exclusif Bonne Nuit", type: "audio", sensitivity: "standard", price: 14.99 },
    { n: 5, title: "Contenu Sensible — Sur Demande", type: "photo", sensitivity: "sensitive", price: 39.99, soldTo: [fid(1)] },
    { n: 6, title: "Set Photo Fitness", type: "photo", sensitivity: "standard", price: 17.99 },
    { n: 7, title: "Vidéo Behind The Scenes", type: "video", sensitivity: "standard", price: 22.99 },
    { n: 8, title: "Photo Exclusive Anniversaire", type: "photo", sensitivity: "standard", price: 15.99 },
    { n: 9, title: "Pack 3 Vidéos Premium", type: "bundle", sensitivity: "standard", price: 59.99 },
    { n: 10, title: "Audio ASMR Personnalisé", type: "audio", sensitivity: "standard", price: 12.99 },
    { n: 11, title: "Photo Cosplay Mai", type: "photo", sensitivity: "standard", price: 21.99 },
    { n: 12, title: "Vidéo Q&A Exclusive", type: "video", sensitivity: "standard", price: 18.99 },
    { n: 13, title: "Set Photo Plage", type: "photo", sensitivity: "standard", price: 25.99, soldTo: [fid(1), fid(2)] },
    { n: 14, title: "Bundle Nouvel An", type: "bundle", sensitivity: "standard", price: 79.99 },
    { n: 15, title: "Photo Exclusive N&B", type: "photo", sensitivity: "standard", price: 16.99 },
    { n: 16, title: "Vidéo Tutoriel Makeup", type: "video", sensitivity: "standard", price: 27.99 },
    { n: 17, title: "Contenu Ultra Premium", type: "bundle", sensitivity: "sensitive", price: 99.99, soldTo: [fid(1), fid(2)] },
    { n: 18, title: "Photo Sportwear", type: "photo", sensitivity: "standard", price: 18.99 },
    { n: 19, title: "Vidéo Voyage Bali", type: "video", sensitivity: "standard", price: 23.99 },
    { n: 20, title: "Audio Message Personnalisé", type: "audio", sensitivity: "standard", price: 9.99 },
  ];

  for (const v of vaultDefs) {
    await supabase.from("chat_ai_vault_assets").upsert({
      id: vid(v.n),
      user_id: userId,
      title: v.title,
      type: v.type,
      sensitivity: v.sensitivity,
      price_history: [{ date: "2026-06-01", price: v.price, soldTo: Math.floor(Math.random() * 15) + 2 }],
      sold_to_fan_ids: v.soldTo || [],
    }, { onConflict: "id" });
  }
  console.log("   ✅ 20 vault assets insérés");

  // ── 8. User Config ────────────────────────────────────────
  console.log("\n8. Configuration utilisateur...");

  await supabase.from("chat_ai_user_config").upsert({
    user_id: userId,
    mode: "copilot_only",
    disclosure: "private_copilot",
    platforms: ["onlyfans"],
    active_playbook_id: playbookIds.solo,
    is_paused: false,
    is_active: true,
    demo_mode: !process.env.DEEPSEEK_API_KEY,
    wizard_step: 12,
    wizard_completed: true,
    cooldown_minutes: 60,
    max_daily_drafts: 50,
    plan: "growth",
  }, { onConflict: "user_id" });
  console.log("   ✅ Config créée (mode: copilot_only, actif, wizard complété)");

  // ── 9. Consent Checklist (validée) ────────────────────────
  console.log("\n9. Checklist de consentement...");

  await supabase.from("chat_ai_consent_checklists").upsert({
    user_id: userId,
    version: 1,
    item_1_authorized: true,
    item_2_platform_rules: true,
    item_3_ia_limitations: true,
    item_4_no_guarantee: true,
    item_5_no_revenue_guarantee: true,
    item_6_human_approval: true,
    item_7_disclosure: true,
    item_8_boundaries: true,
    item_9_audit_logged: true,
    item_10_can_disable: true,
    item_11_legal_info_only: true,
    completed_at: new Date().toISOString(),
  }, { onConflict: "user_id, version" });
  console.log("   ✅ Checklist validée (11/11)");

  // ── 10. PPV Recommendations (12) ──────────────────────────
  console.log("\n10. Insertion des 12 recommandations PPV...");

  const ppvDefs = [
    { n: 1, vault: vid(1), fans: [fid(1)], price: 24.99 },
    { n: 2, vault: vid(3), fans: [fid(2)], price: 49.99 },
    { n: 3, vault: vid(4), fans: [], price: 14.99, alreadySold: [fid(5)] },
    { n: 4, vault: vid(5), fans: [fid(1)], price: 39.99 },
    { n: 5, vault: vid(2), fans: [fid(3)], price: 29.99 },
    { n: 6, vault: vid(9), fans: [], price: 59.99 },
    { n: 7, vault: vid(13), fans: [fid(6)], price: 25.99 },
    { n: 8, vault: vid(7), fans: [], price: 19.99 },
    { n: 9, vault: vid(17), fans: [fid(1)], price: 99.99 },
    { n: 10, vault: vid(20), fans: [], price: 9.99 },
    { n: 11, vault: vid(6), fans: [fid(12)], price: 17.99 },
    { n: 12, vault: vid(19), fans: [], price: 23.99 },
  ];

  for (const p of ppvDefs) {
    await supabase.from("chat_ai_ppv_recommendations").upsert({
      id: toUUID(`${userId}-ppv-${String(p.n).padStart(2, "0")}`),
      user_id: userId,
      vault_asset_id: p.vault,
      target_fan_ids: p.fans,
      recommended_price: p.price,
      min_price: Math.round(p.price * 0.6 * 100) / 100,
      max_price: Math.round(p.price * 1.4 * 100) / 100,
      justification: `Recommandation basée sur l'historique et le statut du fan. Prix dans les limites playbook.`,
      fatigue_risk: p.alreadySold ? "high" : "low",
      already_sold_to: p.alreadySold || [],
      conversion_estimate: "Estimation indicative non garantie",
      status: "draft",
    }, { onConflict: "id" });
  }
  console.log("   ✅ 12 PPV recommendations insérées");

  // ── 11. QA Items (9) ──────────────────────────────────────
  console.log("\n11. Insertion des 9 items QA...");

  const qaDefs = [
    { n: 1, reason: "risky_message", severity: 3, status: "pending" },
    { n: 2, reason: "off_tone", severity: 2, status: "approved" },
    { n: 3, reason: "excessive_pressure", severity: 4, status: "pending" },
    { n: 4, reason: "duplicate_content", severity: 2, status: "false_positive" },
    { n: 5, reason: "vulnerable_fan", severity: 5, status: "blocked" },
    { n: 6, reason: "missing_disclosure", severity: 3, status: "revised" },
    { n: 7, reason: "unauthorized_promise", severity: 5, status: "blocked" },
    { n: 8, reason: "inconsistent_price", severity: 3, status: "escalated" },
    { n: 9, reason: "off_tone", severity: 2, status: "pending" },
  ];

  for (const q of qaDefs) {
    await supabase.from("chat_ai_qa_items").upsert({
      id: toUUID(`${userId}-qa-${String(q.n).padStart(2, "0")}`),
      user_id: userId,
      reason: q.reason,
      severity: q.severity,
      status: q.status,
      notes: `Item QA #${q.n} — ${q.reason}`,
    }, { onConflict: "id" });
  }
  console.log("   ✅ 9 QA items insérés");

  // ── 12. Audit Logs (initiaux) ─────────────────────────────
  console.log("\n12. Insertion des audit logs initiaux...");

  const auditActions = [
    "module_activated", "consent_checklist_completed", "playbook_created",
    "disclosure_mode_selected", "wizard_completed",
  ];

  for (let i = 0; i < auditActions.length; i++) {
    await supabase.from("chat_ai_audit_logs").insert({
      user_id: userId,
      actor_id: userId,
      actor_type: "creator",
      action: auditActions[i],
      target_type: i === 2 ? "playbook" : "chat_ai_config",
      target_id: i === 2 ? playbookIds.solo : null,
      metadata: {},
    });
  }
  console.log(`   ✅ ${auditActions.length} audit logs insérés`);

  // ── Summary ───────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("✅ SEED TERMINÉ");
  console.log("=".repeat(60));
  console.log(`   Compte demo   : ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`   User ID       : ${userId}`);
  console.log(`   Fans          : ${fans.length}`);
  console.log(`   Conversations : ${convIds.length} (${totalMsgs} messages)`);
  console.log(`   Vault assets  : 20`);
  console.log(`   Playbooks     : 3`);
  console.log(`   PPV recos     : 12`);
  console.log(`   QA items      : 9`);
  console.log(`   Audit logs    : ${auditActions.length}`);
  console.log(`   Config        : active, wizard complété`);
  console.log(`   Consentement  : validé (11/11)`);
  console.log(`   Demo mode     : ${process.env.DEEPSEEK_API_KEY ? "NON (DeepSeek actif)" : "OUI (clé absente)"}`);
  console.log("\n   🧪 Cas de test compliance :");
  console.log(`     - Fan do_not_contact   : Blocked_User (${fid(40)})`);
  console.log(`     - Fan vulnerable_fan   : Vulnerable_Fan (${fid(41)})`);
  console.log(`     - Contenu déjà vendu   : vault-5 → Alex.M, vault-17 → Alex.M/James.W`);
  console.log(`     - Consent validé       : OUI (le compte demo a la checklist complète)`);
  console.log("\n   Accès dev-test : /dashboard/chat-ai/dev-test");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("\n❌ Erreur seed:", err);
  process.exit(1);
});
