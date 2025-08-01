import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Animated } from 'react-native';
import { Heart, Calendar, Star, Camera, Palette, ArrowRight, Sparkles, Utensils, Moon, Sun } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const features = [
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
    title: 'Photo Memories',
    description: 'Beautiful moments captured',
    icon: Camera,
    color: '#FF69B4',
    route: '/screens/photos',
  },
  {
    id: 3,
    title: 'Important Dates',
    description: 'Special moments in our story',
    icon: Calendar,
    color: '#DA70D6',
    route: '/screens/calendar',
  },
  {
    id: 4,
    title: 'Moodboard',
    description: 'Visual inspiration & feelings',
    icon: Palette,
    color: '#FF1493',
    route: '/screens/moodboard',
  },
  {
    id: 5,
    title: 'My Favorites',
    description: 'Things that make me smile',
    icon: Heart,
    color: '#8A2BE2',
    route: '/screens/favorites',
  },
  {
    id: 6,
    title: 'Credits',
    description: 'Made with love for you',
    icon: Star,
    color: '#BA55D3',
    route: '/screens/credits',
  },
];

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderFeatureCard = (feature: any) => (
    <TouchableOpacity
      key={feature.id}
      style={[styles.featureCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
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

  const handleProceed = () => {
    setShowWelcomeModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: colors.primary }]}>
            <Heart size={40} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Welcome Princess</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Ready to explore our love story? 💜
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={[styles.welcomeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.welcomeContent}>
            <Sparkles size={24} color={colors.primary} />
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              Every moment with you is a beautiful adventure. Let's create more memories together! ✨
            </Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Explore Our World</Text>
          <View style={styles.featuresGrid}>
            {features.map(renderFeatureCard)}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Journey</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>168</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Together</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>5:1</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Uno Score</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>∞</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Love & Laughter</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with 💜 for the most amazing person in my life
          </Text>
        </View>
      </ScrollView>

      {/* Theme Toggle */}
      <TouchableOpacity 
        style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={toggleTheme}
      >
        {theme === 'purple' ? (
          <Sun size={20} color={colors.text} />
        ) : (
          <Moon size={20} color={colors.text} />
        )}
      </TouchableOpacity>

      {/* Welcome Modal for Christabel */}
      <Modal
        visible={showWelcomeModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {/* Crown Icon */}
            <View style={[styles.crownContainer, { backgroundColor: colors.primary }]}>
              <Sparkles size={40} color="#FFFFFF" />
            </View>

            {/* Access Message */}
            <Text style={[styles.accessText, { color: colors.textSecondary }]}>
              Only Christabel Haizel Makafui has access
            </Text>

            {/* Welcome Message */}
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Welcome Princess! 👑
            </Text>
            
            <Text style={[styles.welcomeSubtitle, { color: colors.primary }]}>
              Happy Girlfriends Day! 💜
            </Text>

            <Text style={[styles.welcomeMessage, { color: colors.textSecondary }]}>
              Your special place awaits, filled with love, memories, and beautiful moments just for you.
            </Text>

            {/* Sparkles */}
            <View style={styles.sparklesContainer}>
              <Sparkles size={24} color={colors.secondary} />
              <Sparkles size={20} color={colors.primary} />
              <Sparkles size={24} color={colors.secondary} />
            </View>

            {/* Proceed Button */}
            <TouchableOpacity
              style={[styles.proceedButton, { backgroundColor: colors.primary }]}
              onPress={handleProceed}
            >
              <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.proceedButtonText}>Proceed to Your World</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  welcomeCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
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
  featureCard: {
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
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  accessText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  sparklesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
  },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});