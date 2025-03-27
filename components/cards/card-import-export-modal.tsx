import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import { MTGColor } from "@/constants/mtg/mtg-colors";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGCardType } from "@/constants/mtg/mtg-types";
import { SortType } from "@/constants/sorting";
import BoardContext from "@/contexts/cards/board.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import ToastContext from "@/contexts/ui/toast.context";
import { filterCards } from "@/functions/cards/card-filtering";
import { sortCards } from "@/functions/cards/card-sorting";
import {
  getLocalStorageStoredCards,
  saveLocalStorageCard,
  setLocalStorageCards,
} from "@/functions/local-storage/card-local-storage";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card, CardIdentifier } from "@/models/card/card";
import {
  faFileArrowDown,
  faFileArrowUp,
  faFilter,
  faInfoCircle,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Chip from "../ui/chip/chip";
import Divider from "../ui/divider/divider";
import ColorFilter from "../ui/filters/filter-types/color-filter";
import RarityFilter from "../ui/filters/filter-types/rarity-filter";
import TypeFilter from "../ui/filters/filter-types/type-filter";
import SortingFilter from "../ui/filters/sorting-filter";
import Modal from "../ui/modal/modal";

export interface CardImportExportModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  exportOnly?: boolean;
  exportCards?: Card[];
  exportSideboard?: Card[];
}

