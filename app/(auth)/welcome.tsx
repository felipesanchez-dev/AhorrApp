import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";
import Button from "@/components/ui/Button";
import Typo from "@/components/ui/Typo";
import { colors, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  BounceIn,
  Easing,
  Extrapolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "TOMA EL CONTROL",
    subtitle: "DE TUS FINANZAS",
    description:
      "Gestiona tu dinero de manera inteligente y alcanza tus objetivos financieros",
    image: require("@/assets/images/welcome2.png"),
    color: "#fed429",
  },
  {
    id: 2,
    title: "ANALIZA",
    subtitle: "TUS GASTOS",
    description:
      "Obtén insights detallados sobre tus patrones de gasto y mejora tus hábitos",
    image: require("@/assets/images/welcome3.png"),
    color: "#fed429",
  },
];

const Welcome = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideProgress = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const nextButtonScale = useSharedValue(1);
  const loginButtonOpacity = useSharedValue(0);

  const openInstagram = () => {
    const instagramUrl = "https://www.instagram.com/felipesanchez_dev";
    Linking.openURL(instagramUrl).catch((err) =>
      console.error("Error al abrir Instagram:", err)
    );
  };

  const handleStart = async () => {
    buttonScale.value = withSpring(
      0.95,
      {
        damping: 15,
        stiffness: 300,
      },
      () => {
        buttonScale.value = withSpring(1, {
          damping: 15,
          stiffness: 300,
        });
      }
    );

    try {
      await AsyncStorage.setItem("hasOpenedApp", "true");
      router.push("/(auth)/register");
    } catch (error) {
      console.error("Failed to set AsyncStorage item:", error);
    }
  };

  const onScrollEnd = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    setCurrentSlide(slideIndex);
    slideProgress.value = slideIndex;

    if (slideIndex === slides.length - 1) {
      loginButtonOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      loginButtonOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const nextSlide = () => {
    nextButtonScale.value = withSpring(
      0.9,
      {
        damping: 15,
        stiffness: 400,
      },
      () => {
        nextButtonScale.value = withSpring(1, {
          damping: 15,
          stiffness: 400,
        });
      }
    );

    if (currentSlide < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentSlide + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const nextButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextButtonScale.value }],
  }));

  const loginButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loginButtonOpacity.value,
    transform: [
      {
        translateY: interpolate(
          loginButtonOpacity.value,
          [0, 1],
          [20, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const renderSlide = (slide: (typeof slides)[0], index: number) => {
    return (
      <View key={slide.id} style={[styles.slide, { width: SCREEN_WIDTH }]}>
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={[colors.neutral900, slide.color + "15", colors.neutral900]}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {index === slides.length - 1 && (
          <Animated.View
            style={[styles.headerContainer, loginButtonAnimatedStyle]}
            entering={SlideInRight.delay(200).duration(800)}
          >
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              style={styles.loginButton}
            >
              <BlurView intensity={20} style={styles.blurContainer}>
                <Typo fontWeight="600" size={14} color={colors.white}>
                  Iniciar sesión
                </Typo>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View
          style={styles.imageContainer}
          entering={BounceIn.delay(400 + index * 200).duration(1200)}
        >
          <Animated.Image
            entering={FadeIn.delay(600 + index * 200).duration(1500)}
            source={slide.image}
            style={styles.welcomeImage}
            resizeMode="contain"
          />

          <Animated.View
            style={[
              styles.floatingElement,
              { backgroundColor: slide.color + "20" },
            ]}
            entering={BounceIn.delay(1000 + index * 200).duration(1000)}
          />
          <Animated.View
            style={[
              styles.floatingElement2,
              { backgroundColor: slide.color + "10" },
            ]}
            entering={BounceIn.delay(1200 + index * 200).duration(1200)}
          />
        </Animated.View>

        <Animated.View
          style={styles.contentCard}
          entering={FadeInUp.delay(800 + index * 200).duration(1000)}
        >
          <BlurView intensity={20} style={styles.glassContainer}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.05)",
                "rgba(255, 255, 255, 0.02)",
                "rgba(255, 255, 255, 0.05)",
              ]}
              style={styles.glassOverlay}
            />

            <View style={styles.indicatorContainer}>
              {slides.map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        i === index ? slide.color : colors.neutral600,
                      width: i === index ? scale(24) : scale(8),
                    },
                  ]}
                />
              ))}
            </View>

            <Animated.View
              style={styles.textContainer}
              entering={FadeInDown.delay(1000 + index * 200).duration(800)}
            >
              <View style={styles.titleContainer}>
                <Typo size={28} fontWeight="800" color={colors.white}>
                  {slide.title}
                </Typo>
                <Typo size={28} fontWeight="900" color={slide.color}>
                  {slide.subtitle}
                </Typo>
              </View>

              <Typo
                size={16}
                fontWeight="400"
                color={colors.textLight}
                style={styles.description}
              >
                {slide.description}
              </Typo>
            </Animated.View>

            <Animated.View
              style={styles.actionContainer}
              entering={BounceIn.delay(1400 + index * 200).duration(1000)}
            >
              {index === slides.length - 1 ? (
                <Animated.View
                  style={[styles.buttonContainer, buttonAnimatedStyle]}
                >
                  <View style={styles.gradientButtonWrapper}>
                    <LinearGradient
                      colors={[slide.color, slide.color + "CC"]}
                      style={styles.gradientButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Button
                        onPress={handleStart}
                        style={styles.transparentButton}
                      >
                        <View style={styles.buttonContent}>
                          <Typo
                            size={18}
                            fontWeight="700"
                            color={colors.neutral900}
                          >
                            Comenzar Ahora
                          </Typo>
                        </View>
                      </Button>
                    </LinearGradient>
                  </View>
                </Animated.View>
              ) : (
                <Animated.View style={nextButtonAnimatedStyle}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={nextSlide}
                  >
                    <BlurView intensity={25} style={styles.nextButtonBlur}>
                      <LinearGradient
                        colors={[slide.color + "30", slide.color + "10"]}
                        style={styles.nextButtonGradient}
                      >
                        <Typo size={16} fontWeight="600" color={colors.white}>
                          Siguiente
                        </Typo>
                      </LinearGradient>
                    </BlurView>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>

            {index === slides.length - 1 && (
              <Animated.View
                style={styles.creditContainer}
                entering={SlideInLeft.delay(1600).duration(800)}
              >
                <Typo size={14} color={colors.textLight}>
                  Desarrollada por:
                </Typo>
                <TouchableOpacity onPress={openInstagram}>
                  <Typo
                    size={14}
                    color={slide.color}
                    style={styles.developerText}
                  >
                    © Felipe Reyes Sanchez
                  </Typo>
                </TouchableOpacity>
              </Animated.View>
            )}
          </BlurView>
        </Animated.View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          bounces={false}
          style={styles.scrollView}
        >
          {slides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? spacingY._50 : spacingY._30,
    position: "relative",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  headerContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? spacingY._50 : spacingY._30,
    right: spacingY._20,
    zIndex: 10,
  },
  loginButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  blurContainer: {
    paddingHorizontal: spacingY._20,
    paddingVertical: spacingY._10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingY._5,
    position: "relative",
    zIndex: 1,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(600),
    alignSelf: "center",
  },
  floatingElement: {
    position: "absolute",
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    top: "20%",
    right: "10%",
    opacity: 0.3,
  },
  floatingElement2: {
    position: "absolute",
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    bottom: "30%",
    left: "15%",
    opacity: 0.2,
  },
  contentCard: {
    marginHorizontal: spacingY._15,
    marginBottom: spacingY._25,
    borderRadius: 30,
    overflow: "hidden",
    zIndex: 2,
  },
  glassContainer: {
    backgroundColor: "rgba(23, 23, 23, 0.8)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: spacingY._25,
    paddingBottom: spacingY._30,
    position: "relative",
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._25,
    gap: spacingY._8,
    zIndex: 1,
  },
  indicator: {
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: colors.neutral600,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: spacingY._30,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: spacingY._15,
    gap: spacingY._5,
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacingY._10,
  },
  actionContainer: {
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  buttonContainer: {
    width: "100%",
  },
  gradientButtonWrapper: {
    borderRadius: 25,
    overflow: "hidden",
  },
  gradientButton: {
    borderRadius: 25,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  transparentButton: {
    backgroundColor: "transparent",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingY._8,
  },
  nextButton: {
    borderRadius: 20,
    overflow: "hidden",
    minWidth: scale(140),
  },
  nextButtonBlur: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  nextButtonGradient: {
    paddingHorizontal: spacingY._25,
    paddingVertical: spacingY._12,
    alignItems: "center",
    borderRadius: 20,
  },
  creditContainer: {
    alignItems: "center",
    gap: spacingY._5,
    marginTop: spacingY._20,
    paddingTop: spacingY._20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
  developerText: {
    textDecorationLine: "underline",
    opacity: 0.9,
  },
});
