import { Alert, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/shared/ModalWrapper";
import { View } from "moti";
import Header from "@/components/layout/Header";
import BackButton from "@/components/ui/BackButton";
import Typo from "@/components/ui/Typo";
import Input from "@/components/ui/Input";
import { WalletType } from "@/types";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ui/ImageUpload";
import { createOrUpdateWallet } from "@/service/walletService";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet.name,
        image: oldWallet.image ? { uri: oldWallet.image } : null,
      });
    }
  }, [oldWallet?.id, oldWallet?.name, oldWallet?.image]);

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Error", "El nombre y la imagen no pueden estar vacíos.");
      return;
    }

    const data: Partial<WalletType> = {
      name,
      image,
      uid: user?.uid,
    };

    if (oldWallet?.id) {
      data.id = oldWallet.id;
    }

    setLoading(true);
    const response = await createOrUpdateWallet(data);
    setLoading(false);

    if (response.success) {
      router.back();
    } else {
      Alert.alert("Error", response.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Editar Billetera" : "Nueva Billetera"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo>Nombre de la billetera:</Typo>
            <Input
              placeholder="Ej: Ahorros, Efectivo"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo>Imagen de la billetera:</Typo>
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Sube una imagen"
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
            {oldWallet?.id ? "Actualizar Billetera" : "Crear Billetera"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

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
