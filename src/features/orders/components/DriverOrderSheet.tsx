import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

import type { Order } from "../orders.types";
import { DriverOrderStatusAction } from "./DriverOrderStatusAction";
import { OrderCard } from "./OrderCard";

type DriverOrderSheetProps = {
  order: Order;
  onUpdated: () => void;
  onCancel: () => void;
  isCancelling: boolean;
  cancelErrorMessage?: string;
};

export function DriverOrderSheet({
  order,
  onUpdated,
  onCancel,
  isCancelling,
  cancelErrorMessage,
}: DriverOrderSheetProps) {
  const snapPoints = useMemo(() => ["26%", "40%"], []);

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#a3a3a3", width: 40 }}
      backgroundStyle={{ borderRadius: 24 }}
    >
      <BottomSheetView className="flex-1 gap-3 px-4 pb-6">
        <OrderCard order={order} />

        <DriverOrderStatusAction order={order} onUpdated={onUpdated} />

        {cancelErrorMessage && (
          <Text className="text-center text-destructive">
            {cancelErrorMessage}
          </Text>
        )}

        <Pressable
          onPress={onCancel}
          disabled={isCancelling}
          className="items-center rounded-2xl border-[1.5px] border-destructive py-3"
        >
          <Text className="font-semibold text-destructive">
            {isCancelling ? "Отменяем…" : "Отменить заказ"}
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}
