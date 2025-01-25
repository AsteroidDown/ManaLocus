import LoadingContext from "@/contexts/ui/loading.context";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

export default function LoadingView() {
  const { loading, setLoaded } = useContext(LoadingContext);

  const [fade, setFade] = React.useState(false);
  const [rotate, setRotate] = React.useState(false);

  useEffect(() => {
    if (!loading)
      setTimeout(() => {
        setFade(true);
        setLoaded(true);
      }, 500);
    else {
      setFade(false);
      setTimeout(() => setRotate(true), 50);
    }
  }, [loading]);

  return (
    <>
      {(loading || fade) && (
        <View
          className={`absolute top-0 left-0 flex-1 flex justify-center items-center w-full h-[100dvh] bg-background-100 transition-all duration-500 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            source={require("assets/Logo.png")}
            className={`max-h-48 max-w-48 transition-all duration-[150s] ease-linear ${
              rotate ? "rotate-[-30000deg]" : "rotate-0"
            }`}
          />
        </View>
      )}
    </>
  );
}
