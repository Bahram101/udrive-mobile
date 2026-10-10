/**
 * Extracts 10 phone digits from input string (e.g. "+7 (707) 130" -> "707130")
 */
export function extractPhoneDigits(input: string): string {
  if (!input) return "";

  let raw = input;
  if (raw.includes("+7 (")) {
    raw = raw.replace("+7 (", "");
  } else if (raw.includes("+7 ")) {
    raw = raw.replace("+7 ", "");
  }

  const hasPlusSeven = raw.trim().startsWith("+7");
  let digits = raw.replace(/\D/g, "");

  if (hasPlusSeven) {
    if (digits.startsWith("7")) {
      digits = digits.slice(1);
    }
  } else if (
    digits.length >= 11 &&
    (digits.startsWith("7") || digits.startsWith("8"))
  ) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

/**
 * Formats digits into a progressive input mask (e.g. "70713" -> "+7 (707) 13")
 */
export function formatPhoneInput(digits: string): string {
  let formatted = "+7 ";
  if (digits?.length > 0) {
    formatted += "(" + digits.slice(0, 3);
  }
  if (digits?.length > 3) {
    formatted += ") " + digits.slice(3, 6);
  }
  if (digits?.length > 6) {
    formatted += " " + digits.slice(6, 8);
  }
  if (digits?.length > 8) {
    formatted += " " + digits.slice(8, 10);
  }
  return formatted;
}

/**
 * Converts 10 digits to international format (+77071302100) (e.g. "7071302100" -> "+77071302100")
 */
export function toInternationalPhone(digits: string): string {
  return "+7" + digits;
}

/**
 * Checks if 10 digits form a valid Kazakhstan phone (e.g. "7071302100" -> true)
 */
export function isValidKzPhone(digits: string): boolean {
  return digits.length === 10 && digits.startsWith("7");
}

/**
 * Formats an international format (+77071302100) for display (e.g. "+77071302100" -> "+7 (707) 130 21 00")
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return phone;

  if (phone.startsWith("+7") && phone.length === 12) {
    const digits = phone.slice(2);
    if (digits.startsWith("7")) {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    }
  }
  return phone;
}

/**
 * Gets new phone digits after user edits the mask (e.g. "707", "+7 (707)", "+7 (70)" -> "70")
 */
export function getPhoneDigitsAfterEdit(
  prevDigits: string,
  prevMasked: string,
  newText: string,
): string {
  if (["+7 (", "+7 ", "+7", "+", ""].includes(newText.trim())) {
    return "";
  }

  const extracted = extractPhoneDigits(newText);
  if (
    newText.length < prevMasked.length &&
    extracted === prevDigits &&
    prevDigits.length > 0
  ) {
    return prevDigits.slice(0, -1);
  }
  return extracted;
}
