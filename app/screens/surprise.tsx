import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Easing, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Sparkles, Star, Gift, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Candle ─────────────────────────────────────────────────────────────────

const CANDLE_COLORS = ['#E91E8C', '#9C27B0', '#E91E8C', '#9C27B0', '#E91E8C'];
const CANDLE_HEIGHTS = [44, 58, 36, 52, 40];

function Candle({ lit, color, height }: { lit: boolean; color: string; height: number }) {
  const flameScaleY = useRef(new Animated.Value(lit ? 1 : 0)).current;
  const flameOpacity = useRef(new Animated.Value(lit ? 1 : 0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (lit) {
      flameOpacity.setValue(1);
      flameScaleY.setValue(1);
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(flameScaleY, { toValue: 0.75, duration: 220, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
          Animated.timing(flameScaleY, { toValue: 1.25, duration: 280, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
          Animated.timing(flameScaleY, { toValue: 1.0, duration: 200, useNativeDriver: true }),
        ])
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      Animated.parallel([
        Animated.timing(flameOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(flameScaleY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
    return () => loopRef.current?.stop();
  }, [lit, flameScaleY, flameOpacity]);

  return (
    <View style={c$.candle}>
      {/* Flame */}
      <Animated.View style={[c$.flameWrap, { opacity: flameOpacity, transform: [{ scaleY: flameScaleY }] }]}>
        <View style={c$.flameOuter} />
        <View style={c$.flameInner} />
      </Animated.View>
      {/* Wick */}
      <View style={c$.wick} />
      {/* Stick */}
      <LinearGradient colors={[color, color + 'BB']} style={[c$.stick, { height }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={c$.stripe} />
        <View style={c$.stripe} />
      </LinearGradient>
    </View>
  );
}

// ─── Cake ────────────────────────────────────────────────────────────────────

const DRIP_HEIGHTS = [22, 30, 18, 26, 24, 20, 28, 16, 24, 30];

function Cake({ candles }: { candles: boolean[] }) {
  return (
    <View style={cake$.wrap}>
      {/* Top tier candles */}
      <View style={[cake$.candlesRow, { width: 130, justifyContent: 'center' }]}>
        {candles.map((lit, i) => (
          <Candle key={i} lit={lit} color={CANDLE_COLORS[i]} height={CANDLE_HEIGHTS[i]} />
        ))}
      </View>

      {/* Tier 3 — top (narrowest) */}
      <View style={cake$.tier3Wrap}>
        <View style={cake$.tier3Frosting} />
        <View style={cake$.tier3}>
          <Text style={cake$.tier3Text}>with love, Eliah</Text>
        </View>
      </View>

      {/* Tier 2 — middle */}
      <View style={cake$.tier2Wrap}>
        <View style={cake$.tier2Frosting} />
        <View style={cake$.tier2}>
          <Text style={cake$.tier2Text}>my baby</Text>
        </View>
      </View>

      {/* Tier 1 — bottom (widest) */}
      <View style={cake$.tier1Wrap}>
        {/* Frosting drips */}
        <View style={cake$.frostingWrap}>
          <View style={cake$.frostingTop} />
          <View style={cake$.dripsRow}>
            {DRIP_HEIGHTS.map((h, i) => (
              <View key={i} style={[cake$.drip, { height: h }]} />
            ))}
          </View>
        </View>
        <View style={cake$.tier1}>
          <Text style={cake$.tier1Title}>Happy Birthday!</Text>
          <Text style={cake$.tier1Sub}>Princess</Text>
        </View>
      </View>

      {/* Base plate */}
      <View style={cake$.base} />
    </View>
  );
}

// ─── Birthday message ─────────────────────────────────────────────────────────

const birthdayMessage = `Happy Birthday, my Princess

Today is your day. A whole day just for you, just for us.

I want you to know that every single morning I wake up, I am amazed that I get to call you mine. You are the kind of person who makes the world a softer, warmer, more beautiful place just by being in it.

Your laugh is my favorite sound. Your smile is my favorite sight. And the way you love, so fully and so honestly, it is the most extraordinary thing I have ever witnessed.

I made this little app just for you, because you deserve to feel celebrated not just today but every single day. I hope every feature, every little detail, made you smile or laugh or feel just a bit more loved.

You deserve everything beautiful in this world. I am going to spend every day trying to give you that.

Happy Birthday, my love.

Yours, always and forever,
Eliah`;

const giftReveal = `Your Birthday Gift

We are going on a seafood boil date.

Just you and me. Good food, good music, and all my attention on you.

You have been talking about it and I have been planning it. Consider it yours.

Get ready, Princess.`;


// ─── Main Screen ─────────────────────────────────────────────────────────────

type Phase = 'cake' | 'celebrate' | 'gift';

const BLOW_THRESHOLD = -22; // dBFS — blowing typically sits between -15 and -25
const LOUD_FRAMES_NEEDED = 3;
const BLOW_COOLDOWN_MS = 1600;

export default function SurpriseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('cake');
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [revealed, setRevealed] = useState(false);
  const [giftRevealed, setGiftRevealed] = useState(false);
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [wishSent, setWishSent] = useState(false);
  const wishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const celebScale = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const msgFade = useRef(new Animated.Value(0)).current;
  const msgScale = useRef(new Animated.Value(0.9)).current;
  const giftFade = useRef(new Animated.Value(0)).current;
  const giftScale = useRef(new Animated.Value(0.9)).current;

  // Mic refs
  const recordingRef = useRef<Audio.Recording | null>(null);
  const loudFrames = useRef(0);
  const blowCooldown = useRef(false);
  const candlesRef = useRef(candles);
  candlesRef.current = candles;

  // Floating animation for gift box
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -12, duration: 1400, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeIn]);

  // Request mic permission and start listening when on cake phase
  useEffect(() => {
    if (phase !== 'cake') return;
    let active = true;

    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (!active) return;
        if (status !== 'granted') { setMicGranted(false); return; }
        setMicGranted(true);
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

        const { recording } = await Audio.Recording.createAsync(
          { ...Audio.RecordingOptionsPresets.LOW_QUALITY, isMeteringEnabled: true },
          (status) => {
            if (!status.isRecording || status.metering === undefined) return;
            if (status.metering > BLOW_THRESHOLD) {
              loudFrames.current++;
              if (loudFrames.current >= LOUD_FRAMES_NEEDED && !blowCooldown.current) {
                blowCooldown.current = true;
                loudFrames.current = 0;
                blowNextCandle();
                setTimeout(() => { blowCooldown.current = false; }, BLOW_COOLDOWN_MS);
              }
            } else {
              if (loudFrames.current > 0) loudFrames.current = Math.max(0, loudFrames.current - 1);
            }
          },
          100,
        );
        recordingRef.current = recording;
      } catch {
        if (active) setMicGranted(false);
      }
    })();

    return () => {
      active = false;
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    };
  }, [phase]);

  const blowNextCandle = useCallback(() => {
    setCandles(prev => {
      const idx = prev.findIndex(c => c);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = false;
      if (next.every(c => !c)) {
        if (wishTimerRef.current) clearTimeout(wishTimerRef.current);
        recordingRef.current?.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
        setTimeout(() => {
          setPhase('celebrate');
          Animated.parallel([
            Animated.spring(celebScale, { toValue: 1, useNativeDriver: true }),
            Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
          ]).start();
          setTimeout(() => setPhase('gift'), 2200);
        }, 600);
      } else {
        setWishSent(true);
        if (wishTimerRef.current) clearTimeout(wishTimerRef.current);
        wishTimerRef.current = setTimeout(() => {
          setWishSent(false);
          wishTimerRef.current = null;
        }, 1300);
      }
      return next;
    });
  }, [celebScale, fadeIn]);

  const tapBlow = () => blowNextCandle();

  const revealMessage = () => {
    setRevealed(true);
    Animated.parallel([
      Animated.timing(msgFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(msgScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const revealGift = () => {
    setGiftRevealed(true);
    Animated.parallel([
      Animated.timing(giftFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(giftScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const allOut = candles.every(c => !c);
  const litCount = candles.filter(Boolean).length;

  // ── Cake phase ──────────────────────────────────────────────────────────────
  if (phase === 'cake') {
    return (
      <LinearGradient colors={['#0a0010', '#1a0033', '#0a0010']} style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + 8 }]}>
          <ChevronLeft size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.cakeContent} bounces={false} overScrollMode="never">
          <Text style={styles.cakeTitle}>Happy Birthday!</Text>
          <Text style={styles.cakeSub}>
            {wishSent
              ? 'Wish sent! ✨'
              : litCount === 5
              ? 'Close your eyes, make a wish, then blow!'
              : litCount === 1
              ? 'Last wish! Make it count...'
              : 'Make another wish, then blow!'}
          </Text>

          <View style={styles.cakeWrap}>
            <Cake candles={candles} />
          </View>

          <Text style={styles.candleCount}>
            {litCount === 0 ? 'All candles out!' : `${litCount} candle${litCount !== 1 ? 's' : ''} left`}
          </Text>

          {micGranted === false ? (
            <View style={styles.micFallback}>
              <Text style={styles.micFallbackText}>Tap to blow out a candle!</Text>
              <TouchableOpacity onPress={tapBlow} disabled={allOut} style={[styles.tapBlowBtn, { opacity: allOut ? 0.4 : 1 }]}>
                <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.tapBlowBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.tapBlowBtnText}>Blow!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : micGranted === true ? (
            <View style={styles.micHint}>
              <View style={[styles.micDot, { backgroundColor: '#4ade80' }]} />
              <Text style={styles.micHintText}>Blow into your microphone</Text>
            </View>
          ) : (
            <View style={styles.micHint}>
              <View style={[styles.micDot, { backgroundColor: '#9C27B0' }]} />
              <Text style={styles.micHintText}>Starting microphone…</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    );
  }

  // ── Celebrate phase ─────────────────────────────────────────────────────────
  if (phase === 'celebrate') {
    return (
      <LinearGradient colors={['#0a0010', '#1a0033', '#0a0010']} style={[styles.container, styles.centered]}>
        <Animated.View style={{ transform: [{ scale: celebScale }], alignItems: 'center' }}>
          <Text style={styles.celebEmoji}>🎉🎂🎉</Text>
          <Text style={styles.celebText}>You did it!</Text>
          <Text style={styles.celebSub}>Opening your gift…</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  // ── Gift phase ───────────────────────────────────────────────────────────────
  return (
    <LinearGradient colors={['#0a0010', '#1a0033', '#0a0010']} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + 8 }]}>
        <ChevronLeft size={22} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.giftContent} bounces={false} overScrollMode="never">
        {!revealed ? (
          <Animated.View style={{ opacity: fadeIn, alignItems: 'center' }}>
            <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
              <View style={styles.giftBox}>
                <Gift size={72} color="#E91E8C" />
              </View>
            </Animated.View>
            <Text style={styles.giftTitle}>A Special Message</Text>
            <Text style={styles.giftSub}>Just for you, Princess</Text>
            <TouchableOpacity style={styles.revealBtn} onPress={revealMessage}>
              <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.revealBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Sparkles size={18} color="#fff" />
                <Text style={styles.revealBtnText}>Open Your Gift</Text>
                <Sparkles size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.msgWrap, { opacity: msgFade, transform: [{ scale: msgScale }] }]}>
            <View style={styles.msgHeaderRow}>
              <Star size={22} color="#FFD700" fill="#FFD700" />
              <Text style={styles.msgHeaderText}>Birthday Message</Text>
              <Star size={22} color="#FFD700" fill="#FFD700" />
            </View>
            <View style={styles.msgCard}>
              <Text style={styles.msgText}>{birthdayMessage}</Text>
            </View>
            <View style={styles.heartRow}>
              {['💜', '✨', '👑', '🌹', '💫'].map((e, i) => (
                <Text key={i} style={styles.heartEmoji}>{e}</Text>
              ))}
            </View>

            {/* gift reveal hidden for now */}

            <TouchableOpacity style={[styles.doneBtn, { marginTop: 24 }]} onPress={() => router.back()}>
              <Heart size={16} color="#fff" fill="#fff" />
              <Text style={styles.doneBtnText}>Back to App</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Candle styles ────────────────────────────────────────────────────────────

const c$ = StyleSheet.create({
  candle: { alignItems: 'center' },
  flameWrap: { alignItems: 'center', marginBottom: 0 },
  flameOuter: { width: 14, height: 20, backgroundColor: '#FFD700', borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  flameInner: { position: 'absolute', bottom: 2, width: 7, height: 12, backgroundColor: '#FF8C00', borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  wick: { width: 2, height: 6, backgroundColor: '#444' },
  stick: { width: 12, height: 44, borderRadius: 4 },
  stripe: { height: 2, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 8, marginHorizontal: 1 },
});

// ─── Cake styles ──────────────────────────────────────────────────────────────

const cake$ = StyleSheet.create({
  wrap: { alignItems: 'center' },
  candlesRow: { flexDirection: 'row', gap: 10, marginBottom: 0, zIndex: 2, alignItems: 'flex-end' },

  // Tier 3 — top, narrowest (130px)
  tier3Wrap: { width: 130, borderRadius: 10, overflow: 'hidden', alignSelf: 'center' },
  tier3Frosting: { height: 8, backgroundColor: '#fff' },
  tier3: { backgroundColor: '#6A1B9A', height: 42, alignItems: 'center', justifyContent: 'center' },
  tier3Text: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontStyle: 'italic' },

  // Tier 2 — middle (190px)
  tier2Wrap: { width: 190, borderRadius: 10, overflow: 'hidden', alignSelf: 'center', marginTop: 3 },
  tier2Frosting: { height: 10, backgroundColor: '#fff' },
  tier2: { backgroundColor: '#9C27B0', height: 54, alignItems: 'center', justifyContent: 'center' },
  tier2Text: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 1 },

  // Tier 1 — bottom, widest (260px)
  tier1Wrap: { width: 260, borderRadius: 12, overflow: 'hidden', alignSelf: 'center', marginTop: 3, shadowColor: '#E91E8C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 16 },
  frostingWrap: { backgroundColor: '#fff', paddingTop: 8 },
  frostingTop: { height: 12, backgroundColor: '#fff' },
  dripsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 6, marginTop: -2 },
  drip: { width: 18, backgroundColor: '#fff', borderBottomLeftRadius: 9, borderBottomRightRadius: 9 },
  tier1: { backgroundColor: '#E91E8C', height: 80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  tier1Title: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  tier1Sub: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '600', marginTop: 2 },

  base: { width: 280, height: 14, backgroundColor: '#4A148C', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
});

// ─── Screen styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', left: 16, zIndex: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },

  // Cake phase
  cakeContent: { alignItems: 'center', paddingTop: 80, paddingBottom: 60, paddingHorizontal: 24 },
  cakeTitle: { fontSize: 30, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 6 },
  cakeSub: { fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 40 },
  cakeWrap: { marginBottom: 28 },
  candleCount: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
  micHint: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  micDot: { width: 8, height: 8, borderRadius: 4 },
  micHintText: { color: 'rgba(255,255,255,0.65)', fontSize: 14 },
  micFallback: { alignItems: 'center', gap: 16 },
  micFallbackText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  tapBlowBtn: { borderRadius: 30, overflow: 'hidden' },
  tapBlowBtnGrad: { paddingHorizontal: 36, paddingVertical: 16 },
  tapBlowBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  // Celebrate phase
  celebEmoji: { fontSize: 56, marginBottom: 16 },
  celebText: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 },
  celebSub: { fontSize: 16, color: 'rgba(255,255,255,0.6)' },

  // Gift phase
  giftContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 60, paddingHorizontal: 24 },
  giftBox: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(233,30,140,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(233,30,140,0.4)', marginBottom: 28 },
  giftTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8 },
  giftSub: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 36 },
  revealBtn: { borderRadius: 30, overflow: 'hidden' },
  revealBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 32, paddingVertical: 18 },
  revealBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  // Message
  msgWrap: { width: '100%', alignItems: 'center' },
  msgHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  msgHeaderText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  msgCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(233,30,140,0.3)', width: '100%', marginBottom: 24 },
  msgText: { fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 26 },
  heartRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
  heartEmoji: { fontSize: 26 },
  doneBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(233,30,140,0.25)', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(233,30,140,0.45)' },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  giftRevealCard: { backgroundColor: 'rgba(233,30,140,0.1)', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(233,30,140,0.4)', width: '100%', marginBottom: 8 },
  giftRevealHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: 'center' },
  giftRevealTitle: { fontSize: 18, fontWeight: '800', color: '#E91E8C' },
  giftRevealText: { fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 28, textAlign: 'center' },
});
