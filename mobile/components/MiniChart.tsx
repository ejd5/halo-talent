import { View } from "react-native";

type Revenue = {
  month: string;
  gross_revenue: number;
};

export function MiniChart({ data }: { data: Revenue[] }) {
  if (data.length === 0) {
    return <View className="flex-1 items-center justify-center" />;
  }

  const maxRevenue = Math.max(...data.map((r) => r.gross_revenue), 1);
  const sorted = [...data].reverse();

  return (
    <View className="flex-1 flex-row items-end gap-1" style={{ paddingTop: 8 }}>
      {sorted.map((r, i) => {
        const height = (r.gross_revenue / maxRevenue) * 100;
        return (
          <View
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${Math.max(height, 4)}%`,
              backgroundColor: i === sorted.length - 1 ? "#D4AF37" : "rgba(212, 175, 55, 0.3)",
              minHeight: 4,
            }}
          />
        );
      })}
    </View>
  );
}
