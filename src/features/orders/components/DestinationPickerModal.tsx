import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import Loader from "@/components/ui/Loader";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { COLORS } from "@/constants/theme";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const INITIAL_REGION_DELTA = 0.02;

type DestinationPickerModalProps = {
  visible: boolean;
  initialCoordinate: Coordinates | null;
  onConfirm: (coordinate: Coordinates) => void;
  onClose: () => void;
};

export function DestinationPickerModal({
  visible,
  initialCoordinate,
  onConfirm,
  onClose,
}: DestinationPickerModalProps) {
  const insets = useSafeAreaInsets();
  const [initialCenter, setInitialCenter] = useState<Coordinates | null>(null);
  const [markerCoordinate, setMarkerCoordinate] = useState<Coordinates | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    let canceled = false;

    async function initLocation() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== Location.PermissionStatus.GRANTED) {
          if (!canceled) {
            setErrorMessage(
              "Разрешите доступ к геолокации, чтобы выбрать точку на карте",
            );
            setIsLoading(false);
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (canceled) return;

        const currentCoords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const startCoords = initialCoordinate ?? currentCoords;
        setInitialCenter(startCoords);
        setMarkerCoordinate(startCoords);
        setIsLoading(false);
      } catch {
        if (!canceled) {
          setErrorMessage(
            "Не удалось определить местоположение. Проверьте GPS и попробуйте снова.",
          );
          setIsLoading(false);
        }
      }
    }

    initLocation();

    return () => {
      canceled = true;
    };
  }, [visible, initialCoordinate, retryCount]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <View
          className="flex-row items-center justify-between border-b border-border bg-background px-4 pb-3"
          style={{ paddingTop: insets.top + 8 }}
        >
          <Pressable
            onPress={onClose}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted"
          >
            <Ionicons name="close" size={24} color="#0a0a0a" />
          </Pressable>

          <View className="flex-1 items-center px-2">
            <Text className="text-base font-semibold">Точка назначения</Text>
          </View>

          <View className="h-10 w-10" />
        </View>

        {isLoading ? (
          <Loader color={COLORS.brand[600]} />
        ) : errorMessage ? (
          <VStack className="flex-1 items-center justify-center gap-4 px-6">
            <Text className="text-center text-destructive">{errorMessage}</Text>
            <AppButton onPress={() => setRetryCount((count) => count + 1)}>
              Попробовать снова
            </AppButton>
          </VStack>
        ) : initialCenter && markerCoordinate ? (
          <View className="flex-1">
            <View className="flex-1">
              <MapView
                style={StyleSheet.absoluteFill}
                provider={
                  Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                showsUserLocation
                initialRegion={{
                  ...initialCenter,
                  latitudeDelta: INITIAL_REGION_DELTA,
                  longitudeDelta: INITIAL_REGION_DELTA,
                }}
                onPress={(event) =>
                  setMarkerCoordinate(event.nativeEvent.coordinate)
                }
              >
                <Marker
                  coordinate={markerCoordinate}
                  draggable
                  onDragEnd={(event) =>
                    setMarkerCoordinate(event.nativeEvent.coordinate)
                  }
                  title="Куда"
                  pinColor={COLORS.brand[800]}
                />
              </MapView>
            </View>

            <VStack
              className="gap-2 border-t border-border bg-background px-4 pt-3"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <Text className="text-center text-xs text-muted-foreground">
                Нажмите на карту или перетащите метку в нужное место
              </Text>
              <AppButton onPress={() => onConfirm(markerCoordinate)}>
                Подтвердить
              </AppButton>
            </VStack>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
