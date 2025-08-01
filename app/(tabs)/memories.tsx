import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, Clock, Camera, Star, ArrowRight, Heart, Sparkles, Brain } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const memoryFeatures = [
  {
    id: 1,
    title: 'Important Dates',
    description: 'Special moments in our story',
    icon: Calendar,
    color: '#A020F0',
    route: '/screens/calendar',
  },
  {
    id: 2,
    title: 'Our Timeline',
    description: 'Every beautiful moment we\'ve shared',
    icon: Clock,
    color: '#FF69B4',
    route: '/screens/timeline',
  },
  {
    id: 3,
    title: 'Photo Memories',
    description: 'Beautiful moments captured',
    icon: Camera,
    color: '#DA70D6',
    route: '/screens/photos',
  },
  {
    id: 4,
    title: 'Starry Night',
    description: 'Magical moments under the stars',
    icon: Star,
    color: '#FF1493',
    route: '/screens/starry',
  },
  {
    id: 5,
    title: 'Touch Messages',
    description: 'Interactive love messages',
    icon: Heart,
    color: '#8A2BE2',
    route: '/screens/touch',
  },
  {
    id: 6,
    title: 'Mini Quiz',
    description: 'Test your knowledge about us',
    icon: Brain,
    color: '#BA55D3',
    route: '/screens/quiz',
  },
];

const memoryQuotes = [
  "Every memory with you is a treasure I'll cherish forever 💜",
  "Our story is my favorite story to tell ✨",
  "The best memories are made with the people you love 💕",
  "Every moment with you becomes a beautiful memory 🌟",
  "Our memories together are the most precious gifts 💖",
];

export default function MemoriesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const renderMemoryCard = (feature: any) => (
    <TouchableOpacity
      key={feature.id}
      style={[styles.memoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
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
            <Calendar size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Our Memories</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Every moment we've shared together 💜
          </Text>
        </View>

        {/* Memory Quote */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.quoteContent}>
            <Sparkles size={24} color={colors.primary} />
            <Text style={[styles.quoteText, { color: colors.text }]}>
              {memoryQuotes[Math.floor(Math.random() * memoryQuotes.length)]}
            </Text>
          </View>
        </View>

        {/* Memory Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Relive Our Moments</Text>
          <View style={styles.featuresGrid}>
            {memoryFeatures.map(renderMemoryCard)}
          </View>
        </View>

        {/* Memory Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Memory Highlights</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>100+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Special Moments</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Photos Together(SMH)</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>∞</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Laughs Shared</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Every memory with you is a gift I'll treasure forever 💜
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
  memoryCard: {
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