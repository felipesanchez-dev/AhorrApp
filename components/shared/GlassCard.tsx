import { spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BlurView } from "expo-blur";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface GlassCardProps {
  style?: ViewStyle;
  padding?: boolean;
  intensity?: number;
}

const GlassCard = ({
  children,
  style,
  padding = true,
  intensity = 24,
}: PropsWithChildren<GlassCardProps>) => {
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
      <View style={[padding && styles.inner]}>{children}</View>
    </BlurView>
  );
};

export default GlassCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: verticalScale(18),
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  inner: {
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
  },
});
