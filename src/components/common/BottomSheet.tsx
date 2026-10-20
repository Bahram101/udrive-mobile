import { ReactNode, useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const ANIMATION_DURATION = 220;

const SHEET_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 16,
};

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({
  visible,
  onClose,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);
  const translateY = useSharedValue(visible ? 0 : SCREEN_HEIGHT);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setMounted(true);
  }

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: ANIMATION_DURATION });
    } else if (mounted) {
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
  }, [visible, mounted, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/30" onPress={onClose} />

        <Animated.View
          style={[SHEET_SHADOW, sheetStyle, { paddingBottom: insets.bottom }]}
          className="rounded-t-3xl bg-background"
        >
          <View className="items-center pt-3">
            <View className="h-1 w-10 rounded-full bg-border" />
          </View>

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
