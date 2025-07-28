import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { View } from "moti";
import Typo from "@/components/ui/Typo";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";

const wallet = () => {
  const router = useRouter();
  const getTotalBalance = () => {
    return 5000;
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              ${getTotalBalance()?.toFixed(0)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"600"}>
              MIS BILLETERAS
            </Typo>
            <TouchableOpacity onPress={() => router.push("/(modals)/walletModal")}>
              <Icons.PlusCircleIcon
                size={verticalScale(20)}
                weight="bold"
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </ScreenWrapper>
  );
};

export default wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._20,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  lisStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
