import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/ui/Typo";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/service/imageService";
import { accountOptionType } from "@/types";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";
import Header from "@/components/ComponentLayout/Header";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Editar perfil",
      icon: <Icons.UserIcon size={26} color={colors.white} weight="bold" />,
      bgColor: "#6366f1",
      routeName: "/(modals)/profileModal",
    },
    {
      title: "Ajustes",
      icon: <Icons.GearSixIcon size={26} color={colors.white} weight="fill" />,
      bgColor: "#059669",
      // routeName: "/(modals)/profileModal",
    },
    {
      title: "Politicas de privacidad",
      icon: <Icons.LockIcon size={26} color={colors.white} weight="bold" />,
      bgColor: "#6366f1",
      // routeName: "/(modals)/profileModal",
    },
    {
      title: "Otras aplicaciones",
      icon: (
        <Icons.GooglePlayLogoIcon
          size={26}
          color={colors.white}
          weight="bold"
        />
      ),
      bgColor: "#2ecc71",
      routeName: "/",
    },
    {
      title: "Creditos al desarrollador",
      icon: <Icons.HeartIcon size={26} color={colors.white} weight="fill" />,
      bgColor: "#380091ff",
      routeName: "/(modals)/credits",
    },
    {
      title: "Cerrar sesión",
      icon: <Icons.SignOutIcon size={26} color={colors.white} weight="bold" />,
      bgColor: "#dc2626",
    },
  ];

  const handlePress = async (item: accountOptionType) => {
    if (item.title === "Cerrar sesión") {
      showLogoutAlert();
    }

    if (item.routeName) router.push(item.routeName);
  };

  const showLogoutAlert = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: () => {
            handleLogout();
          },
          style: "destructive",
        },
      ]
    );
  };
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="TU PERFIL" style={{ marginVertical: spacingY._10 }} />
        <View style={styles.userInfo}>
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"900"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} fontWeight={"600"} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                style={styles.listItem}
                key={index}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item.title}
                  </Typo>
                  <Icons.CaretRightIcon
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
