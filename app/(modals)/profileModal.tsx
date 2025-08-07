import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/shared/ModalWrapper";
import { View } from "moti";
import BackButton from "@/components/ui/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/service/imageService";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/ui/Typo";
import Input from "@/components/ui/Input";
import { UserDataType } from "@/types";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/service/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Header from "@/components/ComponentLayout/Header";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    setLoading(true);
    const response = await updateUser(user?.uid as string, userData);
    setLoading(false);

    if (response.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("Error", response.msg);
    }
  };
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Editar Perfil"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={onPickImage} activeOpacity={0.8}>
              <Image
                style={styles.avatar}
                source={getProfileImage(userData.image)}
                contentFit="cover"
                transition={100}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <Icons.PencilIcon
                size={scale(20)}
                color={colors.neutral800}
                weight="fill"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo>Nombre:</Typo>
            <Input
              placeholder={userData.name}
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo
            fontWeight="700"
            style={{ textAlign: "center" }}
            color={colors.black}
          >
            Guardar Cambios
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
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
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
