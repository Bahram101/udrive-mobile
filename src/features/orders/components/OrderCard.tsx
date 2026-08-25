import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

import type { CreatedOrder, OrderStatus } from "../orders.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Ожидает водителя",
  ACCEPTED: "Принят",
  ARRIVED: "Водитель на месте",
  STARTED: "В пути",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
};

const CANCELLABLE_STATUSES: OrderStatus[] = [
  "NEW",
  "ACCEPTED",
  "ARRIVED",
  "STARTED",
];

type OrderCardProps = {
  order: CreatedOrder;
  onCancel?: () => void;
  isCancelling?: boolean;
};

export function OrderCard({ order, onCancel, isCancelling }: OrderCardProps) {
  const canCancel = onCancel && CANCELLABLE_STATUSES.includes(order.status);

  return (
    <View className="gap-3 rounded-2xl border border-border bg-muted p-4">
      <View className="flex-row items-center justify-between">
        <View className="self-start rounded-full bg-lime-100 px-2.5 py-1">
          <Text className="text-xs font-semibold text-lime-800">
            {STATUS_LABELS[order.status]}
          </Text>
        </View>

        {order.price != null && (
          <Text className="text-lg font-bold">
            {order.price.toLocaleString("ru-RU")} ₸
          </Text>
        )}
      </View>

      <View className="gap-2">
        <View className="flex-row items-start gap-2">
          <Ionicons
            name="location"
            size={16}
            color="#3f6212"
            style={{ marginTop: 2 }}
          />
          <Text className="flex-1 text-sm font-semibold">
            {order.fromAddress}
          </Text>
        </View>

        {order.toAddress && (
          <View className="flex-row items-start gap-2">
            <Ionicons
              name="flag-outline"
              size={16}
              color="#737373"
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-sm text-muted-foreground">
              {order.toAddress}
            </Text>
          </View>
        )}
      </View>

      {canCancel && (
        <Pressable
          onPress={onCancel}
          disabled={isCancelling}
          className="items-center rounded-xl border border-destructive py-2.5"
        >
          <Text className="font-semibold text-destructive">
            {isCancelling ? "Отменяем…" : "Отменить заказ"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
