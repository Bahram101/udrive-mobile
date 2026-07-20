import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_ONBOARDED_KEY = 'has_onboarded';

export const onboardingStorage = {
  async getHasOnboarded(): Promise<boolean> {
    return (await AsyncStorage.getItem(HAS_ONBOARDED_KEY)) === 'true';
  },
  async setHasOnboarded(): Promise<void> {
    await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
  },
};
