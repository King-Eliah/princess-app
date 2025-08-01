import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Star } from 'lucide-react-native';

const floatingMessages = [
  "You are my brightest star ✨",
  "Your love lights up my universe 🌟",
  "Together we shine brighter 💫",
  "You make my dreams come true 🌙",
  "Forever grateful for you ⭐",
];

export default function StarryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Star size={50} color="#A020F0" />
          <Text style={styles.title}>Starry Night</Text>
          <Text style={styles.subtitle}>Under the stars, thinking of you</Text>
        </View>

        <View style={styles.starryContainer}>
          <View style={[styles.floatingStar, styles.star1]}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
          </View>
          <View style={[styles.floatingStar, styles.star2]}>
            <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={[styles.floatingStar, styles.star3]}>
            <Star size={24} color="#A020F0" fill="#A020F0" />
          </View>

          {floatingMessages.map((message, index) => (
            <View key={index} style={[styles.messageCard, { top: 100 + index * 80 }]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000011',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    minHeight: 800,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: 'center',
  },
  starryContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 600,
  },
  floatingStar: {
    position: 'absolute',
  },
  star1: {
    top: 50,
    right: 30,
  },
  star2: {
    top: 150,
    left: 40,
  },
  star3: {
    top: 250,
    right: 60,
  },
  messageCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(160, 32, 240, 0.1)',
    borderColor: 'rgba(160, 32, 240, 0.3)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});