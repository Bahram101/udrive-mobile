import AppButton from "@/components/common/AppButton";
import { Text } from "@/components/ui/text";

import { useCompleteOrder } from "../hooks/useCompleteOrder";
import { useMarkOrderArrived } from "../hooks/useMarkOrderArrived";
import { useStartOrder } from "../hooks/useStartOrder";
import type { Order } from "../orders.types";

type DriverOrderStatusActionProps = {
  order: Order;
  onUpdated: () => void;
};

export function DriverOrderStatusAction({
  order,
  onUpdated,
}: DriverOrderStatusActionProps) {
  const markArrived = useMarkOrderArrived();
  const start = useStartOrder();
  const complete = useCompleteOrder();

  if (order.status === "ACCEPTED") {
    return (
      <>
        {markArrived.isError && (
          <Text className="text-center text-destructive">
            {markArrived.error.message}
          </Text>
        )}
        <AppButton
          isLoading={markArrived.isPending}
          onPress={() => markArrived.mutate(order.id, { onSuccess: onUpdated })}
        >
          Я на месте
        </AppButton>
      </>
    );
  }

  if (order.status === "ARRIVED") {
    return (
      <>
        {start.isError && (
          <Text className="text-center text-destructive">
            {start.error.message}
          </Text>
        )}
        <AppButton
          isLoading={start.isPending}
          onPress={() => start.mutate(order.id, { onSuccess: onUpdated })}
        >
          Начать поездку
        </AppButton>
      </>
    );
  }

  if (order.status === "STARTED") {
    return (
      <>
        {complete.isError && (
          <Text className="text-center text-destructive">
            {complete.error.message}
          </Text>
        )}
        <AppButton
          isLoading={complete.isPending}
          onPress={() => complete.mutate(order.id, { onSuccess: onUpdated })}
        >
          Завершить поездку
        </AppButton>
      </>
    );
  }

  return null;
}
