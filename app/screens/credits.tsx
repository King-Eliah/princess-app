import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Heart, Star, Sparkles, Flower, Music, Camera, Palette, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

export default function CreditsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [animatedText, setAnimatedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const fullText = "Made with love by Your Baby 💜";
  const words = fullText.split(' ');

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setAnimatedText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowHeart(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [currentIndex, words.length]);

  const features = [
    { icon: Heart, title: 'Love Notes', description: 'Personal messages and memories' },
    { icon: Star, title: 'Special Moments', description: 'Important dates and celebrations' },
    { icon: Music, title: 'Music Player', description: 'Songs that tell our story' },
    { icon: Camera, title: 'Photo Memories', description: 'Beautiful moments captured' },
    { icon: Palette, title: 'Moodboard', description: 'Visual inspiration and feelings' },
    { icon: Sparkles, title: 'Interactive Features', description: 'Touch and explore together' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.heartContainer, { backgroundColor: colors.primary }]}>
            <Heart size={60} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Credits</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            A labor of love for you
          </Text>
        </View>

        {/* Animated Text */}
        <View style={styles.animatedSection}>
          <Text style={[styles.animatedText, { color: colors.primary }]}>
            {animatedText}
            {showHeart && <Text style={{ color: colors.secondary }}> 💜</Text>}
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View 
                key={index} 
                style={[
                  styles.featureCard, 
                  { backgroundColor: colors.surface, borderColor: colors.border }
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
                  <feature.icon size={24} color="#FFFFFF" />
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Special Message */}
        <View style={[styles.messageCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.messageTitle, { color: colors.primary }]}>
            Thank You 💜
          </Text>
          <Text style={[styles.messageText, { color: colors.text }]}>
            For being the most amazing person in my life. Every moment with you is a gift, 
            and I wanted to create something special to show you how much you mean to me.
          </Text>
          <Text style={[styles.messageSignature, { color: colors.textSecondary }]}>
            - King
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Built Just For You 💜
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Version 1.0.0
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  heartContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  animatedSection: {
    alignItems: 'center',
    marginBottom: 40,
    minHeight: 60,
  },
  animatedText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  messageCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  messageSignature: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 