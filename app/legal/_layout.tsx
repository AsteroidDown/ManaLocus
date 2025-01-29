import { Stack } from "expo-router";

export default function LegalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="terms-of-service" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}
