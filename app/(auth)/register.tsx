import { StyleSheet, View, Text, Pressable, Animated } from "react-native";
import React, { useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/ui/BackButton";
import Typo from "@/components/ui/Typo";
import Input from "@/components/ui/Input";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/ui/Button";
import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    const res = await registerUser(email, password, name);
    setIsLoading(false);

    if (!res.success) {
      if (res.msg?.includes("email-already-in-use")) {
        setErrors((prev) => ({
          ...prev,
          email: "El correo electrónico ya está en uso.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          name: res.msg || "Error al registrarse",
        }));
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
        </View>

        <View style={styles.content}>
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Icons.UserPlusIcon
                size={verticalScale(32)}
                color={colors.primary}
                weight="fill"
              />
            </View>
            <Typo size={24} fontWeight="700" style={styles.title}>
              Crear Cuenta
            </Typo>
            <Typo size={14} color={colors.textLighter} style={styles.subtitle}>
              Únete a la comunidad de Ahorrapp
            </Typo>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                containerStyle={[
                  styles.inputContainer,
                  errors.name ? styles.inputError : {},
                ]}
                icon={
                  <Icons.UserIcon
                    size={verticalScale(20)}
                    color={errors.name ? colors.error : colors.neutral400}
                  />
                }
              />
              {errors.name && (
                <Animated.View style={styles.errorContainer}>
                  <Icons.WarningCircleIcon
                    size={verticalScale(14)}
                    color={colors.error}
                    weight="fill"
                  />
                  <Text style={styles.errorText}>{errors.name}</Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={[
                  styles.inputContainer,
                  errors.email ? styles.inputError : {},
                ]}
                icon={
                  <Icons.AtIcon
                    size={verticalScale(20)}
                    color={errors.email ? colors.error : colors.neutral400}
                  />
                }
              />
              {errors.email && (
                <Animated.View style={styles.errorContainer}>
                  <Icons.WarningCircleIcon
                    size={verticalScale(14)}
                    color={colors.error}
                    weight="fill"
                  />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  containerStyle={[
                    styles.inputContainer,
                    errors.password ? styles.inputError : {},
                  ]}
                  icon={
                    <Icons.LockIcon
                      size={verticalScale(20)}
                      color={errors.password ? colors.error : colors.neutral400}
                    />
                  }
                />
                <Pressable
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Icons.EyeSlashIcon
                      size={verticalScale(20)}
                      color={colors.neutral400}
                    />
                  ) : (
                    <Icons.EyeIcon
                      size={verticalScale(20)}
                      color={colors.neutral400}
                    />
                  )}
                </Pressable>
              </View>
              {errors.password && (
                <Animated.View style={styles.errorContainer}>
                  <Icons.WarningCircleIcon
                    size={verticalScale(14)}
                    color={colors.error}
                    weight="fill"
                  />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  containerStyle={[
                    styles.inputContainer,
                    errors.confirmPassword ? styles.inputError : {},
                  ]}
                  icon={
                    <Icons.LockKeyIcon
                      size={verticalScale(20)}
                      color={
                        errors.confirmPassword
                          ? colors.error
                          : colors.neutral400
                      }
                    />
                  }
                />
                <Pressable
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Icons.EyeSlashIcon
                      size={verticalScale(20)}
                      color={colors.neutral400}
                    />
                  ) : (
                    <Icons.EyeIcon
                      size={verticalScale(20)}
                      color={colors.neutral400}
                    />
                  )}
                </Pressable>
              </View>
              {errors.confirmPassword && (
                <Animated.View style={styles.errorContainer}>
                  <Icons.WarningCircleIcon
                    size={verticalScale(14)}
                    color={colors.error}
                    weight="fill"
                  />
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                </Animated.View>
              )}
            </View>
          </View>

          <Button
            loading={isLoading}
            onPress={handleSubmit}
            style={styles.registerButton}
          >
            <Typo size={16} fontWeight="600" color={colors.black}>
              Crear cuenta
            </Typo>
          </Button>

          <View style={styles.footer}>
            <Typo size={14} color={colors.textLight}>
              ¿Ya tienes una cuenta?{" "}
            </Typo>
            <Pressable onPress={() => router.navigate("/(auth)/login")}>
              <Typo size={14} fontWeight="600" color={colors.primary}>
                Inicia sesión
              </Typo>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacingY._10,
    paddingHorizontal: spacingX._20,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    justifyContent: "center",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: spacingY._35,
  },
  logoContainer: {
    width: verticalScale(64),
    height: verticalScale(64),
    borderRadius: verticalScale(32),
    backgroundColor: `${colors.primary}15`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._15,
  },
  title: {
    marginBottom: spacingY._7,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
  form: {
    marginBottom: spacingY._25,
  },
  inputGroup: {
    marginBottom: spacingY._17,
  },
  label: {
    fontSize: verticalScale(14),
    fontWeight: "500",
    color: colors.textLight,
    marginBottom: spacingY._7,
  },
  inputContainer: {
    backgroundColor: colors.neutral800,
    borderColor: colors.neutral600,
    borderWidth: 1,
    borderRadius: verticalScale(12),
  },
  inputError: {
    borderColor: colors.error,
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: spacingX._15,
    top: "50%",
    transform: [{ translateY: -verticalScale(10) }],
    padding: spacingX._5,
  },
  registerButton: {
    height: verticalScale(48),
    borderRadius: verticalScale(12),
    marginBottom: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacingY._8,
    paddingHorizontal: spacingX._5,
  },
  errorText: {
    fontSize: verticalScale(12),
    color: colors.error,
    marginLeft: spacingX._5,
    fontWeight: "500",
    flex: 1,
  },
});
