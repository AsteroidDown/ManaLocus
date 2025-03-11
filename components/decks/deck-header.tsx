import { LostURL } from "@/constants/urls";
import DeckContext from "@/contexts/deck/deck.context";
import ToastContext from "@/contexts/ui/toast.context";
import UserContext from "@/contexts/user/user.context";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import {
  faEllipsisV,
  faEye,
  faHeart,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";
import Button from "../ui/button/button";
import Dropdown from "../ui/dropdown/dropdown";
import Text from "../ui/text/text";
import DeckDeleteModal from "./deck-delete-modal";

export default function DeckHeader({ deck }: { deck: Deck }) {
  const { user } = useContext(UserContext);
  const { setDeck } = useContext(DeckContext);
  const { addToast } = useContext(ToastContext);

  const [deckFavorited, setDeckFavorited] = React.useState(false);
  const [deckViewed, setDeckViewed] = React.useState(null as boolean | null);

  const [optionsExpanded, setOptionsExpanded] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  useEffect(() => {
    if (!deck) return;

    DeckService.getDeckFavorited(deck.id).then((favorited) =>
      setDeckFavorited(favorited)
    );

    DeckService.getDeckViewed(deck.id).then((viewed) => setDeckViewed(viewed));
  }, [deck]);

  useEffect(() => {
    if (deckViewed === null || deckViewed) return;

    DeckService.addView(deck.id).then((response) => {
      if (response) {
        setDeck({ ...deck, views: deck.views + 1 });
      }
    });
  }, [deckViewed]);

  function addFavorite() {
    if (!deck) return;

    DeckService.addFavorite(deck.id).then((response) => {
      if (response) {
        setDeckFavorited(true);
        setDeck({ ...deck, favorites: deck.favorites + 1 });
        addToast({
          title: `Added ${deck?.name} to favorites!`,
        });
      }
    });
  }

  function removeFavorite() {
    if (!deck) return;

    DeckService.removeFavorite(deck.id).then((response) => {
      if (response) {
        setDeckFavorited(false);
        setDeck({ ...deck, favorites: deck.favorites - 1 });
        addToast({
          title: `Removed ${deck?.name} from favorites`,
          action: "danger",
        });
      }
    });
  }

  return (
    <View className="relative h-72 overflow-hidden">
      <View className="absolute flex h-full lg:w-[60%] w-full top-0 right-0 overflow-hidden">
        <Image
          className="absolute top-0 left-0 w-full aspect-[626/457]"
          source={{
            uri: deck.featuredArtUrl?.length ? deck.featuredArtUrl : LostURL,
          }}
        />
      </View>

      <View className="absolute w-full h-full lg:bg-gradient-to-r bg-gradient-to-t from-primary-300 lg:from-[41%] from-10% to-transparent lg:to-75% to-50%" />

      <View className="absolute w-full h-full bg-gradient-to-b from-transparent to-black opacity-40" />

      <View className="absolute flex justify-center gap-1 w-full h-full lg:px-16 px-4 top-0 left-0">
        <Text
          size="sm"
          thickness="bold"
          className={`px-2 py-1 bg-dark-200 bg-opacity-85 rounded-xl w-fit h-fit`}
        >
          {deck.format?.length ? titleCase(deck.format) : "TBD"}
        </Text>

        <Text thickness="bold" className="lg:!text-5xl !text-3xl">
          {deck.name}
        </Text>

        <Text size="lg" thickness="medium">
          By <Link href={`/users/${deck.userId}`}>{deck.user?.name}</Link>
        </Text>
      </View>

      <View className="absolute bottom-4 lg:left-16 left-4">
        <Text size="sm" thickness="semi" className="!text-gray-300">
          Last Updated: {moment(deck.updated).format("MMM Do, YYYY")}
        </Text>
      </View>

      {user?.id === deck.userId && (
        <View className="lg:flex hidden absolute top-4 right-6 flex-row gap-2">
          <Link
            href={`${deck.id}/builder/main-board`}
            className="shadow-lg rounded-lg"
          >
            <Button text="Edit" icon={faPen} className="w-full" />
          </Link>

          <Button
            icon={faEllipsisV}
            onClick={() => setOptionsExpanded(true)}
            className="shadow-lg rounded-lg"
          >
            <View className="-mx-1">
              <Dropdown
                xOffset={-100}
                expanded={optionsExpanded}
                setExpanded={setOptionsExpanded}
                className={`mt-5 !max-w-[360px] border-2 border-primary-300 bg-background-100 rounded-2xl overflow-hidden`}
              >
                <Button
                  square
                  type="clear"
                  text="Delete"
                  className="w-full"
                  icon={faTrash}
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setOptionsExpanded(false);
                  }}
                />
              </Dropdown>

              <DeckDeleteModal
                deck={deck}
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
              />
            </View>
          </Button>
        </View>
      )}

      <View className="absolute bottom-2.5 right-6">
        <View className="flex flex-row rounded-full bg-background-100">
          <Button
            rounded
            size="sm"
            type="clear"
            className="-mr-4"
            icon={faEye}
            text={deck.views + ""}
          />

          <Button
            rounded
            size="sm"
            type="clear"
            icon={faHeart}
            text={deck.favorites + ""}
            onClick={() => (deckFavorited ? removeFavorite() : addFavorite())}
          />
        </View>
      </View>
    </View>
  );
}
