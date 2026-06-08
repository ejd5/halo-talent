import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { colors, fonts } from "../../lib/theme";
import { LogOut, ChevronRight, FileText, Bell, Globe, HelpCircle } from "lucide-react-native";

type Profile = { display_name: string | null; full_name: string | null; email: string; avatar_url: string | null; role: string; department: string | null };
type Account = { platform: string; username: string | null; followers: number };

const menuItems = [
  { icon: FileText, label: "Mes contrats" },
  { icon: Bell, label: "Notifications" },
  { icon: Globe, label: "Langue", value: "Français" },
  { icon: HelpCircle, label: "Contacter le support" },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [pRes, aRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("creator_accounts").select("platform, username, followers").eq("creator_id", user.id),
      ]);
      if (pRes.data) setProfile({ ...pRes.data, email: user.email || "" });
      if (aRes.data) setAccounts(aRes.data);
      setLoading(false);
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: async () => { await supabase.auth.signOut(); router.replace("/(auth)/login"); } },
    ]);
  };

  if (loading) return <View style={s.centered}><ActivityIndicator color={colors.gold} /></View>;

  const initials = (profile?.display_name || profile?.full_name || "U").split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <View style={s.profileCard}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
        <Text style={s.name}>{profile?.display_name || profile?.full_name}</Text>
        <Text style={s.email}>{profile?.email}</Text>
        {profile?.department && <View style={s.badge}><Text style={s.badgeText}>{profile.department}</Text></View>}
      </View>

      {accounts.length > 0 && (
        <View style={s.platformSection}>
          <Text style={s.sectionTitle}>Mes plateformes</Text>
          {accounts.map((a) => (
            <View key={a.platform} style={s.platformRow}>
              <View><Text style={s.platformName}>{a.platform}</Text><Text style={s.platformUser}>{a.username || "Non connecté"}</Text></View>
              <Text style={s.platformFol}>{a.followers?.toLocaleString()} followers</Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.menuSection}>
        {menuItems.map(({ icon: Icon, label, value }, i) => (
          <TouchableOpacity key={i} style={s.menuRow}>
            <View style={s.menuLeft}><Icon size={16} color={colors.taupe} /><Text style={s.menuLabel}>{label}</Text></View>
            <View style={s.menuRight}>{value && <Text style={s.menuValue}>{value}</Text>}<ChevronRight size={14} color={colors.taupe} /></View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout} style={s.logoutBtn}>
        <LogOut size={14} color={colors.alert} />
        <Text style={s.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: colors.black, alignItems: "center", justifyContent: "center" },
  profileCard: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.gold + "1A", borderWidth: 1, borderColor: colors.gold + "33", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  avatarText: { color: colors.gold, fontSize: 24, fontFamily: fonts.displayItalic },
  name: { fontFamily: fonts.displayItalic, fontSize: 22, color: colors.ivory },
  email: { color: colors.taupe, fontSize: 14, marginTop: 2 },
  badge: { borderWidth: 1, borderColor: colors.gold + "4D", backgroundColor: colors.gold + "0D", paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  badgeText: { color: colors.gold, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 },
  platformSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: colors.taupe, marginBottom: 12 },
  platformRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: colors.white05, padding: 14, marginBottom: 8 },
  platformName: { color: colors.ivory, fontSize: 14, fontWeight: "500" },
  platformUser: { color: colors.taupe, fontSize: 12, marginTop: 2 },
  platformFol: { color: colors.gold, fontSize: 12 },
  menuSection: { marginBottom: 32 },
  menuRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.03)" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuLabel: { color: colors.ivory, fontSize: 14 },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuValue: { color: colors.taupe, fontSize: 12 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderWidth: 1, borderColor: colors.alert + "4D" },
  logoutText: { color: colors.alert, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5 },
});
