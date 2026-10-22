import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";

const ANIMATION_DURATION = 220;
const OFFSET = -200;

const TOAST_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 16,
};

type ToastProps = {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
};

export default function Toast({
  visible,
  message,
  onHide,
  duration = 2500,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);
  const translateY = useSharedValue(visible ? 0 : OFFSET);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setMounted(true);
  }

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: ANIMATION_DURATION });
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    } else if (mounted) {
      translateY.value = withTiming(
        OFFSET,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
  }, [visible, mounted, duration, onHide, translateY]);

  const toastStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute inset-x-0 top-0 z-50 items-center px-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Animated.View
        style={[TOAST_SHADOW, toastStyle]}
        className="flex-row items-center gap-2 rounded-2xl bg-success-600 px-4 py-3"
      >
        <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
        <Text className="font-semibold text-white">{message}</Text>
      </Animated.View>
    </View>
  );
}
