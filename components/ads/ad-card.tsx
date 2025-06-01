import { PatreonURL } from "@/constants/urls";
import { AdType } from "@/models/ads/ads";
import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { Linking, Pressable, View } from "react-native";
import Icon from "../ui/icon/icon";
import Text from "../ui/text/text";

export interface AdCardProps {
  type: AdType;
}

export default function AdCard({ type = AdType.AD }: AdCardProps) {
  const [hovered, setHovered] = React.useState(false);

  const borderColor =
    type === AdType.AD
      ? "border-background-300"
      : "border-patreon border-opacity-50";

  const backgroundColor =
    type === AdType.AD ? "bg-background-200" : "bg-patreon bg-opacity-10";

  const hoveredColors =
    type === AdType.AD
      ? "border-primary-300 shadow-primary-300"
      : "border-patreon shadow-patreon";

  async function goToAdd() {
    if (type === AdType.PATREON) {
      return await Linking.openURL(PatreonURL);
    } else return await Linking.openURL("https://manalocus.com/help/ads");
  }

  return (
    <Pressable
      onPress={() => goToAdd()}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`${backgroundColor} relative rounded-xl border-2 outline-none overflow-hidden transition-all duration-300 ${
        hovered
          ? `${hoveredColors} w-[296px] h-[200px] -m-1 shadow-[0_0_16px]`
          : `${borderColor}  w-72 h-48`
      }`}
    >
      {type === AdType.PATREON && <PatreonAd />}
    </Pressable>
  );
}

export function PatreonAd() {
  return (
    <View className="flex justify-center items-center gap-2 w-full h-full px-8">
      <Icon
        icon={faPatreon}
        className="!text-patreon text-[48px] p-5 bg-patreon-secondary border-2 border-patreon border-opacity-90 rounded-full"
      />

      <Text center size="sm" className="!text-dark-600">
        Join our Patreon to remove ads and more!
      </Text>
    </View>
  );
}
