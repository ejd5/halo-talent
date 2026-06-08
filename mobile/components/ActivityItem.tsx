import { View, Text } from "react-native";
import { TrendingUp, DollarSign, MessageCircle, type LucideIcon } from "lucide-react-native";
import { theme } from "../lib/theme";

const icons: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  "dollar-sign": DollarSign,
  "message-circle": MessageCircle,
};

export function ActivityItem({ icon, title, subtitle, time }: {
  icon: string; title: string; subtitle: string; time: string;
}) {
  const Icon = icons[icon] || TrendingUp;

  return (
    <View className="flex-row items-center py-3.5 border-b border-white/[0.02]">
      <View className="w-8 h-8 rounded-full bg-brand-gold/5 items-center justify-center">
        <Icon size={14} color={theme.colors.gold} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-brand-ivory text-sm">{title}</Text>
        <Text className="text-brand-taupe text-xs mt-0.5">{subtitle}</Text>
      </View>
      <Text className="text-[10px] text-brand-taupe/40 ml-2">{time}</Text>
    </View>
  );
}
