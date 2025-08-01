import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Gift, Heart, Lock, Sparkles, Crown, Coffee, Gamepad2, Film, Pizza } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const gifts = [
  { id: 1, title: 'Boba Date', description: 'A sweet boba tea date together', icon: Coffee, color: '#FF6B6B' },
  { id: 2, title: 'Arcade Date', description: 'Fun games and arcade adventures', icon: Gamepad2, color: '#4ECDC4' },
  { id: 3, title: 'Movie Date', description: 'Watch a movie together', icon: Film, color: '#FFE66D' },
  { id: 4, title: 'Pizza Date', description: 'Delicious pizza dinner date', icon: Pizza, color: '#FF8E8E' },
];

export default function GiftsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const handleGiftSelect = (giftId: number) => {
    if (hasPlayed) {
      Alert.alert('Already Chosen! 💜', 'You can only pick one gift, Princess! Choose wisely next time! 👑');
      return;
    }

    setSelectedGift(giftId);
    setHasPlayed(true);
    
    const gift = gifts.find(g => g.id === giftId);
    Alert.alert(
      'Gift Chosen! 🎁',
      `You chose: ${gift?.title}\n\nThis is your final choice, Princess! I'll make it absolutely perfect for you! 💜✨`,
      [{ text: 'Thank You! 💜' }]
    );
  };

  const handleShowChoice = () => {
    setShowOnlySelected(true);
  };

  const selectedGiftData = selectedGift ? gifts.find(g => g.id === selectedGift) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Gift size={30} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Surprise Gifts</Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Choose carefully, Princess! You can only pick ONE special gift 💜
      </Text>

      <Text style={[styles.warningText, { color: colors.primary }]}>
        ⚠️ Once you choose, you cannot change your mind!
      </Text>

      <ScrollView contentContainerStyle={styles.giftsContainer}>
        {!hasPlayed ? (
          // Initial game state - show mystery boxes
          <View style={styles.gameContainer}>
            <Text style={[styles.gameTitle, { color: colors.text }]}>
              Pick a Mystery Box! 🎁
            </Text>
            <Text style={[styles.gameSubtitle, { color: colors.textSecondary }]}>
              Each box contains a special surprise just for you
            </Text>
            
            <View style={styles.mysteryGrid}>
              {gifts.map((gift) => (
                <TouchableOpacity
                  key={gift.id}
                  style={[
                    styles.mysteryBox,
                    { backgroundColor: colors.surface, borderColor: colors.border }
                  ]}
                  onPress={() => handleGiftSelect(gift.id)}
                >
                  <View style={[styles.mysteryIcon, { backgroundColor: colors.primary }]}>
                    <Gift size={40} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.mysteryText, { color: colors.text }]}>
                    Mystery Box {gift.id}
                  </Text>
                  <Sparkles size={20} color={colors.secondary} style={styles.sparkleIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : showOnlySelected ? (
          // Show only the selected gift
          <View style={styles.selectedGiftContainer}>
            <Text style={[styles.selectedGiftTitle, { color: colors.text }]}>
              Your Chosen Gift:
            </Text>
            
            <View style={[styles.selectedGiftCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <View style={[styles.selectedGiftBadge, { backgroundColor: colors.primary }]}>
                <Crown size={16} color="#FFFFFF" />
                <Text style={styles.selectedGiftBadgeText}>CHOSEN!</Text>
              </View>
              
              <View style={[styles.giftIcon, { backgroundColor: selectedGiftData?.color }]}>
                {selectedGiftData && React.createElement(selectedGiftData.icon, { size: 40, color: "#FFFFFF" })}
              </View>
              
              <Text style={[styles.giftTitle, { color: colors.text }]}>
                {selectedGiftData?.title}
              </Text>
              
              <Text style={[styles.giftDescription, { color: colors.textSecondary }]}>
                {selectedGiftData?.description}
              </Text>
              
              <View style={styles.selectedIndicator}>
                <Heart size={20} color={colors.primary} fill={colors.primary} />
              </View>
            </View>
          </View>
        ) : (
          // After selection - show all gifts with option to see only selected
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              Here's What You Could Have Chosen:
            </Text>
            
            <TouchableOpacity
              style={[styles.viewChoiceButton, { backgroundColor: colors.primary }]}
              onPress={handleShowChoice}
            >
              <Text style={styles.viewChoiceButtonText}>View Only My Choice</Text>
            </TouchableOpacity>
            
            <View style={styles.giftsGrid}>
              {gifts.map((gift) => {
                const isSelected = selectedGift === gift.id;
                const IconComponent = gift.icon;
                
                return (
                  <View
                    key={gift.id}
                    style={[
                      styles.giftCard,
                      { 
                        backgroundColor: colors.surface, 
                        borderColor: isSelected ? colors.primary : colors.border,
                        opacity: isSelected ? 1 : 0.5,
                      },
                      isSelected && styles.selectedGift,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Crown size={16} color="#FFFFFF" />
                        <Text style={styles.selectedBadgeText}>CHOSEN!</Text>
                      </View>
                    )}
                    
                    <View style={[styles.giftIcon, { backgroundColor: gift.color }]}>
                      <IconComponent size={40} color="#FFFFFF" />
                    </View>
                    
                    <Text style={[styles.giftTitle, { color: colors.text }]}>
                      {gift.title}
                    </Text>
                    
                    <Text style={[styles.giftDescription, { color: colors.textSecondary }]}>
                      {gift.description}
                    </Text>
                    
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Heart size={16} color={colors.primary} fill={colors.primary} />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  giftsContainer: {
    paddingBottom: 20,
  },
  gameContainer: {
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  gameSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  mysteryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  mysteryBox: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    minHeight: 160,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mysteryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  mysteryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sparkleIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewChoiceButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  viewChoiceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  giftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  giftCard: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    minHeight: 160,
  },
  selectedGift: {
    borderWidth: 3,
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#A020F0',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  giftIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  giftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  giftDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  selectedGiftContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedGiftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedGiftCard: {
    width: '80%',
    borderWidth: 3,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    position: 'relative',
    elevation: 10,
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  selectedGiftBadge: {
    position: 'absolute',
    top: -15,
    right: -15,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  selectedGiftBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});