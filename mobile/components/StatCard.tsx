import { View, Text } from "react-native";

type StatCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  positive?: boolean;
};

export function StatCard({ label, value, subtitle, trend, positive }: StatCardProps) {
  return (
    <View className="border border-white/5 p-4">
      <Text className="text-[11px] uppercase tracking-[0.15em] text-brand-taupe mb-1.5">
        {label}
      </Text>
      <Text className="font-display-italic text-xl text-brand-ivory mb-0.5">
        {value}
      </Text>
      <View className="flex-row items-center gap-1.5">
        {subtitle && <Text className="text-brand-taupe text-[11px]">{subtitle}</Text>}
        {trend && (
          <Text className={`text-[11px] ${positive ? "text-brand-success" : "text-brand-alert"}`}>
            {trend}
          </Text>
        )}
      </View>
    </View>
  );
}
