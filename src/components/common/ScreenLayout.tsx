import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SideMenu from "@/components/common/SideMenu";

type Props = {
  children: ReactNode;
  topBarCenter?: ReactNode;
  topBarRight?: ReactNode;
  floatingHeader?: boolean;
};

const ScreenLayout = ({
  children,
  topBarCenter,
  topBarRight,
  floatingHeader = false,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const header = (
    <View
      className={
        floatingHeader
          ? "flex-row items-center justify-between border-b border-border bg-background px-4 pb-3"
          : "flex-row items-center justify-between border-b border-border -mx-4 mb-3 px-4 pb-1 pt-2"
      }
      style={floatingHeader ? { paddingTop: insets.top + 8 } : undefined}
    >
      <Pressable
        onPress={() => setIsMenuOpen(true)}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center rounded-full bg-muted"
      >
        <Ionicons name="menu" size={24} color="#0a0a0a" />
      </Pressable>

      <View className="flex-1 items-center px-2">{topBarCenter}</View>

      <View className="h-10 w-10 items-center justify-center">
        {topBarRight}
      </View>
    </View>
  );

  if (floatingHeader) {
    return (
      <View className="flex-1">
        <View className="absolute inset-x-0 top-0 z-10">{header}</View>

        <View className="flex-1">{children}</View>

        <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </View>
    );
  }

  return (
    <View className="flex-1 pt-14 px-4">
      {header}

      <View className="flex-1 gap-6">{children}</View>

      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </View>
  );
};

export default ScreenLayout;
