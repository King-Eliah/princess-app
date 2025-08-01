import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar as CalendarIcon, Heart, Music, Sparkles, Gift, Cake, Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const importantDates = [
  {
    date: 'February 18',
    title: 'The Day I Texted You',
    description: 'The beginning of our beautiful story',
    icon: Heart,
  },
  {
    date: 'February 18',
    title: 'Our First Hug',
    description: 'A moment that changed everything',
    icon: Heart,
  },
  {
    date: 'May 22',
    title: 'Her Birthday',
    description: 'The most special day of the year',
    icon: Gift,
  },
  {
    date: 'July 18',
    title: 'Our Secret',
    description: 'I\'m cherishing this moment',
    icon: Heart,
  },
];

export default function CalendarScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <CalendarIcon size={50} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Important Dates</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Moments that matter most</Text>
        </View>

        <View style={styles.datesList}>
          {importantDates.map((dateItem, index) => {
            const IconComponent = dateItem.icon;
            return (
              <View key={index} style={[styles.dateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.dateHeader}>
                  <View style={[styles.dateIcon, { backgroundColor: colors.primary }]}>
                    <IconComponent size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.dateInfo}>
                    <Text style={[styles.dateTitle, { color: colors.primary }]}>{dateItem.date}</Text>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{dateItem.title}</Text>
                    <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{dateItem.description}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Every date marks a beautiful chapter in our story 💜
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  datesList: {
    gap: 20,
  },
  dateCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  dateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});