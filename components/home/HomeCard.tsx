import {
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import Typo from "../ui/Typo";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const HomeCard = () => {
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  const balanceOpacity = useSharedValue(0);

  React.useEffect(() => {
    balanceOpacity.value = withTiming(1, { duration: 800 });

    const pulseAnimation = () => {
      scaleValue.value = withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      );
      setTimeout(pulseAnimation, 4000);
    };
    pulseAnimation();
  }, []);

  const animatedBalanceStyle = useAnimatedStyle(() => ({
    opacity: balanceOpacity.value,
    transform: [{ scale: scaleValue.value }],
  }));

  const handleMenuPress = () => {
    rotateValue.value = withSpring(rotateValue.value + 180);
  };

  const animatedMenuStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));
  return (
    <Animated.View
      style={styles.cardWrapper}
      entering={FadeInDown.duration(600).springify().damping(15)}
    >
      <ImageBackground
        source={require("@/assets/images/card.png")}
        resizeMode="cover"
        style={styles.bgImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Animated.View style={[styles.balanceInfo, animatedBalanceStyle]}>
              <Animated.View entering={FadeInUp.delay(200).duration(400)}>
                <Typo color={colors.neutral850} fontWeight="900" size={13}>
                  BALANCE TOTAL
                </Typo>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(400).duration(500)}>
                <Typo
                  color={colors.black}
                  fontWeight="700"
                  size={32}
                  style={styles.balanceAmount}
                >
                  $12,345.67
                </Typo>
              </Animated.View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600).duration(400)}>
              <TouchableOpacity
                style={styles.menuButton}
                activeOpacity={0.8}
                onPress={handleMenuPress}
              >
                <Animated.View style={animatedMenuStyle}>
                  <Icons.DotsThreeOutlineIcon
                    size={16}
                    color={colors.black}
                    weight="bold"
                  />
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.View
            style={styles.statsRow}
            entering={FadeInUp.delay(800).duration(500)}
          >
            <Animated.View
              style={styles.statCard}
              entering={FadeInUp.delay(900).duration(400)}
            >
              <View style={styles.statHeader}>
                <View
                  style={[
                    styles.statIndicator,
                    { backgroundColor: colors.green },
                  ]}
                >
                  <Icons.ArrowDownIcon
                    size={10}
                    color={colors.white}
                    weight="bold"
                  />
                </View>
                <Typo size={13} color={colors.black} fontWeight="800">
                  INGRESOS
                </Typo>
              </View>
              <Typo size={16} color={colors.green} fontWeight="800">
                $5,000
              </Typo>
            </Animated.View>

            <View style={styles.divider} />

            <Animated.View
              style={styles.statCard}
              entering={FadeInUp.delay(1000).duration(400)}
            >
              <View style={styles.statHeader}>
                <View
                  style={[
                    styles.statIndicator,
                    { backgroundColor: colors.rose },
                  ]}
                >
                  <Icons.ArrowUpIcon
                    size={10}
                    color={colors.white}
                    weight="bold"
                  />
                </View>
                <Typo size={13} color={colors.black} fontWeight="800">
                  GASTOS
                </Typo>
              </View>
              <Typo size={16} color={colors.rose} fontWeight="800">
                $2,345
              </Typo>
            </Animated.View>
          </Animated.View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    marginHorizontal: 4,
    marginVertical: 8,
  },
  bgImage: {
    height: 220,
    width: "100%",
  },
  backgroundImageStyle: {
    borderRadius: 28,
  },
  container: {
    flex: 1,
    padding: spacingY._25,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacingY._8,
  },
  balanceInfo: {
    flex: 1,
    gap: spacingY._8,
  },
  balanceAmount: {
    marginTop: 4,
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: spacingY._12,
    borderRadius: radius._20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: radius._20,
    padding: spacingY._15,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginTop: spacingY._10,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: spacingY._5,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
  },
  statIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    width: 1.5,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: spacingX._15,
    borderRadius: 1,
  },
});
