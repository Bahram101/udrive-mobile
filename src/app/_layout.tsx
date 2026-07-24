import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppProviders } from "@/providers";

import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </AppProviders>
    </GluestackUIProvider>
  );
}
