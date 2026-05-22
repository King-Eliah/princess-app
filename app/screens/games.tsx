import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Star, Hash, Grid2x2, Shuffle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameCard {
  title: string;
  description: string;
  route: string;
  icon: any;
  color: string;
  tag: string;
}

const games: GameCard[] = [
  { title: 'Emoji Match', description: 'Spot the matching emoji — pass the phone and take turns', route: '/screens/emoji-match', icon: Shuffle, color: '#F59E0B', tag: '2 players' },
  { title: 'Crossword', description: 'Clues about us — from our story to the things we love', route: '/screens/crossword', icon: Hash, color: '#8E24AA', tag: 'Solo' },
  { title: 'Picture Match', description: 'Flip cards and match all pairs — beat your best time', route: '/screens/picture-match', icon: Grid2x2, color: '#D81B60', tag: 'Solo' },
];

export default function GamesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [stars, setStars] = useState(0);

  const loadStars = useCallback(async () => {
    try {
      const val = await AsyncStorage.getItem('stars');
      setStars(Number(val || '0'));
    } catch { setStars(0); }
  }, []);

  useFocusEffect(useCallback(() => { loadStars(); }, [loadStars]));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: colors.textSecondary }]}>Our Sanctuary</Text>
            <Text style={[styles.title, { color: colors.text }]}>Games</Text>
          </View>
          <TouchableOpacity style={[styles.starsChip, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/screens/gifts')}>
            <Star size={14} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.starsText, { color: colors.primary }]}>{stars} stars</Text>
          </TouchableOpacity>
        </View>

        {/* Games */}
        {games.map(game => {
          const Icon = game.icon;
          return (
            <TouchableOpacity
              key={game.route}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(game.route as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconBox, { backgroundColor: game.color + '22' }]}>
                <Icon size={36} color={game.color} />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{game.title}</Text>
                  <View style={[styles.tag, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>{game.tag}</Text>
                  </View>
                </View>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>{game.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Star size={14} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Earn stars and spend them in the Gift Shop</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 62, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  appName: { fontSize: 12, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800' },
  starsChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginTop: 8 },
  starsText: { fontSize: 14, fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, gap: 14 },
  iconBox: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '600' },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1, marginTop: 8 },
  footerText: { fontSize: 13 },
});
