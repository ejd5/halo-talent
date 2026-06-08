import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [session, setSession] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s ? "authenticated" : "unauthenticated");
    });
  }, []);

  if (session === "loading") {
    return (
      <View className="flex-1 bg-brand-black items-center justify-center">
        <ActivityIndicator color="#D4AF37" />
      </View>
    );
  }

  return session === "authenticated" ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}
