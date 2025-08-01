import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, Star, Sparkles, Flower, ArrowRight, MessageCircle, FileText, Gift, Utensils } from 'lucide-react-native'; // Added Utensils
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const loveFeatures = [
  {
    id: 1,
    title: 'Food Roulette',
    description: 'Let the wheel decide what to eat',
    icon: Utensils,
    color: '#FF6B6B',
    route: '/screens/food-roulette',
  },
  {
    id: 2,
    title: 'Love Letter',
    description: 'A special message just for you',
    icon: MessageCircle,
    color: '#FF69B4',
    route: '/screens/love-letter',
  },
  {
    id: 3,
    title: 'Reasons I Love You',
    description: 'Countless reasons why you\'re amazing',
    icon: Heart,
    color: '#A020F0',
    route: '/screens/reasons',
  },
  {
    id: 4,
    title: 'Our Timeline',
    description: 'Every beautiful moment we\'ve shared',
    icon: Star,
    color: '#DA70D6',
    route: '/screens/timeline',
  },
  {
    id: 5,
    title: 'Beautiful Poem',
    description: 'Words that express my feelings',
    icon: FileText,
    color: '#FF1493',
    route: '/screens/poem',
  },
  {
    id: 6,
    title: 'My Promises',
    description: 'Commitments I make to you',
    icon: Sparkles,
    color: '#8A2BE2',
    route: '/screens/promises',
  },
  {
    id: 7,
    title: 'Surprise Gifts',
    description: 'Little tokens of my affection',
    icon: Gift,
    color: '#BA55D3',
    route: '/screens/gifts',
  },
];

const loveQuotes = [
  "Every time I see you, I fall in love all over again 💜",
  "You're not just my love, you're my best friend, my soulmate, my everything ✨",
  "With you, every day feels like Valentine's Day 💕",
  "You make my heart smile in ways I never thought possible 🌟",
  "I love you more than words can express, more than actions can show 💖",
];

export default function LoveScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const renderLoveCard = (feature: any) => (
    <TouchableOpacity
      key={feature.id}
      style={[styles.loveCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(feature.route)}
    >
      <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
        <feature.icon size={28} color={feature.color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{feature.title}</Text>
        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
          {feature.description}
        </Text>
      </View>
      <ArrowRight size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: colors.primary }]}>
            <Heart size={40} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Love & Romance</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Everything that makes my heart beat for you 💜
          </Text>
        </View>

        {/* Love Quote */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.quoteContent}>
            <Flower size={24} color={colors.primary} />
            <Text style={[styles.quoteText, { color: colors.text }]}>
              {loveQuotes[Math.floor(Math.random() * loveQuotes.length)]}
            </Text>
          </View>
        </View>

        {/* Love Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Express My Love</Text>
          <View style={styles.featuresGrid}>
            {loveFeatures.map(renderLoveCard)}
          </View>
        </View>

        {/* Love Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Love Story</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>100%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>My Heart</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>∞</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Love for You</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>24/7</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Thinking of You</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            You're the missing piece to my puzzle 💜
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
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  quoteCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  quoteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    fontStyle: 'italic',
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresGrid: {
    gap: 15,
  },
  loveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    gap: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});