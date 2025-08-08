import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";
import GlassCard from "@/components/shared/GlassCard";
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

interface ValidateEmailFn {
  (email: string): string | null;
}

const validateEmail: ValidateEmailFn = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "El correo electrónico es requerido";
  if (!emailRegex.test(email.trim()))
    return "Ingresa un correo electrónico válido";
  return null;
};

interface ValidatePasswordFn {
  (password: string): string | null;
}

const validatePassword: ValidatePasswordFn = (password) => {
  if (!password.trim()) return "La contraseña es requerida";
  if (password.trim().length < 6)
    return "La contraseña debe tener al menos 6 caracteres";
  return null;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.92)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(16)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  const cardSlideAnim = useRef(new Animated.Value(12)).current;
  const eyeScaleAnim = useRef(new Animated.Value(1)).current;

  const brand = "AhorrApp";
  const letterAnims = useRef(
    Array.from({ length: brand.length }, () => new Animated.Value(0))
  ).current;
  const [brandWidth, setBrandWidth] = useState(0);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;
  const emailShakeAnim = useRef(new Animated.Value(0)).current;
  const passwordShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacityAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      Animated.stagger(
        40,
        letterAnims.map((v) =>
          Animated.timing(v, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        )
      ).start();
    }, 150);

    setTimeout(() => {
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 300);

    setTimeout(() => {
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 450);

    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.008,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (brandWidth <= 0) return;
    shimmerAnim.setValue(0);
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [brandWidth, shimmerAnim]);

  interface AnimateErrorFn {
    (animValue: Animated.Value): void;
  }

  const animateErrorIn: AnimateErrorFn = (animValue) => {
    Animated.parallel([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  interface AnimateErrorOutFn {
    (animValue: Animated.Value): void;
  }

  const animateErrorOut: AnimateErrorOutFn = (animValue) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const shake = (anim: Animated.Value) => {
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  interface HandleEmailChangeFn {
    (value: string): void;
  }

  const handleEmailChange: HandleEmailChangeFn = (value) => {
    setEmail(value);

    if (emailTouched && showEmailError) {
      const error = validateEmail(value);
      setEmailError(error || "");

      if (!error) {
        animateErrorOut(emailErrorAnim);
        setTimeout(() => setShowEmailError(false), 200);
      }
    }
  };

  interface HandlePasswordChangeFn {
    (value: string): void;
  }

  const handlePasswordChange: HandlePasswordChangeFn = (value) => {
    setPassword(value);

    if (passwordTouched && showPasswordError) {
      const error = validatePassword(value);
      setPasswordError(error || "");

      if (!error) {
        animateErrorOut(passwordErrorAnim);
        setTimeout(() => setShowPasswordError(false), 200);
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const error = validateEmail(email);

    if (error) {
      setEmailError(error);
      setShowEmailError(true);
      animateErrorIn(emailErrorAnim);
      shake(emailShakeAnim);
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const error = validatePassword(password);

    if (error) {
      setPasswordError(error);
      setShowPasswordError(true);
      animateErrorIn(passwordErrorAnim);
      shake(passwordShakeAnim);
    }
  };

  const handleSubmit = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    let hasErrors = false;

    if (emailValidation) {
      setEmailError(emailValidation);
      setEmailTouched(true);
      if (!showEmailError) {
        setShowEmailError(true);
        animateErrorIn(emailErrorAnim);
      }
      shake(emailShakeAnim);
      hasErrors = true;
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
      setPasswordTouched(true);
      if (!showPasswordError) {
        setShowPasswordError(true);
        animateErrorIn(passwordErrorAnim);
      }
      shake(passwordShakeAnim);
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);

    const res = await loginUser(email, password);
    setIsLoading(false);
    if (!res.success) {
      if (res.msg?.includes("user-not-found")) {
        setEmailError("El correo electrónico no está registrado.");
        setShowEmailError(true);
        animateErrorIn(emailErrorAnim);
        shake(emailShakeAnim);
      } else if (res.msg?.includes("wrong-password")) {
        setPasswordError("La contraseña es incorrecta.");
        setShowPasswordError(true);
        animateErrorIn(passwordErrorAnim);
        shake(passwordShakeAnim);
      } else {
        setEmailError(res.msg || "Error al iniciar sesión");
        setShowEmailError(true);
        animateErrorIn(emailErrorAnim);
        shake(emailShakeAnim);
      }
    }
  };

  const handlePasswordToggle = () => {
    Animated.sequence([
      Animated.timing(eyeScaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(eyeScaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setShowPassword(!showPassword);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
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
                  opacity: logoOpacityAnim,
                  transform: [{ scale: logoScaleAnim }],
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
                        textShadowRadius: 12,
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
                        width: Math.max(brandWidth * 0.4, 80),
                        transform: [
                          {
                            translateX: shimmerAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [
                                -brandWidth * 0.9,
                                brandWidth * 0.9,
                              ],
                            }),
                          },
                          { rotate: "10deg" },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(255,255,255,0.6)",
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
            <Typo size={14} color={colors.textLighter} style={styles.subtitle}>
              Tu asistente financiero personal
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
            <Animated.View style={{ transform: [{ translateY: 0 }] }}>
              <GlassCard style={styles.glassCard}>
                <View style={styles.inputGroupGlass}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateX: emailShakeAnim.interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-3, 3],
                          }),
                        },
                      ],
                    }}
                  >
                    <Input
                      value={email}
                      onChangeText={handleEmailChange}
                      onBlur={handleEmailBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="Ingresa tu correo"
                      containerStyle={
                        showEmailError && emailError
                          ? {
                              ...styles.inputContainer,
                              ...styles.inputError,
                              ...styles.inputInGlass,
                            }
                          : { ...styles.inputContainer, ...styles.inputInGlass }
                      }
                    />
                  </Animated.View>
                  {showEmailError && emailError && (
                    <Animated.View
                      style={[
                        styles.errorContainer,
                        {
                          opacity: emailErrorAnim,
                          transform: [
                            {
                              translateY: emailErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-10, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Text style={styles.errorText}>{emailError}</Text>
                    </Animated.View>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            <Animated.View
              style={{ transform: [{ translateY: verticalScale(4) }] }}
            >
              <GlassCard style={styles.glassCard}>
                <View style={styles.inputGroupGlass}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.passwordInputContainer}>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            translateX: passwordShakeAnim.interpolate({
                              inputRange: [-1, 1],
                              outputRange: [-3, 3],
                            }),
                          },
                        ],
                      }}
                    >
                      <Input
                        value={password}
                        onChangeText={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        secureTextEntry={!showPassword}
                        placeholder="Ingresa tu contraseña"
                        containerStyle={
                          showPasswordError && passwordError
                            ? {
                                ...styles.inputContainer,
                                ...styles.inputError,
                                ...styles.inputInGlass,
                              }
                            : {
                                ...styles.inputContainer,
                                ...styles.inputInGlass,
                              }
                        }
                      />
                    </Animated.View>
                    <Pressable
                      style={styles.passwordToggle}
                      onPress={handlePasswordToggle}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      <Animated.Text
                        style={{
                          color: colors.neutral400,
                          fontWeight: "600",
                          transform: [{ scale: eyeScaleAnim }],
                        }}
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </Animated.Text>
                    </Pressable>
                  </View>
                  {showPasswordError && passwordError && (
                    <Animated.View
                      style={[
                        styles.errorContainer,
                        {
                          opacity: passwordErrorAnim,
                          transform: [
                            {
                              translateY: passwordErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-10, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Text style={styles.errorText}>{passwordError}</Text>
                    </Animated.View>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            <Pressable style={styles.forgotPasswordContainer}>
              <Typo size={14} color={colors.primary} fontWeight="600">
                ¿Olvidaste tu contraseña?
              </Typo>
            </Pressable>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: buttonPulseAnim }] }}>
            <Button
              loading={isLoading}
              onPress={handleSubmit}
              style={styles.loginButton}
            >
              <Typo size={16} fontWeight="700" color={colors.black}>
                Iniciar sesión
              </Typo>
            </Button>
          </Animated.View>

          <Animated.View
            style={[
              styles.registerCard,
              {
                transform: [{ translateY: cardSlideAnim }],
              },
            ]}
          >
            <View style={styles.cardHeaderNoIcon}>
              <Typo
                size={16}
                fontWeight="700"
                color={colors.textPrimary}
                style={styles.cardTitle}
              >
                ¿Nuevo en AhorrApp?
              </Typo>
            </View>
            <Typo
              size={14}
              color={colors.textLight}
              style={styles.cardDescription}
            >
              Únete a miles de usuarios que ya están mejorando sus finanzas
            </Typo>
            <Pressable
              style={styles.registerButton}
              onPress={() => router.navigate("/(auth)/register")}
            >
              <Typo size={15} fontWeight="600" color={colors.primary}>
                Crear cuenta gratuita
              </Typo>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {isLoading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.black} />
              <Text style={styles.loadingText}>Iniciando sesión…</Text>
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._25,
    borderRadius: verticalScale(24),
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  brandText: {
    fontSize: verticalScale(32),
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  title: {
    marginBottom: spacingY._5,
    textAlign: "center",
    color: colors.primary,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: verticalScale(22),
  },
  form: {
    marginBottom: spacingY._20,
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
  inputInGlass: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: spacingX._8,
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: spacingY._8,
    paddingVertical: spacingY._5,
    paddingHorizontal: spacingX._10,
    borderRadius: verticalScale(8),
  },
  loginButton: {
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
  registerCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: verticalScale(28),
    padding: spacingX._20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  glassCard: {
    marginBottom: spacingY._10,
  },
  inputGroupGlass: {
    gap: spacingY._7,
  },
  cardHeaderNoIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  cardTitle: {
    flex: 1,
  },
  cardDescription: {
    lineHeight: verticalScale(20),
    marginBottom: spacingY._15,
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.primary}10`,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._16,
    borderRadius: verticalScale(12),
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  shimmerBar: {
    position: "absolute",
    top: -verticalScale(5),
    bottom: -verticalScale(5),
    borderRadius: verticalScale(10),
    opacity: 0.7,
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
  },
});
