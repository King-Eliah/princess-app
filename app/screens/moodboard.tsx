import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Heart, Star, Sparkles, Flower, Music, Camera, Palette, ArrowLeft, Quote } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const moodboardItems = [
  {
    id: 1,
    type: 'quote',
    content: 'You are the most beautiful person I have ever known',
    title: 'Beautiful Soul',
    gradient: ['#8B5A9B', '#9B6B9B'],
    icon: Heart,
  },
  {
    id: 2,
    type: 'quote',
    content: 'Every day with you is a new adventure I can\'t wait to begin',
    title: 'Adventure Awaits',
    gradient: ['#9B6B9B', '#AB7B9B'],
    icon: Star,
  },
  {
    id: 3,
    type: 'quote',
    content: 'Your smile lights up my entire world',
    title: 'Light of My Life',
    gradient: ['#AB7B9B', '#BB8B9B'],
    icon: Sparkles,
  },
  {
    id: 4,
    type: 'quote',
    content: 'You make every moment magical just by being you',
    title: 'Pure Magic',
    gradient: ['#BB8B9B', '#CB9B9B'],
    icon: Flower,
  },
  {
    id: 5,
    type: 'quote',
    content: '168 Days of loving you and counting',
    title: 'Our Journey',
    gradient: ['#CB9B9B', '#DBAB9B'],
    icon: Heart,
  },
  {
    id: 6,
    type: 'quote',
    content: 'You are stronger than you know, braver than you believe',
    title: 'Inner Strength',
    gradient: ['#DBAB9B', '#8B5A9B'],
    icon: Star,
  },
  {
    id: 7,
    type: 'quote',
    content: 'Your dreams are worth fighting for, and I\'ll fight with you',
    title: 'Dream Chaser',
    gradient: ['#8B5A9B', '#9B6B9B'],
    icon: Sparkles,
  },
  {
    id: 8,
    type: 'quote',
    content: 'You deserve all the happiness in the world',
    title: 'Deserving Heart',
    gradient: ['#9B6B9B', '#AB7B9B'],
    icon: Flower,
  },
  {
    id: 9,
    type: 'quote',
    content: 'Your kindness makes the world a better place',
    title: 'Kind Soul',
    gradient: ['#AB7B9B', '#BB8B9B'],
    icon: Heart,
  },
  {
    id: 10,
    type: 'quote',
    content: 'You are capable of amazing things, believe in yourself',
    title: 'Unlimited Potential',
    gradient: ['#BB8B9B', '#CB9B9B'],
    icon: Star,
  },
  {
    id: 11,
    type: 'quote',
    content: 'Your love makes me a better person every day',
    title: 'Love\'s Power',
    gradient: ['#CB9B9B', '#DBAB9B'],
    icon: Sparkles,
  },
  {
    id: 12,
    type: 'quote',
    content: 'Endless Love - That\'s what we have together',
    title: 'Forever Us',
    gradient: ['#DBAB9B', '#8B5A9B'],
    icon: Heart,
  },
];

export default function MoodboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const getItemSize = (item: any) => {
    return { width: (width - 60) / 2, height: 160 };
  };

  const renderItem = ({ item }: { item: any }) => {
    const size = getItemSize(item);
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        style={[
          styles.moodboardItem,
          size,
          {
            backgroundColor: item.gradient[0],
            shadowColor: item.gradient[0],
          }
        ]}
        onPress={() => {
          Alert.alert(
            item.title,
            item.content,
            [{ text: '💜 Thank You!', style: 'default' }]
          );
        }}
        activeOpacity={0.8}
      >
        <View style={styles.itemGradient}>
          <View style={styles.itemHeader}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <IconComponent size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
          
          <View style={styles.quoteContainer}>
            <Quote size={16} color="rgba(255,255,255,0.7)" style={styles.quoteIcon} />
            <Text style={styles.itemText}>{item.content}</Text>
          </View>
          
          <View style={styles.itemFooter}>
            <Text style={styles.itemEmoji}></Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={[styles.headerIcon, { backgroundColor: colors.primary }]}>
              <Palette size={30} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Moodboard</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Motivational quotes to brighten your day
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.descriptionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.descriptionText, { color: colors.text }]}>
            Tap any card to read the full message. These quotes are specially chosen to remind you of how amazing you are! ✨
          </Text>
        </View>

        {/* Moodboard Grid */}
        <View style={styles.moodboardGrid}>
          {moodboardItems.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              {renderItem({ item })}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with love to inspire you every day 💜
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  descriptionCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  moodboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  moodboardItem: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  itemGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: -8,
    left: -4,
  },
  itemText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  itemFooter: {
    alignItems: 'center',
    marginTop: 8,
  },
  itemEmoji: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});