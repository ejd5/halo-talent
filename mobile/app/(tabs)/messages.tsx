import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { colors, fonts } from "../../lib/theme";
import { MessageCircle, Send, Phone, Image } from "lucide-react-native";

type Thread = { id: string; name: string; avatar: string; lastMessage: string; time: string; unread: number };

const mockThreads: Thread[] = [
  { id: "1", name: "Sophie Martin", avatar: "SM", lastMessage: "J'ai regardé tes nouveaux chiffres, bravo !", time: "14:32", unread: 2 },
  { id: "2", name: "Thomas Bernard", avatar: "TB", lastMessage: "On peut faire mieux sur TikTok", time: "Hier", unread: 0 },
  { id: "3", name: "Support Halo", avatar: "H", lastMessage: "Ticket #452 résolu", time: "Hier", unread: 0 },
];

export default function MessagesScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  if (selected) {
    const thread = mockThreads.find((t) => t.id === selected);
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.container}>
        <View style={s.chatHeader}>
          <TouchableOpacity onPress={() => setSelected(null)}><Text style={s.backBtn}>Retour</Text></TouchableOpacity>
          <Text style={s.chatName}>{thread?.name}</Text>
          <Phone size={16} color={colors.taupe} />
        </View>
        <ScrollView style={s.flex1} contentContainerStyle={s.chatMsgs}>
          <View style={styles.msgLeft}><View style={styles.msgInLeft}><Text style={styles.msgText}>Bonjour ! Les chiffres du mois sont excellents !</Text></View></View>
          <View style={styles.msgRight}><View style={styles.msgInRight}><Text style={styles.msgText}>Merci Sophie !</Text></View></View>
        </ScrollView>
        <View style={s.chatInputBar}>
          <TouchableOpacity><Image size={20} color={colors.taupe} /></TouchableOpacity>
          <TextInput placeholder="Votre message..." placeholderTextColor={colors.taupe + "80"} value={messageText}
            onChangeText={setMessageText} style={s.chatInput} />
          <TouchableOpacity disabled={!messageText.trim()}>
            <Send size={18} color={messageText.trim() ? colors.gold : colors.taupe} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.pageHeader}>
        <Text style={s.pageTitle}>Messages</Text>
        <Text style={s.pageSub}>Échangez avec votre équipe</Text>
      </View>
      <ScrollView style={s.flex1} contentContainerStyle={s.list}>
        {mockThreads.map((t) => (
          <TouchableOpacity key={t.id} onPress={() => setSelected(t.id)} style={s.threadRow}>
            <View style={s.avatar}><Text style={s.avatarText}>{t.avatar}</Text></View>
            <View style={s.threadContent}>
              <View style={s.threadTop}><Text style={s.threadName}>{t.name}</Text><Text style={s.threadTime}>{t.time}</Text></View>
              <View style={s.threadBottom}>
                <Text style={s.threadMsg} numberOfLines={1}>{t.lastMessage}</Text>
                {t.unread > 0 && <View style={s.unreadBadge}><Text style={s.unreadText}>{t.unread}</Text></View>}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  flex1: { flex: 1 },
  pageHeader: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.white05 },
  pageTitle: { fontFamily: fonts.displayItalic, fontSize: 28, color: colors.ivory, marginBottom: 2 },
  pageSub: { color: colors.taupe, fontSize: 14 },
  list: { paddingHorizontal: 24, paddingTop: 8 },
  chatHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.white05 },
  backBtn: { color: colors.gold, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 },
  chatName: { color: colors.ivory, fontSize: 15, fontWeight: "600" },
  chatMsgs: { padding: 24 },
  chatInputBar: { flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderTopColor: colors.white05, paddingHorizontal: 24, paddingVertical: 16 },
  chatInput: { flex: 1, color: colors.ivory, fontSize: 16, borderBottomWidth: 1, borderBottomColor: colors.white10, paddingBottom: 8 },
  threadRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.03)" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gold + "1A", borderWidth: 1, borderColor: colors.gold + "33", alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.gold, fontSize: 12, fontWeight: "600" },
  threadContent: { flex: 1, marginLeft: 12 },
  threadTop: { flexDirection: "row", justifyContent: "space-between" },
  threadName: { color: colors.ivory, fontSize: 14, fontWeight: "500" },
  threadTime: { color: colors.taupe + "80", fontSize: 10 },
  threadBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  threadMsg: { color: colors.taupe, fontSize: 13, flex: 1, marginRight: 8 },
  unreadBadge: { backgroundColor: colors.gold, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  unreadText: { color: colors.black, fontSize: 10, fontWeight: "bold" },
});

const styles = StyleSheet.create({
  msgLeft: { alignItems: "flex-start", marginBottom: 16 },
  msgRight: { alignItems: "flex-end", marginBottom: 16 },
  msgInLeft: { backgroundColor: colors.espresso, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, maxWidth: "80%" },
  msgInRight: { backgroundColor: colors.gold + "1A", borderWidth: 1, borderColor: colors.gold + "33", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, maxWidth: "80%" },
  msgText: { color: colors.ivory, fontSize: 14 },
});
