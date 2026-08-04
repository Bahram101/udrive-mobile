import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { useAuth } from "@/providers/AuthProvider";

export default function ClientHomeScreen() {
  const { user } = useAuth();
  // const getMe = useGetMe();

  // function handleGetMe() {
  //   getMe.mutate(undefined, {
  //     // onSuccess: (me) =>
  //     //   Alert.alert("Успех", `${me.name} · ${me.phone} · ${me.role}`),
  //     onError: (error) => Alert.alert("Ошибка", error.message),
  //   });
  // }

  return (
    <ScreenLayout>
      <VStack className="gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>
      </VStack>

      <CreateOrderForm />

      {/* <AppButton onPress={handleGetMe} isLoading={getMe.isPending}>
        Get me
      </AppButton> */}
    </ScreenLayout>
  );
}