export default function CardImportExportModal({
  open,
  setOpen,

  exportOnly = false,
  exportCards,
  exportSideboard,
}: CardImportExportModalProps) {
  const {
    deck,
    setDeck,
    format,
    setFormat,
    commander,
    setCommander,
    partner,
    setPartner,
  } = useContext(DeckContext);
  const { board } = useContext(BoardContext);
  const { addToast } = useContext(ToastContext);
  const { setStoredCards } = useContext(StoredCardsContext);

  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const [colorSort, setColorSort] = React.useState(false);
  const [manaValueSort, setManaValueSort] = React.useState(null as SortType);
  const [alphabeticalSort, setAlphabeticalSort] = React.useState(
    null as SortType
  );

  const [colorFilter, setColorFilter] = React.useState(
    undefined as MTGColor[] | undefined
  );
  const [typeFilter, setTypeFilter] = React.useState(
    undefined as MTGCardType[] | undefined
  );
  const [rarityFilter, setRarityFilter] = React.useState(
    undefined as MTGRarity[] | undefined
  );

  const [cards, setCards] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [copyDisabled, setCopyDisabled] = React.useState(false);

  useEffect(() => {
    setCards(getCardsForExport());
  }, [
    board,
    colorSort,
    manaValueSort,
    alphabeticalSort,
    colorFilter,
    typeFilter,
    rarityFilter,
  ]);

  function getCardsForExport() {
    let decklist = filterCards(
      sortCards(
        exportOnly && exportCards?.length
          ? exportCards
          : getLocalStorageStoredCards(board),
        {
          alphabeticalSort,
          manaValueSort,
          colorSort,
        }
      ),
      {
        colorFilter,
        typeFilter,
        rarityFilter,
      }
    )
      .map(
        (card) =>
          `${card.count} ${card.name} (${card.set?.toUpperCase()}) ${
            card.collectorNumber
          }`
      )
      .join("\n");

    if (
      board === BoardTypes.SIDE ||
      board === BoardTypes.MAIN ||
      (exportOnly && exportSideboard?.length)
    ) {
      const sideBoardCards = sortCards(
        exportOnly && exportSideboard?.length
          ? exportSideboard
          : getLocalStorageStoredCards("side"),
        {
          alphabeticalSort,
          manaValueSort,
          colorSort,
        }
      );

      if (sideBoardCards.length > 0) {
        decklist = "Deck\n" + decklist + "\n\nSideboard";

        sideBoardCards.forEach(
          (card) =>
            (decklist += `\n${card.count} ${
              card.name
            } (${card.set?.toUpperCase()}) ${card.collectorNumber}`)
        );
      }
    }

    return decklist;
  }

  function getCardsFromImport(importText: string) {
    setDisabled(true);

    const deckName = importText.includes("About\nName ")
      ? importText.split("About\nName ")[1].split("\n")[0]
      : undefined;
    if (deck && deckName) {
      deck.name = deckName;
      setDeck({ ...deck });
    }

    const commanderText = importText.includes("Commander\n")
      ? importText.split("Commander\n")[1].split("\n")[0]
      : undefined;

    const partnerText = importText.includes("Commander\n")
      ? importText.split("Commander\n")[1].split("\n")[1].split("\n")[0]
      : undefined;

    const deckText = importText.includes("Deck\n")
      ? importText.split("Deck\n")[1].split("\n\n")[0]
      : importText?.includes("\n\n") && !importText.includes("Deck\n")
      ? importText.split("\n\n")[0]
      : importText;

    const sideboardText = importText.includes("Sideboard\n")
      ? importText.split("Sideboard\n")[1]
      : importText?.includes("\n\n") && !importText.includes("Deck\n")
      ? importText.split("\n\n")[1]
      : undefined;

    const { cardIdentifiers, errorFound } =
      getCardIdentifiersFromText(deckText);

    const {
      cardIdentifiers: sideBoardCardIdentifiers,
      errorFound: errorFoundSideboard,
    } = sideboardText
      ? getCardIdentifiersFromText(sideboardText)
      : { cardIdentifiers: [], errorFound: false };

    const {
      cardIdentifiers: commanderIdentifiers,
      errorFound: errorFoundCommander,
    } = commanderText
      ? getCardIdentifiersFromText(commanderText)
      : { cardIdentifiers: [], errorFound: false };

    const {
      cardIdentifiers: partnerIdentifiers,
      errorFound: errorFoundPartner,
    } = partnerText
      ? getCardIdentifiersFromText(partnerText)
      : { cardIdentifiers: [], errorFound: false };

    if (
      errorFound ||
      errorFoundSideboard ||
      errorFoundCommander ||
      errorFoundPartner
    ) {
      setTimeout(() => setError(false), 3000);
      return;
    } else {
      ScryfallService.getCardsFromCollection(cardIdentifiers).then(
        (newCards) => {
          setLocalStorageCards(
            [],
            sideBoardCardIdentifiers.length ? BoardTypes.MAIN : board
          );
          newCards.forEach((card) =>
            saveLocalStorageCard(
              card,
              1,
              sideBoardCardIdentifiers.length ? BoardTypes.MAIN : board
            )
          );

          if (sideBoardCardIdentifiers.length) {
            ScryfallService.getCardsFromCollection(
              sideBoardCardIdentifiers
            ).then((newSideBoardCards) => {
              setLocalStorageCards([], BoardTypes.SIDE);
              newSideBoardCards.forEach((card) =>
                saveLocalStorageCard(card, 1, BoardTypes.SIDE)
              );
              setStoredCards(newSideBoardCards);
            });
          }

          if (commanderIdentifiers.length) {
            ScryfallService.getCardsFromCollection([
              ...commanderIdentifiers,
              ...partnerIdentifiers,
            ]).then((commanderCards) => {
              commanderCards.forEach((card) => {
                saveLocalStorageCard(card, 1, BoardTypes.MAIN);
                newCards.push(card);
              });

              if (deck) {
                deck.format = MTGFormats.COMMANDER;
                deck.commander = commanderCards[0];
                deck.featuredArtUrl =
                  commanderCards[0].imageURIs?.artCrop || "";

                setDeck({ ...deck });
                setFormat(MTGFormats.COMMANDER);
                setCommander(commanderCards[0]);

                if (commanderCards.length > 1) {
                  deck.partner = commanderCards[1];
                  setPartner(commanderCards[1]);
                }
              }
            });
          }

          setStoredCards(newCards);
          setDisabled(false);
          addToast({
            action: "success",
            title: "Cards Imported!",
            subtitle: "Your cards have been imported",
          });
        }
      );
    }
  }

  function getCardIdentifiersFromText(text: string) {
    const cardIdentifiers: CardIdentifier[] = [];
    let errorFound = false;

    text.split("\n").forEach((card) => {
      if (errorFound) return;

      const cardInfo = card.split(" // ")[0].split(" ");
      const infoLength = cardInfo.length;

      const cardCount = Number(cardInfo?.[0].replace(/[^0-9]/g, ""));
      if (!cardCount) {
        if (cardInfo?.[0].toLowerCase() === "") return;
        else {
          errorFound = true;
          setError(true);
          setDisabled(false);
        }
      }

      const identifier = cardInfo?.[infoLength - 1];
      if (!identifier) {
        errorFound = true;
        setError(true);
        setDisabled(false);
      }

      if (Number(identifier) > 0) {
        const cardSet = cardInfo?.[infoLength - 2]?.substring(1, 4);
        if (!cardSet) {
          errorFound = true;
          setError(true);
          setDisabled(false);
        }

        for (let i = 0; i < cardCount; i++) {
          cardIdentifiers.push({
            set: cardSet.toLowerCase(),
            collector_number: identifier,
          });
        }
      } else if (identifier?.split("-")?.length === 5) {
        for (let i = 0; i < cardCount; i++) {
          cardIdentifiers.push({
            id: identifier,
          });
        }
      } else {
        cardInfo.shift();

        for (let i = 0; i < cardCount; i++) {
          cardIdentifiers.push({
            name: cardInfo.join(" "),
          });
        }
      }
    });

    return { cardIdentifiers, errorFound };
  }

  return (
    <Modal
      title={`${!exportOnly ? "Import/" : ""}Export Cards`}
      open={open}
      setOpen={setOpen}
      end={
        <Button
          rounded
          icon={faFilter}
          type={filtersOpen ? "outlined" : "clear"}
          onClick={() => setFiltersOpen(!filtersOpen)}
        />
      }
      footer={
        <View className="flex flex-row flex-wrap justify-center lg:gap-3 gap-1">
          {!exportOnly && (
            <Button
              rounded
              size="sm"
              type="outlined"
              className="flex-1 min-w-[250px]"
              disabled={disabled}
              action={error ? "danger" : "primary"}
              icon={
                disabled ? faRotate : error ? faInfoCircle : faFileArrowDown
              }
              text={
                disabled
                  ? "Importing..."
                  : error
                  ? "Error Importing Cards!"
                  : "Import from Clipboard"
              }
              onClick={async () =>
                getCardsFromImport(await navigator.clipboard.readText())
              }
            />
          )}

          <Button
            rounded
            size="sm"
            type="outlined"
            className="flex-1 min-w-[250px]"
            disabled={copyDisabled}
            icon={copyDisabled ? faRotate : faFileArrowUp}
            text={copyDisabled ? "Copying..." : "Copy to Clipboard"}
            onClick={() => {
              setCopyDisabled(true);

              setTimeout(() => {
                setCopyDisabled(false);
                navigator.clipboard.writeText(cards);

                addToast({
                  action: "success",
                  title: "Cards Copied!",
                  subtitle: "Your cards have been copied to the clipboard",
                });
              }, 500);
            }}
          />
        </View>
      }
    >
      <View className="flex-1 flex gap-3 lg:max-w-[450px]">
        <View
          className={`${
            filtersOpen ? "max-h-[1000px]" : "max-h-0"
          } flex gap-3 overflow-hidden transition-all duration-300`}
        >
          <View className="flex gap-2 ">
            <Text size="md" weight="bold">
              Colors to Include
            </Text>

            <Divider thick />

            <ColorFilter
              flat
              excludeMono
              colorFilters={colorFilter}
              setColorFilters={setColorFilter}
            />
          </View>

          <View className="flex gap-2 ">
            <Text size="md" weight="bold">
              Types to Filter By
            </Text>

            <Divider thick />

            <TypeFilter
              flat
              typeFilters={typeFilter}
              setTypeFilters={setTypeFilter}
            />
          </View>

          <View className="flex gap-2 ">
            <Text size="md" weight="bold">
              Rarities to Filter By
            </Text>

            <Divider thick />

            <RarityFilter
              flat
              rarityFilters={rarityFilter}
              setRarityFilters={setRarityFilter}
            />
          </View>

          <View className="flex gap-2 ">
            <Text size="md" weight="bold">
              Sort By
            </Text>

            <Divider thick />

            <View className="flex flex-row gap-2 items-center">
              <SortingFilter
                className="flex-1"
                title="Mana Value"
                sortDirection={manaValueSort}
                setSortDirection={setManaValueSort}
              />

              <SortingFilter
                className="flex-1"
                title="Name"
                sortDirection={alphabeticalSort}
                setSortDirection={setAlphabeticalSort}
              />

              <Chip
                size="sm"
                text="Color"
                className="flex-1"
                type={colorSort ? "default" : "outlined"}
                onClick={() => setColorSort(!colorSort)}
              />
            </View>
          </View>
        </View>

        <View className="bg-dark-100 p-4 rounded-xl overflow-hidden">
          <View className="max-h-40 overflow-y-auto">
            <Text mono>{cards}</Text>
          </View>
        </View>

        {!exportOnly && (
          <>
            <Text className="pl-3">
              For importing use one of the standards:
            </Text>
            <Text mono className="-mt-2 px-2.5 py-1.5 bg-dark-100 rounded-lg">
              1 id {"\n"}1 name {"\n"}1 name (set) collection_number
            </Text>
          </>
        )}
      </View>
    </Modal>
  );
}
