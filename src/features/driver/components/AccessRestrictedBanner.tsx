import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";

type Props = {
  hasBlockers: boolean;
  /** True when the driver literally can't go online (e.g. no background location). */
  hasHardBlockers: boolean;
  onPress: () => void;
};

export function AccessRestrictedBanner({
  hasBlockers,
  hasHardBlockers,
  onPress,
}: Props) {
  if (!hasBlockers) return null;

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mt-3 flex-row items-center justify-between rounded-xl bg-alert-600 px-4 py-3"
    >
      <Text className="flex-1 font-bold text-white">
        {hasHardBlockers
          ? "Нет доступа к заказам"
          : "Доступ к заказам ограничен"}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#ffffff" />
    </Pressable>
  );
}
