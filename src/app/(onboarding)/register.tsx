import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRegister } from "@/features/auth/hooks/useRegister";

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
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            router.replace({ pathname: "/(auth)/login", params: { phone } });
          }
        },
      },
    );
  }

  const isConflict =
    axios.isAxiosError(register.error) &&
    register.error.response?.status === 409;

  return (
    <VStack className="flex-1 justify-center gap-6 px-6">
      <VStack className="gap-2">
        <Heading size="2xl">Регистрация</Heading>
        <Text className="text-typography-500">
          Введите ваши данные как {role === "DRIVER" ? "водитель" : "клиент"}
        </Text>
      </VStack>

      <VStack className="gap-4">
        <Input>
          <InputField
            placeholder="Ваше имя"
            value={name}
            onChangeText={setName}
          />
        </Input>
        <Input>
          <InputField
            placeholder="+7XXXXXXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </Input>

        {register.isError && !isConflict && (
          <Text className="text-error-600">
            {"Произошла ошибка, попробуйте снова"}
          </Text>
        )}

        <Button
          size="lg"
          onPress={handleSubmit}
          isDisabled={register.isPending || !name || !phone}
        >
          {register.isPending && <ButtonSpinner />}
          <ButtonText>Продолжить</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
