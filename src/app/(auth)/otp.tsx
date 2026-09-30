import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSendOtp, useVerifyOtp } from "@/features/auth/hooks";

export default function OtpScreen() {
  const { phone, needsTelegramLink, telegramBotUsername } =
    useLocalSearchParams<{
      phone: string;
      needsTelegramLink?: string;
      telegramBotUsername?: string;
    }>();
  const router = useRouter();
  const [code, setCode] = useState("");

  const showTelegramLink = needsTelegramLink === "true" && !!telegramBotUsername;

  const verifyOtp = useVerifyOtp();
  const resendOtp = useSendOtp();

  const isNewUser =
    axios.isAxiosError(verifyOtp.error) &&
    verifyOtp.error.response?.status === 422;

  function handleSubmit() {
    verifyOtp.mutate(
      { phone, code },
      {
        onSuccess: (authUser) => {
          router.replace(
            authUser.role === "DRIVER" ? "/(driver)/home" : "/(client)/home",
          );
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.status === 422) {
            router.push({
              pathname: "/(onboarding)/register",
              params: { phone, code },
            });
          }
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
          <Heading size="2xl">Введите код</Heading>
          <Text className="text-muted-foreground">
            Мы отправили код подтверждения на {phone}
          </Text>
        </VStack>

        <VStack className="gap-4">
          {showTelegramLink && (
            <View className="gap-2 rounded-2xl border border-border bg-muted p-4">
              <Text className="font-semibold">
                {`Откройте @${telegramBotUsername} в Telegram`}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Поделитесь номером телефона в боте — код придёт туда, введите
                его здесь
              </Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://t.me/${telegramBotUsername}`)
                }
                className="items-center rounded-xl bg-lime-400 py-2.5"
              >
                <Text className="font-semibold text-lime-950">
                  Открыть Telegram
                </Text>
              </Pressable>
            </View>
          )}

          <AppInput
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />

          {verifyOtp.isError && !isNewUser && (
            <Text className="text-destructive">
              {"Неверный или просроченный код"}
            </Text>
          )}

          <AppButton
            onPress={handleSubmit}
            isDisabled={verifyOtp.isPending || !code}
            isLoading={verifyOtp.isPending}
          >
            Подтвердить
          </AppButton>

          {/* <Text className="text-right">
            {"Не пришёл код? "}
            <Text
              className="text-brand-700 underline"
              onPress={() => resendOtp.mutate({ phone })}
            >
              Отправить ещё раз
            </Text>
          </Text> */}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
