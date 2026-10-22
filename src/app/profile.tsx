import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import Toast from "@/components/common/Toast";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { UpdateDriverProfilePayload } from "@/features/driver/driver.types";
import { useDriverProfile } from "@/features/driver/hooks/useDriverProfile";
import { useUpdateDriverProfile } from "@/features/driver/hooks/useUpdateDriverProfile";
import { useAuth } from "@/providers/AuthProvider";

const CAR_COLORS = [
  "Белый",
  "Чёрный",
  "Серебристый",
  "Серый",
  "Синий",
  "Красный",
  "Зелёный",
  "Коричневый",
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const hasDriver = Boolean(user?.driver);

  const profile = useDriverProfile(hasDriver);
  const updateProfile = useUpdateDriverProfile();

  const [carBrandDraft, setCarBrand] = useState<string | null>(null);
  const [carModelDraft, setCarModel] = useState<string | null>(null);
  const [carColorDraft, setCarColor] = useState<string | null | undefined>(
    undefined,
  );
  const [emailDraft, setEmail] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const carBrand = carBrandDraft ?? profile.data?.carBrand ?? "";
  const carModel = carModelDraft ?? profile.data?.carModel ?? "";
  const carColor =
    carColorDraft !== undefined
      ? carColorDraft
      : (profile.data?.carColor ?? null);
  const email = emailDraft ?? profile.data?.email ?? user?.email ?? "";

  function handleSubmit() {
    const payload: UpdateDriverProfilePayload = {};
    const initial = profile.data;

    if (hasDriver) {
      const trimmedBrand = carBrand.trim();
      if (trimmedBrand && trimmedBrand !== (initial?.carBrand ?? "")) {
        payload.carBrand = trimmedBrand;
      }

      const trimmedModel = carModel.trim();
      if (trimmedModel && trimmedModel !== (initial?.carModel ?? "")) {
        payload.carModel = trimmedModel;
      }

      if (carColor && carColor !== (initial?.carColor ?? null)) {
        payload.carColor = carColor;
      }
    }

    const trimmedEmail = email.trim();
    const initialEmail = initial?.email ?? user?.email ?? "";
    if (trimmedEmail !== initialEmail) {
      payload.email = trimmedEmail;
    }

    updateProfile.mutate(payload, {
      onSuccess: () => {
        setCarBrand(null);
        setCarModel(null);
        setCarColor(undefined);
        setEmail(null);
        setShowSuccessToast(true);
      },
    });
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 56,
          paddingBottom: 32,
        }}
      >
        <VStack className="gap-6">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted"
          >
            <Ionicons name="arrow-back" size={24} color="#0a0a0a" />
          </Pressable>

          <VStack className="gap-2">
            <Heading size="2xl">Профиль</Heading>
            <Text className="text-muted-foreground">
              {hasDriver
                ? "Данные автомобиля и контактный email"
                : "Контактные данные профиля"}
            </Text>
          </VStack>

          {hasDriver && profile.isLoading ? (
            <Text className="text-muted-foreground">Загрузка...</Text>
          ) : (
            <VStack className="gap-4">
              {updateProfile.isError && (
                <Text className="text-destructive">
                  {updateProfile.error.message}
                </Text>
              )}

              {hasDriver && (
                <>
                  <AppInput
                    placeholder="Марка"
                    value={carBrand}
                    onChangeText={setCarBrand}
                  />

                  <AppInput
                    placeholder="Модель"
                    value={carModel}
                    onChangeText={setCarModel}
                  />

                  <VStack className="gap-2">
                    <Text className="text-muted-foreground">Цвет</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {CAR_COLORS.map((color) => (
                        <AppButton
                          key={color}
                          variant={carColor === color ? "default" : "outline"}
                          onPress={() => setCarColor(color)}
                        >
                          {color}
                        </AppButton>
                      ))}
                    </View>
                  </VStack>
                </>
              )}

              <AppInput
                placeholder="Email (необязательно)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <AppButton
                onPress={handleSubmit}
                isDisabled={updateProfile.isPending}
                isLoading={updateProfile.isPending}
              >
                Сохранить
              </AppButton>
            </VStack>
          )}
        </VStack>
      </ScrollView>

      <Toast
        visible={showSuccessToast}
        message="Профиль успешно сохранён"
        onHide={() => setShowSuccessToast(false)}
      />
    </>
  );
}
