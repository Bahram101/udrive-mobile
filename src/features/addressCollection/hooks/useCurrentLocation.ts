import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import type { Coordinates } from "../addressCollection.types";

export function useCurrentLocation() {
  const [coordinate, setCoordinate] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let canceled = false;

    async function loadCurrentLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (canceled) return;

        if (status !== Location.PermissionStatus.GRANTED) {
          setError(
            "Разрешите доступ к геолокации, чтобы выбрать точку на карте",
          );
          setIsLoading(false);
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (canceled) return;

        setCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      } catch {
        if (!canceled) {
          setError(
            "Не удалось определить местоположение. Проверьте GPS и попробуйте снова.",
          );
          setIsLoading(false);
        }
      }
    }

    void loadCurrentLocation();

    return () => {
      canceled = true;
    };
  }, [reloadKey]);

  return {
    coordinate,
    isLoading,
    error,
    refetch,
  };
}
