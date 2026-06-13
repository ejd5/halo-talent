import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/dashboard/atlas/rules/test, Dry-run test
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { rule, testFanId } = body;

    if (!rule) return NextResponse.json({ error: "Règle requise" }, { status: 400 });

    // Simulate test execution
    const results = {
      trigger_evaluated: true,
      trigger_match: true,
      conditions: [] as { field: string; operator: string; value: any; actual: any; passed: boolean }[],
      actions_to_execute: [] as { type: string; description: string }[],
      all_conditions_passed: false,
      will_execute: false,
    };

    // Evaluate conditions against a test fan if provided
    if (rule.conditions && rule.conditions.length > 0) {
      let testFan: Record<string, any> = {};
      if (testFanId) {
        const { data: fan } = await supabase
          .from("atlas_fans")
          .select("*")
          .eq("id", testFanId)
          .eq("creator_id", user.id)
          .maybeSingle();
        if (fan) testFan = fan;
      } else {
        // Use fake data for demo
        testFan = {
          lifetime_value: 1500,
          fan_tier: "engaged",
          total_spent: 1500,
          purchases_count: 8,
          tags: ["premium", "active"],
          days_since_last_interaction: 15,
        };
      }

      let allPassed = rule.conditions_logic === "any" ? false : true;

      for (const cond of rule.conditions) {
        const actual = testFan[cond.field as keyof typeof testFan];
        let passed = false;
        switch (cond.operator) {
          case "eq": passed = actual == cond.value; break;
          case "neq": passed = actual != cond.value; break;
          case "gt": passed = Number(actual) > Number(cond.value); break;
          case "gte": passed = Number(actual) >= Number(cond.value); break;
          case "lt": passed = Number(actual) < Number(cond.value); break;
          case "lte": passed = Number(actual) <= Number(cond.value); break;
          case "contains": passed = String(actual).includes(String(cond.value)); break;
          default: passed = true;
        }
        results.conditions.push({ field: cond.field, operator: cond.operator, value: cond.value, actual, passed });

        if (rule.conditions_logic === "all") allPassed = allPassed && passed;
        else allPassed = allPassed || passed;
      }

      results.all_conditions_passed = allPassed;
    } else {
      results.all_conditions_passed = true;
    }

    // Preview actions
    if (rule.actions && rule.actions.length > 0) {
      const actionDescriptions: Record<string, string> = {
        update_field: "Modifier champ fan",
        add_tag: "Ajouter tag",
        remove_tag: "Retirer tag",
        change_tier: "Changer tier",
        send_email: "Envoyer email",
        send_sms: "Envoyer SMS",
        send_push: "Envoyer push",
        send_dm: "Envoyer DM",
        create_draft: "Créer draft",
        notify_creator: "Notifier créateur",
        trigger_funnel: "Déclencher funnel",
        http_webhook: "Appel webhook HTTP",
        update_segment: "Mettre à jour segment",
      };
      results.actions_to_execute = rule.actions.map((a: any) => ({
        type: a.type,
        description: actionDescriptions[a.type] ?? a.type,
      }));
    }

    results.will_execute = results.all_conditions_passed;

    return NextResponse.json(results);
  } catch (err) {
    console.error("[ATLAS RULES TEST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
