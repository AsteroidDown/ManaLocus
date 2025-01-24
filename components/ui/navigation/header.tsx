import UserContext from "@/contexts/user/user.context";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, router } from "expo-router";
import { useContext, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import Button from "../button/button";
import Divider from "../divider/divider";
import Text from "../text/text";

export default function Header() {
  const { user } = useContext(UserContext);

  const width = useWindowDimensions().width;

  const [open, setOpen] = useState(false);

  function navigate(path: string) {
    router.push(path);
    setOpen(false);
  }

  return (
    <View
      className={`flex bg-black shadow-lg overflow-hidden transition-all duration-300 ${
        open ? "max-h-[100dvh] h-[100dvh]" : "max-h-12 h-12"
      }`}
    >
      <View
        className={`flex flex-row justify-between items-center px-6 bg-black z-10`}
      >
        <View className="flex flex-row items-center gap-2">
          <Logo />

          {width > 600 && (
            <View className="flex flex-row items-center gap-2">
              <Link href="/decks">
                <Button square type="clear" text="Decks" size="lg" />
              </Link>

              <Link href="/cards">
                <Button square type="clear" text="Cards" size="lg" />
              </Link>

              {/* <Button square type="clear" text="Explore" size="lg" /> */}
            </View>
          )}
        </View>

        {width > 600 && (
          <View className="flex flex-row items-center gap-2">
            {user ? (
              <Link href={`/users/${user.id}`}>
                <Button square type="clear" size="lg" text={user.name} />
              </Link>
            ) : (
              <Link href="/login">
                <Button square type="clear" text="Login" size="lg" />
              </Link>
            )}
          </View>
        )}

        {width <= 600 && (
          <Button
            square
            size="lg"
            type="clear"
            className="-mr-6"
            icon={faBars}
            onClick={() => setOpen(!open)}
          />
        )}
      </View>

      {width <= 600 && (
        <View className="flex items-center justify-between gap-2 h-full w-full">
          <View className="flex items-start w-full">
            <Divider thick />

            <Button
              start
              square
              size="lg"
              type="clear"
              text="Decks"
              className="w-full"
              onClick={() => navigate("/decks")}
            />

            <Divider thick />

            <Button
              start
              square
              size="lg"
              type="clear"
              text="Cards"
              className="w-full"
              onClick={() => navigate("/cards")}
            />

            <Divider thick />

            {/* <Button
              start
              square
              size="lg"
              type="clear"
              text="Explore"
              className="w-full"
            /> */}

            <Divider thick />
          </View>

          <View className="mb-20 px-16 w-full">
            {!user && (
              <Button
                size="lg"
                text="Login"
                type="outlined"
                className="w-full"
                onClick={() => navigate("/login")}
              />
            )}

            {user && (
              <Button
                size="lg"
                text="My Account"
                type="outlined"
                className="w-full"
                onClick={() => navigate("/users/" + user.id)}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function Logo() {
  return (
    <Link className="flex flex-row gap-4" href="/">
      <View className="flex justify-center items-center">
        <Image
          resizeMode="contain"
          className="max-h-10 max-w-10"
          source={require("assets/Logo.png")}
        />
      </View>

      <View className="flex flex-col">
        <Text
          size="2xl"
          thickness="medium"
          className="hover:text-primary-200 transition-all duration-300"
        >
          Mana Locus
        </Text>

        <View className="flex flex-row">
          <View className="flex-1 h-1 bg-gradient-to-r from-mtg-white to-mtg-blue to-85% rounded-l" />
          <View className="flex-1 h-1 bg-gradient-to-r from-mtg-blue to-mtg-black to-75%" />
          <View className="flex-1 h-1 bg-gradient-to-r from-mtg-black to-mtg-red to-95%" />
          <View className="flex-1 h-1 bg-gradient-to-r from-mtg-red to-mtg-green to-50% rounded-r" />
        </View>
      </View>
    </Link>
  );
}
