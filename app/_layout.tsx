import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as NativeSplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';

import { SessionProvider, useSession } from '@/features/auth/presentation/session-provider';
import { LocalizationProvider } from '@/core/localization/localization-provider';
import { ThemeProvider } from '@/core/theme/theme-context';
import { SplashScreen } from '@/features/splash/presentation/splash-screen';

// Immediately hide static native Android splash screen on module load
// so the custom animated SplashScreen component renders instantly on app launch
NativeSplashScreen.hideAsync().catch(() => {});

function RootNavigator() {
  const { isLoading, session } = useSession();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  const isReady = fontsLoaded && !isLoading;

  useEffect(() => {
    // Guarantee native static splash screen is dismissed as early as possible
    NativeSplashScreen.hideAsync().catch(() => {});
  }, []);

  // Navigate once fonts and session are ready
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // Authenticated user on auth screen → send to home
      router.replace('/(main)/home');
    } else if (!session && !inAuthGroup && segments[0] !== 'splash') {
      // Not authenticated and not on auth screen → send to login
      router.replace('/login');
    }
  }, [isReady, session, segments]);

  // Show splash while fonts load or SessionProvider is still initializing (includes min timer)
  if (!isReady) return <SplashScreen />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: 'card',
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animationDuration: 250,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen
        name="apply-card"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationDuration: 350,
        }}
      />
      <Stack.Screen
        name="user-profile"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationDuration: 350,
        }}
      />
      <Stack.Screen
        name="redeem-rewards"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationDuration: 350,
        }}
      />
      <Stack.Screen
        name="redeem-success"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationDuration: 350,
        }}
      />
      <Stack.Screen
        name="financial-calculator"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationDuration: 350,
        }}
      />
      <Stack.Screen
        name="financial-calculator-result"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animationDuration: 350,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <SessionProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </SessionProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
