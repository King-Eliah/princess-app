import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, Heart, Music, Sparkles } from 'lucide-react-native';

const timelineEvents = [
  {
    date: 'Feb 18',
    title: 'The Day It All Started',
    description: 'Our beautiful beginning - the moment that changed everything',
    icon: Heart,
    color: '#FF69B4',
  },
  {
    date: 'Feb 18',
    title: 'First Embrace',
    description: 'The warmth of our first hug - pure magic in that moment',
    icon: Heart,
    color: '#A020F0',
  },
  {
    date: 'Mar 22',
    title: 'You Sang for Me',
    description: 'Your beautiful voice filled my heart with joy',
    icon: Music,
    color: '#DA70D6',
  },
  {
    date: 'July 18',
    title: 'A Special Moment ✨',
    description: 'Our secret little moment that I treasure deeply',
    icon: Sparkles,
    color: '#FF1493',
  },
];

export default function TimelineScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Clock size={50} color="#A020F0" />
          <Text style={styles.title}>Our Timeline</Text>
          <Text style={styles.subtitle}>Every moment is precious</Text>
        </View>

        <View style={styles.timeline}>
          {timelineEvents.map((event, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.iconContainer, { backgroundColor: event.color }]}>
                  <event.icon size={24} color="#FFFFFF" />
                </View>
                {index < timelineEvents.length - 1 && <View style={styles.timelineLine} />}
              </View>
              
              <View style={styles.timelineContent}>
                <View style={styles.eventCard}>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              </View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    fontStyle: 'italic',
  },
  timeline: {
    marginBottom: 40,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(160, 32, 240, 0.3)',
    marginTop: 10,
  },
  timelineContent: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
  },
  eventDate: {
    fontSize: 14,
    color: '#A020F0',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});