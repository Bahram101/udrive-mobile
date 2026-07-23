import { useRouter } from 'expo-router';

import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuth } from '@/providers/AuthProvider';

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => router.replace('/(auth)/login'),
    });
  }

  return (
    <VStack className="flex-1 justify-center gap-6 px-6">
      <VStack className="gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-typography-500">{user?.phone}</Text>
      </VStack>

      <Button variant="outline" onPress={handleLogout} isDisabled={logout.isPending}>
        <ButtonText>Выйти</ButtonText>
      </Button>
    </VStack>
  );
}
