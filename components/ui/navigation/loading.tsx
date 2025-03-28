import LoadingContext from "@/contexts/ui/loading.context";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

export default function LoadingView() {
  const { loading } = useContext(LoadingContext);

  const [fade, setFade] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!loading) {
      setFade(true);
      setIsLoading(false);

      setTimeout(() => setFade(false), 500);
    } else {
      setFade(false);
      setIsLoading(true);
    }
  }, [loading]);

  if (isLoading || fade) {
    return (
      <View
        className={`absolute top-0 left-0 flex-1 flex justify-center items-center w-full h-[100dvh] bg-background-100 ${
          !isLoading && "transition-all duration-500"
        } ${fade ? "opacity-0" : "opacity-100"}`}
      >
        <Image
          source={require("assets/Logo.png")}
          className={`max-h-48 max-w-48 animate-[spinReverse_1.5s_linear_infinite]`}
        />
      </View>
    );
  }
}
