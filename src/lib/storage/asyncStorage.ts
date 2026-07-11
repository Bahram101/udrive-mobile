import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthUser } from '@/features/auth/auth.types';

const USER_KEY = 'auth_user';

export const userStorage = {
  async getUser(): Promise<AuthUser | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
  async setUser(user: AuthUser) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  async clearUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },
};
