import { StyleSheet, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typo from "../ui/Typo";

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={"900"}
          style={{ textAlign: "center", width: leftIcon ? "82%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftcon: {
    alignSelf: "flex-start",
  },
});
