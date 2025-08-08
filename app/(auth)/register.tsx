import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";
import GlassCard from "@/components/shared/GlassCard";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Typo from "@/components/ui/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  const [showErrors, setShowErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const titleScaleAnim = useRef(new Animated.Value(0.95)).current;
  const titleOpacityAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(16)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  const errorAnims = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    password: useRef(new Animated.Value(0)).current,
    confirmPassword: useRef(new Animated.Value(0)).current,
  };

  const shakeAnims = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    password: useRef(new Animated.Value(0)).current,
    confirmPassword: useRef(new Animated.Value(0)).current,
  };

  const eyeScaleAnims = {
    password: useRef(new Animated.Value(1)).current,
    confirmPassword: useRef(new Animated.Value(1)).current,
  };

  const brand = "AhorrApp";
  const letterAnims = useRef(
    Array.from({ length: brand.length }, () => new Animated.Value(0))
  ).current;
  const [brandWidth, setBrandWidth] = useState(0);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(titleScaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacityAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      Animated.stagger(
        35,
        letterAnims.map((v) =>
          Animated.timing(v, {
            toValue: 1,
            duration: 350,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        )
      ).start();
    }, 120);

    setTimeout(() => {
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 250);

    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.006,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
  }, [
    fadeAnim,
    slideAnim,
    titleScaleAnim,
    titleOpacityAnim,
    letterAnims,
    formSlideAnim,
    buttonPulseAnim,
  ]);

  useEffect(() => {
    if (brandWidth <= 0) return;
    shimmerAnim.setValue(0);
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [brandWidth, shimmerAnim]);

  const animateErrorIn = (field: keyof typeof errorAnims) => {
    Animated.timing(errorAnims[field], {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const shake = (field: keyof typeof shakeAnims) => {
    shakeAnims[field].setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnims[field], {
        toValue: 1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnims[field], {
        toValue: -1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnims[field], {
        toValue: 1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnims[field], {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    const newShowErrors = {
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
      newShowErrors.name = true;
      animateErrorIn("name");
      shake("name");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
      newShowErrors.email = true;
      animateErrorIn("email");
      shake("email");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
      newShowErrors.email = true;
      animateErrorIn("email");
      shake("email");
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida";
      newShowErrors.password = true;
      animateErrorIn("password");
      shake("password");
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      newShowErrors.password = true;
      animateErrorIn("password");
      shake("password");
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      newShowErrors.confirmPassword = true;
      animateErrorIn("confirmPassword");
      shake("confirmPassword");
      isValid = false;
    }

    setErrors(newErrors);
    setShowErrors(newShowErrors);
    return isValid;
  };

  const handlePasswordToggle = (field: "password" | "confirmPassword") => {
    Animated.sequence([
      Animated.timing(eyeScaleAnims[field], {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(eyeScaleAnims[field], {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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
        setShowErrors((prev) => ({ ...prev, email: true }));
        animateErrorIn("email");
        shake("email");
      } else {
        setErrors((prev) => ({
          ...prev,
          name: res.msg || "Error al registrarse",
        }));
        setShowErrors((prev) => ({ ...prev, name: true }));
        animateErrorIn("name");
        shake("name");
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.brandSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: titleOpacityAnim,
                  transform: [{ scale: titleScaleAnim }],
                },
              ]}
              onLayout={(e) => setBrandWidth(e.nativeEvent.layout.width)}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {brand.split("").map((ch, idx) => (
                  <Animated.Text
                    key={`${ch}-${idx}`}
                    style={[
                      styles.brandText,
                      {
                        transform: [
                          {
                            translateY: letterAnims[idx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [4, 0],
                            }),
                          },
                          {
                            scale: letterAnims[idx].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.98, 1],
                            }),
                          },
                        ],
                        opacity: letterAnims[idx].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.4, 1],
                        }),
                        textShadowColor: colors.primary,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 10,
                      },
                    ]}
                  >
                    {ch}
                  </Animated.Text>
                ))}
                {brandWidth > 0 && (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.shimmerBar,
                      {
                        width: Math.max(brandWidth * 0.35, 70),
                        transform: [
                          {
                            translateX: shimmerAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [
                                -brandWidth * 0.8,
                                brandWidth * 0.8,
                              ],
                            }),
                          },
                          { rotate: "8deg" },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(255,255,255,0.5)",
                        "transparent",
                      ]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                )}
              </View>
            </Animated.View>
            <Typo size={22} fontWeight="700" style={styles.title}>
              Crear Cuenta
            </Typo>
            <Typo size={13} color={colors.textLighter} style={styles.subtitle}>
              Únete a la comunidad de AhorrApp
            </Typo>
          </View>

          <Animated.View
            style={[
              styles.form,
              {
                transform: [{ translateY: formSlideAnim }],
              },
            ]}
          >
            <GlassCard style={styles.glassCard}>
              <View style={styles.inputGroupGlass}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <Animated.View
                  style={{
                    transform: [
                      {
                        translateX: shakeAnims.name.interpolate({
                          inputRange: [-1, 1],
                          outputRange: [-3, 3],
                        }),
                      },
                    ],
                  }}
                >
                  <Input
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholder="Ingresa tu nombre de usuario"
                    containerStyle={[
                      styles.inputContainer,
                      showErrors.name ? styles.inputError : {},
                    ]}
                  />
                </Animated.View>
                {showErrors.name && errors.name && (
                  <Animated.View
                    style={[
                      styles.errorContainer,
                      {
                        opacity: errorAnims.name,
                        transform: [
                          {
                            translateY: errorAnims.name.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.errorText}>{errors.name}</Text>
                  </Animated.View>
                )}
              </View>
            </GlassCard>

            <GlassCard style={styles.glassCard}>
              <View style={styles.inputGroupGlass}>
                <Text style={styles.label}>Correo electrónico</Text>
                <Animated.View
                  style={{
                    transform: [
                      {
                        translateX: shakeAnims.email.interpolate({
                          inputRange: [-1, 1],
                          outputRange: [-3, 3],
                        }),
                      },
                    ],
                  }}
                >
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Ingresa tu correo"
                    containerStyle={[
                      styles.inputContainer,
                      showErrors.email ? styles.inputError : {},
                    ]}
                  />
                </Animated.View>
                {showErrors.email && errors.email && (
                  <Animated.View
                    style={[
                      styles.errorContainer,
                      {
                        opacity: errorAnims.email,
                        transform: [
                          {
                            translateY: errorAnims.email.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.errorText}>{errors.email}</Text>
                  </Animated.View>
                )}
              </View>
            </GlassCard>

            <GlassCard style={styles.glassCard}>
              <View style={styles.inputGroupGlass}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordInputContainer}>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateX: shakeAnims.password.interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-3, 3],
                          }),
                        },
                      ],
                    }}
                  >
                    <Input
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholder="Ingresa tu contraseña"
                      containerStyle={[
                        styles.inputContainer,
                        showErrors.password ? styles.inputError : {},
                      ]}
                    />
                  </Animated.View>
                  <Pressable
                    style={styles.passwordToggle}
                    onPress={() => handlePasswordToggle("password")}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    <Animated.Text
                      style={[
                        styles.toggleText,
                        { transform: [{ scale: eyeScaleAnims.password }] },
                      ]}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </Animated.Text>
                  </Pressable>
                </View>
                {showErrors.password && errors.password && (
                  <Animated.View
                    style={[
                      styles.errorContainer,
                      {
                        opacity: errorAnims.password,
                        transform: [
                          {
                            translateY: errorAnims.password.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.errorText}>{errors.password}</Text>
                  </Animated.View>
                )}
              </View>
            </GlassCard>

            <GlassCard style={styles.glassCard}>
              <View style={styles.inputGroupGlass}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={styles.passwordInputContainer}>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateX: shakeAnims.confirmPassword.interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-3, 3],
                          }),
                        },
                      ],
                    }}
                  >
                    <Input
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="Confirma tu contraseña"
                      containerStyle={[
                        styles.inputContainer,
                        showErrors.confirmPassword ? styles.inputError : {},
                      ]}
                    />
                  </Animated.View>
                  <Pressable
                    style={styles.passwordToggle}
                    onPress={() => handlePasswordToggle("confirmPassword")}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    <Animated.Text
                      style={[
                        styles.toggleText,
                        {
                          transform: [{ scale: eyeScaleAnims.confirmPassword }],
                        },
                      ]}
                    >
                      {showConfirmPassword ? "Ocultar" : "Mostrar"}
                    </Animated.Text>
                  </Pressable>
                </View>
                {showErrors.confirmPassword && errors.confirmPassword && (
                  <Animated.View
                    style={[
                      styles.errorContainer,
                      {
                        opacity: errorAnims.confirmPassword,
                        transform: [
                          {
                            translateY: errorAnims.confirmPassword.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  </Animated.View>
                )}
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonPulseAnim }] }}>
            <Button
              loading={isLoading}
              onPress={handleSubmit}
              style={styles.registerButton}
            >
              <Typo size={16} fontWeight="700" color={colors.black}>
                Crear cuenta
              </Typo>
            </Button>
          </Animated.View>

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
        </Animated.View>

        {isLoading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.black} />
              <Text style={styles.loadingText}>Creando cuenta…</Text>
            </View>
          </View>
        )}
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
    marginBottom: spacingY._30,
  },
  logoContainer: {
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._20,
    borderRadius: verticalScale(20),
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  brandText: {
    fontSize: verticalScale(28),
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -0.3,
  },
  title: {
    marginBottom: spacingY._5,
    textAlign: "center",
    color: colors.text,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: verticalScale(18),
  },
  form: {
    marginBottom: spacingY._20,
  },
  glassCard: {
    marginBottom: spacingY._10,
  },
  inputGroupGlass: {
    gap: spacingY._7,
  },
  inputGroup: {
    marginBottom: spacingY._15,
  },
  label: {
    fontSize: verticalScale(13),
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: spacingY._7,
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: verticalScale(12),
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
    shadowColor: colors.error,
    shadowOpacity: 0.2,
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordToggle: {
    position: "absolute",
    right: spacingX._12,
    top: "50%",
    transform: [{ translateY: -verticalScale(10) }],
    padding: spacingX._5,
    borderRadius: verticalScale(6),
    backgroundColor: "transparent",
  },
  toggleText: {
    color: colors.neutral400,
    fontWeight: "600",
    fontSize: verticalScale(12),
  },
  registerButton: {
    height: verticalScale(46),
    borderRadius: verticalScale(12),
    marginBottom: spacingY._20,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
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
    marginTop: spacingY._7,
    paddingHorizontal: spacingX._5,
  },
  errorText: {
    fontSize: verticalScale(12),
    color: colors.error,
    fontWeight: "500",
    flex: 1,
  },
  shimmerBar: {
    position: "absolute",
    top: -verticalScale(4),
    bottom: -verticalScale(4),
    borderRadius: verticalScale(8),
    opacity: 0.6,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: colors.primary,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._16,
    borderRadius: verticalScale(14),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  loadingText: {
    color: colors.black,
    fontWeight: "700",
    fontSize: verticalScale(14),
  },
});
