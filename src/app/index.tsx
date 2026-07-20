import { ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/providers/AuthProvider';

export default function Index() {
  const { isLoading, isAuthenticated, hasOnboarded, user } = useAuth();

  if (isLoading) {
    return (
      <VStack className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </VStack>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={user?.role === 'DRIVER' ? '/(driver)/home' : '/(client)/home'} />;
  }

  return <Redirect href={hasOnboarded ? '/(auth)/login' : '/(onboarding)/role'} />;
}
