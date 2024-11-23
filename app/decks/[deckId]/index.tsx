import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import DeckContext from "@/contexts/deck/deck.context";
import UserContext from "@/contexts/user/user.context";
import { DeckCard } from "@/models/deck/deck";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Image, ScrollView, View } from "react-native";

export default function DeckPage() {
  const { user } = useContext(UserContext);
  const { deck } = useContext(DeckContext);

  const [mainBoard, setMainBoard] = React.useState([] as DeckCard[]);
  const [sideBoard, setSideBoard] = React.useState([] as DeckCard[]);
  const [maybeBoard, setMaybeBoard] = React.useState([] as DeckCard[]);
  const [acquireBoard, setAcquireBoard] = React.useState([] as DeckCard[]);

  useEffect(() => {
    if (!deck) return;

    setMainBoard(deck.main);
    setSideBoard(deck.side);
    setMaybeBoard(deck.maybe);
    setAcquireBoard(deck.acquire);
  }, [deck]);

  if (!deck) return;

  return (
    <ScrollView>
      <View className="relative h-64">
        <Image
          source={{ uri: deck.featuredArtUrl }}
          className="absolute h-[457px] w-[50%] top-0 right-0"
        />

        <View className="absolute w-full h-full bg-gradient-to-r from-primary-300 from-[51%] to-transparent to-75%" />

        <View className="absolute w-full h-full bg-gradient-to-b from-transparent to-black opacity-40" />

        <View className="absolute flex justify-center w-full h-full px-11 top-0 left-0">
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

      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
        <View className="flex flex-row flex-wrap gap-4 w-full">
          <Column title="Main Board" cards={mainBoard} />
          <Column title="Side Board" cards={sideBoard} />
          <Column title="Maybe Board" cards={maybeBoard} />
          <Column title="Acquire Board" cards={acquireBoard} />

          {/* {!!byType?.creature?.length && (
            <Column title="Creatures" cards={byType?.creature} />
          )}
          {!!byType?.instant?.length && (
            <Column title="Instants" cards={byType?.instant} />
          )}
          {!!byType?.sorcery?.length && (
            <Column title="Sorceries" cards={byType?.sorcery} />
          )}
          {!!byType?.artifact?.length && (
            <Column title="Artifacts" cards={byType?.artifact} />
          )}
          {!!byType?.enchantment?.length && (
            <Column title="Enchantments" cards={byType?.enchantment} />
          )}
          {!!byType?.planeswalker?.length && (
            <Column title="Planeswalkers" cards={byType?.planeswalker} />
          )}
          {!!byType?.battle?.length && (
            <Column title="Battles" cards={byType?.battle} />
          )}
          {!!byType?.land?.length && (
            <Column title="Lands" cards={byType?.land} />
          )} */}
        </View>
      </View>
    </ScrollView>
  );
}

function Column({ title, cards }: { title: string; cards?: DeckCard[] }) {
  return (
    <View className="flex-1 flex min-w-[256px]">
      <Text size="lg" thickness="bold" className="mb-2">
        {title}
      </Text>

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <View key={index} className="rounded-xl overflow-hidden">
            <Text>{card.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
