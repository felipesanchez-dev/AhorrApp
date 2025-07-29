import { StyleSheet } from "react-native";
import React from "react";
import Typo from "@/components/ui/Typo";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

const Home = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Typo>Home</Typo>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
