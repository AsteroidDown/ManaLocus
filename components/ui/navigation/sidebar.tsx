import Text from "@/components/ui/text/text";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Button from "../button/button";

export interface SidebarLink {
  title: string;
  href: string;
  links?: SidebarLink[];
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

export default function Sidebar({
  current,
  sections,
}: {
  current?: string;
  sections: SidebarSection[];
}) {
  const width = useWindowDimensions().width;

  const [open, setOpen] = useState(width > 600);

  return (
    <View
      className={`relative flex flex-row min-w-[256] max-w-[256px] min-h-[100dvh] bg-background-100 border-r-2 border-r-dark-200 transition-all duration-300 ${
        !open ? "-ml-[206px]" : ""
      }`}
    >
      <View className="flex-1 px-4 py-2">
        {sections.map((section) => (
          <View className="flex gap-1" key={section.title}>
            <Text size="lg" weight="medium">
              {section.title}
            </Text>

            {section?.links.map((link) => (
              <SidebarLinkLayout
                current={current}
                link={link}
                key={link.title}
              />
            ))}
          </View>
        ))}
      </View>

      <View className="flex flex-row justify-end">
        <Button
          size="sm"
          type="clear"
          icon={faBars}
          onClick={() => setOpen(!open)}
        />
      </View>
    </View>
  );
}

function SidebarLinkLayout({
  current,
  link,
}: {
  current?: string;
  link: SidebarLink;
}) {
  const childIncludesCurrent = checkChildIncludesCurrent(link);

  function checkChildIncludesCurrent(link: SidebarLink): boolean {
    if (link.title === current) return true;
    else if (link.links?.length) {
      return link.links.some((subLink) => checkChildIncludesCurrent(subLink));
    } else return false;
  }

  return (
    <View className="flex gap-1">
      <Link href={link.href}>
        <View
          className={`flex min-w-full px-2 py-0.5 border-[1.5px] rounded-lg hover:bg-primary-300 hover:bg-opacity-25 transition-all duration-300 ${
            current === link.title ? "border-primary-300" : "border-transparent"
          }`}
        >
          <Text size="sm" weight="semi" action="primary">
            {link.title}
          </Text>
        </View>
      </Link>

      {childIncludesCurrent &&
        link.links?.map((subLink) => (
          <View className="flex gap-1 ml-4" key={subLink.title}>
            <SidebarLinkLayout current={current} link={subLink} />
          </View>
        ))}
    </View>
  );
}
