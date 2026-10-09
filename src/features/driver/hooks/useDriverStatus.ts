import { useEffect, useRef } from "react";
import { Alert } from "react-native";

import * as Location from "expo-location";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { DriverService } from "../api/driver.service";
import type { UpdateDriverStatusResponse } from "../driver.types";
import {
  startForegroundTracking,
  startLocationTracking,
} from "../services/locationTask";

export function useDriverStatus() {
  const queryClient = useQueryClient();
  const alertShownRef = useRef(false);

  const query = useQuery({
    queryKey: ["driver", "status"],
    queryFn: () => DriverService.getStatus(),
  });

  useEffect(() => {
    if (!query.data?.driver.isOnline) {
      alertShownRef.current = false;
      return;
    }

    async function checkPermissionsAndTrack() {
      try {
        const bg = await Location.getBackgroundPermissionsAsync();
        if (bg.status === Location.PermissionStatus.GRANTED) {
          try {
            await startLocationTracking();
            return;
          } catch {
            // fallback to foreground tracking
          }
        }

        const success = await startForegroundTracking();
        if (!success && !alertShownRef.current) {
          alertShownRef.current = true;

          DriverService.updateStatus({ isOnline: false })
            .then((response) => {
              queryClient.setQueryData<UpdateDriverStatusResponse>(
                ["driver", "status"],
                response,
              );
            })
            .catch(console.error);

          Alert.alert(
            "Нет доступа к геолокации",
            "Вы сняты с линии. Разрешите доступ к геолокации в настройках, чтобы выйти на линию.",
          );
        }
      } catch (err) {
        console.error("Failed to start tracking:", err);
      }
    }

    void checkPermissionsAndTrack();
  }, [query.data?.driver.isOnline, queryClient]);

  return query;
}

