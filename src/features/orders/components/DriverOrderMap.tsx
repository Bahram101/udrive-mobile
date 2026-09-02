import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import { DriverService } from "@/features/driver/api/driver.service";

import type { Order } from "../orders.types";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type DriverOrderMapProps = {
  order: Order;
};

export function DriverOrderMap({ order }: DriverOrderMapProps) {
  const mapRef = useRef<MapView>(null);
  const hasFitted = useRef(false);
  const [driverPosition, setDriverPosition] = useState<Coordinates | null>(
    null,
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function watchDriverPosition() {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 4000,
          distanceInterval: 20,
        },
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverPosition({ latitude, longitude });
          DriverService.updateStatus({
            isOnline: true,
            lat: latitude,
            lng: longitude,
          }).catch(() => {});
        },
      );
    }

    watchDriverPosition();

    return () => subscription?.remove();
  }, []);

  const clientPosition: Coordinates | null =
    order.fromLat != null && order.fromLng != null
      ? { latitude: order.fromLat, longitude: order.fromLng }
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

  if (!clientPosition) return null;

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
        <Marker
          coordinate={clientPosition}
          title="Клиент"
          description={order.fromAddress}
          pinColor="#3f6212"
        />
      </MapView>
    </View>
  );
}
