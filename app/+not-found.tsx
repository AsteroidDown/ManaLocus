import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import { LostURL } from "@/constants/urls";
import { Link, router } from "expo-router";
import { Image, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View className="relative flex">
      <Image
        source={{ uri: LostURL }}
        className="absolute top-0 left-0 w-full min-h-[100dvh]"
      />

      <View className="flex flex-col gap-4 justify-center items-center bg-gradient-to-b from-background-100/30 to-background-100 to-80% lg:px-16 px-4 py-4 min-h-[100dvh]">
        <Text size="2xl" weight="semi" className="-mt-32">
          Oops!
        </Text>

        <Text center size="md" className="max-w-[400px]">
          Looks like you got a little lost. If you think this is a mistake, let
          us know at:
        </Text>

        <Link
          className="!text-primary-300 text-[16px] px-3 pt-1 pb-1.5 bg-dark-100 hover:bg-background-200 rounded-full border-2 border-primary-300 transition-all duration-300"
          href="mailto:support@manalocus.com"
        >
          support@manalocus.com
        </Link>

        <Text center size="md" className="max-w-[400px] mt-4">
          Otherwise you can{" "}
          <Link href="/" className="!text-primary-300">
            go home
          </Link>{" "}
          or browse:
        </Text>

        <View className="flex flex-row bg-dark-100 rounded-lg">
          <Button
            squareRight
            text="Decks"
            type="outlined"
            className="flex-1"
            onClick={() => router.push(`decks`)}
          />
          <Button
            square
            text="Cards"
            type="outlined"
            className="flex-1"
            onClick={() => router.push(`cards`)}
          />
          <Button
            squareLeft
            text="Builders"
            type="outlined"
            className="flex-1"
            onClick={() => router.push(`users`)}
          />
        </View>
      </View>

      <Footer />
    </View>
  );
}
