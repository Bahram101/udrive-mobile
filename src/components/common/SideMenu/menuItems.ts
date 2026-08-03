import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export type MenuItemConfig = {
  key: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  badge?: string;
};

export const MENU_ITEMS: MenuItemConfig[] = [
  { key: "city", label: "Город", icon: "car-outline" },
  { key: "orders", label: "История заказов", icon: "time-outline" },
  {
    key: "groceries",
    label: "Продукты за 15 минут",
    icon: "flash-outline",
    badge: "NEW",
  },
  { key: "couriers", label: "Курьеры", icon: "bicycle-outline" },
  { key: "payments", label: "Способы оплаты", icon: "card-outline" },
  { key: "business", label: "Бизнес доставка", icon: "briefcase-outline" },
  { key: "intercity", label: "Межгород", icon: "globe-outline" },
  { key: "addresses", label: "Мои адреса", icon: "bookmark-outline" },
  { key: "cargo", label: "Грузовые", icon: "cube-outline" },
  { key: "notifications", label: "Уведомления", icon: "notifications-outline" },
  { key: "security", label: "Безопасность", icon: "shield-checkmark-outline" },
  { key: "settings", label: "Настройки", icon: "settings-outline" },
];
