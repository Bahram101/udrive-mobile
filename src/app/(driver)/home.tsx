import { useRouter } from 'expo-router';
import { View } from 'react-native';

import AppButton from '@/components/common/AppButton';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuth } from '@/providers/AuthProvider';

export default function DriverHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => router.replace('/(auth)/login'),
    });
  }

  return (
    <VStack className="flex-1 gap-6 px-6 pt-8">
      <View className="self-start rounded-full bg-lime-100 px-3 py-1.5">
        <Text className="text-xs font-bold uppercase tracking-wide text-lime-800">
          Водитель
        </Text>
      </View>

      <VStack className="gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>
      </VStack>

      <View className="gap-1.5 rounded-2xl border border-border bg-muted p-4">
        <Text className="font-bold">Вы не на линии</Text>
        <Text className="text-sm text-muted-foreground">
          Заказы появятся здесь, когда включите смену.
        </Text>
      </View>

      <AppButton
        variant="outline"
        onPress={handleLogout}
        isDisabled={logout.isPending}
      >
        Выйти
      </AppButton>
    </VStack>
  );
}
