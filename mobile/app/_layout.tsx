import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View, ActivityIndicator } from "react-native";
import { colors } from "../lib/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CormorantGaramond_400Regular: require("../assets/fonts/CormorantGaramond-Regular.ttf"),
          CormorantGaramond_400Regular_Italic: require("../assets/fonts/CormorantGaramond-Italic.ttf"),
          Inter_400Regular: require("../assets/fonts/Inter-Regular.ttf"),
          Inter_500Medium: require("../assets/fonts/Inter-Medium.ttf"),
          Inter_600SemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
          JetBrainsMono_400Regular: require("../assets/fonts/JetBrainsMono-Regular.ttf"),
        });
      } catch {
        // Fallback system fonts
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.black, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}
