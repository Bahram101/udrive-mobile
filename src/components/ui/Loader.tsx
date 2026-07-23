import { ActivityIndicator } from "react-native";
import { VStack } from "./vstack";

type Props = {
  color?: string;
};

const Loader = ({ color }: Props) => {
  return (
    <VStack className="flex-1 items-center justify-center">
      <ActivityIndicator color={color} />
    </VStack>
  );
};

export default Loader;
