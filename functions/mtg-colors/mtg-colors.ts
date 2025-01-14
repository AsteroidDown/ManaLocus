import { MTGColorSymbol, MTGColorSymbols } from "@/constants/mtg/mtg-colors";
import { Card } from "@/models/card/card";

export function getDeckColors(cards: Card[]): MTGColorSymbol[] {
  const colors: MTGColorSymbol[] = [];

  cards.forEach((card) => {
    if (colors.length === 5) return colors;

    card.colorIdentity?.forEach((color) => {
      if (!colors.includes(color)) colors.push(color);
    });
  });

  return colors;
}

export function sortColors(colors: MTGColorSymbol[]): MTGColorSymbol[] {
  colors = colors.filter((color) => color !== MTGColorSymbols.COLORLESS);

  if (colors.length === 5) {
    return [
      MTGColorSymbols.WHITE,
      MTGColorSymbols.BLUE,
      MTGColorSymbols.BLACK,
      MTGColorSymbols.RED,
      MTGColorSymbols.GREEN,
    ];
  } else if (colors.length === 4) {
    if (!colors.includes(MTGColorSymbols.WHITE)) {
      return [
        MTGColorSymbols.BLUE,
        MTGColorSymbols.BLACK,
        MTGColorSymbols.RED,
        MTGColorSymbols.GREEN,
      ];
    } else if (!colors.includes(MTGColorSymbols.BLUE)) {
      return [
        MTGColorSymbols.BLACK,
        MTGColorSymbols.RED,
        MTGColorSymbols.GREEN,
        MTGColorSymbols.WHITE,
      ];
    } else if (!colors.includes(MTGColorSymbols.BLACK)) {
      return [
        MTGColorSymbols.RED,
        MTGColorSymbols.GREEN,
        MTGColorSymbols.WHITE,
        MTGColorSymbols.BLUE,
      ];
    } else if (!colors.includes(MTGColorSymbols.RED)) {
      return [
        MTGColorSymbols.GREEN,
        MTGColorSymbols.WHITE,
        MTGColorSymbols.BLUE,
        MTGColorSymbols.BLACK,
      ];
    } else if (!colors.includes(MTGColorSymbols.GREEN)) {
      return [
        MTGColorSymbols.WHITE,
        MTGColorSymbols.BLUE,
        MTGColorSymbols.BLACK,
        MTGColorSymbols.RED,
      ];
    }
  } else if (colors.length === 3) {
    if (!colors.includes(MTGColorSymbols.WHITE)) {
      if (!colors.includes(MTGColorSymbols.BLUE)) {
        // Jund
        return [
          MTGColorSymbols.BLACK,
          MTGColorSymbols.RED,
          MTGColorSymbols.GREEN,
        ];
      } else if (!colors.includes(MTGColorSymbols.BLACK)) {
        // Temur
        return [
          MTGColorSymbols.BLUE,
          MTGColorSymbols.RED,
          MTGColorSymbols.GREEN,
        ];
      } else if (!colors.includes(MTGColorSymbols.RED)) {
        // Sultai
        return [
          MTGColorSymbols.BLUE,
          MTGColorSymbols.BLACK,
          MTGColorSymbols.GREEN,
        ];
      } else if (!colors.includes(MTGColorSymbols.GREEN)) {
        // Grixis
        return [
          MTGColorSymbols.BLUE,
          MTGColorSymbols.BLACK,
          MTGColorSymbols.RED,
        ];
      }
    } else if (!colors.includes(MTGColorSymbols.BLUE)) {
      if (!colors.includes(MTGColorSymbols.BLACK)) {
        // Naya
        return [
          MTGColorSymbols.WHITE,
          MTGColorSymbols.RED,
          MTGColorSymbols.GREEN,
        ];
      } else if (!colors.includes(MTGColorSymbols.RED)) {
        // Abzan
        return [
          MTGColorSymbols.WHITE,
          MTGColorSymbols.BLACK,
          MTGColorSymbols.GREEN,
        ];
      } else if (!colors.includes(MTGColorSymbols.GREEN)) {
        // Mardu
        return [
          MTGColorSymbols.WHITE,
          MTGColorSymbols.BLACK,
          MTGColorSymbols.RED,
        ];
      }
    } else if (!colors.includes(MTGColorSymbols.BLACK)) {
      if (!colors.includes(MTGColorSymbols.RED)) {
        // Bant
        return [
          MTGColorSymbols.WHITE,
          MTGColorSymbols.BLUE,
          MTGColorSymbols.GREEN,
        ];
      } else if (!colors.includes(MTGColorSymbols.GREEN)) {
        // Jeskai
        return [
          MTGColorSymbols.WHITE,
          MTGColorSymbols.BLUE,
          MTGColorSymbols.RED,
        ];
      }
    } else if (!colors.includes(MTGColorSymbols.RED)) {
      // Esper
      if (!colors.includes(MTGColorSymbols.GREEN)) {
        return [
          MTGColorSymbols.WHITE,
          MTGColorSymbols.BLUE,
          MTGColorSymbols.BLACK,
        ];
      }
    }
  } else if (colors.length === 2) {
    if (!colors.includes(MTGColorSymbols.WHITE)) {
      if (!colors.includes(MTGColorSymbols.BLUE)) {
        if (!colors.includes(MTGColorSymbols.BLACK)) {
          // Gruul
          return [MTGColorSymbols.RED, MTGColorSymbols.GREEN];
        } else if (!colors.includes(MTGColorSymbols.RED)) {
          // Golgari
          return [MTGColorSymbols.BLACK, MTGColorSymbols.GREEN];
        } else if (!colors.includes(MTGColorSymbols.GREEN)) {
          // Rakdos
          return [MTGColorSymbols.BLACK, MTGColorSymbols.RED];
        }
      } else if (!colors.includes(MTGColorSymbols.BLACK)) {
        if (!colors.includes(MTGColorSymbols.RED)) {
          // Simic
          return [MTGColorSymbols.BLUE, MTGColorSymbols.GREEN];
        } else if (!colors.includes(MTGColorSymbols.GREEN)) {
          // Izzet
          return [MTGColorSymbols.BLUE, MTGColorSymbols.RED];
        }
      } else if (!colors.includes(MTGColorSymbols.RED)) {
        if (!colors.includes(MTGColorSymbols.GREEN)) {
          // Dimir
          return [MTGColorSymbols.BLUE, MTGColorSymbols.BLACK];
        }
      }
    } else if (!colors.includes(MTGColorSymbols.BLUE)) {
      if (!colors.includes(MTGColorSymbols.BLACK)) {
        if (!colors.includes(MTGColorSymbols.RED)) {
          // Selesnya
          return [MTGColorSymbols.WHITE, MTGColorSymbols.GREEN];
        } else if (!colors.includes(MTGColorSymbols.GREEN)) {
          // Boros
          return [MTGColorSymbols.WHITE, MTGColorSymbols.RED];
        }
      }
    } else if (!colors.includes(MTGColorSymbols.BLACK)) {
      // Azorius
      return [MTGColorSymbols.WHITE, MTGColorSymbols.BLUE];
    } else {
      // Orzhov
      return [MTGColorSymbols.BLACK, MTGColorSymbols.BLUE];
    }
  }

  return colors;
}
