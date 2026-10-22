import { useQuery } from "@tanstack/react-query";

import { DriverService } from "../api/driver.service";

export function useDriverProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: ["driver", "profile"],
    queryFn: () => DriverService.getProfile(),
    enabled,
  });
}
