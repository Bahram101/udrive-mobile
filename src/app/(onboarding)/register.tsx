import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { SelectableRole } from "@/features/auth/auth.types";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";

export default function RegisterScreen() {
  const { phone, code } = useLocalSearchParams<{
    phone: string;
    code: string;
  }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<SelectableRole | null>(null);

  const register = useVerifyOtp();

  function handleSubmit() {
    console.log("Submitting registration with:", { phone, code, name, role });
    if (!role) return;

    register.mutate(
      { phone, code, name, role },
      {
        onSuccess: (authUser) => {
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
      <VStack className="gap-6">
        <VStack className="gap-2">
          <Heading size="2xl">Расскажите о себе</Heading>
          <Text className="text-muted-foreground">
            Это ваш первый вход — заполните профиль
          </Text>
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

          <VStack className="gap-2">
            <Text className="text-muted-foreground">
              Вы будете использовать uDrive как
            </Text>
            <View className="flex-row gap-3">
              <AppButton
                className="flex-1"
                variant={role === "CLIENT" ? "default" : "outline"}
                onPress={() => setRole("CLIENT")}
              >
                Клиент
              </AppButton>
              <AppButton
                className="flex-1"
                variant={role === "DRIVER" ? "default" : "outline"}
                onPress={() => setRole("DRIVER")}
              >
                Водитель
              </AppButton>
            </View>
          </VStack>

          <AppButton
            onPress={handleSubmit}
            isDisabled={register.isPending || !name || !role}
            isLoading={register.isPending}
          >
            Продолжить
          </AppButton>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
