import { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import type { Order } from "../orders.types";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type ClientOrderMapProps = {
  order: Order;
};

export function ClientOrderMap({ order }: ClientOrderMapProps) {
  const mapRef = useRef<MapView>(null);
  const hasFitted = useRef(false);

  const clientPosition: Coordinates | null =
    order.fromLat != null && order.fromLng != null
      ? { latitude: order.fromLat, longitude: order.fromLng }
      : null;

  const driverPosition: Coordinates | null =
    order.driver?.lat != null && order.driver?.lng != null
      ? { latitude: order.driver.lat, longitude: order.driver.lng }
      : null;

  useEffect(() => {
    if (hasFitted.current || !mapRef.current || !driverPosition || !clientPosition)
      return;

    hasFitted.current = true;
    mapRef.current.fitToCoordinates([driverPosition, clientPosition], {
      edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
      animated: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    driverPosition?.latitude,
    driverPosition?.longitude,
    clientPosition?.latitude,
    clientPosition?.longitude,
  ]);

  if (!clientPosition || !order.driverId) return null;

  return (
    <View className="h-[70%] overflow-hidden rounded-2xl border border-border">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        showsUserLocation
        initialRegion={{
          ...clientPosition,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {driverPosition && (
          <Marker
            coordinate={driverPosition}
            title="Водитель"
            pinColor="#0ea5e9"
          />
        )}
      </MapView>
    </View>
  );
}
