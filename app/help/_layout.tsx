import { SidebarSection } from "@/components/ui/navigation/sidebar";
import { Stack } from "expo-router";

export const HelpSections: SidebarSection[] = [
  {
    title: "General",
    links: [
      { title: "General", href: "help" },
      {
        title: "Brackets",
        href: "help/brackets",
        links: [
          { title: "Game Changers", href: "help/brackets/game-changers" },
          { title: "Tutors", href: "help/brackets/tutors" },
          { title: "Extra Turns", href: "help/brackets/extra-turns" },
          { title: "Mass Land Denial", href: "help/brackets/mass-land-denial" },
        ],
      },
      { title: "Contact", href: "help/contact" },
    ],
  },
];

export default function HelpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="brackets" options={{ headerShown: false }} />
      <Stack.Screen
        name="brackets/game-changers"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="brackets/tutors" options={{ headerShown: false }} />
      <Stack.Screen
        name="brackets/extra-turns"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="brackets/mass-land-denial"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="contact" options={{ headerShown: false }} />
    </Stack>
  );
}
