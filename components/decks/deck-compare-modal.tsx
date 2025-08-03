import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { faLeftRight, faShop } from "@fortawesome/free-solid-svg-icons";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Linking, View } from "react-native";
import Button from "../ui/button/button";
import Checkbox from "../ui/checkbox/checkbox";
import Select from "../ui/input/select";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export interface DeckCompareModalProps {
  deck: Deck;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeckCompareModal({
  deck,
  open,
  setOpen,
}: DeckCompareModalProps) {
  const { user } = useContext(UserContext);

  const [collections, setCollections] = useState([] as Deck[]);
  const [selectedCollection, setSelectedCollection] = useState(
    null as Deck | null
  );
  const [collectionCards, setCollectionCards] = useState([] as Card[]);

  const [cardsOwned, setCardsOwned] = useState([] as Card[]);
  const [cardsToAcquire, setCardsToAcquire] = useState([] as Card[]);
  const [cardsToBuy, setCardsToBuy] = useState([] as Card[]);

  useEffect(() => {
    if (!open) close();
  }, [open]);

  useEffect(() => {
    if (!user) return;

    DeckService.getByUser(user.id, {
      userDecks: true,
      onlyCollections: true,
      includePrivate: true,
    }).then((response) => setCollections(response.data));
  }, [user]);

  useEffect(() => {
    if (!selectedCollection) return;

    DeckService.get(selectedCollection.id).then((response) => {
      setCollectionCards(response.main);
    });
  }, [selectedCollection]);

  useEffect(() => {
    if (!collectionCards?.length) return;

    const cardsInDeck: Card[] = [];
    const cardsNotInDeck: Card[] = [];

    deck.main.forEach((card) => {
      const deckCard = collectionCards.find(
        (deckCard) => deckCard.name === card.name
      );

      if (deckCard) {
        const moreInDeck = deckCard.count > card.count;

        if (moreInDeck) {
          cardsInDeck.push(card);
          cardsNotInDeck.push({ ...card, count: deckCard.count - card.count });
        } else cardsInDeck.push({ ...card, count: deckCard.count });
      } else cardsNotInDeck.push(card);
    });

    setCardsOwned(cardsInDeck);
    setCardsToAcquire(cardsNotInDeck);
  }, [collectionCards]);

  function updateCardsToBuy(card: Card, checked: boolean) {
    if (checked) {
      setCardsToBuy([...cardsToBuy, card]);
    } else {
      setCardsToBuy(
        cardsToAcquire.filter(
          (cardToAcquire) => cardToAcquire.name !== card.name
        )
      );
    }
  }

  function updateAll(checked: boolean) {
    if (checked) setCardsToBuy(cardsToAcquire);
    else setCardsToBuy([]);
  }

  function buyMissingCards() {
    let link = "https://www.tcgplayer.com/massentry?c=";

    link += cardsToBuy
      .map(
        (card) =>
          `${card.count} ${card.name} [${card.set.toUpperCase()}] ${
            card.collectorNumber
          }`
      )
      .join("||");

    link += "&productline=Magic";

    Linking.openURL(link);
  }

  function close() {
    setOpen(false);

    setTimeout(() => {
      setSelectedCollection(null);
      setCardsOwned([]);
      setCardsToAcquire([]);
      setCardsToBuy([]);
    }, 500);
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      icon={faLeftRight}
      title={`Compare ${deck.name} to a Collection`}
      footer={
        <View className="flex flex-row gap-2 justify-end">
          <Button
            size="sm"
            type="outlined"
            text="Close"
            onClick={() => close()}
          />

          <Button
            size="sm"
            type="outlined"
            text="Purchase Cards"
            icon={faShop}
            onClick={buyMissingCards}
            disabled={!cardsToAcquire?.length}
          />
        </View>
      }
    >
      <Select
        label="Collection"
        value={selectedCollection}
        onChange={setSelectedCollection}
        placeholder="Select a collection"
        options={collections.map((collection) => ({
          label: collection.name,
          value: collection,
        }))}
      />

      <View className="flex flex-row gap-2 mt-4">
        <View className="flex-1 flex gap-2">
          <Text size="md" weight="medium">
            Cards Owned
          </Text>

          <View className="flex-1 max-h-[500px] overflow-y-auto">
            <View className="flex min-w-[400px] min-h-[200px] h-full px-3 py-2 bg-dark-100 rounded-lg">
              {cardsOwned.map((card) => (
                <Text size="sm" key={card.name} className="py-[3px]">
                  {card.count} {card.name}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View className="flex-1 flex gap-2">
          <View className="flex flex-row gap-2 items-center justify-between">
            <Text size="md" weight="medium" className="flex-1">
              Cards Not Owned
            </Text>

            <Checkbox
              label={`${
                cardsToBuy.length === cardsToAcquire.length
                  ? "Deselect"
                  : "Select"
              } All`}
              disabled={!cardsToAcquire?.length}
              checked={
                cardsToAcquire.length > 1 &&
                cardsToBuy.length === cardsToAcquire.length
              }
              onChange={(checked) => updateAll(checked)}
            />
          </View>

          <View className="max-h-[500px] overflow-y-auto">
            <View className="flex min-w-[400px] min-h-[200px] h-full px-3 py-2 bg-dark-100 rounded-lg overflow-y-auto">
              {cardsToAcquire.map((card) => (
                <Checkbox
                  key={card.name}
                  checked={cardsToBuy.includes(card)}
                  label={`${card.count} ${card.name}`}
                  className="min-h-[26px]"
                  onChange={(checked) => updateCardsToBuy(card, checked)}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
