import { AuthProvider, useAuth } from "@/contexts/authContext";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import Loading from "@/components/ui/Loading";

const MainLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inTabsGroup = segments[0] === "(tabs)";
    if (user && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!user && inTabsGroup) {
      router.replace("/welcome");
    }
  }, [user, loading]);

  if (loading) {
    return <Loading />;
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
