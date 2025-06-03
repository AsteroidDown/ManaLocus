import Text from "@/components/ui/text/text";
import { SymbolMap } from "@/constants/mtg/mtg-symbols";
import { Size } from "@/constants/ui/sizes";
import { Image, View, ViewProps } from "react-native";

export type CardTextProps = ViewProps & {
  text: string;
  flavor?: string;
  size?: Size;
};

export default function CardText({
  text,
  flavor,
  size = "md",
  className,
}: CardTextProps) {
  if (!text) return;

  const lines = text.split("\n").map((line) => {
    let loyalty: "add" | "remove" | undefined = undefined;
    let value: string | undefined = undefined;

    if (
      (!text.includes("Spree") && line[0] === "+") ||
      line[0] === "−" ||
      line.substring(0, 2) === "0:"
    ) {
      loyalty =
        line[0] === "+" ? "add" : line[0] === "−" ? "remove" : undefined;
      value = line
        .split(":")?.[0]
        ?.substring(loyalty ? 1 : 0)
        .trim();
      line = line.substring(line.indexOf(":") + 1).trim();
    }

    const foundSymbols = line.split("{");

    const symbolSections = foundSymbols.reduce((acc, section) => {
      if (!section?.length) return acc;

      const symbolEnd = section.indexOf("}");
      const symbol =
        symbolEnd > 0 ? "{" + section.substring(0, symbolEnd + 1) : null;
      const content = section.substring(symbolEnd + 1);

      if (symbol) acc.push(symbol);
      acc.push(content);

      return acc;
    }, [] as string[]);

    const sections = symbolSections.reduce((acc, section) => {
      if (!(section.includes("(") || section.includes(")"))) {
        acc.push(section);
        return acc;
      }

      const italicStart = section.indexOf("(");
      const italicEnd = section.indexOf(")");

      if (italicEnd === -1) {
        acc.push(" " + section.substring(italicStart));
      } else if (italicStart === -1) {
        acc.push(section.substring(0, italicEnd + 1));
      } else {
        const beforeItalic = section.substring(0, italicStart);
        const italic = section.substring(italicStart, italicEnd + 1);
        const afterItalic = section.substring(italicEnd + 1);

        acc.push(beforeItalic);
        acc.push(italic);
        acc.push(afterItalic);
      }

      return acc;
    }, [] as string[]);

    return { loyalty, value, sections };
  });

  return (
    <View className={`flex gap-4 ${className}`}>
      <View className="flex flex-row flex-wrap gap-2 items-center">
        {lines.map((line, index) => (
          <Text className="items-center" key={index}>
            {line.value && (
              <View className="flex flex-row items-center gap-2">
                <Text
                  weight="bold"
                  className="px-2 py-0.5 min-w-10 text-center bg-dark-300 rounded"
                >
                  {line.value !== "0"
                    ? line.loyalty === "add"
                      ? "+"
                      : line.loyalty === "remove"
                      ? "-"
                      : ""
                    : ""}
                  {line.value}
                </Text>

                <Text>
                  {line.sections.map((section, index) => (
                    <Text
                      key={section + index}
                      className={
                        section[0] === "(" ||
                        section[1] === "(" ||
                        section[section.length - 1] === ")"
                          ? "italic"
                          : ""
                      }
                    >
                      {section[0] === "{" && (
                        <Image
                          className={`${getImageSize(size)} mx-px`}
                          source={{ uri: SymbolMap.get(section) }}
                        />
                      )}

                      {section[0] !== "{" && <Text>{section}</Text>}
                    </Text>
                  ))}
                </Text>
              </View>
            )}

            {!line.value &&
              line.sections.map((section, index) => (
                <Text
                  key={section + index}
                  className={
                    section[0] === "(" ||
                    section[1] === "(" ||
                    section[section.length - 1] === ")"
                      ? "italic"
                      : ""
                  }
                >
                  {section[0] === "{" && (
                    <Image
                      className={`${getImageSize(size)} mx-px`}
                      source={{ uri: SymbolMap.get(section) }}
                    />
                  )}

                  {section[0] !== "{" && <Text>{section}</Text>}
                </Text>
              ))}
          </Text>
        ))}
      </View>

      {flavor && (
        <Text italic size="sm">
          {flavor}
        </Text>
      )}
    </View>
  );
}

function getImageSize(size: Size) {
  if (size === "xs") return "h-2 w-2";
  else if (size === "sm") return "h-3 w-3 -mb-[2px]";
  else if (size === "md") return "h-4 w-4 -mb-[3px]";
  else if (size === "lg") return "h-6 w-6 -mb-[5px]";
  else if (size === "xl") return "h-8 w-8 -mb-[13px]";
  else return "h-10 w-10 -mb-[23px]";
}
