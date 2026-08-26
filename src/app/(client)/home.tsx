import { useEffect, useRef, useState } from "react";

import AppButton from "@/components/common/AppButton";
import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useCancelOrder } from "@/features/orders/hooks/useCancelOrder";
import { useCurrentClientOrder } from "@/features/orders/hooks/useCurrentClientOrder";
import { useAuth } from "@/providers/AuthProvider";

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const currentOrder = useCurrentClientOrder();
  const cancelOrder = useCancelOrder();

  const lastOrderId = useRef<string | null>(null);
  const selfCancelled = useRef(false);
  const [driverCancelled, setDriverCancelled] = useState(false);

  useEffect(() => {
    if (currentOrder.data) {
      lastOrderId.current = currentOrder.data.id;
      return;
    }

    if (lastOrderId.current && !selfCancelled.current) {
      setDriverCancelled(true);
    }

    lastOrderId.current = null;
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
      <VStack className="gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>
      </VStack>

      {driverCancelled && (
        <VStack className="gap-2 rounded-2xl border border-destructive bg-destructive/5 p-4">
          <Text className="font-semibold text-destructive">
            Водитель отменил заказ
          </Text>
          <Text className="text-sm text-muted-foreground">
            Не переживайте — можете оформить новый заказ прямо сейчас.
          </Text>
          <AppButton
            variant="outline"
            onPress={() => setDriverCancelled(false)}
          >
            Понятно
          </AppButton>
        </VStack>
      )}

      {currentOrder.data ? (
        <OrderCard
          order={currentOrder.data}
          onCancel={handleCancel}
          isCancelling={cancelOrder.isPending}
        />
      ) : (
        !driverCancelled && (
          <CreateOrderForm onSuccess={() => currentOrder.refetch()} />
        )
      )}

      {cancelOrder.isError && (
        <Text className="text-destructive">{cancelOrder.error.message}</Text>
      )}
    </ScreenLayout>
  );
}
