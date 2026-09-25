import cn from "clsx";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";

import { useDriverStatus } from "../hooks/useDriverStatus";
import { useUpdateDriverStatus } from "../hooks/useUpdateDriverStatus";

const TRACK_WIDTH = 190;
const TRACK_HEIGHT = 31;
const PILL_WIDTH = 100;
// border-2 (2px) + px-0.5 (2px) on each side of the track.
const TRACK_INSET = 8;
const PILL_TRAVEL = TRACK_WIDTH - PILL_WIDTH - TRACK_INSET;

export function OnlineToggle() {
  const driverStatus = useDriverStatus();
  const updateStatus = useUpdateDriverStatus();
  const isOnline = driverStatus.data?.driver.isOnline ?? false;

  const handleToggle = () => {
    updateStatus.mutate(!isOnline);
  };

  const pillStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(isOnline ? PILL_TRAVEL : 0, { duration: 150 }) },
    ],
  }));

  return (
    <View className="items-center gap-2">
      <Pressable
        onPress={handleToggle}
        disabled={updateStatus.isPending || driverStatus.isLoading}
        className={cn(
          "justify-center rounded-full border-2 px-0.5",
          isOnline ? "border-brand-400" : "border-destructive",
        )}
        style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
      >
        <Animated.View
          style={[{ width: PILL_WIDTH }, pillStyle]}
          className={
            isOnline
              ? "items-center rounded-full border-2 border-brand-400 bg-brand-400"
              : "items-center rounded-full border-2 border-destructive bg-destructive "
          }
        >
          <Text
            className={
              isOnline
                ? "font-semibold text-brand-950"
                : "font-semibold text-white"
            }
          >
            {updateStatus.isPending
              ? "Загрузка..."
              : isOnline
                ? "На линии"
                : "Не в сети"}
          </Text>
        </Animated.View>
      </Pressable>

      {updateStatus.isError && (
        <Text className="text-center text-xs text-destructive">
          {updateStatus.error.message}
        </Text>
      )}
    </View>
  );
}
