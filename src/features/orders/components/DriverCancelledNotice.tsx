import AppButton from "@/components/common/AppButton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type DriverCancelledNoticeProps = {
  onDismiss: () => void;
};

export function DriverCancelledNotice({
  onDismiss,
}: DriverCancelledNoticeProps) {
  return (
    <VStack className="mt-2 gap-2 rounded-2xl border border-destructive bg-destructive/5 p-4">
      <Text className="font-semibold text-destructive">
        Водитель отменил заказ
      </Text>
      <Text className="text-sm text-muted-foreground">
        Не переживайте — можете оформить новый заказ прямо сейчас.
      </Text>
      <AppButton variant="outline" onPress={onDismiss}>
        Понятно
      </AppButton>
    </VStack>
  );
}
