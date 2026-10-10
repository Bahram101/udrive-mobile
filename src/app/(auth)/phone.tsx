import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

import AppButton from "@/components/common/AppButton";
import PhoneInput from "@/components/common/PhoneInput";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSendOtp } from "@/features/auth/hooks";
import { isValidKzPhone, toInternationalPhone } from "@/lib/phone";

export default function PhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const sendOtp = useSendOtp();

  function handleSubmit() {
    const internationalPhone = toInternationalPhone(phone);
    sendOtp.mutate(
      { phone: internationalPhone },
      {
        onSuccess: (response) => {
          router.push({
            pathname: "/(auth)/otp",
            params: {
              phone: internationalPhone,
              needsTelegramLink: String(response.needsTelegramLink),
              telegramBotUsername: response.telegramBotUsername ?? "",
            },
          });
        },
      },
    );
  }

  const isFormValid = isValidKzPhone(phone);

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
          <Heading size="2xl">Вход</Heading>
          <Text className="text-muted-foreground">
            Введите номер телефона — мы пришлём код подтверждения
          </Text>
        </VStack>

        <VStack className="gap-4">
          <PhoneInput value={phone} onChangeText={setPhone} />

          {sendOtp.isError && (
            <Text className="text-destructive">
              {"Произошла ошибка, попробуйте снова"}
            </Text>
          )}

          <AppButton
            onPress={handleSubmit}
            isDisabled={sendOtp.isPending || !isFormValid}
            isLoading={sendOtp.isPending}
          >
            Получить код
          </AppButton>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
