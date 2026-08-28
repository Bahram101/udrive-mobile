import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

import { useDriverStatus } from "../hooks/useDriverStatus";
import { useUpdateDriverStatus } from "../hooks/useUpdateDriverStatus";

export function OnlineToggle() {
  const driverStatus = useDriverStatus();
  const updateStatus = useUpdateDriverStatus();
  const isOnline = driverStatus.data?.driver.isOnline ?? false;

  const handleToggle = () => {
    updateStatus.mutate(!isOnline);
  };

  return (
    <View className="mt-2 items-center gap-2">
      <Pressable
        onPress={handleToggle}
        disabled={updateStatus.isPending || driverStatus.isLoading}
        className={
          isOnline
            ? "items-center rounded-full border-2 border-lime-400 bg-lime-400 px-6 py-1"
            : "items-center rounded-full border-2 border-destructive px-6 py-1"
        }
      >
        <Text
          className={
            isOnline
              ? "font-semibold text-lime-950"
              : "font-semibold text-destructive"
          }
        >
          {updateStatus.isPending ? "…" : isOnline ? "На линии" : "Не в сети"}
        </Text>
      </Pressable>

      {updateStatus.isError && (
        <Text className="text-center text-xs text-destructive">
          {updateStatus.error.message}
        </Text>
      )}
    </View>
  );
}
