import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FileText } from 'lucide-react-native';

export default function PoemScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <FileText size={50} color="#A020F0" />
          <Text style={styles.title}>Beautiful Poem</Text>
          <Text style={styles.subtitle}>Written just for you</Text>
        </View>

        <View style={styles.poemCard}>
          <Text style={styles.poemTitle}>My Princess</Text>
          <Text style={styles.poemText}>
            In a world of endless stars above,{'\n'}
            You shine the brightest, my love.{'\n'}
            Your laughter echoes through my days,{'\n'}
            In countless beautiful ways.{'\n\n'}
            
            Your kindness flows like gentle rain,{'\n'}
            Washing away all my pain.{'\n'}
            With every smile, with every glance,{'\n'}
            You put my heart in a trance.{'\n\n'}
            
            Princess, you're my guiding light,{'\n'}
            Making everything feel right.{'\n'}
            In your eyes I see my home,{'\n'}
            Never again will I roam.{'\n\n'}
            
            Forever grateful, forever true,{'\n'}
            My heart belongs only to you.{'\n'}
            My beautiful, wonderful Princess dear,{'\n'}
            You're everything I hold near.
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
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: 'center',
  },
  poemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 25,
  },
  poemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A020F0',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  poemText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});