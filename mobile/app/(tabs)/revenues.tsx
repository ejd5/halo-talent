import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { colors, fonts } from "../../lib/theme";

type Revenue = { month: string; platform: string; gross_revenue: number; agency_commission: number; net_to_creator: number; commission_rate: number };

const filters = ["7j", "30j", "90j", "1 an", "Tout"] as const;

export default function RevenuesScreen() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("30j");

  useEffect(() => {
    supabase.from("monthly_revenues").select("*").order("month", { ascending: false }).limit(12).then(({ data }) => {
      if (data) setRevenues(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <View style={s.centered}><ActivityIndicator color={colors.gold} /></View>;

  const totalGross = revenues.reduce((s, r) => s + r.gross_revenue, 0);
  const totalNet = revenues.reduce((s, r) => s + r.net_to_creator, 0);
  const totalComm = revenues.reduce((s, r) => s + r.agency_commission, 0);

  const byPlatform: Record<string, Revenue[]> = {};
  revenues.forEach((r) => { if (!byPlatform[r.platform]) byPlatform[r.platform] = []; byPlatform[r.platform].push(r); });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <Text style={s.pageTitle}>Revenus</Text>
      <Text style={s.pageSub}>Analyse financière détaillée</Text>

      <View style={s.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity key={f} onPress={() => setActiveFilter(f)}
            style={[s.filterBtn, activeFilter === f && s.filterBtnActive]}>
            <Text style={[s.filterText, activeFilter === f && s.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.summaryGrid}>
        <View style={s.halfCol}><View style={s.summaryCard}><Text style={s.summaryLabel}>Brut total</Text><Text style={s.summaryValue}>{totalGross.toLocaleString()}€</Text></View></View>
        <View style={s.halfCol}><View style={s.summaryCard}><Text style={s.summaryLabel}>Net créateur</Text><Text style={s.summaryValue}>{totalNet.toLocaleString()}€</Text></View></View>
        <View style={s.halfCol}><View style={s.summaryCard}><Text style={s.summaryLabel}>Commission</Text><Text style={[s.summaryValue, { color: colors.gold }]}>{totalComm.toLocaleString()}€</Text></View></View>
        <View style={s.halfCol}><View style={s.summaryCard}><Text style={s.summaryLabel}>Taux</Text><Text style={[s.summaryValue, { color: colors.gold }]}>{totalGross > 0 ? Math.round((totalComm / totalGross) * 100) : 0}%</Text></View></View>
      </View>

      <View style={s.tierCard}>
        <Text style={s.tierLabel}>Palier actuel</Text>
        <Text style={s.tierValue}>Tier 2 — 15%</Text>
        <Text style={s.tierSub}>Prochain palier à 50 000€ de CA mensuel</Text>
      </View>

      {Object.entries(byPlatform).map(([platform, data]) => (
        <TouchableOpacity key={platform} style={s.platformRow}>
          <View><Text style={s.platformName}>{platform}</Text><Text style={s.platformMonths}>{data.length} mois</Text></View>
          <Text style={s.platformTotal}>{data.reduce((s, r) => s + r.gross_revenue, 0).toLocaleString()}€</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: colors.black, alignItems: "center", justifyContent: "center" },
  pageTitle: { fontFamily: fonts.displayItalic, fontSize: 28, color: colors.ivory, marginBottom: 2 },
  pageSub: { color: colors.taupe, fontSize: 14, marginBottom: 24 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: colors.white10 },
  filterBtnActive: { borderColor: colors.gold, backgroundColor: colors.gold + "0D" },
  filterText: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: colors.taupe },
  filterTextActive: { color: colors.gold },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  halfCol: { width: "50%", padding: 6 },
  summaryCard: { borderWidth: 1, borderColor: colors.white05, padding: 16 },
  summaryLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: colors.taupe, marginBottom: 6 },
  summaryValue: { fontFamily: fonts.displayItalic, fontSize: 22, color: colors.ivory },
  tierCard: { marginTop: 24, borderWidth: 1, borderColor: colors.gold + "33", backgroundColor: colors.gold + "0D", padding: 20 },
  tierLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: colors.gold, marginBottom: 6 },
  tierValue: { fontFamily: fonts.displayItalic, fontSize: 20, color: colors.ivory },
  tierSub: { color: colors.taupe, fontSize: 12, marginTop: 4 },
  platformRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: colors.white05, padding: 16, marginTop: 12 },
  platformName: { color: colors.gold, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, fontWeight: "600" },
  platformMonths: { color: colors.taupe, fontSize: 11, marginTop: 2 },
  platformTotal: { fontFamily: fonts.displayItalic, fontSize: 18, color: colors.ivory },
});
