import { StyleSheet } from "react-native";
import React from "react";
import Typo from "@/components/ui/Typo";
import LoadingSpecial from "@/components/ui/Loadingspecial";
import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";

const statistics = () => {
  return (
     <ScreenWrapper style={styles.container}>
      <Typo style={styles.title}>En desarrollo (statistics)</Typo>
      <LoadingSpecial />
    </ScreenWrapper>
  );
};

export default statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
