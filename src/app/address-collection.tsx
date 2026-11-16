import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppInput from "@/components/common/AppInput";
import { OsmAttribution } from "@/components/common/OsmAttribution";
import { Heading } from "@/components/ui/heading";
import Loader from "@/components/ui/Loader";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { COLORS } from "@/constants/theme";
import type { Coordinates } from "@/features/addressCollection/addressCollection.types";
import { useCreateAddress } from "@/features/addressCollection/hooks/useCreateAddress";
import { useCurrentLocation } from "@/features/addressCollection/hooks/useCurrentLocation";

const INITIAL_REGION_DELTA = 0.005;

export default function AddressCollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const [markerCoordinate, setMarkerCoordinate] = useState<Coordinates | null>(
    null,
  );

  const location = useCurrentLocation();
  const createAddress = useCreateAddress();

  const activeCoordinate = markerCoordinate ?? location.coordinate;
  const isValid =
    street.trim().length > 0 &&
    houseNumber.trim().length > 0 &&
    activeCoordinate !== null &&
    !location.isLoading &&
    !location.error;

  function handleSave() {
    if (!activeCoordinate) return;
    const trimmedStreet = street.trim();
    const trimmedHouseNumber = houseNumber.trim();
    if (!trimmedStreet || !trimmedHouseNumber) return;

    createAddress.mutate(
      {
        street: trimmedStreet,
        houseNumber: trimmedHouseNumber,
        lat: activeCoordinate.latitude,
        lng: activeCoordinate.longitude,
      },
      {
        onSuccess: () => {
          setHouseNumber("");
          setSavedCount((count) => count + 1);
          setMarkerCoordinate(null);
          location.refetch();
        },
      },
    );
  }

  return (
    <View className="flex-1 bg-background">
      <VStack
        className="gap-4 border-b border-border bg-background px-6 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted"
          >
            <Ionicons name="arrow-back" size={24} color="#0a0a0a" />
          </Pressable>

          <Text className="text-sm font-medium text-brand-800">
            Собрано в этой сессии: {savedCount}
          </Text>
        </View>

        <Heading size="2xl">Сбор адресов</Heading>

        <VStack className="gap-3">
          <AppInput
            placeholder="Улица"
            value={street}
            onChangeText={setStreet}
            editable={!createAddress.isPending}
          />

          <AppInput
            placeholder="Номер дома"
            value={houseNumber}
            onChangeText={setHouseNumber}
            editable={!createAddress.isPending}
          />
        </VStack>
      </VStack>

      <View className="flex-1">
        {location.isLoading ? (
          <Loader color={COLORS.brand[600]} />
        ) : location.error ? (
          <VStack className="flex-1 items-center justify-center gap-4 px-6">
            <Text className="text-center text-destructive">
              {location.error}
            </Text>
            <AppButton onPress={location.refetch}>Попробовать снова</AppButton>
          </VStack>
        ) : location.coordinate && activeCoordinate ? (
          <>
            <MapView
              style={StyleSheet.absoluteFill}
              mapType="none"
              showsUserLocation
              initialRegion={{
                ...location.coordinate,
                latitudeDelta: INITIAL_REGION_DELTA,
                longitudeDelta: INITIAL_REGION_DELTA,
              }}
              onPress={(event) =>
                setMarkerCoordinate(event.nativeEvent.coordinate)
              }
            >
              <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
              <Marker
                coordinate={activeCoordinate}
                draggable
                onDragEnd={(event) =>
                  setMarkerCoordinate(event.nativeEvent.coordinate)
                }
                title="Адрес"
                pinColor={COLORS.brand[800]}
              />
            </MapView>
            <OsmAttribution />
          </>
        ) : null}
      </View>

      <VStack
        className="gap-2 border-t border-border bg-background px-6 pt-3"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text className="text-center text-xs text-muted-foreground">
          Нажмите на карту или перетащите метку в нужное место
        </Text>

        {createAddress.isError && (
          <Text className="text-destructive">
            {createAddress.error.message ||
              "Произошла ошибка, попробуйте снова"}
          </Text>
        )}

        <AppButton
          onPress={handleSave}
          isDisabled={!isValid || createAddress.isPending}
          isLoading={createAddress.isPending}
        >
          Сохранить
        </AppButton>
      </VStack>
    </View>
  );
}
