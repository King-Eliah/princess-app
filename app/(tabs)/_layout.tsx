import React from 'react';
import { Tabs } from 'expo-router/tabs';
import { Heart, Music, Calendar, Star, Home, Camera } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Home size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: 'Music',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Music size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Camera size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="love"
        options={{
          title: 'Love',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Heart size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="exit"
        options={{
          title: 'Exit',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '20' }]}>
              <Star size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});