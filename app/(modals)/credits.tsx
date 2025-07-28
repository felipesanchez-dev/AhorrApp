import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Linking,
  SafeAreaView,
  Modal,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import ModalWrapper from "@/components/shared/ModalWrapper";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  GlobeIcon,
  IconWeight,
  InstagramLogoIcon,
} from "phosphor-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Header } from "@react-navigation/elements";
import BackButton from "@/components/ui/BackButton";

const colors = {
  primary: "#fed429",
  neutral900: "#171717",
  neutral800: "#262626",
  neutral700: "#404040",
  neutral100: "#f5f5f5",
  neutral50: "#fafafa",
  accent: "#34d399",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const developerInfo = {
  name: "Felipe Reyes Sanchez",
  role: "Full Stack Developer",
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocJlGJTLxFAW5szulXgdGmb4Pxq84A2G5_fGqlZVXRFtyU93uO4=s360-c-no",
  socials: [
    {
      name: "github",
      icon: GithubLogoIcon,
      url: "https://github.com/felipesanchez-dev",
    },
    {
      name: "Instagram",
      icon: InstagramLogoIcon,
      url: "https://www.instagram.com/felipesanchez_dev",
    },
    {
      name: "linkedin",
      icon: LinkedinLogoIcon,
      url: "https://www.linkedin.com/in/felipereyessa/",
    },

    {
      name: "Sitio web",
      icon: GlobeIcon,
      url: "https://felipesanchezdev.site",
    },
  ],
};

const useEntryAnimation = (delay = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 12, stiffness: 100 })
    );
  }, [delay, opacity, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
};

type SocialIconProps = {
  IconComponent: React.ComponentType<{
    size: number;
    color: string;
    weight?: IconWeight;
  }>;
  url: string;
};
const SocialIcon: React.FC<SocialIconProps> = ({ IconComponent, url }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const handlePress = () => Linking.openURL(url).catch(console.error);
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[styles.iconWrapper, animatedStyle]}
    >
      <IconComponent size={28} color={colors.neutral100} weight="light" />
    </AnimatedPressable>
  );
};

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animationStyle?: Animated.AnimateStyle<ViewStyle>;
};
const Card: React.FC<CardProps> = ({ children, style, animationStyle }) => (
  <Animated.View style={[styles.card, style, animationStyle]}>
    {children}
  </Animated.View>
);

type StoryModalProps = {
  isVisible: boolean;
  onClose: () => void;
};
const StoryModal: React.FC<StoryModalProps> = ({ isVisible, onClose }) => {
  const backdropOpacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  useEffect(() => {
    if (isVisible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  }, [isVisible, backdropOpacity, scale]);
  const handleClose = () => {
    backdropOpacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.8, { duration: 200 });
    setTimeout(onClose, 300);
  };
  return (
    <Modal transparent visible={isVisible} onRequestClose={handleClose}>
      <Animated.View style={[styles.modalBackdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>
    </Modal>
  );
};

const Credits = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const devCardAnimation = useEntryAnimation(100);

  return (
    <ModalWrapper>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Desarrollado por:"
          headerStyle={{ backgroundColor: colors.neutral900 }}
          headerTintColor={colors.neutral50}
          headerLeft={() => <BackButton />}
          headerTitleAlign="center"
        />
        <View style={styles.container}>
          <View>
            <Card animationStyle={devCardAnimation}>
              <Image
                source={{ uri: developerInfo.avatarUrl }}
                style={styles.avatar}
              />
              <Text style={styles.name}>{developerInfo.name}</Text>
              <Text style={styles.role}>{developerInfo.role}</Text>
              <View style={styles.socialsContainer}>
                {developerInfo.socials.map((s) => (
                  <SocialIcon key={s.name} IconComponent={s.icon} url={s.url} />
                ))}
              </View>
            </Card>
          </View>
          <Card animationStyle={devCardAnimation}>
            <Text style={styles.name}>Sobre el desarrollador</Text>
            <Text style={styles.role}>
              Hola, soy Felipe, Ingeniero Informático y creador de Ahorrapp.
              Esta aplicación nace como parte de un proyecto personal para
              seguir creciendo como desarrollador, explorar nuevas tecnologías
              y, sobre todo, crear herramientas útiles, fáciles de usar y con un
              toque divertido.
            </Text>
          </Card>

          <Text style={styles.footerText}>
            &copy; {new Date().getFullYear()} Felipe Reyes Sanchez - Ibagué,
            Colombia
          </Text>
        </View>

        <StoryModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </ModalWrapper>
  );
};

export default Credits;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "rgba(64, 64, 64, 0.7)",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.neutral50,
    textAlign: "center",
  },
  role: {
    fontSize: 14,
    color: colors.neutral100,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 16,
  },
  socialsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconWrapper: {
    marginHorizontal: 10,
    padding: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.neutral50,
  },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  ctaButtonText: {
    color: colors.neutral900,
    fontWeight: "bold",
    fontSize: 14,
  },
  footerText: {
    textAlign: "center",
    color: colors.neutral700,
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: 20,
    padding: 30,
    margin: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.neutral50,
    marginBottom: 20,
  },
  modalParagraph: {
    fontSize: 16,
    color: colors.neutral100,
    lineHeight: 24,
    marginBottom: 16,
  },
  closeButton: { position: "absolute", top: 15, right: 15, padding: 5 },
});
