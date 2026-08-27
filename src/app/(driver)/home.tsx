import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { OnlineToggle } from "@/features/driver/components/OnlineToggle";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useCancelDriverOrder } from "@/features/orders/hooks/useCancelDriverOrder";
import { useCurrentDriverOrder } from "@/features/orders/hooks/useCurrentDriverOrder";

export default function DriverOrderFeedScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const currentOrder = useCurrentDriverOrder();
  const cancelOrder = useCancelDriverOrder();

  function handleCancel() {
    if (!currentOrder.data) return;

    cancelOrder.mutate(currentOrder.data.id, {
      onSuccess: () => currentOrder.refetch(),
    });
  }

  return (
    <ScreenLayout
      topBarCenter={<OnlineToggle isOnline={isOnline} onChange={setIsOnline} />}
      topBarRight={
        <Pressable hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color="#0a0a0a" />
        </Pressable>
      }
    >
      {currentOrder.data ? (
        <View className="flex-1 gap-3">
          <Heading size="lg">Ваш заказ</Heading>
          <OrderCard order={currentOrder.data} />

          <View className="items-center gap-2 pt-2">
            <Ionicons name="navigate-outline" size={26} color="#737373" />
            <Text className="text-center text-sm font-semibold">
              Едьте по адресу выше
            </Text>
            <Text className="max-w-52.5 text-center text-xs text-muted-foreground">
              Клиент ждёт вас по указанному адресу. Статус обновится, когда вы
              приедете.
            </Text>
          </View>

          <View className="flex-1" />

          {cancelOrder.isError && (
            <Text className="text-center text-destructive">
              {cancelOrder.error.message}
            </Text>
          )}

          <Pressable
            onPress={handleCancel}
            disabled={cancelOrder.isPending}
            className="items-center rounded-2xl border-[1.5px] border-destructive py-3 mb-3"
          >
            <Text className="font-semibold text-destructive">
              {cancelOrder.isPending ? "Отменяем…" : "Отменить заказ"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Ionicons name="time-outline" size={28} color="#737373" />
          <Text className="text-center text-muted-foreground">
            {!isOnline
              ? "Включите линию, чтобы получать заказ"
              : "Ожидаем заказ…"}
          </Text>
        </View>
      )}
    </ScreenLayout>
  );
}
