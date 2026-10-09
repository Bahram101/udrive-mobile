import { Stack } from 'expo-router';
import { useRegisterPushToken } from "@/features/notifications/hooks/useRegisterPushToken";

export default function ClientLayout() {
  useRegisterPushToken("client");
  return <Stack screenOptions={{ headerShown: false }} />;
}
