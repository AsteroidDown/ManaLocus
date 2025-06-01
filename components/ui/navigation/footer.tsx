import {
  BlueskyURL,
  DiscordURL,
  GithubURL,
  PatreonURL,
} from "@/constants/urls";
import {
  faBluesky,
  faDiscord,
  faGithub,
  faPatreon,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import moment from "moment";
import { View } from "react-native";
import Button from "../button/button";
import Text from "../text/text";

export default function Footer() {
  const year = moment().format("yyyy");

  return (
    <View className="flex gap-4 min-h-40 lg:px-16 px-4 pt-6 pb-4 bg-dark-200">
      <Text size="xs" className="!text-dark-600">
        Wizards of the Coast, Magic: The Gathering, and their logos are
        trademarks of Wizards of the Coast LLC in the United States and other
        countries. © 1993-{year} Wizards. All Rights Reserved.
      </Text>

      <Text size="xs" className="!text-dark-600">
        ManaLocus LLC is not affiliated with, endorsed, sponsored, or
        specifically approved by Wizards of the Coast LLC. ManaLocus LLC may use
        the trademarks and other intellectual property of Wizards of the Coast
        LLC, which is permitted under Wizards' Fan Site Policy. MAGIC: THE
        GATHERING® is a trademark of Wizards of the Coast. For more information
        about Wizards of the Coast or any of Wizards' trademarks or other
        intellectual property, please visit their website at{" "}
        <Link href="https://company.wizards.com/." className="text-primary-300">
          https://company.wizards.com/.
        </Link>
      </Text>

      <Text size="xs" className="!text-dark-600">
        Some card prices and other card data are provided by{" "}
        <Link href="https://scryfall.com/" className="text-primary-300">
          Scryfall
        </Link>
        . Scryfall makes no guarantee about its price information and recommends
        you see stores for final prices and details.
      </Text>

      <View className="flex flex-row -my-2">
        <Link target="_blank" href={DiscordURL}>
          <Button rounded type="clear" icon={faDiscord} />
        </Link>

        <Link target="_blank" href={PatreonURL}>
          <Button rounded type="clear" icon={faPatreon} />
        </Link>

        <Link target="_blank" href={BlueskyURL}>
          <Button rounded type="clear" icon={faBluesky} />
        </Link>

        <Link target="_blank" href={GithubURL}>
          <Button rounded type="clear" icon={faGithub} />
        </Link>

        <Link target="_blank" href="mailto:support@manalocus.com">
          <Button rounded type="clear" icon={faEnvelope} />
        </Link>
      </View>

      <View className="flex lg:flex-row gap-2">
        <Text size="xs" className="!text-dark-600">
          © {year} ManaLocus LLC
        </Text>

        <View className="flex flex-row flex-wrap items-center gap-2">
          <Link href="legal/terms-of-service" className="-mt-px">
            <Text size="xs" className="!text-primary-300">
              Terms of Service
            </Text>
          </Link>

          <Link href="legal/privacy-policy" className="-mt-px">
            <Text size="xs" className="!text-primary-300">
              Privacy Policy
            </Text>
          </Link>

          <Text size="xs" className="!text-primary-300">
            Affiliate Disclosures
          </Text>
        </View>

        <Text size="xs" className="!text-dark-600">
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
}
