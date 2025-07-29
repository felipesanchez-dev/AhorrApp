import { View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LoadingSpecial = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        source={require("@/assets/animations/Piggy bank loop.json")}
        style={{ width: 200, height: 200 }}
        autoPlay
        loop
        speed={1.5}
      />
    </View>
  );
};

export default LoadingSpecial;
