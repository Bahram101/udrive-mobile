import { useQuery } from "@tanstack/react-query";
import { DriverService } from "../api/driver.service";

export function useDriverStatus() {
  return useQuery({
    queryKey: ["driver", "status"],
    queryFn: () => DriverService.getStatus(),
  });
}
