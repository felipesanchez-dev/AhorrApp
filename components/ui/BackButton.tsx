import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import { verticalScale, horizontalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";

const BackButton = ({ style, iconSize = 18 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <CaretLeftIcon size={iconSize} color={colors.neutral900} weight="bold" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fed429",
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
