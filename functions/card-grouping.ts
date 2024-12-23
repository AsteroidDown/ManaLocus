import { MTGColorSymbols } from "@/constants/mtg/mtg-colors";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import { Card } from "@/models/card/card";
import {
  CardsSortedByColor,
  CardsSortedByColorMulti,
  CardsSortedByCost,
  CardsSortedByRarity,
  CardsSortedByType,
  CardsSortedCustom,
} from "@/models/sorted-cards/sorted-cards";
import { getCardType } from "./card-information";

export function groupCardsByColor(cards: Card[]): CardsSortedByColor {
  const groupedCards: CardsSortedByColor = {
    white: [],
    blue: [],
    black: [],
    red: [],
    green: [],
    gold: [],
    colorless: [],
    land: [],
  };

  cards.forEach((card) => {
    if (
      card.faces
        ? card.faces?.front.typeLine.includes("Land")
        : card.typeLine.includes("Land")
    ) {
      groupedCards.land.push(card);
    } else if (card.colorIdentity.length > 1) {
      groupedCards.gold.push(card);
    } else if (card.colorIdentity.length === 0) {
      groupedCards.colorless.push(card);
    } else {
      switch (card.colorIdentity[0]) {
        case MTGColorSymbols.WHITE:
          groupedCards.white.push(card);
          return;
        case MTGColorSymbols.BLUE:
          groupedCards.blue.push(card);
          return;
        case MTGColorSymbols.BLACK:
          groupedCards.black.push(card);
          return;
        case MTGColorSymbols.RED:
          groupedCards.red.push(card);
          return;
        case MTGColorSymbols.GREEN:
          groupedCards.green.push(card);
          return;
      }
    }
  });

  return groupedCards;
}

