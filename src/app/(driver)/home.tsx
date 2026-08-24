import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Text } from "@/components/ui/text";
import { OnlineToggle } from "@/features/driver/components/OnlineToggle";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useNewOrders } from "@/features/orders/hooks/useNewOrders";

export default function DriverOrderFeedScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const newOrders = useNewOrders(isOnline);
  const orders = newOrders.data ?? [];

  return (
    <ScreenLayout
      topBarCenter={<OnlineToggle isOnline={isOnline} onChange={setIsOnline} />}
      topBarRight={
        <Pressable hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color="#0a0a0a" />
        </Pressable>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="-mx-4 flex-1 px-4 "
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
    </ScreenLayout>
  );
}
