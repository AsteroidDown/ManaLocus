import { currency } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import {
  faFileLines,
  faImage,
  faNewspaper,
  faShare,
  faShop,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Linking, View } from "react-native";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Text from "../ui/text/text";

export function CardLinks({ card }: { card: Card }) {
  const [copiedText, setCopiedText] = useState(false);

  function copyCardText() {
    if (!card) return;

    let text = "";

    if (!card.faces) {
      text += card.name + " " + card?.manaCost + "\n";
      text += card.typeLine + "\n";
      text += card.oracleText + "\n";
      if (card.power) text += card.power + "/" + card.toughness + "\n";
      if (card.loyalty) text += card.loyalty + "\n";
      if (card.defense) text += card.defense + "\n";
    } else {
      text += card.faces.front.name + " " + card?.faces.front.manaCost + "\n";
      text += card.faces.front.typeLine + "\n";
      text += card.faces.front.oracleText + "\n";
      if (card.power)
        text +=
          card.faces.front.power + "/" + card.faces.front.toughness + "\n";
      if (card.loyalty) text += card.faces.front.loyalty + "\n";
      if (card.defense) text += card.faces.front.defense + "\n";

      text += "\n---\n";

      text += card.faces?.back?.name + " " + card?.faces?.back?.manaCost + "\n";
      text += card.faces?.back?.typeLine + "\n";
      text += card.faces?.back?.oracleText + "\n";
      if (card.power)
        text += card.faces.back.power + "/" + card.faces.back.toughness + "\n";
      if (card.loyalty) text += card.faces.back.loyalty + "\n";
      if (card.defense) text += card.faces.back.defense + "\n";
    }

    navigator.clipboard.writeText(text);

    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  return (
    <View className="flex flex-row gap-6 flex-wrap lg:mt-12 mt-2 lg:mb-6 mb-2">
      <View className="flex-1 flex gap-2 min-w-max">
        <Text size="lg" weight="semi">
          From the Web
        </Text>

        <Divider thick />

        {card.relatedUris.edhrec && (
          <Button
            icon={faShare}
            size="sm"
            type="outlined"
            action="success"
            text="View on EDHREC"
            onClick={() => Linking.openURL(card.relatedUris.edhrec)}
          />
        )}

        {card.relatedUris.gatherer && (
          <Button
            icon={faShare}
            size="sm"
            action="success"
            type="outlined"
            text="View on Gatherer"
            onClick={() => Linking.openURL(card.relatedUris.gatherer)}
          />
        )}

        {card.relatedUris.tcgplayerInfiniteArticles && (
          <Button
            icon={faNewspaper}
            size="sm"
            action="success"
            type="outlined"
            text="TCGPlayer Infinite Articles"
            onClick={() =>
              Linking.openURL(card.relatedUris.tcgplayerInfiniteArticles)
            }
          />
        )}

        {card.relatedUris.tcgplayerInfiniteDecks && (
          <Button
            icon={faTable}
            size="sm"
            type="outlined"
            action="success"
            text="TCGPlayer Infinite Decks"
            onClick={() =>
              Linking.openURL(card.relatedUris.tcgplayerInfiniteDecks)
            }
          />
        )}
      </View>

      <View className="flex-1 flex gap-2 min-w-max">
        <Text size="lg" weight="semi">
          Buy Card
        </Text>

        <Divider thick />

        {card.priceUris.tcgplayer && (
          <Button
            icon={faShop}
            size="sm"
            action="info"
            type="outlined"
            text={`TCG Player  ${currency(card.prices?.usd)}`}
            onClick={() => Linking.openURL(card.priceUris.tcgplayer || "")}
          />
        )}

        {card.priceUris.cardmarket && (
          <Button
            icon={faShop}
            size="sm"
            action="info"
            type="outlined"
            text={`Card Market  ${currency(card.prices?.eur, true)}`}
            onClick={() => Linking.openURL(card.priceUris.cardmarket || "")}
          />
        )}

        {card.priceUris.cardhoarder && (
          <Button
            icon={faShop}
            size="sm"
            action="info"
            type="outlined"
            text={`Card Hoarder  ${currency(card.prices?.eur)}`}
            onClick={() => Linking.openURL(card.priceUris.cardhoarder || "")}
          />
        )}
      </View>

      <View className="flex-1 flex gap-2 min-w-max">
        <Text size="lg" weight="semi">
          Card Data
        </Text>

        <Divider thick />

        {card.imageURIs?.png && (
          <Button
            size="sm"
            action="warning"
            type="outlined"
            text="Download PNG"
            icon={faImage}
            onClick={() => Linking.openURL(card.imageURIs?.png || "")}
          />
        )}

        {card.faces?.front.imageUris.png && (
          <Button
            size="sm"
            action="warning"
            type="outlined"
            text="Download Front PNG"
            icon={faImage}
            onClick={() =>
              Linking.openURL(card.faces?.front.imageUris.png || "")
            }
          />
        )}

        {card.faces?.back.imageUris.png && (
          <Button
            size="sm"
            action="warning"
            type="outlined"
            text="Download Back PNG"
            icon={faImage}
            onClick={() =>
              Linking.openURL(card.faces?.back.imageUris.png || "")
            }
          />
        )}

        {card.imageURIs?.artCrop && (
          <Button
            size="sm"
            action="warning"
            type="outlined"
            text="Download Art Crop"
            icon={faImage}
            onClick={() => Linking.openURL(card.imageURIs?.artCrop || "")}
          />
        )}

        {card.faces?.front.imageUris.artCrop && (
          <Button
            size="sm"
            action="warning"
            type="outlined"
            text="Download Front Art Crop"
            icon={faImage}
            onClick={() =>
              Linking.openURL(card.faces?.front.imageUris.artCrop || "")
            }
          />
        )}

        {card.faces?.back.imageUris.artCrop && (
          <Button
            size="sm"
            action="warning"
            type="outlined"
            text="Download Back Art Crop"
            icon={faImage}
            onClick={() =>
              Linking.openURL(card.faces?.back.imageUris.artCrop || "")
            }
          />
        )}

        <Button
          size="sm"
          type="outlined"
          action={copiedText ? "success" : "warning"}
          text={copiedText ? "Copied!" : "Copy Card Text"}
          icon={faFileLines}
          onClick={copyCardText}
        />
      </View>
    </View>
  );
}