export function groupCardsByColorMulti(cards: Card[]): CardsSortedByColorMulti {
  const groupedCards: CardsSortedByColorMulti = {};

  cards.forEach((card) => {
    // Colorless
    if (!card.colorIdentity.length) {
      groupedCards?.["colorless"]
        ? groupedCards["colorless"].push(card)
        : (groupedCards["colorless"] = [card]);

      // Single Color
    } else if (card.colorIdentity.length === 1) {
      if (card.colorIdentity[0] === MTGColorSymbols.WHITE) {
        groupedCards?.["white"]
          ? groupedCards["white"].push(card)
          : (groupedCards["white"] = [card]);
      } else if (card.colorIdentity[0] === MTGColorSymbols.BLUE) {
        groupedCards?.["blue"]
          ? groupedCards["blue"].push(card)
          : (groupedCards["blue"] = [card]);
      } else if (card.colorIdentity[0] === MTGColorSymbols.BLACK) {
        groupedCards?.["black"]
          ? groupedCards["black"].push(card)
          : (groupedCards["black"] = [card]);
      } else if (card.colorIdentity[0] === MTGColorSymbols.RED) {
        groupedCards?.["red"]
          ? groupedCards["red"].push(card)
          : (groupedCards["red"] = [card]);
      } else if (card.colorIdentity[0] === MTGColorSymbols.GREEN) {
        groupedCards?.["green"]
          ? groupedCards["green"].push(card)
          : (groupedCards["green"] = [card]);
      }

      // Two Color
    } else if (card.colorIdentity.length === 2) {
      if (card.colorIdentity.includes(MTGColorSymbols.WHITE)) {
        // Azorius
        if (card.colorIdentity.includes(MTGColorSymbols.BLUE)) {
          groupedCards?.["azorius"]
            ? groupedCards["azorius"].push(card)
            : (groupedCards["azorius"] = [card]);

          // Orzhov
        } else if (card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
          groupedCards?.["orzhov"]
            ? groupedCards["orzhov"].push(card)
            : (groupedCards["orzhov"] = [card]);

          // Boros
        } else if (card.colorIdentity.includes(MTGColorSymbols.RED)) {
          groupedCards?.["boros"]
            ? groupedCards["boros"].push(card)
            : (groupedCards["boros"] = [card]);

          // Selesnya
        } else {
          groupedCards?.["selesnya"]
            ? groupedCards["selesnya"].push(card)
            : (groupedCards["selesnya"] = [card]);
        }
      } else if (card.colorIdentity.includes(MTGColorSymbols.BLUE)) {
        // Dimir
        if (card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
          groupedCards?.["dimir"]
            ? groupedCards["dimir"].push(card)
            : (groupedCards["dimir"] = [card]);

          // Izzet
        } else if (card.colorIdentity.includes(MTGColorSymbols.RED)) {
          groupedCards?.["izzet"]
            ? groupedCards["izzet"].push(card)
            : (groupedCards["izzet"] = [card]);

          // Simic
        } else {
          groupedCards?.["simic"]
            ? groupedCards["simic"].push(card)
            : (groupedCards["simic"] = [card]);
        }
      } else if (card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
        // Rakdos
        if (card.colorIdentity.includes(MTGColorSymbols.RED)) {
          groupedCards?.["rakdos"]
            ? groupedCards["rakdos"].push(card)
            : (groupedCards["rakdos"] = [card]);

          // Golgari
        } else {
          groupedCards?.["golgari"]
            ? groupedCards["golgari"].push(card)
            : (groupedCards["golgari"] = [card]);
        }
      } else {
        // Gruul
        groupedCards?.["gruul"]
          ? groupedCards["gruul"].push(card)
          : (groupedCards["gruul"] = [card]);
      }

      // Three Color
    } else if (card.colorIdentity.length === 3) {
      if (card.colorIdentity.includes(MTGColorSymbols.WHITE)) {
        if (card.colorIdentity.includes(MTGColorSymbols.BLUE)) {
          // Esper
          if (card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
            groupedCards?.["esper"]
              ? groupedCards["esper"].push(card)
              : (groupedCards["esper"] = [card]);

            // Jeskai
          } else if (card.colorIdentity.includes(MTGColorSymbols.RED)) {
            groupedCards?.["jeskai"]
              ? groupedCards["jeskai"].push(card)
              : (groupedCards["jeskai"] = [card]);

            // Bant
          } else {
            groupedCards?.["bant"]
              ? groupedCards["bant"].push(card)
              : (groupedCards["bant"] = [card]);
          }
        } else if (card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
          // Mardu
          if (card.colorIdentity.includes(MTGColorSymbols.RED)) {
            groupedCards?.["mardu"]
              ? groupedCards["mardu"].push(card)
              : (groupedCards["mardu"] = [card]);

            // Abzan
          } else {
            groupedCards?.["abzan"]
              ? groupedCards["abzan"].push(card)
              : (groupedCards["abzan"] = [card]);
          }

          // Naya
        } else {
          groupedCards?.["naya"]
            ? groupedCards["naya"].push(card)
            : (groupedCards["naya"] = [card]);
        }
      } else if (card.colorIdentity.includes(MTGColorSymbols.BLUE)) {
        if (card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
          // Grixis
          if (card.colorIdentity.includes(MTGColorSymbols.RED)) {
            groupedCards?.["grixis"]
              ? groupedCards["grixis"].push(card)
              : (groupedCards["grixis"] = [card]);

            // Sultai
          } else {
            groupedCards?.["sultai"]
              ? groupedCards["sultai"].push(card)
              : (groupedCards["sultai"] = [card]);
          }

          // Temur
        } else {
          groupedCards?.["temur"]
            ? groupedCards["temur"].push(card)
            : (groupedCards["temur"] = [card]);
        }

        // Jund
      } else {
        groupedCards?.["jund"]
          ? groupedCards["jund"].push(card)
          : (groupedCards["jund"] = [card]);
      }

      // Four Color
    } else if (card.colorIdentity.length === 4) {
      if (!card.colorIdentity.includes(MTGColorSymbols.WHITE)) {
        groupedCards?.["glint"]
          ? groupedCards["glint"].push(card)
          : (groupedCards["glint"] = [card]);
      } else if (!card.colorIdentity.includes(MTGColorSymbols.BLUE)) {
        groupedCards?.["dune"]
          ? groupedCards["dune"].push(card)
          : (groupedCards["dune"] = [card]);
      } else if (!card.colorIdentity.includes(MTGColorSymbols.BLACK)) {
        groupedCards?.["ink"]
          ? groupedCards["ink"].push(card)
          : (groupedCards["ink"] = [card]);
      } else if (!card.colorIdentity.includes(MTGColorSymbols.RED)) {
        groupedCards?.["witch"]
          ? groupedCards["witch"].push(card)
          : (groupedCards["witch"] = [card]);
      } else {
        groupedCards?.["yore"]
          ? groupedCards["yore"].push(card)
          : (groupedCards["yore"] = [card]);
      }
    } else {
      groupedCards?.["wubrg"]
        ? groupedCards["wubrg"].push(card)
        : (groupedCards["wubrg"] = [card]);
    }
  });

  return getGroupedCardsMultiInOrder(groupedCards);
}

