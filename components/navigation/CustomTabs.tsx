import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, MotiText } from "moti";

import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import {
  HouseIcon,
  ChartBarIcon,
  WalletIcon,
  UserIcon,
} from "phosphor-react-native";

const tabbarIcons = {
  index: (props: any) => <HouseIcon {...props} />,
  statistics: (props: any) => <ChartBarIcon {...props} />,
  wallet: (props: any) => <WalletIcon {...props} />,
  profile: (props: any) => <UserIcon {...props} />,
};

export default function CustomTabs({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [tabLayouts, setTabLayouts] = useState<
    Record<string, { x: number; width: number }>
  >({});

  const handleLayout = (key: string) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width } }));
  };

  const activeTabLayout = useMemo(() => {
    const activeRouteKey = state.routes[state.index].key;
    return tabLayouts[activeRouteKey];
  }, [state.index, tabLayouts, state.routes]);

  const tabBarContainerStyle: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    height: verticalScale(65) + insets.bottom,
    paddingBottom: insets.bottom,
    backgroundColor: colors.neutral800,
    position: "relative",
  };

  return (
    <View style={tabBarContainerStyle}>
      {activeTabLayout && (
        <MotiView
          style={styles.activeTabPill}
          from={{ translateX: activeTabLayout.x, width: activeTabLayout.width }}
          animate={{
            translateX: activeTabLayout.x,
            width: activeTabLayout.width,
          }}
          transition={{ type: "spring", damping: 16, stiffness: 180 }}
        />
      )}

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const IconComponent =
          tabbarIcons[route.name as keyof typeof tabbarIcons];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            onLayout={handleLayout(route.key)}
            style={styles.tabBarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <View>
              <MotiView
                transition={{ type: "timing", duration: 300 }}
                animate={{ opacity: isFocused ? 0 : 1 }}
              >
                <IconComponent
                  size={verticalScale(30)}
                  weight="regular"
                  color={colors.white}
                />
              </MotiView>

              <MotiView
                style={StyleSheet.absoluteFill}
                transition={{ type: "timing", duration: 300 }}
                animate={{ opacity: isFocused ? 1 : 0 }}
              >
                <IconComponent
                  size={verticalScale(30)}
                  weight="fill"
                  color={colors.primary}
                />
              </MotiView>
            </View>

            <MotiText
              style={[styles.label, { color: colors.white }]}
              from={{ opacity: 0, translateY: 10 }}
              animate={{
                opacity: isFocused ? 1 : 0,
                translateY: isFocused ? 5 : 10,
              }}
              transition={{ type: "timing", duration: 250 }}
            >
             
            </MotiText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabPill: {
    position: "absolute",
    top: verticalScale(15),
    height: verticalScale(38),
    borderRadius: 99,
    backgroundColor: colors.neutral600,
    zIndex: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    bottom: verticalScale(2),
    textTransform: "capitalize",
  },
});
