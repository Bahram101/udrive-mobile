import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { COLORS } from "@/constants/theme";
import { useRegisterPushToken } from "@/features/notifications/hooks/useRegisterPushToken";

export default function DriverLayout() {
  useRegisterPushToken();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand[700],
        tabBarInactiveTintColor: "#a3a3a3",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Лента заказов",
          // expo-router типизирует color как RN ColorValue (включает null в RN 0.88),
          // а Ionicons — нет; реально сюда всегда приходит строка из tabBar*TintColor.
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Статистика",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Кошелёк",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
