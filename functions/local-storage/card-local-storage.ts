import { BoardType, BoardTypes } from "@/constants/boards";
import { SideBoardLimit } from "@/constants/mtg/limits";
import { Platform } from "react-native";
import { Card } from "../../models/card/card";
import { titleCase } from "../text-manipulation";

export function getLocalStorageStoredCards(board: BoardType = BoardTypes.MAIN) {
  if (Platform.OS === "ios") return [];

  const storedCards: string[] = JSON.parse(
    localStorage.getItem("cubeCards" + titleCase(board)) || "[]"
  );

  return storedCards.map((savedCard) => JSON.parse(savedCard) as Card);
}

export function setLocalStorageCards(cards: Card[], board?: BoardType) {
  localStorage.setItem(
    "builderCards" + titleCase(board),
    JSON.stringify(cards.map((card) => JSON.stringify(card)))
  );
}

export function saveLocalStorageCard(card: Card, count = 1, board?: BoardType) {
  if (Platform.OS === "ios") return;

  const storedCards = getLocalStorageStoredCards(board);

  if (
    board === "side" &&
    storedCards.reduce((acc, storedCard) => acc + storedCard.count, 0) >=
      SideBoardLimit
  ) {
    return;
  }

  const storedCardIndex = storedCards.findIndex(
    (storedCard) => storedCard.scryfallId === card.scryfallId
  );

  if (storedCardIndex >= 0) storedCards[storedCardIndex].count += count;
  else storedCards.push({ ...card, count });

  const newCards = JSON.stringify([
    ...storedCards.map((storedCard) => JSON.stringify(storedCard)),
  ]);
  localStorage.setItem("cubeCards" + titleCase(board), newCards);

  return storedCards;
}

export function switchLocalStorageCardPrint(
  card: Card,
  print: Card,
  board?: BoardType
) {
  const storedCards = getLocalStorageStoredCards(board);

  const cardIndex = storedCards.findIndex(
    (storedCard) => storedCard.scryfallId === card.scryfallId
  );

  if (cardIndex >= 0) {
    const storedCard = storedCards[cardIndex];
    print.count = storedCard.count;
    storedCards[cardIndex] = print;

    localStorage.setItem(
      "cubeCards" + titleCase(board),
      JSON.stringify(
        storedCards.map((storedCard) => JSON.stringify(storedCard))
      )
    );
  }
}

export function updateLocalStorageCardGroup(
  card: Card,
  group: string,
  board?: BoardType
) {
  const storedCards = getLocalStorageStoredCards(board);

  const cardIndex = storedCards.findIndex(
    (storedCard) => storedCard.scryfallId === card.scryfallId
  );

  if (cardIndex >= 0) {
    storedCards[cardIndex].group = group;

    localStorage.setItem(
      "cubeCards" + titleCase(board),
      JSON.stringify(
        storedCards.map((storedCard) => JSON.stringify(storedCard))
      )
    );
  }
}

export function addToLocalStorageCardCount(card: Card, board?: BoardType) {
  const storedCards = getLocalStorageStoredCards(board);

  if (
    board === "side" &&
    storedCards.reduce((acc, storedCard) => acc + storedCard.count, 0) >=
      SideBoardLimit
  ) {
    return;
  }

  const cardIndex = storedCards.findIndex(
    (storedCard) => storedCard.scryfallId === card.scryfallId
  );

  if (cardIndex >= 0) {
    storedCards[cardIndex].count += 1;

    localStorage.setItem(
      "cubeCards" + titleCase(board),
      JSON.stringify(
        storedCards.map((storedCard) => JSON.stringify(storedCard))
      )
    );
  } else saveLocalStorageCard(card);
}

export function removeFromLocalStorageCardCount(card: Card, board?: BoardType) {
  const storedCards = getLocalStorageStoredCards(board);

  const cardIndex = storedCards.findIndex(
    (storedCard) => storedCard.scryfallId === card.scryfallId
  );

  if (cardIndex >= 0) {
    storedCards[cardIndex].count -= 1;

    if (storedCards[cardIndex].count <= 0) removeLocalStorageCard(card);
    else {
      localStorage.setItem(
        "cubeCards" + titleCase(board),
        JSON.stringify(
          storedCards.map((storedCard) => JSON.stringify(storedCard))
        )
      );
    }
  }
}

export function removeLocalStorageCard(card: Card, board?: BoardType) {
  if (Platform.OS === "ios") return;

  const storedCards = getLocalStorageStoredCards(board);

  const index = storedCards.findIndex(
    (storedCard) => storedCard.scryfallId === card.scryfallId
  );

  if (index >= 0) {
    storedCards.splice(index, 1);
    localStorage.setItem(
      "cubeCards" + titleCase(board),
      JSON.stringify(
        storedCards.map((storedCard) => JSON.stringify(storedCard))
      )
    );
  }
}