export function getGroupedCardsMultiInOrder(
  cards: CardsSortedByColorMulti
): CardsSortedByColorMulti {
  return {
    ...(cards?.white?.length ? { white: cards.white } : {}),
    ...(cards?.blue?.length ? { blue: cards.blue } : {}),
    ...(cards?.black?.length ? { black: cards.black } : {}),
    ...(cards?.red?.length ? { red: cards.red } : {}),
    ...(cards?.green?.length ? { green: cards.green } : {}),

    ...(cards?.azorius?.length ? { azorius: cards.azorius } : {}),
    ...(cards?.dimir?.length ? { dimir: cards.dimir } : {}),
    ...(cards?.rakdos?.length ? { rakdos: cards.rakdos } : {}),
    ...(cards?.gruul?.length ? { gruul: cards.gruul } : {}),
    ...(cards?.selesnya?.length ? { selesnya: cards.selesnya } : {}),

    ...(cards?.orzhov?.length ? { orzhov: cards.orzhov } : {}),
    ...(cards?.golgari?.length ? { golgari: cards.golgari } : {}),
    ...(cards?.simic?.length ? { simic: cards.simic } : {}),
    ...(cards?.izzet?.length ? { izzet: cards.izzet } : {}),
    ...(cards?.boros?.length ? { boros: cards.boros } : {}),

    ...(cards?.esper?.length ? { esper: cards.esper } : {}),
    ...(cards?.grixis?.length ? { grixis: cards.grixis } : {}),
    ...(cards?.jund?.length ? { jund: cards.jund } : {}),
    ...(cards?.naya?.length ? { naya: cards.naya } : {}),
    ...(cards?.bant?.length ? { bant: cards.bant } : {}),

    ...(cards?.jeskai?.length ? { jeskai: cards.jeskai } : {}),
    ...(cards?.sultai?.length ? { sultai: cards.sultai } : {}),
    ...(cards?.mardu?.length ? { mardu: cards.mardu } : {}),
    ...(cards?.temur?.length ? { temur: cards.temur } : {}),
    ...(cards?.abzan?.length ? { abzan: cards.abzan } : {}),

    ...(cards?.yore?.length ? { yore: cards.yore } : {}),
    ...(cards?.glint?.length ? { glint: cards.glint } : {}),
    ...(cards?.dune?.length ? { dune: cards.dune } : {}),
    ...(cards?.ink?.length ? { ink: cards.ink } : {}),
    ...(cards?.witch?.length ? { witch: cards.witch } : {}),

    ...(cards?.wubrg?.length ? { wubrg: cards.wubrg } : {}),

    ...(cards?.colorless?.length ? { colorless: cards.colorless } : {}),
  };
}

export function groupCardsByCost(cards: Card[]): CardsSortedByCost {
  const groupedCards: CardsSortedByCost = {
    zero: [],
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    land: [],
  };

  cards.forEach((card) => {
    if (
      card.faces
        ? card.faces?.front.typeLine.includes("Land")
        : card.typeLine.includes("Land")
    ) {
      groupedCards.land.push(card);
    } else if (card.cmc >= 6) groupedCards.six.push(card);
    else {
      switch (card.cmc) {
        case 0:
          groupedCards.zero.push(card);
          return;
        case 1:
          groupedCards.one.push(card);
          return;
        case 2:
          groupedCards.two.push(card);
          return;
        case 3:
          groupedCards.three.push(card);
          return;
        case 4:
          groupedCards.four.push(card);
          return;
        case 5:
          groupedCards.five.push(card);
          return;
      }
    }
  });

  return groupedCards;
}

export function groupCardsByType(cards: Card[]): CardsSortedByType {
  const groupedCards: CardsSortedByType = {
    land: [],
    enchantment: [],
    artifact: [],
    instant: [],
    sorcery: [],
    creature: [],
    planeswalker: [],
    battle: [],
  };

  cards.forEach((card) => {
    const cardType = getCardType(card);

    switch (cardType.toLowerCase()) {
      case MTGCardTypes.CREATURE:
        groupedCards.creature.push(card);
        return;
      case MTGCardTypes.INSTANT:
        groupedCards.instant.push(card);
        return;
      case MTGCardTypes.SORCERY:
        groupedCards.sorcery.push(card);
        return;
      case MTGCardTypes.ARTIFACT:
        groupedCards.artifact.push(card);
        return;
      case MTGCardTypes.ENCHANTMENT:
        groupedCards.enchantment.push(card);
        return;
      case MTGCardTypes.LAND:
        groupedCards.land.push(card);
        return;
      case MTGCardTypes.PLANESWALKER:
        groupedCards.planeswalker.push(card);
        return;
      case MTGCardTypes.BATTLE:
        groupedCards.battle.push(card);
        return;
    }
  });

  return groupedCards;
}

export function groupCardsByRarity(cards: Card[]): CardsSortedByRarity {
  const groupedCards: CardsSortedByRarity = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
  };

  cards.forEach((card) => {
    switch (card.rarity) {
      case MTGRarities.COMMON:
        groupedCards.common.push(card);
        return;
      case MTGRarities.UNCOMMON:
        groupedCards.uncommon.push(card);
        return;
      case MTGRarities.RARE:
        groupedCards.rare.push(card);
        return;
      case MTGRarities.MYTHIC:
        groupedCards.mythic.push(card);
        return;
    }
  });

  return groupedCards;
}

export function groupCardsCustom(cards: Card[]): CardsSortedCustom {
  const groupedCards: CardsSortedCustom = {};

  const groups: string[] = [];

  cards.forEach((card) => {
    if (!card.group) {
      groupedCards?.["Unsorted"]
        ? groupedCards["Unsorted"].push(card)
        : (groupedCards["Unsorted"] = [card]);
    } else if (!groups.includes(card.group)) {
      groups.push(card.group);
      groupedCards[card.group] = [card];
    } else groupedCards[card.group].push(card);
  });

  return groupedCards;
}
