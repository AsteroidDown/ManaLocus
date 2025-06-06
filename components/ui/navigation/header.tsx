import UserContext from "@/contexts/user/user.context";
import {
  faBars,
  faChevronDown,
  faToolbox,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, router } from "expo-router";
import { useContext, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import Button from "../button/button";
import Divider from "../divider/divider";
import Dropdown from "../dropdown/dropdown";
import Icon from "../icon/icon";
import Text from "../text/text";

export default function Header() {
  const { user } = useContext(UserContext);

  const width = useWindowDimensions().width;

  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

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
            <View className="flex flex-row items-center">
              <Link href="/decks">
                <Button
                  square
                  size="md"
                  type="clear"
                  text="Decks"
                  buttonClasses="min-h-12"
                />
              </Link>

              <Link href="/cards">
                <Button
                  square
                  size="md"
                  type="clear"
                  text="Cards"
                  buttonClasses="min-h-12"
                />
              </Link>

              <Button
                square
                size="md"
                type="clear"
                text="Explore"
                buttonClasses="min-h-12"
                onClick={() => setExploreOpen(!exploreOpen)}
              >
                <Icon
                  size="sm"
                  action="primary"
                  icon={faChevronDown}
                  className={`${
                    exploreOpen ? "rotate-180" : ""
                  } text-primary-200 transition-all duration-300`}
                />

                <View className="-mx-1">
                  <Dropdown expanded={exploreOpen} setExpanded={setExploreOpen}>
                    <View className="flex flex-col mt-3 border-2 border-primary-300 !bg-background-100 rounded-xl !bg-opacity-95 overflow-auto max-h-[250px]">
                      <Button
                        start
                        square
                        type="clear"
                        text="Builders"
                        icon={faUsers}
                        className="w-full"
                        onClick={() => {
                          navigate("/users");
                          setExploreOpen(false);
                        }}
                      />

                      <Button
                        start
                        square
                        type="clear"
                        text="Kits"
                        icon={faToolbox}
                        className="w-full"
                        buttonClasses="gap-1.5"
                        onClick={() => {
                          navigate("/kits");
                          setExploreOpen(false);
                        }}
                      />
                    </View>
                  </Dropdown>
                </View>
              </Button>

              <Link href="/help">
                <Button
                  square
                  size="md"
                  type="clear"
                  text="Help"
                  buttonClasses="min-h-12"
                />
              </Link>
            </View>
          )}
        </View>

        {width > 600 && (
          <View className="flex flex-row items-center gap-2">
            {user?.name ? (
              <Link href={`/users/${user.name}`}>
                <Button
                  square
                  size="md"
                  type="clear"
                  text={user.name}
                  buttonClasses="min-h-12"
                />
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  square
                  size="md"
                  type="clear"
                  text="Login"
                  buttonClasses="min-h-12"
                />
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

            <Button
              start
              square
              size="lg"
              type="clear"
              text="Builders"
              className="w-full"
              onClick={() => navigate("/users")}
            />

            <Divider thick />

            <Button
              start
              square
              size="lg"
              type="clear"
              text="Kits"
              className="w-full"
              buttonClasses="gap-1.5"
              onClick={() => navigate("/kits")}
            />

            <Divider thick />

            <Button
              start
              square
              size="lg"
              type="clear"
              text="Help"
              className="w-full"
              buttonClasses="gap-1.5"
              onClick={() => navigate("/help")}
            />

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
                onClick={() => navigate("/users/" + user.name)}
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
          weight="medium"
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
