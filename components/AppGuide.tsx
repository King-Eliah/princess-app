import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Animated, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Compass, Headphones, Film, Gem, Gamepad2,
  Star, NotebookPen, ShoppingBag, Heart, Sparkles, X,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');
const GUIDE_KEY = 'app_guide_seen_v2';

const steps = [
  {
    icon: Sparkles,
    color: '#E91E8C',
    gradient: ['#E91E8C', '#9C27B0'] as [string, string],
    title: 'Welcome to Princess 2.0 💜',
    description:
      "This app was made just for you, my love. It's your personal sanctuary — full of memories, music, love, and little surprises. Let me show you around!",
  },
  {
    icon: Compass,
    color: '#C2185B',
    gradient: ['#C2185B', '#E91E8C'] as [string, string],
    title: 'Sanctuary (Home)',
    description:
      "Your home base. Swipe through our photo slideshow, read a daily love quote, and quickly jump to any feature from the \"Explore Our World\" section.",
  },
  {
    icon: Headphones,
    color: '#7B1FA2',
    gradient: ['#7B1FA2', '#AB47BC'] as [string, string],
    title: 'Music',
    description:
      "Songs picked just for you. Tap any track to play, use the controls to skip or pause. A mini-player follows you around the app so the music never stops.",
  },
  {
    icon: Film,
    color: '#9C27B0',
    gradient: ['#9C27B0', '#CE93D8'] as [string, string],
    title: 'Memories',
    description:
      "Our photo & video album. Tap the + button to add new memories anytime. Long-press a photo to mark it as a favourite or delete it.",
  },
  {
    icon: Gem,
    color: '#D81B60',
    gradient: ['#D81B60', '#E91E8C'] as [string, string],
    title: 'Love Vault',
    description:
      "The Love tab is your treasure chest — love letters, poems, promises, our story, a drawing canvas, starry sky messages, and more. Explore every corner!",
  },
  {
    icon: Gamepad2,
    color: '#AB47BC',
    gradient: ['#AB47BC', '#7B1FA2'] as [string, string],
    title: 'Games & Stars',
    description:
      "Play couple games to earn ⭐ stars! Head to the Shop (Home → Shop) to spend them on little love gifts. More games are being added soon.",
  },
  {
    icon: NotebookPen,
    color: '#E91E8C',
    gradient: ['#E91E8C', '#C2185B'] as [string, string],
    title: 'Notes & Open-When Letters',
    description:
      "Write quick notes from the Home screen, or open the Love tab to find special \"Open When\" letters — sealed envelopes you can open whenever you feel them.",
  },
  {
    icon: ShoppingBag,
    color: '#8E24AA',
    gradient: ['#8E24AA', '#AB47BC'] as [string, string],
    title: 'Shop',
    description:
      "Use your earned stars to unlock sweet little gifts and surprises in the Shop. Keep playing games to earn more! Some items are still being wrapped up for you.",
  },
  {
    icon: Heart,
    color: '#E91E8C',
    gradient: ['#C2185B', '#9C27B0'] as [string, string],
    title: "You're all set, Princess! 🌟",
    description:
      "This is version 2.0 — some features are still being lovingly crafted just for you. Tap the 💜 button anytime to replay this guide. Enjoy your sanctuary!",
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AppGuide({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateToStep = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const next = () => {
    if (step < steps.length - 1) {
      animateToStep(step + 1);
    } else {
      handleClose();
    }
  };

  const prev = () => {
    if (step > 0) animateToStep(step - 1);
  };

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Icon circle */}
          <Animated.View style={[styles.iconArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient colors={current.gradient} style={styles.iconCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Icon size={38} color="#fff" strokeWidth={1.8} />
            </LinearGradient>
          </Animated.View>

          {/* Text */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 24, alignItems: 'center' }}>
            <Text style={[styles.title, { color: colors.text }]}>{current.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{current.description}</Text>
          </Animated.View>

          {/* Dots */}
          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === step
                    ? { backgroundColor: current.color, width: 18 }
                    : { backgroundColor: colors.border },
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {step > 0 ? (
              <TouchableOpacity style={[styles.backBtn, { borderColor: colors.border }]} onPress={prev}>
                <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backBtn} />
            )}

            <TouchableOpacity style={styles.nextBtnWrap} onPress={next}>
              <LinearGradient colors={current.gradient} style={styles.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.nextBtnText}>{isLast ? 'Done!' : 'Next →'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {!isLast && (
            <TouchableOpacity onPress={handleClose} style={styles.skipLink}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip tour</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

export async function shouldShowGuide(): Promise<boolean> {
  try {
    const seen = await AsyncStorage.getItem(GUIDE_KEY);
    return seen === null;
  } catch {
    return false;
  }
}

export async function markGuideSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(GUIDE_KEY, '1');
  } catch {}
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconArea: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    width: 6,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    gap: 12,
  },
  backBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtnWrap: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  nextBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipLink: {
    marginTop: 16,
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 13,
  },
});
