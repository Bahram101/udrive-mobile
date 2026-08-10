import { useState } from "react";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useCreateOrder } from "../hooks/useCreateOrder";

export function CreateOrderForm() {
  const [address, setAddress] = useState("");
  const createOrder = useCreateOrder();

  const isValid = address.trim().length > 0;

  function handleSubmit() {
    createOrder.mutate(
      { fromAddress: address },
      {
        onSuccess: () => {
          setAddress("");
        },
      },
    );
  }

  return (
    <VStack className="gap-3">
      <AppInput
        placeholder="Ваш адрес"
        value={address}
        onChangeText={setAddress}
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
