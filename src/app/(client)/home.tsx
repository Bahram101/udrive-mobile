import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useCancelClientOrder } from "@/features/orders/hooks/useCancelClientOrder";
import { useCurrentClientOrder } from "@/features/orders/hooks/useCurrentClientOrder";
import { useAuth } from "@/providers/AuthProvider";

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const currentOrder = useCurrentClientOrder();

  console.log("currentOrder", JSON.stringify(currentOrder, null, 2));
  const cancelOrder = useCancelClientOrder();

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
      <VStack className="flex-1 gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>

        {driverCancelled && (
          <VStack className="mt-2 gap-2 rounded-2xl border border-destructive bg-destructive/5 p-4">
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
          <VStack className="mt-2 flex-1 gap-3">
            <OrderCard order={currentOrder.data} />

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
          !driverCancelled && (
            <CreateOrderForm onSuccess={() => currentOrder.refetch()} />
          )
        )}
      </VStack>
    </ScreenLayout>
  );
}
