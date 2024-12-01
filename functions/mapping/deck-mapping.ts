import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";

export function mapDatabaseDeck(data: any, withCards = false): Deck {
  const deck = withCards ? data.deck : data;

  return {
    id: deck.id,

    created: deck.created,
    updated: deck.updated,

    userId: deck.user_id,
    user: {
      ...deck.user,
      name: deck.user.username,
    },

    name: deck.name,
    description: deck.description,

    private: deck.private,
    format: deck.format,

    featuredArtUrl: deck.featuredArtUrl,
    colors: deck.colors,

    main: data.main.map((card: any) => mapDatabaseCardToCard(card)),
    side: data.side.map((card: any) => mapDatabaseCardToCard(card)),
    maybe: data.maybe.map((card: any) => mapDatabaseCardToCard(card)),
    acquire: data.acquire.map((card: any) => mapDatabaseCardToCard(card)),
  };
}

function mapDatabaseCardToCard(card: any): Card {
  return {
    scryfallId: card.scryfallId,
    count: card.count,
    set: card.setId,
    setName: card.setName,
    collectorNumber: card.collectorNumber,
    releasedAt: card.released,
    cardBackId: card.cardBackId,
    artist: card.artist,

    name: card.name,
    colors: card.colors,
    colorIdentity: card.colorIdentity,
    manaCost: card.manaCost,
    cmc: card.cmc,
    rarity: card.rarity,
    typeLine: card.typeLine,
    power: card.power,
    toughness: card.toughness,
    loyalty: card.loyalty,
    defense: card.defense,
    producedMana: card.producedMana,
    oracleText: card.oracleText,
    flavorText: card.flavorText,

    borderColor: card.borderColor,
    frame: card.frame,
    fullArt: card.fullArt,
    frameEffects: card.frameEffects,
    promo: card.promo,
    finishes: card.finishes,
    foil: card.foil,
    nonfoil: card.nonfoil,
    lang: card.lang,

    imageURIs: card.imageURIs,
    faces: card.faces,
    prices: {
      usd: card.prices?.usd ? Number(card.prices.usd) : null,
      usdFoil: card.prices?.usdFoil ? Number(card.prices.usdFoil) : null,
      usdEtched: card.prices?.usdEtched ? Number(card.prices.usdEtched) : null,
      eur: card.prices?.eur ? Number(card.prices.eur) : null,
      eurFoil: card.prices?.eurFoil ? Number(card.prices.eurFoil) : null,
      tix: card.prices?.tix ? Number(card.prices.tix) : null,
    },
    priceUris: card.priceUris,
    legalities: card.legalities,
  };
}
