import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ClientOrderMap } from "@/features/orders/components/ClientOrderMap";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { OrderNotice } from "@/features/orders/components/OrderNotice";
import { useCancelClientOrder } from "@/features/orders/hooks/useCancelClientOrder";
import { useCurrentClientOrder } from "@/features/orders/hooks/useCurrentClientOrder";
import { useAuth } from "@/providers/AuthProvider";

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
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

  return (
    <ScreenLayout>
      <VStack className="flex-1 gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>

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
          <VStack className="mt-2 flex-1 gap-3">
            <OrderCard order={currentOrder.data} />

            <ClientOrderMap order={currentOrder.data} />

            <VStack className="flex-1" />

            {cancelOrder.isError && (
              <Text className="text-center text-destructive">
                {cancelOrder.error.message}
              </Text>
            )}

            <Pressable
              onPress={handleCancel}
              disabled={cancelOrder.isPending}
              style={{ marginBottom: 12 + insets.bottom }}
              className="items-center rounded-2xl border-[1.5px] border-destructive py-3"
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
