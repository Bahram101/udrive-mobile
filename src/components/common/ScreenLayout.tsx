import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
};

const ScreenLayout = ({ children }: Props) => {
  return <View className="flex-1 gap-6 px-6 pt-12">{children}</View>;
};

export default ScreenLayout;
