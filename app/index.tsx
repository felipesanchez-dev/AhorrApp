import { Image, StyleSheet, View, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const hasOpenedApp = await AsyncStorage.getItem("hasOpenedApp");
        if (hasOpenedApp === null) {
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error("Failed to access AsyncStorage:", error);
        setIsFirstTime(true);
      }
    };

    checkFirstTime();

    const animationSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.elastic(2),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          { iterations: 2 }
        ),
      ]),
    ]);

    animationSequence.start();
  }, [router, scaleAnim, opacityAnim, rotateAnim, bounceAnim]);

  useEffect(() => {
    if (isFirstTime === null) return;

    const navigate = () => {
      if (isFirstTime) {
        router.replace("/(auth)/welcome");
      } else if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    };

    const timer = setTimeout(navigate, 2000);

    return () => clearTimeout(timer);
  }, [isFirstTime, user, router]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotate },
              { translateY: bounce },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("@/assets/images/logo.png")}
        />
      </Animated.View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fed429",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "70%",
    aspectRatio: 1,
    maxWidth: 300,
  },
});
