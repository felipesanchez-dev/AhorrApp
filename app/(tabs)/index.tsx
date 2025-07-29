import { StyleSheet } from "react-native";
import React from "react";
import Typo from "@/components/ui/Typo";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import LoadingSpecial from "@/components/ui/Loadingspecial";

const Home = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Typo>Home</Typo>
        <LoadingSpecial />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
