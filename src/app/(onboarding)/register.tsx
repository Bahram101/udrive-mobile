import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { ScrollView } from "react-native";

export default function RegisterScreen() {
  const { role, phone: initialPhone } = useLocalSearchParams<{
    role: "CLIENT" | "DRIVER";
    phone?: string;
  }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(initialPhone ?? "");

  const register = useRegister(role);

  function handleSubmit() {
    register.mutate(
      { name, phone },
      {
        onSuccess: (authUser) => {
          router.replace(
            authUser.role === "DRIVER" ? "/(driver)/home" : "/(client)/home",
          );
        },
        onError: (error) => {
          console.log("Register error:", error);
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
      <VStack className="gap-4">
        <VStack>
          <Heading size="2xl">Регистрация</Heading>
          {/* <Text className="text-muted-foreground">
            Введите ваши данные как {role === "DRIVER" ? "водитель" : "клиент"}
          </Text> */}
        </VStack>

        {register.isError && (
          <Text className="text-destructive">
            {"Произошла ошибка, попробуйте снова"}
          </Text>
        )}

        <VStack className="gap-4">
          <AppInput
            placeholder="Ваше имя"
            value={name}
            onChangeText={setName}
          />

          <AppInput
            placeholder="+7XXXXXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <AppButton
            onPress={handleSubmit}
            isDisabled={register.isPending || !name || !phone}
            isLoading={register.isPending}
          >
            Продолжить
          </AppButton>

          <Text className="text-right">
            {"У вас уже есть аккаунт? "}
            <Text
              className="text-lime-700 underline"
              onPress={() => router.replace({ pathname: "/(auth)/login" })}
            >
              Войти
            </Text>
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
