import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { ScrollView } from "react-native";

export default function LoginScreen() {
  const { phone: initialPhone } = useLocalSearchParams<{ phone?: string }>();
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone ?? "");

  const login = useLogin();

  const isNotFound =
    axios.isAxiosError(login.error) && login.error.response?.status === 404;

  function handleSubmit() {
    login.mutate(
      { phone },
      {
        onSuccess: async (authUser) => {
          router.replace(
            authUser.role === "DRIVER" ? "/(driver)/home" : "/(client)/home",
          );
        },
      },
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <VStack className="flex-1 justify-center gap-4">
        <Heading size="2xl">Вход</Heading>

        <VStack className="gap-4">
          <AppInput
            placeholder="+7XXXXXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {login.isError && !isNotFound && (
            <Text className="text-destructive">
              {"Произошла ошибка, попробуйте снова"}
            </Text>
          )}

          {isNotFound && (
            <VStack className="gap-2">
              <Text className="text-destructive">
                {"Этот номер не зарегистрирован"}
              </Text>
              <AppButton
                variant="link"
                onPress={() =>
                  router.replace({
                    pathname: "/(onboarding)/role",
                    params: { phone },
                  })
                }
              >
                Регистрация
              </AppButton>
            </VStack>
          )}

          <AppButton
            onPress={handleSubmit}
            isDisabled={login.isPending || !phone}
            isLoading={login.isPending}
          >
            Войти
          </AppButton>

          <Text className="text-right">
            {"Еще нет аккаунта? "}
            <Text
              className="text-lime-700 underline"
              onPress={() =>
                router.replace({ pathname: "/(onboarding)/register" })
              }
            >
              Зарегистрироваться
            </Text>
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
