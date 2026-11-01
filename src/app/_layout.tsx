import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppProviders } from "@/providers";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "../../global.css";
import "@/features/driver/services/locationTask";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Предзагружаем шрифт иконок один раз здесь, а не полагаемся на
  // автозагрузку внутри каждого <Ionicons>: при параллельном монтировании
  // нескольких иконок (например, чекбокс соглашения + кнопка закрытия
  // модалки) автозагрузка гонялась и падала с getAssetByID of undefined.
  // Рендер приложения этим не блокируем — если загрузка шрифта зависнет
  // или упадёт, экран не должен оставаться пустым.
  const [fontsLoaded, fontsError] = useFonts(Ionicons.font);

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

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
