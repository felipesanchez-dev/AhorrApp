import { StyleSheet } from "react-native";
import React from "react";
import Typo from "@/components/ui/Typo";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import LoadingSpecial from "@/components/ui/Loadingspecial";

const Home = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Typo style={styles.title}>En desarrollo (Index)</Typo>
      <LoadingSpecial />
    </ScreenWrapper>
  );
};

export default Home;

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
