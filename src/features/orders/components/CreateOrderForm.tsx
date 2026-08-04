import { useState } from "react";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useCreateOrder } from "../hooks/useCreateOrder";

export function CreateOrderForm() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const createOrder = useCreateOrder();

  const isValid = pickup.trim().length > 0 && dropoff.trim().length > 0;

  function handleSubmit() {
    createOrder.mutate(
      { fromAddress: pickup, toAddress: dropoff },
      {
        onSuccess: () => {
          setPickup("");
          setDropoff("");
        },
      },
    );
  }

  return (
    <VStack className="gap-3">
      <AppInput
        placeholder="Откуда"
        value={pickup}
        onChangeText={setPickup}
        editable={!createOrder.isPending}
      />
      <AppInput
        placeholder="Куда"
        value={dropoff}
        onChangeText={setDropoff}
        editable={!createOrder.isPending}
      />

      {createOrder.isError && (
        <Text className="text-destructive">
          {"Произошла ошибка, попробуйте снова"}
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
