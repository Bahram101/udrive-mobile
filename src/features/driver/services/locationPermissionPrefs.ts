import AsyncStorage from "@react-native-async-storage/async-storage";

const BG_EXPLAINED_KEY = "location_bg_permission_explained";
const BG_DENIAL_SHOWN_KEY = "location_bg_denial_notice_shown";

export const locationPermissionPrefs = {
  async wasExplained(): Promise<boolean> {
    const val = await AsyncStorage.getItem(BG_EXPLAINED_KEY);
    return val === "true";
  },
  async markExplained() {
    await AsyncStorage.setItem(BG_EXPLAINED_KEY, "true");
  },
  async wasDenialNoticeShown(): Promise<boolean> {
    const val = await AsyncStorage.getItem(BG_DENIAL_SHOWN_KEY);
    return val === "true";
  },
  async markDenialNoticeShown() {
    await AsyncStorage.setItem(BG_DENIAL_SHOWN_KEY, "true");
  },
};
