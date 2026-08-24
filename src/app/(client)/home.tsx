import ScreenLayout from "@/components/common/ScreenLayout";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { useCurrentClientOrder } from "@/features/orders/hooks/useCurrentClientOrder";
import { useAuth } from "@/providers/AuthProvider";

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const currentOrder = useCurrentClientOrder();

  return (
    <ScreenLayout>
      <VStack className="gap-2">
        <Heading size="2xl">Привет, {user?.name}</Heading>
        <Text className="text-muted-foreground">{user?.phone}</Text>
      </VStack>

      {currentOrder.data ? (
        <OrderCard order={currentOrder.data} />
      ) : (
        <CreateOrderForm onSuccess={() => currentOrder.refetch()} />
      )}
    </ScreenLayout>
  );
}
