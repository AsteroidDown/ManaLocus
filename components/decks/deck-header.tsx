import { LostURL } from "@/constants/urls";
import UserContext from "@/contexts/user/user.context";
import { titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import { useContext } from "react";
import { Image, View } from "react-native";
import Button from "../ui/button/button";
import Text from "../ui/text/text";

export default function DeckHeader({ deck }: { deck: Deck }) {
  const { user } = useContext(UserContext);

  return (
    <View className="relative h-64 overflow-hidden">
      <Image
        source={{
          uri: deck.featuredArtUrl?.length ? deck.featuredArtUrl : LostURL,
        }}
        className="absolute h-[384px] w-[60%] top-0 right-0"
      />

      <View className="absolute w-full h-full bg-gradient-to-r from-primary-300 from-[41%] to-transparent to-75%" />

      <View className="absolute w-full h-full bg-gradient-to-b from-transparent to-black opacity-40" />

      <View className="absolute flex justify-center gap-1 w-full h-full px-16 top-0 left-0">
        <Text
          size="sm"
          thickness="bold"
          className={`px-2 py-1 bg-dark-200 bg-opacity-85 rounded-xl w-fit h-fit`}
        >
          {deck.format?.length ? titleCase(deck.format) : "TBD"}
        </Text>

        <Text thickness="bold" className="!text-5xl">
          {deck.name}
        </Text>

        <Text size="lg" thickness="medium">
          By {deck.user?.name}
        </Text>
      </View>

      {user?.id === deck.userId && (
        <View className="absolute top-4 right-6 shadow-lg">
          <Link href={`${deck.id}/builder/main-board`}>
            <Button
              text="Edit"
              icon={faPen}
              action="primary"
              className="w-full"
            />
          </Link>
        </View>
      )}
    </View>
  );
}
