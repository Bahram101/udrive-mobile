import { ScrollView } from "react-native";

import ScreenLayout from "@/components/common/ScreenLayout";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { MOCK_ORDERS } from "@/features/orders/orders.mock";

export default function DriverOrderFeedScreen() {
  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="-mx-4 flex-1 px-4"
      >
        {MOCK_ORDERS.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </ScreenLayout>
  );
}
