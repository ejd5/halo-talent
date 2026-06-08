import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { colors, fonts } from "../../lib/theme";

type Profile = { display_name: string | null; full_name: string | null };
type Account = { platform: string; followers: number };
type Revenue = { month: string; gross_revenue: number };

export default function DashboardScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [profileRes, accountsRes, revenuesRes] = await Promise.all([
      supabase.from("profiles").select("display_name, full_name").eq("id", user.id).single(),
      supabase.from("creator_accounts").select("platform, followers").eq("creator_id", user.id),
      supabase.from("monthly_revenues").select("month, gross_revenue").eq("creator_id", user.id).order("month", { ascending: false }).limit(12),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (accountsRes.data) setAccounts(accountsRes.data);
    if (revenuesRes.data) setRevenues(revenuesRes.data);
  };

  useEffect(() => { loadData().finally(() => setLoading(false)); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  const firstName = profile?.display_name || profile?.full_name?.split(" ")[0] || "Créateur";
  const totalFollowers = accounts.reduce((sum, a) => sum + (a.followers || 0), 0);
  const totalRevenue = revenues.reduce((sum, r) => sum + r.gross_revenue, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
    >
      <Text style={styles.greeting}>Bonjour, {firstName}</Text>
      <Text style={styles.greetingSub}>Voici votre aperçu du jour</Text>

      {/* Stats grid */}
      <View style={styles.grid}>
        <View style={styles.halfCol}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Revenu du mois</Text>
            <Text style={styles.cardValue}>{revenues[0] ? `${revenues[0].gross_revenue.toLocaleString()}€` : "—"}</Text>
          </View>
        </View>
        <View style={styles.halfCol}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Cumul annuel</Text>
            <Text style={styles.cardValue}>{totalRevenue.toLocaleString()}€</Text>
          </View>
        </View>
        <View style={styles.halfCol}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Abonnés totaux</Text>
            <Text style={styles.cardValue}>{totalFollowers.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.halfCol}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Plateformes</Text>
            <Text style={styles.cardValue}>{accounts.length}</Text>
          </View>
        </View>
      </View>

      {/* Mini chart */}
      <View style={styles.chartBox}>
        <Text style={styles.sectionTitle}>Évolution 30 jours</Text>
        <View style={{ height: 140, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.taupe }}>Graphique à venir</Text>
        </View>
      </View>

      {/* Activity */}
      <View style={{ marginTop: 24, marginBottom: 32 }}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.activityTitle}>Bienvenue sur Halo Talent</Text>
            <Text style={styles.activitySub}>Votre espace est prêt</Text>
          </View>
          <Text style={styles.activityTime}>Maintenant</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  scroll: { padding: 24, paddingTop: 60 },
  centered: { flex: 1, backgroundColor: colors.black, alignItems: "center", justifyContent: "center" },
  greeting: { fontFamily: fonts.displayItalic, fontSize: 28, color: colors.ivory, marginBottom: 2 },
  greetingSub: { color: colors.taupe, fontSize: 14, marginBottom: 32 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  halfCol: { width: "50%", padding: 6 },
  card: { borderWidth: 1, borderColor: colors.white05, padding: 16 },
  cardLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: colors.taupe, marginBottom: 6 },
  cardValue: { fontFamily: fonts.displayItalic, fontSize: 22, color: colors.ivory },
  chartBox: { marginTop: 32 },
  sectionTitle: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: colors.taupe, marginBottom: 12 },
  activityItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.02)" },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  activityTitle: { color: colors.ivory, fontSize: 14 },
  activitySub: { color: colors.taupe, fontSize: 12, marginTop: 1 },
  activityTime: { fontSize: 10, color: colors.taupe + "66", marginLeft: 8 },
});
