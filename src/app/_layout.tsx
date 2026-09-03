import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppProviders } from "@/providers";

import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GluestackUIProvider mode="light">
          <AppProviders>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
          </AppProviders>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
