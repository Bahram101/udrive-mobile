import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";

import SideMenu from "@/components/common/SideMenu";

type Props = {
  children: ReactNode;
};

const ScreenLayout = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <View className="flex-1 gap-6 pt-24 px-4">
      <Pressable
        onPress={() => setIsMenuOpen(true)}
        hitSlop={8}
        className="absolute left-2 top-14 z-10 h-10 w-10 items-center justify-center rounded-full bg-muted"
      >
        <Ionicons name="menu" size={24} color="#0a0a0a" />
      </Pressable>

      {children}

      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </View>
  );
};

export default ScreenLayout;
