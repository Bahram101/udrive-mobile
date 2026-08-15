import { RefreshControl, ScrollView, View } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Text } from "@/components/ui/text";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useNewOrders } from "@/features/orders/hooks/useNewOrders";

export default function DriverOrderFeedScreen() {
  const newOrders = useNewOrders();
  const orders = newOrders.data ?? [];

  console.log("isLoading", newOrders.isLoading);

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="-mx-4 flex-1 px-4"
        contentContainerStyle={{ gap: 12 }}
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
              {newOrders.isLoading ? "Загрузка…" : "Новых заказов пока нет"}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
