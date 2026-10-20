import { Ionicons } from "@expo/vector-icons";
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

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="items-center rounded-t-3xl bg-alert-600 px-4 pb-6 pt-4">
        <Text className="text-center text-xl font-bold text-white">
          Доступ к заказам ограничен
        </Text>
        <Text className="mt-2 text-center text-sm text-white/80">
          Устраните проблемы ниже, чтобы получать заказы
        </Text>
      </View>

      <View className="gap-3 px-4 pb-6 pt-5">
        <Text className="text-xs font-semibold uppercase text-muted-foreground">
          Доступ к заказам
        </Text>

        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={
              item.blocked
                ? () => {
                    onClose();
                    item.fix();
                  }
                : undefined
            }
            disabled={!item.blocked}
            className="flex-row items-center gap-3 rounded-2xl border border-border bg-muted p-4"
          >
            <Ionicons
              name={item.blocked ? "close-circle" : "checkmark-circle"}
              size={24}
              color={item.blocked ? COLORS.alert[700] : COLORS.brand[600]}
            />
            <Text className="flex-1 text-sm text-foreground">
              {item.label}
            </Text>
            {item.blocked && (
              <Ionicons name="chevron-forward" size={20} color="#737373" />
            )}
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
