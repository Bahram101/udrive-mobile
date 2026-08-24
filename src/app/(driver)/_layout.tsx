import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useDriverOrderSocket } from '@/features/orders/hooks/useDriverOrderSocket';

export default function DriverLayout() {
  useDriverOrderSocket();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4d7c0f',
        tabBarInactiveTintColor: '#a3a3a3',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Лента заказов',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Статистика',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Кошелёк',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
