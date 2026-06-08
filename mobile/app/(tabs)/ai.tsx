import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { colors, fonts } from "../../lib/theme";
import { Send, Bot } from "lucide-react-native";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = ["Comment optimiser mes prix ?", "Quelles tendances ce mois-ci ?", "Analyse mes revenus", "Conseils engagement Instagram"];

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.EXPO_PUBLIC_SITE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      if (res.ok) setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <Bot size={22} color={colors.gold} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Assistant IA</Text>
          <Text style={styles.headerSub}>Conseils et analyses</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.flex1} contentContainerStyle={styles.msgList}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}>
        {messages.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Bot size={28} color={colors.gold} /></View>
            <Text style={styles.emptyText}>Posez une question sur votre stratégie, vos revenus, ou demandez des conseils.</Text>
            <View style={styles.suggestRow}>{suggestions.map((s) => (
              <TouchableOpacity key={s} onPress={() => setInput(s)} style={styles.suggestBtn}>
                <Text style={styles.suggestText}>{s}</Text>
              </TouchableOpacity>
            ))}</View>
          </View>
        )}
        {messages.map((msg, i) => (
          <View key={i} style={[styles.msgRow, msg.role === "user" ? styles.msgUser : styles.msgBot]}>
            <View style={[styles.msgBubble, msg.role === "user" ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={[styles.msgText, msg.role === "user" ? styles.textUser : styles.textBot]}>{msg.content}</Text>
            </View>
          </View>
        ))}
        {loading && <View style={styles.msgBot}><View style={styles.bubbleBot}><ActivityIndicator color={colors.gold} size="small" /></View></View>}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput placeholder="Votre question..." placeholderTextColor={colors.taupe + "80"} value={input}
          onChangeText={setInput} multiline style={styles.textInput} />
        <TouchableOpacity onPress={handleSend} disabled={!input.trim() || loading}>
          <Send size={18} color={!input.trim() || loading ? colors.taupe : colors.gold} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  flex1: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.white05 },
  headerTitle: { fontFamily: fonts.displayItalic, fontSize: 22, color: colors.ivory },
  headerSub: { color: colors.taupe, fontSize: 12 },
  msgList: { padding: 24, paddingBottom: 40 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.gold + "33", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyText: { color: colors.taupe, fontSize: 13, textAlign: "center", maxWidth: 260, marginBottom: 24 },
  suggestRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  suggestBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: colors.white10 },
  suggestText: { fontSize: 12, color: colors.taupe },
  msgRow: { marginBottom: 16 },
  msgUser: { alignItems: "flex-end" },
  msgBot: { alignItems: "flex-start" },
  msgBubble: { maxWidth: "85%", paddingHorizontal: 16, paddingVertical: 12 },
  bubbleUser: { backgroundColor: colors.espresso, borderRadius: 8 },
  bubbleBot: { borderWidth: 1, borderColor: colors.white10, borderRadius: 8 },
  msgText: { fontSize: 14, lineHeight: 20 },
  textUser: { color: colors.ivory },
  textBot: { color: colors.taupe },
  inputBar: { flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderTopColor: colors.white05, paddingHorizontal: 24, paddingVertical: 16 },
  textInput: { flex: 1, color: colors.ivory, fontSize: 16, borderBottomWidth: 1, borderBottomColor: colors.white10, paddingBottom: 8 },
});
