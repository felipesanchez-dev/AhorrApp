import LoadingSpecial from "@/components/ui/Loadingspecial";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import { useStorageState } from "@/hooks/useStorageState";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

const MainLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { value: hasOpenedApp, loading: storageLoading } =
    useStorageState("hasOpenedApp");
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (authLoading || storageLoading) return;

    if (!user) {
      if (hasOpenedApp === "true") {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(auth)/welcome");
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [user, hasOpenedApp, authLoading, storageLoading, segments]);

  if (authLoading || storageLoading) {
    return <LoadingSpecial />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)/profileModal" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
