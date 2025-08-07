import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { AnimatePresence, View as MotiView } from "moti";
import Typo from "@/components/ui/Typo";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import Loading from "@/components/ui/Loading";
import { LinearGradient } from "expo-linear-gradient";
import WalletListItem from "@/components/wallets/WalletListItem";
import AnimatedBalance from "@/components/wallets/AnimatedBalance";
import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";

const wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: wallets,
    error,
    loading,
  } = useFetchData<WalletType>(user ? "wallets" : "", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => total + (wallet.amount || 0), 0);
  };

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centeredMessage}>
          <Typo color={colors.rose}>Error al cargar los datos.</Typo>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <LinearGradient
        colors={["#1E1E1E", colors.black]}
        style={styles.gradient}
      />

      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={styles.balanceView}
      >
        <Typo size={16} color={colors.neutral400} style={{ marginBottom: 8 }}>
          Balance Total
        </Typo>
        <AnimatedBalance value={getTotalBalance()} />
      </MotiView>

      <MotiView
        from={{ translateY: 1000 }}
        animate={{ translateY: 0 }}
        transition={{ type: "timing", duration: 700, delay: 200 }}
        style={styles.walletsSheet}
      >
        <View style={styles.sheetHandle} />

        <View style={styles.sheetHeader}>
          <Typo size={20} fontWeight={"600"}>
            MIS BILLETERAS
          </Typo>
          <TouchableOpacity
            onPress={() => router.push("/(modals)/walletModal")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icons.PlusCircleIcon
              size={verticalScale(33)}
              weight="fill"
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {loading && <Loading />}

        <AnimatePresence>
          {!loading && wallets.length === 0 && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.centeredMessage}
            >
              <Icons.WalletIcon size={48} color={colors.neutral700} />
              <Typo color={colors.neutral400} style={{ marginTop: 15 }}>
                Aún no tienes billeteras.
              </Typo>
              <Typo size={14} color={colors.neutral500}>
                Crea la primera usando el botón +
              </Typo>
            </MotiView>
          )}
        </AnimatePresence>

        {!loading && (
          <FlatList
            data={wallets}
            keyExtractor={(item, index) => item.id ?? `wallet-${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <WalletListItem
                item={item}
                index={index}
                router={router}
                animationDelay={index * 100}
              />
            )}
            contentContainerStyle={styles.listStyle}
          />
        )}
      </MotiView>
    </ScreenWrapper>
  );
};

export default wallet;

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  balanceView: {
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacingY._20,
  },
  walletsSheet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    paddingTop: spacingY._15,
    paddingHorizontal: spacingX._20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.neutral700,
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: spacingY._15,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._20,
  },
  listStyle: {
    paddingBottom: spacingY._30,
    gap: verticalScale(20),
  },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingBottom: 50,
  },
});
