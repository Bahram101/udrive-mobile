import { Text } from "@/components/ui/text";

export function OsmAttribution() {
  return (
    <Text className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
      © OpenStreetMap contributors
    </Text>
  );
}
