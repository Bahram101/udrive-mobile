import {
  formatPhoneInput,
  getPhoneDigitsAfterEdit,
  isValidKzPhone,
} from "@/lib/phone";
import { View } from "react-native";
import { Text } from "../ui/text";
import AppInput from "./AppInput";

type PhoneInputProps = {
  value: string; // 10 digits
  onChangeText: (text: string) => void;
};

const PhoneInput = ({ value, onChangeText }: PhoneInputProps) => {
  const maskedValue = formatPhoneInput(value);

  const handleChange = (text: string) => {
    // Calculate the next sequence of digits factoring in potential mask deletions
    const digits = getPhoneDigitsAfterEdit(value, maskedValue, text);
    onChangeText(digits);
  };

  const isComplete = value.length === 10;
  const isInvalid = isComplete && !isValidKzPhone(value);

  return (
    <View className="w-full flex-col gap-1">
      <AppInput
        value={maskedValue}
        onChangeText={handleChange}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
        maxLength={18} // "+7 (707) 130 21 00" is 18 chars
        selection={{ start: maskedValue.length, end: maskedValue.length }}
      />
      {isInvalid && (
        <Text className="text-destructive text-sm mt-1">
          Введите казахстанский номер: +7 (7XX) XXX XX XX
        </Text>
      )}
    </View>
  );
};

export default PhoneInput;
