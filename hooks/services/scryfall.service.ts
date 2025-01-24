import { MapRulings } from "@/functions/mapping/ruling-mapping";
import {
  ScryfallToCard,
  ScryfallToSet,
} from "@/functions/mapping/scryfall-mapping";
import { Card, CardIdentifier } from "@/models/card/card";
import { Ruling } from "@/models/card/ruling";
import { Set } from "@/models/card/set";
import { ScryfallCard } from "@/models/scryfall/scryfall-card";
import { ScryfallCatalog } from "@/models/scryfall/scryfall-catalog";
import {
  ScryfallCardList,
  ScryfallSetList,
} from "@/models/scryfall/scryfall-list";
import { ScryfallSet } from "@/models/scryfall/scryfall-set";
import axios from "axios";
import API from "../api-methods/api-methods";
import ScryfallAPI from "../api-methods/scryfall-api-methods";

async function autocomplete(query: string): Promise<string[]> {
  const response: ScryfallCatalog = await ScryfallAPI.get(
    `cards/autocomplete`,
    {
      q: query,
    }
  ).catch((error) => console.error(error));

  return response
    ? response.data.filter((name) => name.substring(0, 2) !== "A-")
    : [];
}

async function findCards(query: string): Promise<Card[]> {
  const response: ScryfallCardList = await ScryfallAPI.get(`cards/search`, {
    q: query + " game:paper",
  }).catch((error) => console.error(error));

  return response ? response.data.map((card) => ScryfallToCard(card)) : [];
}

async function getCard(name: string, exact = false): Promise<Card> {
  const card: ScryfallCard = await ScryfallAPI.get(`cards/named`, {
    ...(exact ? { exact: name } : { fuzzy: name }),
  }).catch((error) => console.error(error));

  return ScryfallToCard(card);
}

async function getCardByNumber(
  setId: string,
  cardNumber: string
): Promise<Card> {
  const card: ScryfallCard = await ScryfallAPI.get(
    `cards/${setId}/${cardNumber}`
  ).catch((error) => console.error(error));

  return ScryfallToCard(card);
}

async function getCardById(cardId: string): Promise<Card> {
  const card: ScryfallCard = await ScryfallAPI.get(`cards/${cardId}`).catch(
    (error) => console.error(error)
  );

  return ScryfallToCard(card);
}

async function getCardPrints(name: string): Promise<Card[]> {
  return (await findCards(`name:/^${name}$/ unique:prints game:paper`)).sort(
    (a, b) =>
      new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
  );
}

async function getCardRulings(id: string): Promise<Ruling[]> {
  const rulings = await ScryfallAPI.get(`cards/${id}/rulings`).catch((error) =>
    console.error(error)
  );

  return MapRulings(rulings.data);
}

async function getCardsFromCollection(cardsIdentifiers: CardIdentifier[]) {
  const bundles: CardIdentifier[][] = [];

  cardsIdentifiers.forEach((identifier, index) => {
    const bundleNumber = Math.floor(index / 75);

    if (bundles.length <= bundleNumber) bundles.push([]);

    bundles[bundleNumber].push(
      (identifier as any).id
        ? { id: (identifier as any).id }
        : (identifier as any).name
        ? { name: (identifier as any).name }
        : {
            set: (identifier as any).set,
            collector_number: (identifier as any).collector_number,
          }
    );
  });

  const scryfallCards: ScryfallCard[] = [];

  await Promise.all(
    bundles.map(
      async (bundle) =>
        await ScryfallAPI.post(`cards/collection`, {
          identifiers: bundle,
        })
          .then((response: ScryfallCardList) =>
            response.data.forEach((scryfallCard) =>
              scryfallCards.push(scryfallCard)
            )
          )
          .catch((error) => console.error(error))
    )
  );

  return scryfallCards.map((scryfallCard) => ScryfallToCard(scryfallCard));
}

async function getRandomCard(): Promise<Card> {
  const card: ScryfallCard = await ScryfallAPI.get(`cards/random`).catch(
    (error) => console.error(error)
  );

  return ScryfallToCard(card);
}

async function getSets(): Promise<Set[]> {
  const response: ScryfallSetList = await ScryfallAPI.get(`sets`).catch(
    (error) => console.error(error)
  );

  return response ? response.data.map((set) => ScryfallToSet(set)) : [];
}

async function getSetByCode(setId: string): Promise<Set> {
  const set: ScryfallSet = await ScryfallAPI.get(`sets/${setId}`).catch(
    (error) => console.error(error)
  );

  return ScryfallToSet(set);
}

async function getSetCards(searchURI: string): Promise<Card[]> {
  const response: ScryfallCardList = await ScryfallAPI.get(
    `${searchURI.split("api.scryfall.com/")[1]}`
  ).catch((error) => console.error(error));

  const cards = response.data.map((card) => ScryfallToCard(card));

  if (response.has_more) {
    return [...cards, ...(await getSetCards(response.next_page))];
  } else return cards;
}

async function getAllCards() {
  const response: ScryfallCardList = await ScryfallAPI.get(
    `bulk-data/default-cards`
  ).catch((error) => console.error(error));

  await axios.get((response as any).download_uri).then((response2) => {
    const data = response2.data;

    API.post(`scryfall/`, {
      cards: data,
    });
  });
}

const ScryfallService = {
  autocomplete,
  findCards,
  getCard,
  getCardById,
  getCardByNumber,
  getCardPrints,
  getCardRulings,
  getCardsFromCollection,
  getRandomCard,
  getSets,
  getSetByCode,
  getSetCards,
  getAllCards,
};

export default ScryfallService;
