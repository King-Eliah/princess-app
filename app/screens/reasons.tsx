import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { List, Heart } from 'lucide-react-native';

const reasons = [
  "Your infectious smile that brightens every room",
  "The way you care for everyone around you", 
  "Your incredible strength and resilience",
  "The infintie number of reels you send me",
  "Your beautiful soul that sees good in everything",
  "How you make me feel like the luckiest person alive",
  "Your amazing sense of humor",
  "The way you light up when you're excited",
  "Your thoughtfulness in everything you do",
  "How you make ordinary moments feel magical",
  "They're so many i can't state them all"
];

export default function ReasonsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <List size={50} color="#A020F0" />
          <Text style={styles.title}>Reasons I Adore You</Text>
        </View>

        <View style={styles.reasonsList}>
          {reasons.map((reason, index) => (
            <View key={index} style={styles.reasonCard}>
              <Heart size={20} color="#A020F0" fill="#A020F0" />
              <Text style={styles.reasonText}>{reason}</Text>
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
  reasonsList: {
    gap: 15,
  },
  reasonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  reasonText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
});