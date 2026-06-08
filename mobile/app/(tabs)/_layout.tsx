import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { Chrome as Home, TrendingUp, Bot, MessageCircle, User } from "lucide-react-native";
import { colors } from "../../lib/theme";

const tabs = [
  { name: "index", title: "Accueil", icon: Home },
  { name: "revenues", title: "Revenus", icon: TrendingUp },
  { name: "ai", title: "Assistant", icon: Bot },
  { name: "messages", title: "Messages", icon: MessageCircle },
  { name: "profile", title: "Profil", icon: User },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.white05,
          borderTopWidth: 1,
          paddingTop: 6,
          height: 85,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.taupe,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_400Regular",
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}
    >
      {tabs.map(({ name, title, icon: Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => <Icon size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
