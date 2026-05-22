'use client';

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, Music, Camera, Star, Settings } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function TabNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  const tabs = [
    { name: 'Home', path: '/tabs', icon: Heart },
    { name: 'Music', path: '/music', icon: Music },
    { name: 'Memories', path: '/memories', icon: Camera },
    { name: 'Love', path: '/love', icon: Star },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.path);
        
        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.tab}
            onPress={() => router.push(tab.path)}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: active ? colors.primary : colors.surface }
            ]}>
              <Icon 
                size={22} 
                color={active ? '#FFFFFF' : colors.textSecondary} 
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
