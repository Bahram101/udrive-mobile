import { Ionicons } from "@expo/vector-icons";
import { LogOut } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import AppButton from "@/components/common/AppButton";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/providers/AuthProvider";

import { useLogout } from "@/features/auth/hooks/useLogout";
import { useRouter } from "expo-router";
import { MENU_ITEMS } from "./menuItems";

const PANEL_WIDTH = Math.min(Dimensions.get("window").width * 0.82, 320);
const ANIMATION_DURATION = 220;

const PANEL_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 4, height: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 16,
};

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  const [mounted, setMounted] = useState(false);
  const translateX = useSharedValue(-PANEL_WIDTH);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
    } else if (mounted) {
      translateX.value = withTiming(
        -PANEL_WIDTH,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
  }, [visible, mounted, translateX]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!mounted) return null;

  const isDriver = user?.role === "DRIVER";
  const roleSwitchLabel = isDriver ? "Стать клиентом" : "Стать водителем";

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => router.replace("/(auth)/phone"),
    });
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 flex-row">
        <Animated.View
          style={[{ width: PANEL_WIDTH }, PANEL_SHADOW, panelStyle]}
          className="gap-2 bg-background pb-8 pt-16 px-5"
        >
          <Pressable className="mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-full bg-lime-100">
                  <Text className="text-lg font-bold text-lime-800">
                    {user?.name?.[0]?.toUpperCase() ?? "?"}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-base font-bold">{user?.name}</Text>
                {user?.rating != null && (
                  <Text className="text-xs text-muted-foreground">
                    ★ {user.rating.toFixed(1)}
                  </Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#737373" />
          </Pressable>

          <View className="h-px bg-border" />

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                className="flex-row items-center gap-4 py-3.5"
              >
                <Ionicons name={item.icon} size={22} color="#0a0a0a" />
                <Text className="flex-1 text-[15px] font-medium">
                  {item.label}
                </Text>
                {item.badge && (
                  <View className="rounded bg-destructive px-1.5 py-0.5">
                    <Text className="text-[10px] font-bold text-white">
                      {item.badge}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}

            <Pressable
              className="flex-row items-center gap-4 py-3.5"
              onPress={handleLogout}
              disabled={logout.isPending}
            >
              <LogOut />
              <Text className="text-[15px] font-medium text-destructive">
                Выйти
              </Text>
            </Pressable>
          </ScrollView>

          <View className="gap-4 border-t border-border pt-4">
            <AppButton variant="outline">{roleSwitchLabel}</AppButton>
          </View>
        </Animated.View>

        <Pressable className="flex-1 bg-black/30" onPress={onClose} />
      </View>
    </Modal>
  );
}
