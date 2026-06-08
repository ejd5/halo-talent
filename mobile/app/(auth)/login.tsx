import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { colors, fonts } from "../../lib/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      Alert.alert(
        "Erreur",
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message
      );
    } else {
      router.replace("/(tabs)");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>à votre espace créateur</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="vous@email.com"
              placeholderTextColor={colors.taupe + "80"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={colors.taupe + "80"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            style={[styles.button, (loading || !email.trim() || !password.trim()) && styles.buttonDisabled]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? "Connexion..." : "Continuer"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pas encore membre ?{" "}
            <Text
              style={styles.footerLink}
              onPress={() => Alert.alert("Candidature", "Rendez-vous sur halotalent.com/apply")}
            >
              Postuler à la maison
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontFamily: fonts.displayItalic,
    fontSize: 48,
    color: colors.ivory,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.taupe,
    fontSize: 16,
  },
  form: {
    gap: 32,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.taupe,
    marginBottom: 8,
    marginLeft: 1,
  },
  input: {
    color: colors.ivory,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.white20,
    paddingBottom: 12,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.black,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    color: colors.taupe,
    fontSize: 14,
  },
  footerLink: {
    color: colors.gold,
  },
});
