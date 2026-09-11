import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { OrderMap } from "@/features/orders/components/OrderMap";
import { OrderNotice } from "@/features/orders/components/OrderNotice";
import { OrderSheet } from "@/features/orders/components/OrderSheet";
import { useCancelClientOrder } from "@/features/orders/hooks/useCancelClientOrder";
import { useCurrentClientOrder } from "@/features/orders/hooks/useCurrentClientOrder";

export default function ClientHomeScreen() {
  const currentOrder = useCurrentClientOrder();
  const cancelOrder = useCancelClientOrder();

  const lastOrderId = useRef<string | null>(null);
  const lastOrderStatus = useRef<string | null>(null);
  const selfCancelled = useRef(false);
  const [driverCancelled, setDriverCancelled] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);

  useEffect(() => {
    if (currentOrder.data) {
      lastOrderId.current = currentOrder.data.id;
      lastOrderStatus.current = currentOrder.data.status;
      return;
    }

    if (lastOrderId.current && !selfCancelled.current) {
      if (lastOrderStatus.current === "STARTED") {
        setTripCompleted(true);
      } else {
        setDriverCancelled(true);
      }
    }

    lastOrderId.current = null;
    lastOrderStatus.current = null;
    selfCancelled.current = false;
  }, [currentOrder.data]);

  function handleCancel() {
    if (!currentOrder.data) return;

    selfCancelled.current = true;
    cancelOrder.mutate(currentOrder.data.id, {
      onSuccess: () => currentOrder.refetch(),
    });
  }

  if (currentOrder.data?.driverId) {
    return (
      <ScreenLayout
        floatingHeader
        topBarRight={
          <Pressable hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color="#0a0a0a" />
          </Pressable>
        }
      >
        <OrderMap order={currentOrder.data} role="client" />

        <OrderSheet
          order={currentOrder.data}
          onCancel={handleCancel}
          isCancelling={cancelOrder.isPending}
          cancelErrorMessage={cancelOrder.error?.message}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <VStack className="flex-1 gap-2">
        {driverCancelled && (
          <OrderNotice
            tone="destructive"
            title="Водитель отменил заказ"
            description="Не переживайте — можете оформить новый заказ прямо сейчас."
            onDismiss={() => setDriverCancelled(false)}
          />
        )}

        {tripCompleted && (
          <OrderNotice
            tone="success"
            title="Поездка завершена"
            description="Спасибо, что выбрали uDrive!"
            onDismiss={() => setTripCompleted(false)}
          />
        )}

        {currentOrder.data ? (
          <VStack className="mt-2 flex-1 items-center justify-center gap-2">
            <Ionicons name="time-outline" size={28} color="#737373" />
            <Text className="text-center text-muted-foreground">
              Ищем водителя…
            </Text>

            {cancelOrder.isError && (
              <Text className="text-center text-destructive">
                {cancelOrder.error.message}
              </Text>
            )}

            <Pressable
              onPress={handleCancel}
              disabled={cancelOrder.isPending}
              className="mt-4 items-center rounded-2xl border-[1.5px] border-destructive px-6 py-3"
            >
              <Text className="font-semibold text-destructive">
                {cancelOrder.isPending ? "Отменяем…" : "Отменить заказ"}
              </Text>
            </Pressable>
          </VStack>
        ) : (
          !driverCancelled &&
          !tripCompleted && (
            <CreateOrderForm onSuccess={() => currentOrder.refetch()} />
          )
        )}
      </VStack>
    </ScreenLayout>
  );
}
