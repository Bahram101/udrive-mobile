import { useState } from "react";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useCreateOrder } from "../hooks/useCreateOrder";
import type { Order } from "../orders.types";

type CreateOrderFormProps = {
  onSuccess?: (order: Order) => void;
};

export function CreateOrderForm({ onSuccess }: CreateOrderFormProps) {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const createOrder = useCreateOrder();

  const isValid = fromAddress.trim().length > 0;

  function handleSubmit() {
    createOrder.mutate(
      {
        fromAddress,
        toAddress: toAddress.trim() ? toAddress : undefined,
      },
      {
        onSuccess: (order) => {
          setFromAddress("");
          setToAddress("");
          onSuccess?.(order);
        },
      },
    );
  }

  return (
    <VStack className="gap-3">
      <AppInput
        placeholder="Ваш адрес"
        value={fromAddress}
        onChangeText={setFromAddress}
        editable={!createOrder.isPending}
      />

      <AppInput
        placeholder="Куда (примерно, необязательно)"
        value={toAddress}
        onChangeText={setToAddress}
        editable={!createOrder.isPending}
      />

      {createOrder.isError && (
        <Text className="text-destructive">
          {createOrder.error.message || "Произошла ошибка, попробуйте снова"}
        </Text>
      )}

      {createOrder.isSuccess && (
        <Text className="text-lime-700">{"Заказ отправлен"}</Text>
      )}

      <AppButton
        onPress={handleSubmit}
        isDisabled={!isValid || createOrder.isPending}
        isLoading={createOrder.isPending}
      >
        Отправить
      </AppButton>
    </VStack>
  );
}
