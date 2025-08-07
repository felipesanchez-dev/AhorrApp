import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/ui/Typo";
import Input from "@/components/ui/Input";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/ui/Button";
import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";

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
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  const cardSlideAnim = useRef(new Animated.Value(20)).current;
  const eyeScaleAnim = useRef(new Animated.Value(1)).current;

  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;

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
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    setTimeout(() => {
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 600);

    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.02,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const error = validatePassword(password);

    if (error) {
      setPasswordError(error);
      setShowPasswordError(true);
      animateErrorIn(passwordErrorAnim);
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
      hasErrors = true;
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
      setPasswordTouched(true);
      if (!showPasswordError) {
        setShowPasswordError(true);
        animateErrorIn(passwordErrorAnim);
      }
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
      } else if (res.msg?.includes("wrong-password")) {
        setPasswordError("La contraseña es incorrecta.");
        setShowPasswordError(true);
        animateErrorIn(passwordErrorAnim);
      } else {
        setEmailError(res.msg || "Error al iniciar sesión");
        setShowEmailError(true);
        animateErrorIn(emailErrorAnim);
      }
    }
  };

  const handlePasswordToggle = () => {
    Animated.sequence([
      Animated.timing(eyeScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(eyeScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowPassword(!showPassword);
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
                  transform: [
                    { scale: logoScaleAnim },
                    { rotate: logoRotation },
                  ],
                },
              ]}
            >
              <Icons.CurrencyDollarIcon
                size={verticalScale(28)}
                color={colors.primary}
                weight="bold"
              />
            </Animated.View>
            <Typo size={28} fontWeight="800" style={styles.title}>
              Ahorrapp
            </Typo>
            <Typo size={16} color={colors.textLighter} style={styles.subtitle}>
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Input
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={
                  showEmailError && emailError
                    ? { ...styles.inputContainer, ...styles.inputError }
                    : styles.inputContainer
                }
                icon={
                  <Icons.AtIcon
                    size={verticalScale(18)}
                    color={
                      showEmailError && emailError
                        ? colors.error
                        : colors.neutral400
                    }
                  />
                }
              />
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
                  <Icons.WarningCircleIcon
                    size={verticalScale(14)}
                    color={colors.error}
                    weight="fill"
                  />
                  <Text style={styles.errorText}>{emailError}</Text>
                </Animated.View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <Input
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  secureTextEntry={!showPassword}
                  containerStyle={
                    showPasswordError && passwordError
                      ? { ...styles.inputContainer, ...styles.inputError }
                      : styles.inputContainer
                  }
                  icon={
                    <Icons.LockIcon
                      size={verticalScale(18)}
                      color={
                        showPasswordError && passwordError
                          ? colors.error
                          : colors.neutral400
                      }
                    />
                  }
                />
                <Pressable
                  style={styles.passwordToggle}
                  onPress={handlePasswordToggle}
                >
                  <Animated.View
                    style={{ transform: [{ scale: eyeScaleAnim }] }}
                  >
                    {showPassword ? (
                      <Icons.EyeSlashIcon
                        size={verticalScale(18)}
                        color={colors.neutral400}
                      />
                    ) : (
                      <Icons.EyeIcon
                        size={verticalScale(18)}
                        color={colors.neutral400}
                      />
                    )}
                  </Animated.View>
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
                  <Icons.WarningCircleIcon
                    size={verticalScale(14)}
                    color={colors.error}
                    weight="fill"
                  />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </Animated.View>
              )}
            </View>

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
            <View style={styles.cardHeader}>
              <Icons.UserPlusIcon
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
              <Typo
                size={16}
                fontWeight="700"
                color={colors.textPrimary}
                style={styles.cardTitle}
              >
                ¿Nuevo en Ahorrapp?
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
              <Icons.ArrowRightIcon
                size={verticalScale(16)}
                color={colors.primary}
                weight="bold"
              />
            </Pressable>
          </Animated.View>
        </Animated.View>
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
    width: verticalScale(70),
    height: verticalScale(70),
    borderRadius: verticalScale(35),
    backgroundColor: `${colors.primary}08`,
    borderWidth: 2,
    borderColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._15,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    marginBottom: spacingY._25,
  },
  inputGroup: {
    marginBottom: spacingY._20,
  },
  label: {
    fontSize: verticalScale(14),
    fontWeight: "600",
    color: colors.textLight,
    marginBottom: spacingY._8,
  },
  inputContainer: {
    backgroundColor: colors.neutral800,
    borderColor: colors.neutral600,
    borderWidth: 1,
    borderRadius: verticalScale(14),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    right: spacingX._15,
    top: "50%",
    transform: [{ translateY: -verticalScale(12) }],
    padding: spacingX._8,
    borderRadius: verticalScale(6),
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
    height: verticalScale(52),
    borderRadius: verticalScale(16),
    marginBottom: spacingY._25,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerCard: {
    backgroundColor: colors.neutral850,
    borderRadius: verticalScale(30),
    padding: spacingX._20,
    borderWidth: 1,
    borderColor: colors.neutral700,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  cardTitle: {
    marginLeft: spacingX._10,
    flex: 1,
  },
  cardDescription: {
    lineHeight: verticalScale(20),
    marginBottom: spacingY._15,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `${colors.primary}10`,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._16,
    borderRadius: verticalScale(12),
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
});
