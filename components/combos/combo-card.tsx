import { SpellbookURL } from "@/constants/urls";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import {
  SpellbookCombo,
  SpellbookComboResult,
} from "@/models/spellbook/spellbook-combo";
import {
  faExternalLinkAlt,
  faInfinity,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import CardText from "../cards/card-text";
import Chip from "../ui/chip/chip";
import Divider from "../ui/divider/divider";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";
import ComboDetails from "./combo-details";

export default function ComboCard({
  combo,
  deck,
}: {
  combo: SpellbookCombo;
  deck: Deck;
}) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const [comboCards, setComboCards] = useState([] as Card[]);

  useEffect(() => {
    if (!combo || !deck) return;
    const cardsInCombo = combo.uses.map((card) => card.card.name);

    setComboCards(deck.main.filter((card) => cardsInCombo.includes(card.name)));
  }, [combo]);

  function openModal() {
    setOpen(true);
    setHovered(false);
  }

  return (
    <Pressable
      onPress={openModal}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`flex border-2 border-background-200 rounded-xl overflow-hidden transition-all duration-300 ${
        hovered
          ? "lg:w-[428px] w-[344px] -m-1 shadow-[0_0_16px] border-primary-300 shadow-primary-300"
          : "lg:w-[420px] w-[336px]"
      }`}
    >
      <View className="relative flex flex-row">
        {comboCards.map((card) => (
          <Image
            key={card.scryfallId}
            source={{
              uri: card.faces?.front
                ? card.faces.front.imageUris.artCrop
                : card.imageURIs?.artCrop,
            }}
            className="flex-1 h-28"
          />
        ))}

        <View
          className={`absolute px-1 py-0.5 bg-dark-100 bg-opacity-70 rounded-xl transition-all duration-300 ${
            hovered ? "top-3 right-3" : "top-2 right-2"
          }`}
        >
          <CardText text={`{${combo.identity.split("").join("}{")}}`} />
        </View>
      </View>

      <Divider thick />

      <View
        className={`flex-1 flex gap-1 bg-dark-100 transition-all duration-300 ${
          hovered ? "px-5 pb-5 pt-3" : "px-4 pb-4 pt-2"
        }`}
      >
        <Text size="sm" weight="medium">
          Uses
        </Text>

        <View className="flex flex-row flex-wrap gap-1">
          {combo.uses.map((card) => (
            <Chip
              size="xs"
              type="outlined"
              key={card.card.name}
              text={card.card.name}
            />
          ))}
        </View>

        <Text size="sm" weight="medium">
          Produces
        </Text>

        <ComboProduces combo={combo} openModal={openModal} />
      </View>

      <Modal
        title="Combo Details"
        open={open}
        setOpen={setOpen}
        footer={
          <Link
            href={`${SpellbookURL}/combo/${combo.id}`}
            target="_blank"
            className="!text-primary-200 ml-auto"
          >
            View on Commander Spellbook
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="ml-2 text-primary-200"
            />
          </Link>
        }
      >
        <ComboDetails combo={combo} comboCards={comboCards} setOpen={setOpen} />
      </Modal>
    </Pressable>
  );
}

function ComboProduces({
  combo,
  openModal,
}: {
  combo: SpellbookCombo;
  openModal: () => void;
}) {
  const [produces, setProduces] = useState([] as SpellbookComboResult[]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const sortedResults = combo.produces.sort(
      (a, b) => a.feature.name.length - b.feature.name.length
    );

    if (sortedResults.length > 3) {
      setProduces(sortedResults.slice(0, 3));
      setHasMore(true);
    } else {
      setProduces(sortedResults);
    }
  }, [combo]);

  return (
    <View className="flex flex-row flex-wrap gap-1">
      {produces.map((result) => (
        <Chip
          size="xs"
          type="outlined"
          className="!gap-1"
          key={result.feature.id}
          text={result.feature.name}
          startIcon={
            result.feature.name.toLowerCase().includes("infinite")
              ? faInfinity
              : undefined
          }
        />
      ))}

      {hasMore && (
        <Chip
          size="xs"
          type="outlined"
          className="!gap-1"
          startIcon={faPlus}
          onClick={openModal}
          text={`${combo.produces.length - 3} More`}
        />
      )}
    </View>
  );
}
