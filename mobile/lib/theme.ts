import { StyleSheet } from "react-native";

export const colors = {
  black: "#0A0908",
  espresso: "#1A1611",
  gold: "#D4AF37",
  goldLight: "#E8D4A8",
  ivory: "#F5F1E8",
  taupe: "#9B958A",
  success: "#7A9A65",
  alert: "#C44536",
  white05: "rgba(255,255,255,0.05)",
  white10: "rgba(255,255,255,0.1)",
  white20: "rgba(255,255,255,0.2)",
} as const;

export const fonts = {
  display: "CormorantGaramond_400Regular",
  displayItalic: "CormorantGaramond_400Regular_Italic",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  mono: "JetBrainsMono_400Regular",
} as const;

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gutter: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
