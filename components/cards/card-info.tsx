import Divider from "@/components/ui/divider/divider";
import Text from "@/components/ui/text/text";
import { Card } from "@/models/card/card";
import { View } from "react-native";
import CardCost from "./card-cost";
import CardText from "./card-text";

export interface CardInfoProps {
  card?: Card;
}

export function CardInfo({ card }: CardInfoProps) {
  return (
    <View className="flex gap-3">
      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Name
        </Text>

        <Text className="flex-[3]">
          {card?.name || "Something cool probably"}
        </Text>
      </View>

      {card?.manaCost && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Cost
            </Text>

            <View className="flex-[3]">
              <CardCost cost={card.manaCost} />
            </View>
          </View>
        </>
      )}

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Type
        </Text>

        <Text className="flex-[3]">
          {card?.typeLine || "Creature - Awesome"}
        </Text>
      </View>

      {card?.loyalty && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Loyalty
            </Text>

            <Text className="flex-[3]">
              <Text
                thickness="bold"
                className="px-2 py-0.5 bg-background-100 rounded"
              >
                {card.loyalty}
              </Text>
            </Text>
          </View>
        </>
      )}

      {card?.power && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Stats
            </Text>

            <Text className="flex-[3]">
              <Text
                thickness="bold"
                className="px-2 py-0.5 bg-background-100 rounded"
              >
                {card.power} / {card.toughness}
              </Text>
            </Text>
          </View>
        </>
      )}

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Text
        </Text>

        <View className="flex-[3]">
          <CardText
            text={card?.oracleText || "{T}: You win the game!"}
            flavor={card?.flavorText}
          />
        </View>
      </View>

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Artist
        </Text>

        <Text className="flex-[3] italic">
          {card?.artist || "No artist listed"}
        </Text>
      </View>
    </View>
  );
}

export function CardFrontInfo({ card }: CardInfoProps) {
  return (
    <View className="flex gap-3">
      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Name
        </Text>

        <Text className="flex-[3]">{card?.faces?.front.name || ""}</Text>
      </View>

      {!!card?.faces?.front.manaCost && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Cost
            </Text>

            <View className="flex-[3]">
              <CardCost cost={card?.faces?.front?.manaCost || ""} />
            </View>
          </View>
        </>
      )}

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Type
        </Text>

        <Text className="flex-[3]">{card?.faces?.front.typeLine || ""}</Text>
      </View>

      {!!card?.faces?.front.loyalty && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Loyalty
            </Text>

            <Text className="flex-[3]">
              <Text
                thickness="bold"
                className="px-2 py-0.5 bg-background-100 rounded"
              >
                {card.faces.front.loyalty}
              </Text>
            </Text>
          </View>
        </>
      )}

      {!!card?.faces?.front.defense && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Defense
            </Text>

            <Text className="flex-[3]">{card.faces.front.defense}</Text>
          </View>
        </>
      )}

      {card?.faces?.front.power && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Stats
            </Text>

            <Text className="flex-[3]">
              {card.faces.front.power}/{card.faces.front.toughness}
            </Text>
          </View>
        </>
      )}

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Text
        </Text>

        <View className="flex-[3]">
          <CardText
            text={card?.faces?.front.oracleText || ""}
            flavor={card?.faces?.front.flavorText}
          />
        </View>
      </View>

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Artist
        </Text>

        <Text className="flex-[3] italic">
          {card?.faces?.front.artist || "No artist listed"}
        </Text>
      </View>
    </View>
  );
}

export function CardBackInfo({ card }: CardInfoProps) {
  return (
    <View className="flex gap-3">
      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Name
        </Text>

        <Text className="flex-[3]">{card?.faces?.back.name || ""}</Text>
      </View>

      {!!card?.faces?.back.manaCost && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Cost
            </Text>

            <View className="flex-[3]">
              <CardCost cost={card?.faces?.back?.manaCost || ""} />
            </View>
          </View>
        </>
      )}

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Type
        </Text>

        <Text className="flex-[3]">{card?.faces?.back.typeLine || ""}</Text>
      </View>

      {!!card?.faces?.back.loyalty && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Loyalty
            </Text>

            <Text className="flex-[3]">
              <Text
                thickness="bold"
                className="px-2 py-0.5 bg-background-100 rounded"
              >
                {card.faces.back.loyalty}
              </Text>
            </Text>
          </View>
        </>
      )}

      {!!card?.faces?.back.defense && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Defense
            </Text>

            <Text className="flex-[3]">{card.faces.back.defense}</Text>
          </View>
        </>
      )}

      {card?.faces?.back.power && (
        <>
          <Divider />

          <View className="flex flex-row gap-2">
            <Text thickness="bold" className="flex-1">
              Stats
            </Text>

            <Text className="flex-[3]">
              {card.faces.back.power}/{card.faces.back.toughness}
            </Text>
          </View>
        </>
      )}

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Text
        </Text>

        <View className="flex-[3]">
          <CardText
            text={card?.faces?.back.oracleText || ""}
            flavor={card?.faces?.back.flavorText}
          />
        </View>
      </View>

      <Divider />

      <View className="flex flex-row gap-2">
        <Text thickness="bold" className="flex-1">
          Artist
        </Text>

        <Text className="flex-[3] italic">
          {card?.faces?.back.artist || "No artist listed"}
        </Text>
      </View>
    </View>
  );
}
