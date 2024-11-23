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

    main: data.main?.map((card: any) => mapDatabaseCardToDeckCard(card)) ?? [],
    side: data.side?.map((card: any) => mapDatabaseCardToDeckCard(card)) ?? [],
    maybe:
      data.maybe?.map((card: any) => mapDatabaseCardToDeckCard(card)) ?? [],
    acquire:
      data.acquire?.map((card: any) => mapDatabaseCardToDeckCard(card)) ?? [],
  };
}

function mapDatabaseCardToDeckCard(card: any): any {
  return {
    scryfallId: card.scryfallId,
    name: card.name,
    count: card.count,
    manaCost: card.manaCost,
    frontImageUrl: card.frontImageUrl,
    backImageUrl: card.backImageUrl,
    tcgPlayerUrl: card.tcgPlayerUrl,
    cardMarketUrl: card.cardMarketUrl,
  };
}
