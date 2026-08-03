import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGetMe, useLogout } from "@/features/auth/hooks";
import { useAuth } from "@/providers/AuthProvider";

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();
  const getMe = useGetMe();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => router.replace("/(auth)/phone"),
    });
  }

  function handleGetMe() {
    getMe.mutate(undefined, {
      // onSuccess: (me) =>
      //   Alert.alert("Успех", `${me.name} · ${me.phone} · ${me.role}`),
      onError: (error) => Alert.alert("Ошибка", error.message),
    });
  }

  return (
    <ScreenLayout>
      <VStack className="gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>
      </VStack>

      <View className="gap-1.5 rounded-2xl border border-border bg-muted p-4">
        <Text className="font-bold">Заказов пока нет</Text>
        <Text className="text-sm text-muted-foreground">
          Как только появится поездка — вы увидите её здесь.
        </Text>
      </View>

      <AppButton onPress={handleGetMe} isLoading={getMe.isPending}>
        Get me
      </AppButton>
      <AppButton
        variant="outline"
        onPress={handleLogout}
        isDisabled={logout.isPending}
      >
        Выйти
      </AppButton>
    </ScreenLayout>
  );
}
