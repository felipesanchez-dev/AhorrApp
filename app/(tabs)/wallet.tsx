import { StyleSheet, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

const wallet = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.text}>wallet</Text>
    </ScreenWrapper>
  );
};

export default wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
});
