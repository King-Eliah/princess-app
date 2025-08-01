import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/hooks/useTheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="screens/login" options={{ headerShown: false }} />
          <Stack.Screen name="screens/moodboard" options={{ headerShown: false }} />
          <Stack.Screen name="screens/credits" options={{ headerShown: false }} />
          <Stack.Screen name="screens/exit" options={{ headerShown: false }} />
          <Stack.Screen name="screens/photos" options={{ headerShown: false }} />
          <Stack.Screen name="screens/favorites" options={{ headerShown: false }} />
          <Stack.Screen name="screens/calendar" options={{ headerShown: false }} />
          <Stack.Screen name="screens/draw" options={{ headerShown: false }} />
          <Stack.Screen name="screens/gifts" options={{ headerShown: false }} />
          <Stack.Screen name="screens/love-letter" options={{ headerShown: false }} />
          <Stack.Screen name="screens/poem" options={{ headerShown: false }} />
          <Stack.Screen name="screens/promises" options={{ headerShown: false }} />
          <Stack.Screen name="screens/quiz" options={{ headerShown: false }} />
          <Stack.Screen name="screens/reasons" options={{ headerShown: false }} />
          <Stack.Screen name="screens/starry" options={{ headerShown: false }} />
          <Stack.Screen name="screens/timeline" options={{ headerShown: false }} />
          <Stack.Screen name="screens/touch" options={{ headerShown: false }} />
          <Stack.Screen name="screens/food-roulette" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
