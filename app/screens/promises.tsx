import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Heart } from 'lucide-react-native';

const promises = [
  'I promise to always listen with my whole heart',
  'I promise to celebrate every little victory with you',
  'I promise to be your safe space in any storm',
  'I promise to make you laugh even on difficult days',
  'I promise to support your dreams unconditionally',
  'I promise to remember all the little things you love',
  'I promise to be honest and genuine always',
  'I promise to cherish every moment we share',
  'I promise to be patient and understanding',
  'I promise to love you and i aanoy you a little',
];

export default function PromisesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Heart size={50} color="#A020F0" fill="#A020F0" />
          <Text style={styles.title}>My Promises to You</Text>
          <Text style={styles.subtitle}>From my heart to yours</Text>
        </View>

        <View style={styles.promisesList}>
          {promises.map((promise, index) => (
            <View key={index} style={styles.promiseCard}>
              <View style={styles.promiseNumber}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.promiseText}>{promise}</Text>
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
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: 'center',
  },
  promisesList: {
    gap: 15,
  },
  promiseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  promiseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A020F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  promiseText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
});