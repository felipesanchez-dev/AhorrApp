import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { CustomButtonProps } from "@/types";
import { radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Loading from "./Loading";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      disabled={loading}
    >
      {loading ? <Loading /> : children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fed429",
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
});
