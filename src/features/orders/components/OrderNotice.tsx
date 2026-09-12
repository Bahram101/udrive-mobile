import cn from "clsx";

import AppButton from "@/components/common/AppButton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

type OrderNoticeProps = {
  tone: "destructive" | "success";
  title: string;
  description: string;
  onDismiss: () => void;
};

export function OrderNotice({
  tone,
  title,
  description,
  onDismiss,
}: OrderNoticeProps) {
  return (
    <VStack
      className={cn(
        "mt-2 gap-2 rounded-2xl border p-4",
        tone === "destructive"
          ? "border-destructive bg-destructive/5"
          : "border-brand-400 bg-brand-50",
      )}
    >
      <Text
        className={cn(
          "font-semibold",
          tone === "destructive" ? "text-destructive" : "text-brand-950",
        )}
      >
        {title}
      </Text>
      <Text className="text-sm text-muted-foreground">{description}</Text>
      <AppButton variant="outline" onPress={onDismiss}>
        Понятно
      </AppButton>
    </VStack>
  );
}
