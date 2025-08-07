import { colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
  style?: any;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors: gradientColors = [colors.neutral900, colors.neutral800, colors.neutral900],
  style,
}) => {
  return (
    <LinearGradient
      colors={gradientColors as any}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
