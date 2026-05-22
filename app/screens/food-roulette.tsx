import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { ChevronLeft, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FOODS = [
  { label: 'Sushi', emoji: '🍣' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Burgers', emoji: '🍔' },
  { label: 'Tacos', emoji: '🌮' },
  { label: 'Ramen', emoji: '🍜' },
  { label: 'BBQ', emoji: '🍖' },
  { label: 'Pasta', emoji: '🍝' },
  { label: 'Seafood', emoji: '🦞' },
  { label: 'Fried Rice', emoji: '🍛' },
  { label: 'Salad', emoji: '🥗' },
  { label: 'Shawarma', emoji: '🌯' },
  { label: 'Waffles', emoji: '🧇' },
];

const ITEM_H = 80;
const VISIBLE = 3;
const REEL_H = ITEM_H * VISIBLE;

// Build a long repeated list so spin animation scrolls far
function buildReelItems() {
  const out: typeof FOODS = [];
  for (let i = 0; i < 8; i++) out.push(...FOODS);
  return out;
}
const REEL_ITEMS = buildReelItems();

function Reel({ translateY }: { translateY: Animated.AnimatedInterpolation<number> }) {
  return (
    <View style={reel$.window}>
      <Animated.View style={[reel$.strip, { transform: [{ translateY }] }]}>
        {REEL_ITEMS.map((food, i) => (
          <View key={i} style={reel$.item}>
            <Text style={reel$.emoji}>{food.emoji}</Text>
            <Text style={reel$.label}>{food.label}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export default function FoodRouletteScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [spinning, setSpinning] = useState(false);
  const [finalFood, setFinalFood] = useState<typeof FOODS[0] | null>(null);
  const [done, setDone] = useState(false);

  const rawAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Target pixel offsets for each reel (computed on spin)
  const targetOffsets = useRef([0, 0, 0]);

  const reset = useCallback(() => {
    rawAnims.forEach(a => a.setValue(0));
    targetOffsets.current = [0, 0, 0];
    setFinalFood(null);
    setDone(false);
    setSpinning(false);
  }, [rawAnims]);

  const spin = useCallback(() => {
    if (spinning) return;
    reset();
    setSpinning(true);
    setDone(false);

    const pick = Math.floor(Math.random() * FOODS.length);

    // Each reel lands on the same food. We spin some extra full loops + offset to land
    // on the picked item. The center slot (index 1 of the 3 visible) should show the result.
    // We want the reel to stop so that REEL_ITEMS[stopIndex] is in the center visible row.
    // Center row = (REEL_ITEMS.length / 2 + 1) roughly; pick a high-index occurrence.
    const baseLoops = 5;
    const totalItems = REEL_ITEMS.length;

    rawAnims.forEach((anim, col) => {
      // Find an item index in the upper half of REEL_ITEMS that matches `pick`
      const targetIdx = FOODS.length * (baseLoops + col) + pick;
      // To center that item: top of the visible window should be (targetIdx - 1) * ITEM_H
      const targetY = -(targetIdx - 1) * ITEM_H;
      targetOffsets.current[col] = targetY;

      const delay = col * 500;
      const duration = 2200 + col * 600;

      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: targetY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (col === 2 && finished) {
          setFinalFood(FOODS[pick]);
          setDone(true);
          setSpinning(false);
        }
      });
    });
  }, [spinning, reset, rawAnims]);

  return (
    <LinearGradient colors={['#0a0010', '#160B25', '#0a0010']} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Food Roulette</Text>
          <Text style={styles.headerSub}>Let fate decide tonight</Text>
        </View>
        <TouchableOpacity onPress={reset} style={styles.resetBtn}>
          <RotateCcw size={20} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Slot machine body */}
        <View style={styles.machine}>
          <LinearGradient colors={['#2a0050', '#1a0033', '#2a0050']} style={styles.machineBody} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>

            {/* Top lights */}
            <View style={styles.lightStrip}>
              {[...Array(9)].map((_, i) => (
                <View key={i} style={[styles.lightBulb, { backgroundColor: i % 2 === 0 ? '#E91E8C' : '#9C27B0' }]} />
              ))}
            </View>

            {/* Reels row */}
            <View style={styles.reelsRow}>
              {rawAnims.map((anim, i) => (
                <React.Fragment key={i}>
                  <View style={styles.reelWrap}>
                    <Reel translateY={anim as any} />
                  </View>
                  {i < 2 && <View style={styles.reelSep} />}
                </React.Fragment>
              ))}
            </View>

            {/* Center selection highlight */}
            <View style={styles.selectionFrame} pointerEvents="none">
              <View style={styles.selectionTop} />
              <View style={styles.selectionBottom} />
            </View>

            {/* Bottom lights */}
            <View style={styles.lightStrip}>
              {[...Array(9)].map((_, i) => (
                <View key={i} style={[styles.lightBulb, { backgroundColor: i % 2 === 0 ? '#9C27B0' : '#E91E8C' }]} />
              ))}
            </View>
          </LinearGradient>

          {/* Decorative side lever */}
          <View style={styles.lever}>
            <View style={styles.leverArm} />
            <View style={[styles.leverKnob, { backgroundColor: spinning ? '#9C27B0' : '#E91E8C' }]} />
          </View>
        </View>

        {/* Result display */}
        {done && finalFood ? (
          <LinearGradient colors={['rgba(233,30,140,0.15)', 'rgba(156,39,176,0.15)']} style={styles.resultCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.resultEmoji}>{finalFood.emoji}</Text>
            <Text style={styles.resultName}>{finalFood.label}</Text>
            <Text style={styles.resultSub}>Tonight is settled.</Text>
          </LinearGradient>
        ) : (
          <View style={styles.resultPlaceholder}>
            <Text style={styles.placeholderText}>
              {spinning ? 'Spinning...' : 'Tap SPIN to find out what to eat'}
            </Text>
          </View>
        )}

        {/* Spin button */}
        <TouchableOpacity onPress={spin} disabled={spinning} activeOpacity={0.8} style={styles.spinBtnOuter}>
          <LinearGradient
            colors={spinning ? ['#444', '#333'] : ['#E91E8C', '#9C27B0']}
            style={styles.spinBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.spinBtnText}>{spinning ? 'SPINNING...' : 'SPIN'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Food index */}
        <View style={styles.foodGrid}>
          {FOODS.map(f => (
            <View key={f.label} style={[styles.foodChip, { borderColor: colors.border }]}>
              <Text style={styles.foodChipEmoji}>{f.emoji}</Text>
              <Text style={[styles.foodChipLabel, { color: colors.textSecondary }]}>{f.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const reel$ = StyleSheet.create({
  window: {
    height: REEL_H,
    overflow: 'hidden',
    width: '100%',
  },
  strip: {
    flexDirection: 'column',
  },
  item: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  emoji: { fontSize: 28 },
  label: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600', textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  resetBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 60 },

  machine: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'flex-start',
    marginBottom: 28,
    position: 'relative',
  },
  machineBody: {
    width: '100%',
    borderRadius: 20,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: 'rgba(233,30,140,0.5)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  lightStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  lightBulb: {
    width: 13, height: 13, borderRadius: 7,
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  reelsRow: {
    flexDirection: 'row',
    gap: 0,
  },
  reelWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0a0010',
  },
  reelSep: { width: 8 },

  selectionFrame: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 14 + 10 + 13 + 10 + ITEM_H, // lightStrip offset + center row
    height: ITEM_H,
    pointerEvents: 'none',
  },
  selectionTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(233,30,140,0.8)',
  },
  selectionBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(233,30,140,0.8)',
  },

  lever: {
    position: 'absolute',
    right: -22,
    top: 30,
    alignItems: 'center',
  },
  leverArm: {
    width: 10,
    height: 90,
    backgroundColor: '#3a3a3a',
    borderRadius: 5,
  },
  leverKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: -8,
  },

  resultCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(233,30,140,0.4)',
    marginBottom: 20,
  },
  resultEmoji: { fontSize: 52, marginBottom: 4 },
  resultName: { fontSize: 28, fontWeight: '800', color: '#fff' },
  resultSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },

  resultPlaceholder: {
    width: '100%',
    maxWidth: 340,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: { fontSize: 14, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },

  spinBtnOuter: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  spinBtn: {
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinBtnText: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 4 },

  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 340,
  },
  foodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  foodChipEmoji: { fontSize: 14 },
  foodChipLabel: { fontSize: 12, fontWeight: '500' },
});
