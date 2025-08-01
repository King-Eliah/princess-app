import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Mail } from 'lucide-react-native';

export default function LoveLetterScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Mail size={50} color="#A020F0" />
          <Text style={styles.title}>Love Letter</Text>
        </View>

        <View style={styles.letterCard}>
          <Text style={styles.letterText}>
            My Dearest Princess,{'\n\n'}
            
            Every day with you feels like a beautiful dream that I never want to wake up from. 
            Your presence in my life has brought colors I never knew existed, melodies I never heard before, 
            and a warmth that reaches the deepest parts of my soul.{'\n\n'}
            
            From the moment i saw you, I knew there was something magical about you. 
            Your first hug felt like coming home, and when you sang for me, 
            my heart knew it had found its rhythm.{'\n\n'}
            
            You are more than I ever dared to wish for, and everything I never knew I needed. 
            Your laugh is my favorite sound, your smile is my favorite sight, 
            and your happiness is my favorite mission.{'\n\n'}
            
            Thank you for being the incredible person you are, for bringing light into my world, 
            and for making every ordinary moment feel extraordinary.{'\n\n'}
            
            With all my love and endless admiration,{'\n'}
            King 💜
          </Text>
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
  letterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 25,
  },
  letterText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});