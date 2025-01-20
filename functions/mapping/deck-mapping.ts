import { Card, CardImageUris, CardPart } from "@/models/card/card";
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
    favorites: data.favorites || 0,
    views: data.views || 0,

    private: deck.private,
    format: deck.format,

    featuredArtUrl: deck.featuredArtUrl,
    colors: deck.colors,

    main: data.main
      ? data.main.map((card: any) => mapDatabaseCardToCard(card))
      : [],
    side: data.side
      ? data.side.map((card: any) => mapDatabaseCardToCard(card))
      : [],
    maybe: data.maybe
      ? data.maybe.map((card: any) => mapDatabaseCardToCard(card))
      : [],
    acquire: data.acquire
      ? data.acquire.map((card: any) => mapDatabaseCardToCard(card))
      : [],

    dashboard: data.dashboard?.sections
      ? { sections: data.dashboard?.sections }
      : undefined,

    commander: deck?.commander
      ? mapDatabaseCardToCard(deck.commander)
      : undefined,

    partner: deck?.partner ? mapDatabaseCardToCard(deck.partner) : undefined,

    isKit: !!deck?.isKit,
    inProgress: !!deck?.inProgress,
  };
}

function mapDatabaseCardToCard(card: any): Card {
  return {
    scryfallId: card.scryfallId,
    count: card.count || 1,
    group: card?.group,
    set: card.set,
    setName: card.setName,
    collectorNumber: card.collectorNumber,
    releasedAt: card.releasedAt,
    cardBackId: card.cardBackId,
    artist: card.artist,

    name: card.name,
    colors: card.colors ? JSON.parse(card.colors.replace(/'/g, '"')) : [],
    colorIdentity: card.colorIdentity
      ? JSON.parse(card.colorIdentity.replace(/'/g, '"'))
      : [],
    manaCost: card.manaCost,
    cmc: card.cmc,
    rarity: card.rarity,
    typeLine: card.typeLine,
    power: card.power,
    toughness: card.toughness,
    loyalty: card.loyalty,
    defense: card.defense,
    producedMana: card.producedMana
      ? JSON.parse(card.producedMana.replace(/'/g, '"'))
      : [],
    oracleText: card.oracleText,
    flavorText: card.flavorText,

    borderColor: card.borderColor,
    frame: card.frame,
    fullArt: card.fullArt,
    frameEffects: card.frameEffects
      ? JSON.parse(card.frameEffects.replace(/'/g, '"'))
      : [],
    promo: card.promo,
    finishes: card.finishes ? JSON.parse(card.finishes.replace(/'/g, '"')) : [],
    foil: card.foil,
    nonfoil: card.nonfoil,
    lang: card.lang,

    ...(card.imageURIs && {
      imageURIs: mapDatabaseCardImageUris(card.imageURIs),
    }),

    faces: card.faces?.length
      ? {
          front: {
            name: card.faces[0].name,
            manaCost: card.faces[0]?.mana_cost,
            typeLine: card.faces[0].type_line,
            power: card.faces[0]?.power,
            toughness: card.faces[0]?.toughness,
            loyalty: card.faces[0]?.loyalty,
            defense: card.faces[0]?.defense,
            oracleText: card.faces[0].oracle_text,
            flavorText: card.faces[0].flavor_text,
            imageUris: mapDatabaseCardImageUris(card.faces[0].image_uris),
            artist: card.faces[0].artist,
            frameEffects: card.faces[0].frame_effects
              ? JSON.parse(card.faces[0].frame_effects.replace(/'/g, '"'))
              : [],
          },
          back: {
            name: card.faces[1].name,
            manaCost: card.faces[1]?.mana_cost,
            typeLine: card.faces[1].type_line,
            power: card.faces[1].power,
            toughness: card.faces[1].toughness,
            loyalty: card.faces[1]?.loyalty,
            defense: card.faces[1]?.defense,
            oracleText: card.faces[1].oracle_text,
            flavorText: card.faces[1].flavor_text,
            imageUris: mapDatabaseCardImageUris(card.faces[1].image_uris),
            artist: card.faces[1].artist,
            frameEffects: card.faces[1].frame_effects
              ? JSON.parse(card.faces[1].frame_effects.replace(/'/g, '"'))
              : [],
          },
        }
      : null,
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
    allParts: card.allParts
      ? card.allParts.map((part: any) => mapDatabaseCardPart(part))
      : [],
  };
}

function mapDatabaseCardPart(part: any): CardPart {
  return {
    component: part.component,
    id: part.id,
    name: part.name,
    object: part.object,
    typeLine: part.type_line,
    uri: part.uri,
  };
}

function mapDatabaseCardImageUris(imageURIs: any): CardImageUris {
  return {
    small: imageURIs?.small,
    normal: imageURIs?.normal,
    large: imageURIs?.large,

    png: imageURIs?.png,
    artCrop: imageURIs?.art_crop,
    borderCrop: imageURIs?.border_crop,
  };
}
