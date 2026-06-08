import { View, Text } from "react-native";

type Revenue = {
  month: string;
  gross_revenue: number;
  agency_commission: number;
  net_to_creator: number;
};

export function RevenueChart({ data }: { data: Revenue[] }) {
  if (data.length === 0) {
    return (
      <View className="border border-white/5 p-8 items-center">
        <Text className="text-brand-taupe text-sm">Aucune donnée disponible</Text>
      </View>
    );
  }

  const sorted = [...data].reverse();
  const maxVal = Math.max(...sorted.map((r) => r.gross_revenue), 1);

  const formatMonth = (m: string) => {
    const date = new Date(m);
    return date.toLocaleDateString("fr-FR", { month: "short" });
  };

  return (
    <View className="border border-white/5 p-4">
      <View style={{ height: 200 }} className="flex-row items-end gap-1">
        {sorted.map((r, i) => {
          const grossH = (r.gross_revenue / maxVal) * 180;
          const netH = (r.net_to_creator / maxVal) * 180;
          return (
            <View key={i} className="flex-1 items-center" style={{ height: 200 }}>
              <View className="flex-1 justify-end w-full items-center gap-0.5">
                <View
                  className="w-full rounded-t"
                  style={{
                    height: Math.max(grossH, 2),
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    minHeight: 2,
                  }}
                />
                <View
                  className="w-full rounded-t"
                  style={{
                    height: Math.max(netH, 2),
                    backgroundColor: "#D4AF37",
                    minHeight: 2,
                  }}
                />
              </View>
              <Text className="text-[9px] text-brand-taupe/50 mt-1">{formatMonth(r.month)}</Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View className="flex-row justify-center gap-6 mt-4 pt-3 border-t border-white/5">
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
          <Text className="text-brand-taupe text-[11px]">Net créateur</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }} />
          <Text className="text-brand-taupe text-[11px]">Brut</Text>
        </View>
      </View>
    </View>
  );
}
