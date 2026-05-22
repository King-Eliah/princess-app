import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router/tabs';
import { Gem, Headphones, Film, Compass, Play, Pause, SkipForward, Music, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { getMusicState, subscribe, miniTogglePlay, miniSkipNext } from '@/lib/musicStore';
import AppGuide, { shouldShowGuide, markGuideSeen } from '@/components/AppGuide';

function TabIcon({ Icon, color, focused }: { Icon: any; color: string; focused: boolean; primaryColor: string }) {
  return (
    <View style={styles.iconWrap}>
      <Icon size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}

function MiniPlayer() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState(getMusicState);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => subscribe(() => setState(getMusicState())), []);

  useEffect(() => {
    if (state.isPlaying) setDismissed(false);
  }, [state.isPlaying]);

  const isOnMusic = pathname === '/music' || pathname === '/(tabs)/music';
  if (!state.title || isOnMusic || dismissed) return null;

  const TAB_H = Platform.OS === 'ios' ? 88 : 72;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push('/(tabs)/music' as any)}
      style={[miniStyles.container, { backgroundColor: colors.surface, borderTopColor: colors.border, bottom: TAB_H }]}
    >
      <LinearGradient colors={['#E91E8C', '#9C27B0']} style={miniStyles.disc} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Music size={14} color="#fff" />
      </LinearGradient>
      <View style={miniStyles.info}>
        <Text style={[miniStyles.title, { color: colors.text }]} numberOfLines={1}>{state.title}</Text>
        <Text style={[miniStyles.artist, { color: colors.textSecondary }]} numberOfLines={1}>{state.artist}</Text>
      </View>
      <TouchableOpacity onPress={miniTogglePlay} style={miniStyles.btn}>
        {state.isPlaying
          ? <Pause size={20} color={colors.primary} fill={colors.primary} />
          : <Play size={20} color={colors.primary} fill={colors.primary} />
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={miniSkipNext} style={miniStyles.btn}>
        <SkipForward size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDismissed(true)} style={miniStyles.btn}>
        <X size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const [guideVisible, setGuideVisible] = useState(false);

  useEffect(() => {
    shouldShowGuide().then(show => {
      if (show) {
        setGuideVisible(true);
        markGuideSeen();
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
    <AppGuide visible={guideVisible} onClose={() => setGuideVisible(false)} />
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          elevation: 20,
          shadowColor: colors.primary,
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sanctuary',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Compass} color={color} focused={focused} primaryColor={colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: 'Music',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Headphones} color={color} focused={focused} primaryColor={colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Film} color={color} focused={focused} primaryColor={colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="love"
        options={{
          title: 'Love',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon Icon={Gem} color={color} focused={focused} primaryColor={colors.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="exit"
        options={{
          href: null,
        }}
      />
    </Tabs>
    <MiniPlayer />
    </View>
  );
}

const miniStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  disc: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 1 },
  artist: { fontSize: 12 },
  btn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
