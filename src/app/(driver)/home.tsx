import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Text } from "@/components/ui/text";
import { OnlineToggle } from "@/features/driver/components/OnlineToggle";
import { useDriverStatus } from "@/features/driver/hooks/useDriverStatus";
import { DriverOrderMap } from "@/features/orders/components/DriverOrderMap";
import { DriverOrderStatusAction } from "@/features/orders/components/DriverOrderStatusAction";
import { OrderSheet } from "@/features/orders/components/OrderSheet";
import { useCancelDriverOrder } from "@/features/orders/hooks/useDriverOrderActions";
import { useCurrentDriverOrder } from "@/features/orders/hooks/useCurrentDriverOrder";

export default function DriverOrderFeedScreen() {
  const driverStatus = useDriverStatus();
  const isOnline = driverStatus.data?.driver.isOnline ?? false;
  const currentOrder = useCurrentDriverOrder();
  const cancelOrder = useCancelDriverOrder();

  const handleCancel = () => {
    if (!currentOrder.data) return;

    cancelOrder.mutate(currentOrder.data.id, {
      onSuccess: () => currentOrder.refetch(),
    });
  };

  const settingsButton = (
    <Pressable hitSlop={8}>
      <Ionicons name="settings-outline" size={22} color="#0a0a0a" />
    </Pressable>
  );

  if (currentOrder.data) {
    return (
      <ScreenLayout
        floatingHeader
        topBarCenter={<OnlineToggle />}
        topBarRight={settingsButton}
      >
        <DriverOrderMap order={currentOrder.data} />

        <OrderSheet
          order={currentOrder.data}
          onCancel={handleCancel}
          isCancelling={cancelOrder.isPending}
          cancelErrorMessage={cancelOrder.error?.message}
        >
          <DriverOrderStatusAction
            order={currentOrder.data}
            onUpdated={() => currentOrder.refetch()}
          />
        </OrderSheet>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout topBarCenter={<OnlineToggle />} topBarRight={settingsButton}>
      <View className="flex-1 items-center justify-center gap-2 px-8">
        <Ionicons name="time-outline" size={28} color="#737373" />
        <Text className="text-center text-muted-foreground">
          {!isOnline
            ? "Включите линию, чтобы получать заказ"
            : "Ожидаем заказ…"}
        </Text>
      </View>
    </ScreenLayout>
  );
}
