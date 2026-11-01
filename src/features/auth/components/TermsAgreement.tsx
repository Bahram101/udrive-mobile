import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

import {
  LegalDocumentModal,
  type LegalDocument,
} from "./LegalDocumentModal";

type Props = {
  checked: boolean;
  onToggle: () => void;
};

export function TermsAgreement({ checked, onToggle }: Props) {
  const [openDocument, setOpenDocument] = useState<LegalDocument | null>(
    null,
  );

  return (
    <>
      <View className="flex-row flex-wrap items-center gap-2">
        <Pressable onPress={onToggle} hitSlop={8}>
          <Ionicons
            name={checked ? "checkbox" : "square-outline"}
            size={22}
            color={checked ? "#9333ea" : "#737373"}
          />
        </Pressable>

        <Text className="text-muted-foreground">Я согласен с</Text>
        <Pressable onPress={() => setOpenDocument("terms")} hitSlop={4}>
          <Text className="text-brand-700 underline">
            пользовательским соглашением
          </Text>
        </Pressable>
        <Text className="text-muted-foreground">и</Text>
        <Pressable onPress={() => setOpenDocument("privacy")} hitSlop={4}>
          <Text className="text-brand-700 underline">
            политикой конфиденциальности
          </Text>
        </Pressable>
      </View>

      <LegalDocumentModal
        document={openDocument}
        onClose={() => setOpenDocument(null)}
      />
    </>
  );
}
