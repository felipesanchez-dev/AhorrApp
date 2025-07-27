import React from "react";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/ui/Typo";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideInLeft,
  BounceIn,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Welcome = () => {
  const router = useRouter();
  const openInstagram = () => {
    const instagramUrl = "https://www.instagram.com/felipesanchez_dev";
    Linking.openURL(instagramUrl).catch((err) =>
      console.error("Error al abrir Instagram:", err)
    );
  };

  const handleStart = async () => {
    try {
      await AsyncStorage.setItem("hasOpenedApp", "true");
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Failed to set AsyncStorage item:", error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Animated.View entering={SlideInRight.delay(200).duration(800)}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
            <Typo fontWeight={"500"}>Iniciar sesión</Typo>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={styles.imageContainer}
          entering={BounceIn.delay(400).duration(1200)}
        >
          <Animated.Image
            entering={FadeIn.delay(600).duration(1500)}
            source={require("@/assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={styles.footer}
          entering={FadeInUp.delay(800).duration(1000)}
        >
          <Animated.View
            style={styles.titleContainer}
            entering={FadeInDown.delay(1000).duration(800)}
          >
            <Typo size={25} fontWeight={"800"}>
              TOMA EL CONTROL DE TUS
            </Typo>
            <Typo size={25} fontWeight={"900"} color="#fed429">
              FINANZAS
            </Typo>
          </Animated.View>

          <Animated.View
            style={styles.buttonContainer}
            entering={BounceIn.delay(1400).duration(1000)}
          >
            <Button onPress={handleStart}>
              <Typo size={22} fontWeight={"800"} color={colors.neutral900}>
                Comenzar
              </Typo>
            </Button>
          </Animated.View>

          <Animated.View
            style={styles.creditContainer}
            entering={SlideInLeft.delay(1200).duration(800)}
          >
            <Typo size={16} color={colors.text}>
              Desarrollada por:
            </Typo>
            <TouchableOpacity onPress={openInstagram}>
              <Typo size={16} color={colors.text} style={styles.developerText}>
                &copy; Felipe Reyes Sanchez
              </Typo>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(400),
    alignSelf: "center",
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingY._20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  titleContainer: {
    alignItems: "center",
    gap: 5,
  },
  creditContainer: {
    alignItems: "center",
    gap: 2,
  },
  developerText: {
    textDecorationLine: "underline",
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingY._25,
  },
});
