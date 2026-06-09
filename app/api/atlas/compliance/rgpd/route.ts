import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { action, fan_id } = body;

    if (action === "export") {
      // Export all data for a fan (RGPD Art. 15)
      if (!fan_id) return NextResponse.json({ error: "fan_id requis" }, { status: 400 });

      const { data: fan } = await supabase
        .from("atlas_fans")
        .select("*")
        .eq("id", fan_id)
        .eq("creator_id", user.id)
        .maybeSingle();

      const { data: consents } = await supabase
        .from("atlas_consent_registry")
        .select("*")
        .eq("fan_id", fan_id)
        .eq("creator_id", user.id);

      const { data: interactions } = await supabase
        .from("atlas_interactions")
        .select("*")
        .eq("fan_id", fan_id)
        .eq("creator_id", user.id)
        .limit(500);

      const exportData = {
        exported_at: new Date().toISOString(),
        fan,
        consents,
        interactions,
      };

      return NextResponse.json({ success: true, data: exportData });
    }

    if (action === "delete") {
      // Anonymize a fan (RGPD Art. 17)
      if (!fan_id) return NextResponse.json({ error: "fan_id requis" }, { status: 400 });

      const { error } = await supabase
        .from("atlas_fans")
        .update({
          display_name: "Anonymisé",
          email: null,
          phone: null,
          username_onlyfans: null,
          username_instagram: null,
          username_tiktok: null,
          avatar_url: null,
          country: null,
          total_spent: 0,
          lifetime_value: 0,
          status: "deleted",
        })
        .eq("id", fan_id)
        .eq("creator_id", user.id);

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      // Log the deletion for audit
      await supabase.from("atlas_compliance_audit").insert({
        creator_id: user.id,
        event_type: "fan.deleted",
        entity_type: "fan",
        entity_id: fan_id,
        description: "Fan anonymized per GDPR Art. 17 request",
      });

      return NextResponse.json({ success: true });
    }

    if (action === "generate_privacy") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const template = `# Politique de Confidentialité

Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}

## Responsable du traitement
${profile?.full_name ?? "Le créateur"} agit en tant que responsable du traitement des données personnelles de ses fans.

## Données collectées
- Nom, email, numéro de téléphone (avec consentement)
- Données de navigation et d'interaction
- Historique d'achat et de communication

## Base légale
- Consentement explicite (Art. 6.1.a RGPD)
- Exécution contractuelle (Art. 6.1.b)
- Intérêt légitime (Art. 6.1.f)

## Destinataires
- Resend (email)
- Twilio (SMS)
- Claude API (IA)
- Aucun transfert hors UE

## Durée de conservation
- Données actives : durée de la relation
- Logs d'audit : 7 ans
- Drafts IA : 90 jours

## Vos droits
- Accès (Art. 15), Rectification (Art. 16), Effacement (Art. 17)
- Opposition (Art. 21), Portabilité (Art. 20)
- Retrait du consentement à tout moment`.trim();

      return NextResponse.json({ success: true, template });
    }

    if (action === "generate_dpa") {
      const template = `# Data Processing Agreement (DPA)

Between: Creator (Controller) and Atlas Platform (Processor)

## 1. Subject Matter
Processing of fan personal data for marketing automation.

## 2. Duration
Duration of the Agreement plus 7 years for audit logs.

## 3. Nature and Purpose
Email marketing, SMS marketing, push notifications, AI-assisted content generation.

## 4. Categories of Data Subjects
Fans and subscribers of the Creator.

## 5. Obligations of the Processor
- Process only on documented instructions
- Ensure confidentiality of personnel
- Implement appropriate security measures
- Assist the Controller with GDPR compliance
- Delete or return data after termination

## 6. Sub-processors
- Resend (email delivery)
- Twilio (SMS delivery)
- Anthropic/Claude (AI processing)

## 7. Data Breach Notification
Processor shall notify Controller within 48 hours of becoming aware of a breach.`;

      return NextResponse.json({ success: true, template });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err) {
    console.error("[COMPLIANCE RGPD] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
