import { Stack } from 'expo-router';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AppProviders } from '@/providers';

import '../../global.css';

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="system">
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }} />
      </AppProviders>
    </GluestackUIProvider>
  );
}
