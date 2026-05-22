import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, FileText, Utensils, Star, ChevronRight, Mail } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const loveFeatures = [
  { id: 8, title: 'Open When', description: 'Letters written just for you — open one when you need it most', icon: Mail, color: '#3B82F6', route: '/screens/open-when' },
  { id: 1, title: 'Food Roulette', description: 'Let fate decide what to eat tonight', icon: Utensils, color: '#E91E8C', route: '/screens/food-roulette' },
  { id: 2, title: 'Love Letters', description: 'Monthly letters just for you', icon: MessageCircle, color: '#AB47BC', route: '/screens/love-letter' },
  { id: 3, title: 'Reasons I Love You', description: 'Countless reasons you are amazing', icon: Heart, color: '#E91E8C', route: '/screens/reasons' },
  { id: 4, title: 'Touch Messages', description: 'Hold to reveal a sweet message', icon: Heart, color: '#D81B60', route: '/screens/touch' },
  { id: 5, title: 'Starry Night', description: 'Magical moments under the stars', icon: Star, color: '#8E24AA', route: '/screens/starry' },
  { id: 6, title: 'Beautiful Poem', description: 'Words that express my feelings', icon: FileText, color: '#4A148C', route: '/screens/poem' },
  { id: 7, title: 'My Promises', description: 'Commitments I make to you', icon: Heart, color: '#7B1FA2', route: '/screens/promises' },
];

const loveQuotes = [
  "Every time I see you,\nI fall in love all over again.",
  "You're not just my love,\nyou're my best friend and my everything.",
  "With you, every day feels\nlike Valentine's Day.",
  "You make my heart smile\nin ways I never thought possible.",
];

export default function LoveScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const quote = loveQuotes[new Date().getDay() % loveQuotes.length];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">

        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.textSecondary }]}>Our Sanctuary</Text>
        </View>

        <View style={styles.quoteBlock}>
          <Text style={styles.quoteMarks}>"</Text>
          <Text style={styles.quoteText}>{quote}</Text>
          <Text style={styles.quoteAttribution}>always and forever</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover Together</Text>

          {loveFeatures.map(feat => (
            <TouchableOpacity key={feat.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push(feat.route as any)} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: feat.color + '22' }]}>
                <feat.icon size={32} color={feat.color} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{feat.title}</Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={1}>{feat.description}</Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>You're the missing piece to my puzzle 💜</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: 28 },
  appName: { fontSize: 13, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  quoteBlock: { alignItems: 'center', marginBottom: 40, paddingHorizontal: 16 },
  quoteMarks: { fontSize: 72, color: '#E91E8C', lineHeight: 72, marginBottom: -16, fontStyle: 'italic', opacity: 0.9 },
  quoteText: { fontSize: 26, fontStyle: 'italic', fontWeight: '700', color: '#FFFFFF', textAlign: 'center', lineHeight: 36, letterSpacing: 0.3 },
  quoteAttribution: { marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 16, opacity: 0.7 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, gap: 14 },
  iconBox: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  cardDesc: { fontSize: 12, lineHeight: 16 },
  footer: { alignItems: 'center', paddingVertical: 16 },
  footerText: { fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
});
