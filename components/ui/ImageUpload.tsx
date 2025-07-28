import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { ImageUploadProps } from "@/types";
import * as Icons from "phosphor-react-native";
import { colors, radius } from "@/constants/theme";
import Typo from "./Typo";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "Toca para seleccionar una imagen",
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };

  return (
    <View style={containerStyle}>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          style={styles.uploadArea}
        >
          <Icons.UploadSimple size={32} color={colors.primary} />
          {placeholder && (
            <Typo size={16} color={colors.neutral200}>
              {placeholder}
            </Typo>
          )}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[styles.imageContainer, imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={{ uri: file.uri }}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
            <Icons.XCircleIcon
              size={scale(28)}
              weight="fill"
              color={colors.rose}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  uploadArea: {
    height: verticalScale(150),
    width: "100%",
    backgroundColor: colors.neutral700,
    borderRadius: radius._20,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    borderWidth: 1.5,
    borderColor: colors.neutral600,
    borderStyle: "dashed",
    paddingHorizontal: 20,
  },
  imageContainer: {
    height: scale(350),
    width: "100%",
    borderRadius: radius._15,
    overflow: "hidden",
  },
  deleteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 100,
  },
});
