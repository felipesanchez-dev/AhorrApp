import React, { useEffect } from "react";
import { TextInput } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedBalanceProps {
  value: number;
}

const AnimatedBalance = ({ value }: AnimatedBalanceProps) => {
  const balance = useSharedValue(0);

  useEffect(() => {
    balance.value = withTiming(value, {
      duration: 700,
      easing: Easing.out(Easing.exp),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    const formattedValue = Math.round(balance.value).toLocaleString("es-CO");
    return {
      text: `$${formattedValue}`,
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`$${Math.round(value).toLocaleString("es-CO")}`}
      style={[{ fontSize: 45, fontWeight: "500", color: "white" }]}
      animatedProps={animatedProps}
    />
  );
};

export default AnimatedBalance;
