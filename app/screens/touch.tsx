import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MessageCircle, Heart } from 'lucide-react-native';

const touchMessages = [
  "You make my heart skip a beat 💜",
  "Your smile is my favorite view ✨",
  "Every day with you is a gift 🎁",
  "You're my happy place 🌟",
  "Your laugh is pure magic 🎵",
  "You light up my world 💫",
  "You're absolutely amazing 👑",
  "My heart belongs to you 💖",
];

export default function TouchScreen() {
  const [revealedMessages, setRevealedMessages] = useState(new Set());

  const handleHeartPress = (index) => {
    setRevealedMessages(prev => new Set([...prev, index]));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MessageCircle size={50} color="#A020F0" />
          <Text style={styles.title}>Touch Messages</Text>
          <Text style={styles.subtitle}>Tap the hearts to reveal sweet messages</Text>
        </View>

        <View style={styles.heartsGrid}>
          {touchMessages.map((message, index) => (
            <View key={index} style={styles.heartContainer}>
              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => handleHeartPress(index)}
              >
                <Heart 
                  size={40} 
                  color="#A020F0" 
                  fill={revealedMessages.has(index) ? "#A020F0" : "transparent"} 
                />
              </TouchableOpacity>
              
              {revealedMessages.has(index) && (
                <View style={styles.messageCard}>
                  <Text style={styles.messageText}>{message}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {revealedMessages.size === touchMessages.length && (
          <View style={styles.completionCard}>
            <Text style={styles.completionText}>
              You've discovered all my messages! 💜{'\n'}
              Each one comes straight from my heart.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  heartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  heartContainer: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 20,
  },
  heartButton: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    width: '100%',
  },
  messageCard: {
    marginTop: 10,
    backgroundColor: 'rgba(160, 32, 240, 0.1)',
    borderColor: 'rgba(160, 32, 240, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completionCard: {
    backgroundColor: 'rgba(160, 32, 240, 0.2)',
    borderColor: 'rgba(160, 32, 240, 0.4)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  completionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});