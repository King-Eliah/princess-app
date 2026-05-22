import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Heart, ChevronLeft, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const promises = [
  { text: 'I promise to always listen with my whole heart' },
  { text: 'I promise to celebrate every little victory with you' },
  { text: 'I promise to be your safe space in any storm' },
  { text: 'I promise to make you laugh even on difficult days' },
  { text: 'I promise to support your dreams unconditionally' },
  { text: 'I promise to remember all the little things you love' },
  { text: 'I promise to be honest and genuine always' },
  { text: 'I promise to cherish every moment we share' },
  { text: 'I promise to be patient and understanding' },
  { text: 'I promise to love you and annoy you a little' },
];

export default function PromisesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  const handlePromiseTap = (index: number) => {
    setTappedIndex(index);
    setTimeout(() => setTappedIndex(null), 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Promises to You</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            From my heart to yours
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Promises List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Heart size={32} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            These are the promises I make to you, my love. Each one is a sacred vow that comes from the deepest part of my heart.
          </Text>
        </View>

        {promises.map((promise, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.promiseCard,
              { 
                backgroundColor: colors.surface, 
                borderColor: tappedIndex === index ? colors.primary : colors.border,
                transform: [{ scale: tappedIndex === index ? 0.98 : 1 }]
              }
            ]}
            onPress={() => handlePromiseTap(index)}
            activeOpacity={0.7}
          >
            <View style={[styles.promiseNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <View style={styles.promiseContent}>
              <Text style={[styles.promiseText, { color: colors.text }]} numberOfLines={3} ellipsizeMode="tail">
                {promise.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Sparkles size={20} color={colors.primary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Forever and always
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  introCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  promiseCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 12,
  },
  promiseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promiseContent: {
    flex: 1,
  },
  promiseText: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
});