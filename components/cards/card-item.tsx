import {
  faCircleInfo,
  faMinus,
  faPalette,
  faPlus,
  faRightFromBracket,
  faShop,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import StoredCardsContext from "../../contexts/cards/stored-cards.context";
import {
  addToLocalStorageCardCount,
  getLocalStorageStoredCards,
  removeFromLocalStorageCardCount,
  removeLocalStorageCard,
  saveLocalStorageCard,
} from "../../functions/local-storage";
import { Card } from "../../models/card/card";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Modal from "../ui/modal/modal";
import { Tooltip } from "../ui/tooltip/tooltip";
import CardCost from "./card-cost";
import CardDetailedPreview from "./card-detailed-preview";
import CardImage from "./card-image";

export interface CardItemProps {
  card: Card;
  condensed?: boolean;
  hideImage?: boolean;
}

export default function CardItem({
  card,
  condensed = false,
  hideImage = false,
}: CardItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className={`flex gap-2 rounded-2xl overflow-hidden transition-all duration-300 ${
          expanded
            ? "max-h-[1000px] "
            : condensed
            ? "max-h-[24px]"
            : "max-h-[36px]"
        } ${
          expanded
            ? "bg-background-300"
            : condensed
            ? "bg-none"
            : "bg-background-300"
        }`}
      >
        <CardItemHeader card={card} condensed={condensed} />

        <Divider thick className="-mt-2" />

        {!hideImage && (
          <>
            <View className={"flex gap-2 px-2"}>
              <CardImage card={card} onClick={() => setModalOpen(true)} />
            </View>

            <Divider thick />
          </>
        )}

        <CardItemFooter
          card={card}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </Pressable>

      <Modal transparent open={modalOpen} setIsOpen={setModalOpen}>
        <CardDetailedPreview card={card}>
          <CardItemFooter card={card} />
        </CardDetailedPreview>
      </Modal>
    </>
  );
}

export function CardItemHeader({ card, condensed }: CardItemProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <View
      className={`flex flex-row gap-1 justify-between items-center transition-all ${
        condensed ? "px-2 max-h-[24px] h-[24px]" : "px-4 max-h-[36px] h-[36px]"
      }
        ${
          hovered
            ? "bg-primary-300"
            : condensed
            ? "bg-none"
            : "bg-background-300"
        }`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* <Tooltip style={[{ flex: 1 }]} message={card.name}> */}
      <View className="flex flex-row gap-2 flex-1">
        <Text className="text-white">{card.count}</Text>
        <Text className="text-white truncate">{card.name}</Text>
      </View>
      {/* </Tooltip> */}

      {card.faces ? (
        <Text className="flex flex-row items-center gap-1">
          {card.faces.front.manaCost && (
            <CardCost size="sm" cost={card.faces.front.manaCost} />
          )}

          {card.faces.back.manaCost && (
            <Text className="text-white h-[20px]"> // </Text>
          )}

          {card.faces.back.manaCost && (
            <CardCost size="sm" cost={card.faces.back.manaCost} />
          )}
        </Text>
      ) : card.manaCost ? (
        <CardCost size="sm" cost={card.manaCost} />
      ) : null}
    </View>
  );
}

export function CardItemFooter({ card, modalOpen, setModalOpen }: any) {
  const { maybeBoard, setStoredCards } = useContext(StoredCardsContext);

  function addToCount(card: Card) {
    addToLocalStorageCardCount(card, maybeBoard);
    setStoredCards(getLocalStorageStoredCards(maybeBoard));
  }

  function removeFromCount(card: Card) {
    removeFromLocalStorageCardCount(card, maybeBoard);
    setStoredCards(getLocalStorageStoredCards(maybeBoard));
  }

  function removeCard(card: Card) {
    removeLocalStorageCard(card, maybeBoard);
    setStoredCards(getLocalStorageStoredCards(maybeBoard));
  }

  function moveCard(card: Card) {
    saveLocalStorageCard(card, !maybeBoard);
    removeLocalStorageCard(card, maybeBoard);
    setStoredCards(getLocalStorageStoredCards(maybeBoard));
  }

  return (
    <View className="flex gap-2">
      <View className="flex flex-row justify-center items-center gap-2 px-2">
        <Button
          action="info"
          className="flex-1"
          icon={faCircleInfo}
          onClick={() => setModalOpen(!modalOpen)}
        ></Button>

        <Button
          className="flex-1"
          icon={faPalette}
          // onClick={() => removeCard(card)}
        ></Button>

        <Tooltip title="Move to Maybe Board">
          <Button
            action="warning"
            className="flex-1"
            icon={faRightFromBracket}
            onClick={() => moveCard(card)}
          ></Button>
        </Tooltip>

        <Button
          action="danger"
          className="flex-1"
          icon={faTrash}
          onClick={() => removeCard(card)}
        ></Button>
      </View>

      <View className="flex flex-row justify-between items-center px-2">
        <Button
          hideRightBorder
          size="sm"
          type="outlined"
          action="danger"
          className="flex-1"
          icon={faMinus}
          onClick={() => removeFromCount}
        />

        <View className="flex justify-center items-center px-2 h-full border-2 border-x-0 border-dark-600">
          <Text className="text-white font-bold">{card.count}</Text>
        </View>

        <Button
          hideLeftBorder
          size="sm"
          type="outlined"
          action="info"
          className="flex-1"
          icon={faPlus}
          onClick={() => addToCount(card)}
        />
      </View>

      <View className="flex flex-row flex-1 gap-2 px-2 pb-2">
        <Button
          size="xs"
          action="info"
          className="flex-1"
          icon={faShop}
          text={`$${card.prices?.usd}`}
          onClick={async () => await Linking.openURL(card.priceUris.tcgplayer)}
        />

        <Button
          size="xs"
          action="info"
          className="flex-1"
          icon={faShop}
          text={`€${card.prices?.eur}`}
          onClick={async () => await Linking.openURL(card.priceUris.cardmarket)}
        />
      </View>
    </View>
  );
}
