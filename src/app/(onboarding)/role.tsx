import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type SelectableRole = 'CLIENT' | 'DRIVER';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();

  function selectRole(role: SelectableRole) {
    router.push({ pathname: '/(onboarding)/register', params: { role, phone } });
  }

  return (
    <VStack className="flex-1 justify-center gap-10 px-6">
      <VStack className="gap-2">
        <Heading size="2xl">Kim sifatida davom etasiz?</Heading>
        <Text className="text-typography-500">
          {"Ro'yxatdan o'tish uchun rolingizni tanlang"}
        </Text>
      </VStack>

      <VStack className="gap-4">
        <Button size="lg" onPress={() => selectRole('CLIENT')}>
          <ButtonText>Mijoz sifatida</ButtonText>
        </Button>
        <Button size="lg" variant="outline" onPress={() => selectRole('DRIVER')}>
          <ButtonText>Haydovchi sifatida</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
