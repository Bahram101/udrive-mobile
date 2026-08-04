import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

import type { Order } from "../orders.types";

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <View className="flex-row gap-3 border-b border-border py-4">
      <View className="w-16 items-center gap-1">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-lime-100">
          <Ionicons name="person" size={20} color="#3f6212" />
        </View>
        <Text className="text-xs font-medium" numberOfLines={1}>
          {order.passengerName}
        </Text>
        <View className="flex-row items-center gap-0.5">
          <Ionicons name="star" size={10} color="#eab308" />
          <Text className="text-[11px] text-muted-foreground">
            {order.rating.toFixed(1)} ({order.ratingCount})
          </Text>
        </View>
        <Text className="text-[11px] text-muted-foreground">
          {order.etaMinutes} мин.
        </Text>
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-xs text-muted-foreground">
          {order.pricePerKm.toLocaleString("ru-RU")} ₸/km · ~{order.distanceKm}{" "}
          км
        </Text>
        <Text className="text-xl font-bold">
          {order.price.toLocaleString("ru-RU")} ₸
        </Text>

        {order.isFairPrice && (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="chevron-up-circle-outline"
              size={14}
              color="#7e22ce"
            />
            <Text className="text-xs font-semibold text-purple-700">
              Справедливая цена
            </Text>
          </View>
        )}

        <View className="mt-1 gap-0.5">
          <Text className="text-sm font-semibold">{order.pickup}</Text>
          <Text className="text-sm text-muted-foreground">{order.dropoff}</Text>
        </View>

        {order.paymentTag && (
          <View className="mt-1 self-start rounded-md bg-lime-100 px-2 py-1">
            <Text className="text-xs font-semibold text-lime-800">
              {order.paymentTag}
            </Text>
          </View>
        )}
      </View>

      <Pressable hitSlop={8} className="pt-1">
        <Ionicons name="ellipsis-vertical" size={18} color="#a3a3a3" />
      </Pressable>
    </View>
  );
}
