import { StyleSheet, Text } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

const statistics = () => {
  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.text}>statistics</Text>
    </ScreenWrapper>
  );
};

export default statistics;

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
