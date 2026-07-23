import { useLocalSearchParams, useRouter } from "expo-router";

import AppButton from "@/components/common/AppButton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type SelectableRole = "CLIENT" | "DRIVER";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();

  function selectRole(role: SelectableRole) {
    router.push({
      pathname: "/(onboarding)/register",
      params: { role, phone },
    });
  }

  return (
    <VStack className="flex-1 justify-center gap-10 px-6">
      <VStack className="gap-2">
        {/* <Heading size="2xl">В качестве кого вы продолжите?</Heading> */}
        <Text className="text-typography-500 text-center text-lg">
          {"Выберите вашу роль для регистрации"}
        </Text>
      </VStack>

      <VStack className="gap-4">
        <AppButton onPress={() => selectRole("CLIENT")}>Клиент</AppButton>
        <AppButton onPress={() => selectRole("DRIVER")}>Водитель</AppButton>
      </VStack>
    </VStack>
  );
}
