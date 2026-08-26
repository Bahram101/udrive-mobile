import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { OnlineToggle } from "@/features/driver/components/OnlineToggle";
import { useCancelDriverOrder } from "@/features/orders/hooks/useCancelDriverOrder";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useCurrentDriverOrder } from "@/features/orders/hooks/useCurrentDriverOrder";
import { useNewOrders } from "@/features/orders/hooks/useNewOrders";

export default function DriverOrderFeedScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const currentOrder = useCurrentDriverOrder();
  const newOrders = useNewOrders(isOnline && !currentOrder.data);
  const orders = newOrders.data ?? [];
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
            className="items-center rounded-2xl border-[1.5px] border-destructive py-3"
          >
            <Text className="font-semibold text-destructive">
              {cancelOrder.isPending ? "Отменяем…" : "Отменить заказ"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="-mx-4 flex-1 px-4"
          contentContainerStyle={{ gap: 6 }}
          refreshControl={
            <RefreshControl
              refreshing={newOrders.isRefetching}
              onRefresh={() => newOrders.refetch()}
            />
          }
        >
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <View className="items-center pt-12">
              <Text className="text-muted-foreground">
                {!isOnline
                  ? "Включите линию, чтобы видеть заказы"
                  : newOrders.isLoading
                    ? "Загрузка…"
                    : "Новых заказов пока нет"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </ScreenLayout>
  );
}
