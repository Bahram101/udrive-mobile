import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginScreen() {
  const { phone: initialPhone } = useLocalSearchParams<{ phone?: string }>();
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone ?? '');

  const login = useLogin();

  const isNotFound = axios.isAxiosError(login.error) && login.error.response?.status === 404;

  function handleSubmit() {
    login.mutate(
      { phone },
      {
        onSuccess: (authUser) => {
          console.log('authUser', JSON.stringify(authUser, null, 2));
          router.replace(authUser.role === 'DRIVER' ? '/(driver)/home' : '/(client)/home');
        },
      },
    );
  }

  return (
    <VStack className="flex-1 justify-center gap-6 px-6">
      <VStack className="gap-2">
        <Heading size="2xl">Kirish</Heading>
        <Text className="text-typography-500">Telefon raqamingizni kiriting</Text>
      </VStack>

      <VStack className="gap-4">
        <Input>
          <InputField
            placeholder="+7XXXXXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </Input>

        {login.isError && !isNotFound && (
          <Text className="text-error-600">{"Xatolik yuz berdi, qayta urinib ko'ring"}</Text>
        )}

        {isNotFound && (
          <VStack className="gap-2">
            <Text className="text-error-600">{"Bu raqam ro'yxatdan o'tmagan"}</Text>
            <Button
              variant="link"
              onPress={() => router.replace({ pathname: '/(onboarding)/role', params: { phone } })}
            >
              <ButtonText>{"Ro'yxatdan o'tish"}</ButtonText>
            </Button>
          </VStack>
        )}

        <Button size="lg" onPress={handleSubmit} isDisabled={login.isPending || !phone}>
          {login.isPending && <ButtonSpinner />}
          <ButtonText>Kirish</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
