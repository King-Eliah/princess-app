import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ChevronLeft, Heart, Coffee, Gamepad2, Film, Pizza, Star, Lock, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GiftItem {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: [string, string];
  price: number;
}

const gifts: GiftItem[] = [
  { id: 1, title: 'Boba Date', description: 'A sweet boba tea date, just the two of us', icon: Coffee, color: ['#F06292', '#E91E8C'], price: 30 },
  { id: 2, title: 'Arcade Date', description: 'Games, laughter and good energy', icon: Gamepad2, color: ['#CE93D8', '#9C27B0'], price: 50 },
  { id: 3, title: 'Movie Night', description: 'Pick any film, I will watch it with you', icon: Film, color: ['#F48FB1', '#C2185B'], price: 40 },
  { id: 4, title: 'Pizza Dinner', description: 'Delicious pizza, even better company', icon: Pizza, color: ['#FFAB91', '#E64A19'], price: 35 },
];

export default function GiftsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [owned, setOwned] = useState<number[]>([]);

  const loadData = useCallback(async () => {
    try {
      // v2: prices changed — clear old owned gifts so nothing is wrongly locked
      const ver = await AsyncStorage.getItem('giftsVersion');
      if (ver !== 'v2') {
        await AsyncStorage.removeItem('ownedGifts');
        await AsyncStorage.setItem('giftsVersion', 'v2');
      }
      const s = await AsyncStorage.getItem('stars');
      const o = await AsyncStorage.getItem('ownedGifts');
      setStars(Number(s || '0'));
      setOwned(o ? JSON.parse(o) : []);
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const purchaseGift = async (giftId: number) => {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    if (owned.includes(giftId)) { Alert.alert('Already owned', 'You already have this one.'); return; }
    if (stars < gift.price) {
      Alert.alert('Not enough stars', `This costs ${gift.price} stars. You have ${stars}.`);
      return;
    }
    const newStars = stars - gift.price;
    const newOwned = [...owned, giftId];
    await AsyncStorage.setItem('stars', String(newStars));
    await AsyncStorage.setItem('ownedGifts', JSON.stringify(newOwned));
    setStars(newStars);
    setOwned(newOwned);
    Alert.alert('Unlocked', `${gift.title} is now yours.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gift Shop</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Redeem your stars for a date</Text>
        </View>
        <View style={[styles.starBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Star size={14} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.starCount, { color: colors.primary }]}>{stars}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Shop */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>REDEEM STARS</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Dates</Text>
          {gifts.map(gift => {
            const Icon = gift.icon;
            const isOwned = owned.includes(gift.id);
            const canAfford = stars >= gift.price;
            return (
              <View key={gift.id} style={[styles.shopCard, { backgroundColor: colors.surface, borderColor: isOwned ? colors.primary : colors.border }]}>
                <LinearGradient colors={gift.color} style={styles.shopIconWrap} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Icon size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.shopInfo}>
                  <Text style={[styles.shopTitle, { color: colors.text }]}>{gift.title}</Text>
                  <Text style={[styles.shopDesc, { color: colors.textSecondary }]} numberOfLines={1}>{gift.description}</Text>
                  <View style={styles.shopMeta}>
                    <Star size={12} color={colors.primary} fill={colors.primary} />
                    <Text style={[styles.shopPrice, { color: colors.primary }]}>{gift.price} stars</Text>
                  </View>
                </View>
                {isOwned ? (
                  <View style={[styles.shopAction, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                    <Check size={14} color={colors.primary} />
                    <Text style={[styles.shopActionText, { color: colors.primary }]}>Owned</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.shopAction, { backgroundColor: canAfford ? colors.primary : colors.surface, borderColor: canAfford ? colors.primary : colors.border }]}
                    onPress={() => purchaseGift(gift.id)}
                    activeOpacity={0.8}
                  >
                    {canAfford
                      ? <Text style={[styles.shopActionText, { color: '#fff' }]}>Buy</Text>
                      : <Lock size={14} color={colors.textSecondary} />
                    }
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Heart size={16} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Earn stars by playing games and quizzes</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  starBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  starCount: { fontSize: 15, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  sectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 6 },

  shopCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, gap: 14 },
  shopIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  shopInfo: { flex: 1 },
  shopTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  shopDesc: { fontSize: 12, marginBottom: 4 },
  shopMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shopPrice: { fontSize: 12, fontWeight: '600' },
  shopAction: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  shopActionText: { fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1 },
  footerText: { fontSize: 13 },
});
