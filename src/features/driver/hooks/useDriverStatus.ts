import { useEffect } from "react";

import * as Location from "expo-location";
import { useQuery } from "@tanstack/react-query";

import { DriverService } from "../api/driver.service";
import {
  startForegroundTracking,
  startLocationTracking,
} from "../services/locationTask";

export function useDriverStatus() {
  const query = useQuery({
    queryKey: ["driver", "status"],
    queryFn: () => DriverService.getStatus(),
  });

  useEffect(() => {
    if (query.data?.driver.isOnline) {
      Location.getBackgroundPermissionsAsync()
        .then((bg) => {
          if (bg.status === Location.PermissionStatus.GRANTED) {
            startLocationTracking().catch(() => startForegroundTracking());
          } else {
            void startForegroundTracking();
          }
        })
        .catch(console.error);
    }
  }, [query.data?.driver.isOnline]);

  return query;
}
