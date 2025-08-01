import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native';
import { ArrowLeft, Heart, Utensils, Sparkles, Crown, Star, Zap, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const regularFoods = [
  { id: 1, name: 'Waakye', emoji: '🍚' },
  { id: 2, name: 'Fried Rice', emoji: '🍚' },
  { id: 3, name: 'Jollof Rice', emoji: '🍚' },
  { id: 4, name: 'Rice & Stew', emoji: '🍚' },
  { id: 5, name: 'Yam Chips', emoji: '🍟' },
];

const bougieFoods = [
  { id: 1, name: 'Shawarma', emoji: '🌯' },
  { id: 2, name: 'Loaded Fries', emoji: '🍟' },
  { id: 3, name: 'Pizza', emoji: '🍕' },
  { id: 4, name: 'Boba', emoji: '🧋' },
  { id: 5, name: 'Tacos', emoji: '🌮' },
  { id: 6, name: 'KFC', emoji: '🍗' },
];

// Instructions for how to get the food
const instructions = [
  "Order it for delivery right now!",
  "Go to the kitchen and make it!",
  "Head to the nearest restaurant!",
  "Call a friend to bring it over!",
  "Walk to the store and buy ingredients!",
  "Look up a recipe and start cooking!",
  "Check your fridge and make it happen!",
  "Order it online for pickup!",
  "Ask someone to cook it for you!",
  "Go to your favorite spot that serves it!",
  "Search for the best place nearby!",
];

export default function FoodRouletteScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<{ id: number; name: string; emoji: string; } | null>(null);
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [isBougieMode, setIsBougieMode] = useState(false);
  
  const reelAnim = useRef(new Animated.Value(0)).current;
  const leverAnim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;

  const currentFoods = isBougieMode ? bougieFoods : regularFoods;

  const spinSlotMachine = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedFood(null);
    setSelectedInstruction(null);
    setSpinCount(prev => prev + 1);

    // Pull the lever animation
    Animated.sequence([
      Animated.timing(leverAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(leverAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Arrow pulse animation during spin
    const arrowPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    arrowPulse.start();

    // Reset reel position first
    reelAnim.setValue(0);

    // Random final position
    const finalPosition = Math.floor(Math.random() * currentFoods.length);
    const totalSpins = currentFoods.length * 5 + finalPosition; // 5 full cycles + final position

    // Animate the single reel with more realistic slot machine movement
    Animated.timing(reelAnim, {
      toValue: totalSpins,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      arrowPulse.stop();
      arrowAnim.setValue(0);
      
      // Determine the result
      const selected = currentFoods[finalPosition];
      const randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];
      
      setSelectedFood(selected);
      setSelectedInstruction(randomInstruction);
    });
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Utensils size={30} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Food Slot Machine</Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Pull the lever and see what you'll eat! 🎰
      </Text>

      {/* Bougie Mode Toggle */}
      <TouchableOpacity
        style={[
          styles.bougieToggle,
          { backgroundColor: isBougieMode ? colors.primary : colors.surface, borderColor: colors.border }
        ]}
        onPress={() => setIsBougieMode(!isBougieMode)}
      >
        <Crown size={20} color={isBougieMode ? '#FFFFFF' : colors.text} />
        <Text style={[styles.bougieText, { color: isBougieMode ? '#FFFFFF' : colors.text }]}>
          {isBougieMode ? 'Bougie Mode ON' : 'Bougie Mode OFF'}
        </Text>
      </TouchableOpacity>

      {/* Casino Slot Machine */}
      <View style={styles.slotMachineContainer}>
        {/* Slot Machine Body */}
        <View style={[styles.slotMachine, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Single Reel Container with Arrow */}
          <View style={styles.reelRow}>
            {/* Arrow Pointer */}
            <Animated.View style={[
              styles.arrowPointer,
              {
                transform: [
                  {
                    scale: arrowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    })
                  }
                ]
              }
            ]}>
              <ChevronRight size={32} color={colors.primary} />
            </Animated.View>

            {/* Single Reel */}
            <View style={[styles.reel, { borderColor: colors.border }]}>
              <View style={styles.reelWindow}>
                <Animated.View style={[
                  styles.reelContent, 
                  { 
                    transform: [{ 
                      translateY: reelAnim.interpolate({
                        inputRange: [0, currentFoods.length],
                        outputRange: [0, -currentFoods.length * 80],
                      }) 
                    }] 
                  }
                ]}>
                  {/* Create multiple copies of the food list for seamless scrolling */}
                  {Array.from({ length: 8 }, (_, cycle) => 
                    currentFoods.map((food, index) => (
                      <View key={`${cycle}-${index}`} style={styles.reelItem}>
                        <Text style={styles.reelEmoji}>{food.emoji}</Text>
                        <Text style={[styles.reelText, { color: colors.text }]}>{food.name}</Text>
                      </View>
                    ))
                  )}
                </Animated.View>
              </View>
            </View>
          </View>
        </View>

        {/* Lever - Now positioned under the wheel */}
        <Animated.View style={[
          styles.lever,
          { 
            backgroundColor: colors.primary,
            transform: [{ rotate: leverAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-15deg'],
            }) }]
          }
        ]}>
          <TouchableOpacity
            style={styles.leverButton}
            onPress={spinSlotMachine}
            disabled={isSpinning}
          >
            
            <Text style={styles.leverText}>
              {isSpinning ? 'SPINNING...' : 'PULL!'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Result */}
      {selectedFood && (
        <View style={[styles.resultContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.resultHeader}>
            <Sparkles size={24} color={colors.primary} />
            <Text style={[styles.resultTitle, { color: colors.primary }]}>
              🎉 Your Choice! 🎉
            </Text>
            <Sparkles size={24} color={colors.primary} />
          </View>
          
          <View style={styles.resultContent}>
            <Text style={[styles.resultFood, { color: colors.text }]}>
              {selectedFood.emoji} {selectedFood.name}
            </Text>
            
            {selectedInstruction && (
              <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                {selectedInstruction}
              </Text>
            )}
          </View>
          
          <Heart size={20} color={colors.secondary} />
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          Spins today: {spinCount} 🎰
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Made with love to help you decide 💜
        </Text>
      </View>
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
    marginBottom: 20,
    fontStyle: 'italic',
  },
  bougieToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    marginBottom: 20,
    gap: 8,
  },
  bougieText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slotMachineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
    paddingBottom: 80,
  },
  slotMachine: {
    width: width * 0.8,
    height: 150,
    borderRadius: 20,
    borderWidth: 4,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  reelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  arrowPointer: {
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  reel: {
    width: '80%',
    height: '80%',
    borderRadius: 15,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: '#2C2C2C',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  reelWindow: {
    flex: 1,
    overflow: 'hidden',
  },
  reelContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  reelItem: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  reelEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  reelText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lever: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    transformOrigin: '50% 100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginLeft: -100, // Center the button (half of width)
  },
  leverButton: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leverText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    marginVertical: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  resultFood: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  statsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statsText: {
    fontSize: 14,
    fontStyle: 'italic',
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