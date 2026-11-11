import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { COLORS } from "@/constants/theme";

import { useCreateOrder } from "../hooks/useCreateOrder";
import type { Order } from "../orders.types";
import {
  DestinationPickerModal,
  type Coordinates,
} from "./DestinationPickerModal";

type CreateOrderFormProps = {
  onSuccess?: (order: Order) => void;
};

export function CreateOrderForm({ onSuccess }: CreateOrderFormProps) {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toCoordinate, setToCoordinate] = useState<Coordinates | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const createOrder = useCreateOrder();

  const isValid = fromAddress.trim().length > 0;

  function handleSubmit() {
    createOrder.mutate(
      {
        fromAddress,
        toAddress: toAddress.trim() ? toAddress : undefined,
        ...(toCoordinate
          ? { toLat: toCoordinate.latitude, toLng: toCoordinate.longitude }
          : {}),
      },
      {
        onSuccess: (order) => {
          setFromAddress("");
          setToAddress("");
          setToCoordinate(null);
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

      {toCoordinate ? (
        <View className="flex-row items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-3 py-2">
          <Pressable
            onPress={() => setIsPickerOpen(true)}
            disabled={createOrder.isPending}
            className="flex-1 flex-row items-center gap-2"
          >
            <Ionicons name="location" size={18} color={COLORS.brand[700]} />
            <Text className="text-sm font-medium text-brand-800">
              Точка на карте выбрана (изменить)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setToCoordinate(null)}
            disabled={createOrder.isPending}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.brand[700]} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setIsPickerOpen(true)}
          disabled={createOrder.isPending}
          hitSlop={4}
          className="flex-row items-center gap-1.5 self-start py-1"
        >
          <Ionicons
            name="location-outline"
            size={18}
            color={COLORS.brand[700]}
          />
          <Text className="text-sm font-medium text-brand-700">
            Указать точку на карте
          </Text>
        </Pressable>
      )}

      {createOrder.isError && (
        <Text className="text-destructive">
          {createOrder.error.message || "Произошла ошибка, попробуйте снова"}
        </Text>
      )}

      {createOrder.isSuccess && (
        <Text className="text-brand-700">{"Заказ отправлен"}</Text>
      )}

      <AppButton
        onPress={handleSubmit}
        isDisabled={!isValid || createOrder.isPending}
        isLoading={createOrder.isPending}
      >
        Заказать такси
      </AppButton>

      <DestinationPickerModal
        visible={isPickerOpen}
        initialCoordinate={toCoordinate}
        onConfirm={(coordinate) => {
          setToCoordinate(coordinate);
          setIsPickerOpen(false);
        }}
        onClose={() => setIsPickerOpen(false)}
      />
    </VStack>
  );
}
