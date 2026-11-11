import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, View } from "react-native";

import BottomSheet from "@/components/common/BottomSheet";
import { Text } from "@/components/ui/text";
import { COLORS } from "@/constants/theme";

import { useDriverAccessChecklist } from "../hooks/useDriverAccessChecklist";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AccessRestrictedSheet({ visible, onClose }: Props) {
  const { items } = useDriverAccessChecklist();
  const pendingFixRef = useRef<(() => void) | null>(null);

  function handleRowPress(fix: () => void) {
    pendingFixRef.current = fix;
    onClose();
  }

  function handleClosed() {
    pendingFixRef.current?.();
    pendingFixRef.current = null;
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} onClosed={handleClosed}>
      <View className="items-center gap-2 px-4 pt-4">
        <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-alert-50">
          <Ionicons name="warning" size={28} color={COLORS.alert[600]} />
        </View>
        <Text className="text-center text-xl font-bold text-foreground">
          Доступ к заказам ограничен
        </Text>
        <Text className="text-center text-sm text-muted-foreground">
          Выполните пункты ниже, чтобы получать заказы
        </Text>
      </View>

      <View className="gap-3 px-4 pb-6 pt-5">
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={
              item.blocked ? () => handleRowPress(item.fix) : undefined
            }
            disabled={!item.blocked}
            className="flex-row items-center gap-3 rounded-2xl border border-border bg-muted p-4"
          >
            <Ionicons
              name={item.blocked ? "close-circle" : "checkmark-circle"}
              size={24}
              color={item.blocked ? COLORS.alert[700] : COLORS.brand[600]}
            />
            <Text className="flex-1 text-sm text-foreground">{item.label}</Text>
            {item.blocked && (
              <Ionicons name="chevron-forward" size={20} color="#737373" />
            )}
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
