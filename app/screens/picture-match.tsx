import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Alert, Image } from 'react-native';
import { ChevronLeft, RotateCcw, Clock, Star, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { getMemories } from '@/lib/db';

interface Card {
  id: number;
  pairId: number;
  imageUri: string | undefined;
  emoji: string;
  color: string;
  flipped: boolean;
  matched: boolean;
}

const FALLBACK = [
  { emoji: '♥', color: '#E91E8C' },
  { emoji: '✦', color: '#AB47BC' },
  { emoji: '◑', color: '#5C6BC0' },
  { emoji: '✿', color: '#EC407A' },
  { emoji: '♛', color: '#8E24AA' },
  { emoji: '◇', color: '#E91E8C' },
  { emoji: '✶', color: '#7B1FA2' },
  { emoji: '❋', color: '#D81B60' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(photos: string[]): Card[] {
  // Randomly pick 8 from the full pool so each game uses a different set
  const pool = shuffle([...photos]).slice(0, 8);
  const cards: Card[] = [];
  for (let i = 0; i < 8; i++) {
    const fb = FALLBACK[i];
    const imageUri = pool[i];
    cards.push({ id: (i + 1) * 2 - 1, pairId: i + 1, imageUri, emoji: fb.emoji, color: fb.color, flipped: false, matched: false });
    cards.push({ id: (i + 1) * 2,     pairId: i + 1, imageUri, emoji: fb.emoji, color: fb.color, flipped: false, matched: false });
  }
  return shuffle(cards);
}

function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

const TOTAL_CARDS = 16;

export default function PictureMatchScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const photosRef = useRef<string[]>([]);
  const [cards, setCards] = useState<Card[]>(() => buildDeck([]));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const flipAnims = useRef<Animated.Value[]>(
    Array.from({ length: TOTAL_CARDS }, () => new Animated.Value(0))
  ).current;

  // Load photos from memories (tries Supabase, falls back to local cache)
  useEffect(() => {
    getMemories().then(all => {
      const uris = all
        .filter(m => m.type === 'photo' && (m.uri.startsWith('https://') || m.uri.startsWith('http://')))
        .slice(0, 8)
        .map(m => m.uri);
      photosRef.current = uris;
      const deck = buildDeck(uris);
      setCards(deck);
      flipAnims.forEach(a => a.setValue(0));
    }).catch(() => {});
  }, []);

  const loadBest = useCallback(async () => {
    try {
      const t = await AsyncStorage.getItem('picmatch_best_time');
      const m = await AsyncStorage.getItem('picmatch_best_moves');
      if (t) setBestTime(Number(t));
      if (m) setBestMoves(Number(m));
    } catch {}
  }, []);

  useEffect(() => { loadBest(); }, [loadBest]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const flipCard = (index: number, toValue: number) =>
    Animated.spring(flipAnims[index], { toValue, useNativeDriver: true, friction: 8 });

  const handlePress = (index: number) => {
    if (lockRef.current) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;
    if (!running && !done) setRunning(true);

    flipCard(index, 1).start();
    const newCards = cards.map((c, i) => i === index ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (newCards[a].pairId === newCards[b].pairId) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
          setSelected([]);
          lockRef.current = false;
          const allMatched = newCards.every((c, i) => c.matched || i === a || i === b);
          if (allMatched) {
            setRunning(false);
            setDone(true);
            const finalMoves = moves + 1;
            saveBest(elapsed, finalMoves);
            setTimeout(() => {
              Alert.alert(
                'You matched them all!',
                `${formatTime(elapsed)} — ${finalMoves} moves\n\nYou earned 1 star.`,
                [{ text: 'Play Again', onPress: reset }, { text: 'Done', onPress: () => router.back() }]
              );
              awardStars(1);
            }, 400);
          }
        }, 300);
      } else {
        setTimeout(() => {
          flipCard(a, 0).start();
          flipCard(b, 0).start();
          setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
          setSelected([]);
          lockRef.current = false;
        }, 900);
      }
    }
  };

  const saveBest = async (time: number, mv: number) => {
    try {
      const t = await AsyncStorage.getItem('picmatch_best_time');
      const m = await AsyncStorage.getItem('picmatch_best_moves');
      if (!t || time < Number(t)) { await AsyncStorage.setItem('picmatch_best_time', String(time)); setBestTime(time); }
      if (!m || mv < Number(m)) { await AsyncStorage.setItem('picmatch_best_moves', String(mv)); setBestMoves(mv); }
    } catch {}
  };

  const awardStars = async (amount: number) => {
    try {
      const current = await AsyncStorage.getItem('stars');
      await AsyncStorage.setItem('stars', String(Number(current || '0') + amount));
    } catch {}
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newDeck = buildDeck(photosRef.current);
    setCards(newDeck);
    flipAnims.forEach(a => a.setValue(0));
    setSelected([]);
    setMoves(0);
    setElapsed(0);
    setRunning(false);
    setDone(false);
    lockRef.current = false;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.text }]}>Picture Match</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Find all the pairs</Text>
        </View>
        <TouchableOpacity onPress={reset} style={[styles.resetBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <RotateCcw size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.statsBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.stat}>
            <Clock size={14} color={colors.primary} />
            <Text style={[styles.statVal, { color: colors.text }]}>{formatTime(elapsed)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Time</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.text }]}>{moves}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Moves</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Star size={14} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.statVal, { color: colors.text }]}>{bestTime !== null ? formatTime(bestTime) : '--'}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {cards.map((card, index) => {
            const rotate = flipAnims[index].interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
            const rotateFront = flipAnims[index].interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

            return (
              <TouchableOpacity
                key={card.id}
                style={styles.cardWrap}
                onPress={() => handlePress(index)}
                activeOpacity={0.85}
                disabled={card.matched}
              >
                {/* Back face */}
                <Animated.View style={[styles.cardFace, styles.cardBack, { borderColor: colors.border, transform: [{ rotateY: rotate }] }]}>
                  <LinearGradient
                    colors={[colors.primary + 'CC', colors.primary + '55']}
                    style={styles.cardFill}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  >
                    <Heart size={22} color="rgba(255,255,255,0.7)" fill="rgba(255,255,255,0.4)" />
                  </LinearGradient>
                </Animated.View>

                {/* Front face */}
                <Animated.View style={[styles.cardFace, styles.cardFront, { borderColor: card.matched ? colors.primary : colors.border, transform: [{ rotateY: rotateFront }] }]}>
                  {card.imageUri ? (
                    <Image source={{ uri: card.imageUri }} style={styles.cardFill} resizeMode="cover" />
                  ) : (
                    <View style={[styles.cardFill, { backgroundColor: card.color + '33', alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={[styles.cardEmoji, { color: card.color }]}>{card.emoji}</Text>
                    </View>
                  )}
                  {card.matched && (
                    <View style={styles.matchedOverlay}>
                      <Text style={styles.matchedCheck}>✓</Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>

        {bestMoves !== null && (
          <View style={[styles.bestRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Star size={13} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.bestText, { color: colors.textSecondary }]}>
              Personal best: {formatTime(bestTime!)} in {bestMoves} moves
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const CARD_SIZE = 80;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 62, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  resetBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  statsBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingVertical: 14, marginBottom: 24 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 16, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  statDivider: { width: 1, height: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  cardWrap: { width: CARD_SIZE, height: CARD_SIZE + 16 },
  cardFace: { position: 'absolute', width: CARD_SIZE, height: CARD_SIZE + 16, borderRadius: 12, borderWidth: 1, backfaceVisibility: 'hidden', overflow: 'hidden' },
  cardBack: {},
  cardFront: {},
  cardFill: { width: '100%', height: '100%' },
  cardEmoji: { fontSize: 26, fontWeight: '700' },
  matchedOverlay: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  matchedCheck: { color: '#fff', fontSize: 12, fontWeight: '700' },
  bestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, padding: 12, borderRadius: 10, borderWidth: 1 },
  bestText: { fontSize: 13 },
});
