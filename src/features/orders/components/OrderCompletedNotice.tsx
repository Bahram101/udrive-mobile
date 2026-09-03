import AppButton from "@/components/common/AppButton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type OrderCompletedNoticeProps = {
  onDismiss: () => void;
};

export function OrderCompletedNotice({ onDismiss }: OrderCompletedNoticeProps) {
  return (
    <VStack className="mt-2 gap-2 rounded-2xl border border-lime-400 bg-lime-50 p-4">
      <Text className="font-semibold text-lime-950">Поездка завершена</Text>
      <Text className="text-sm text-muted-foreground">
        Спасибо, что выбрали uDrive!
      </Text>
      <AppButton variant="outline" onPress={onDismiss}>
        Понятно
      </AppButton>
    </VStack>
  );
}
