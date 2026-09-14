import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";

import cn from "clsx";
import { useDriverStatus } from "../hooks/useDriverStatus";
import { useUpdateDriverStatus } from "../hooks/useUpdateDriverStatus";

const TRACK_HEIGHT = 40;
const PILL_WIDTH = 132;
// border-2 (2px) + px-0.5 (2px) on each side of the track.
const TRACK_INSET = 8;

export function OnlineToggle() {
  const driverStatus = useDriverStatus();
  const updateStatus = useUpdateDriverStatus();
  const isOnline = driverStatus.data?.driver.isOnline ?? false;

  const handleToggle = () => {
    updateStatus.mutate(!isOnline);
  };

  const trackWidth = useSharedValue(0);

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  const pillStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          isOnline
            ? Math.max(trackWidth.value - PILL_WIDTH - TRACK_INSET, 0)
            : 0,
          { duration: 220 },
        ),
      },
    ],
  }));

  return (
    <View className="w-full gap-2">
      <View
        className={cn(
          "w-full justify-center rounded-full border-2 px-0.5",
          isOnline ? "border-brand-400" : "border-destructive",
        )}
        style={{ height: TRACK_HEIGHT }}
        onLayout={handleTrackLayout}
      >
        <Animated.View
          style={[
            {
              width: PILL_WIDTH,
              position: "absolute",
              top: 0,
              bottom: 0,
              justifyContent: "center",
            },
            pillStyle,
          ]}
        >
          <Pressable
            onPress={handleToggle}
            disabled={updateStatus.isPending || driverStatus.isLoading}
            className={cn(
              "",
              isOnline
                ? "items-center rounded-full border-2 border-brand-400 bg-brand-400 py-1"
                : "items-center rounded-full border-2 border-destructive py-1",
            )}
          >
            <Text
              className={
                isOnline
                  ? "font-semibold text-brand-950"
                  : "font-semibold text-destructive"
              }
            >
              {updateStatus.isPending
                ? "…"
                : isOnline
                  ? "На линии"
                  : "Не в сети"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {updateStatus.isError && (
        <Text className="text-center text-xs text-destructive">
          {updateStatus.error.message}
        </Text>
      )}
    </View>
  );
}
