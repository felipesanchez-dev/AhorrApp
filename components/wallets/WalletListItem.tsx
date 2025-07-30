import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { WalletType } from "@/types";
import { Router } from "expo-router";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "@/components/ui/Typo";

const WalletListItem = ({
  item,
  index,
  router,
  animationDelay,
}: {
  item: WalletType;
  index: number;
  router: Router;
  animationDelay?: number;
}) => {
  const isLongName = item?.name && item.name.length > 20;

  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay || 0)
        .duration(400)
        .springify()
        .damping(12)}
    >
      <TouchableOpacity
        style={[styles.card, isLongName && styles.cardExpanded]}
        onPress={openWallet}
      >
        {isLongName ? (
          <>
            <View style={styles.topRow}>
              <View style={styles.iconContainer}>
                <Image
                  style={{ flex: 1 }}
                  source={item?.image}
                  contentFit="cover"
                  transition={100}
                />
              </View>
              <View style={styles.textContainer}>
                <Typo size={16} fontWeight="900">
                  {item?.name}
                </Typo>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <Typo size={16} fontWeight="900" color={colors.neutral300}>
                ${item?.amount?.toLocaleString("es-CO")}
              </Typo>
            </View>
          </>
        ) : (
          <>
            <View style={styles.mainContent}>
              <View style={styles.iconContainer}>
                <Image
                  style={{ flex: 1 }}
                  source={item?.image}
                  contentFit="cover"
                  transition={100}
                />
              </View>
              <View style={styles.textContainer}>
                <Typo size={16} fontWeight="900">
                  {item?.name}
                </Typo>
              </View>
            </View>

            <View style={styles.balanceContainer}>
              <Typo size={16} fontWeight="900" color={colors.neutral300}>
                ${item?.amount?.toLocaleString("es-CO")}
              </Typo>
              <Icons.CaretRightIcon
                size={verticalScale(20)}
                weight="bold"
                color={colors.neutral500}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(12),
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderWidth: 1,
    borderColor: colors.neutral800,
  },
  cardExpanded: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacingY._5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  iconContainer: {
    height: verticalScale(48),
    width: verticalScale(48),
    backgroundColor: colors.neutral700,
    borderRadius: 100,
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
  },
});
