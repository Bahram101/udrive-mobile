import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Text } from "@/components/ui/text";
import { AccessRestrictedBanner } from "@/features/driver/components/AccessRestrictedBanner";
import { AccessRestrictedSheet } from "@/features/driver/components/AccessRestrictedSheet";
import { OnlineToggle } from "@/features/driver/components/OnlineToggle";
import { useDriverAccessChecklist } from "@/features/driver/hooks/useDriverAccessChecklist";
import { useDriverStatus } from "@/features/driver/hooks/useDriverStatus";
import { DriverOrderStatusAction } from "@/features/orders/components/DriverOrderStatusAction";
import { OrderMap } from "@/features/orders/components/OrderMap";
import { OrderSheet } from "@/features/orders/components/OrderSheet";
import { useCurrentOrder } from "@/features/orders/hooks/useCurrentOrder";
import { useCancelDriverOrder } from "@/features/orders/hooks/useDriverOrderActions";

export default function DriverOrderFeedScreen() {
  const driverStatus = useDriverStatus();
  const isOnline = driverStatus.data?.driver.isOnline ?? false;
  const currentOrder = useCurrentOrder("driver");
  const cancelOrder = useCancelDriverOrder();
  const {
    hasBlockers,
    hasHardBlockers,
    isLoading: isChecklistLoading,
  } = useDriverAccessChecklist();
  const showAccessBanner = !isChecklistLoading && hasBlockers;
  const [isAccessSheetOpen, setIsAccessSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  // floating header is position:absolute, doesn't reserve space — offset manually
  const floatingHeaderHeight = insets.top + 60;

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
        {showAccessBanner && (
          <View style={{ marginTop: floatingHeaderHeight }}>
            <AccessRestrictedBanner
              hasBlockers={showAccessBanner}
              hasHardBlockers={hasHardBlockers}
              onPress={() => setIsAccessSheetOpen(true)}
            />
          </View>
        )}
        <OrderMap order={currentOrder.data} role="driver" />

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

        <AccessRestrictedSheet
          visible={isAccessSheetOpen}
          onClose={() => setIsAccessSheetOpen(false)}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout topBarCenter={<OnlineToggle />} topBarRight={settingsButton}>
      <AccessRestrictedBanner
        hasBlockers={showAccessBanner}
        hasHardBlockers={hasHardBlockers}
        onPress={() => setIsAccessSheetOpen(true)}
      />
      <View className="flex-1 items-center justify-center gap-2 px-8">
        <Ionicons name="time-outline" size={28} color="#737373" />
        <Text className="text-center text-muted-foreground">
          {!isOnline
            ? "Включите линию, чтобы получать заказ"
            : "Ожидаем заказ…"}
        </Text>
      </View>

      <AccessRestrictedSheet
        visible={isAccessSheetOpen}
        onClose={() => setIsAccessSheetOpen(false)}
      />
    </ScreenLayout>
  );
}
