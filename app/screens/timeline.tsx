import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Alert } from 'react-native';
import { Clock, Heart, Music, Sparkles, ChevronLeft, Plus, X, Calendar, Trash2, Edit2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  color: string;
  timestamp: number;
}

const eventColors = ['#FF69B4', '#A020F0', '#DA70D6', '#FF1493', '#BA55D3', '#8A2BE2'];

export default function TimelineScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', description: '' });

  useEffect(() => {
    loadEvents();
  }, []);

  const OFFICIAL_MS = new Date('2026-03-18').getTime();

  const defaultEvents: TimelineEvent[] = [
    {
      id: 'first-meeting',
      date: 'December 2025',
      title: 'Our first real conversation',
      description: 'The moment everything started to feel different in the best way.',
      color: eventColors[0],
      timestamp: OFFICIAL_MS - 90 * 86400000,
    },
    {
      id: 'first-date',
      date: 'Early 2026',
      title: 'First time we hung out',
      description: 'Smiles, butterflies, and the feeling that this could be something special.',
      color: eventColors[1],
      timestamp: OFFICIAL_MS - 30 * 86400000,
    },
    {
      id: 'made-it-official',
      date: 'March 18, 2026',
      title: 'Us, officially',
      description: 'From talking every day to choosing each other for real. The best day.',
      color: eventColors[2],
      timestamp: Date.now() - 1000,
    },
    {
      id: 'first-i-love-you',
      date: 'April 2026',
      title: 'Three words that changed everything',
      description: 'When we both finally said what we had been feeling all along.',
      color: eventColors[3],
      timestamp: OFFICIAL_MS + 14 * 86400000,
    },
    {
      id: 'first-monthiversary',
      date: 'April 18, 2026',
      title: 'One month strong',
      description: 'Our first monthly anniversary — and the beginning of many more.',
      color: eventColors[4],
      timestamp: OFFICIAL_MS + 31 * 86400000,
    },
    {
      id: 'today-and-always',
      date: 'Today and every day',
      title: 'Still choosing you',
      description: 'Every day with you is a new favorite memory in the making.',
      color: eventColors[5],
      timestamp: Date.now(),
    },
  ];

  const loadEvents = async () => {
    try {
      const saved = await AsyncStorage.getItem('timelineEvents');
      if (saved) {
        const parsed: TimelineEvent[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const now = Date.now();
          const migrated = parsed.map(e => {
            // Always keep today-and-always at the very end
            if (e.id === 'today-and-always') return { ...e, timestamp: now };
            // Keep made-it-official just before today-and-always
            if (e.id === 'made-it-official') return { ...e, timestamp: now - 1000 };
            return e;
          });
          const sorted = [...migrated].sort((a, b) => a.timestamp - b.timestamp);
          setEvents(sorted);
          await AsyncStorage.setItem('timelineEvents', JSON.stringify(sorted));
          return;
        }
      }
      const sorted = [...defaultEvents].sort((a, b) => a.timestamp - b.timestamp);
      setEvents(sorted);
      await AsyncStorage.setItem('timelineEvents', JSON.stringify(sorted));
    } catch {
      setEvents([...defaultEvents].sort((a, b) => a.timestamp - b.timestamp));
    }
  };

  const saveEvents = async (updatedEvents: TimelineEvent[]) => {
    try {
      await AsyncStorage.setItem('timelineEvents', JSON.stringify(updatedEvents));
    } catch {}
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) {
      Alert.alert('Required', 'Please add a date and title for this event.');
      return;
    }

    const event: TimelineEvent = {
      id: Date.now().toString(),
      date: newEvent.date.trim(),
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      color: eventColors[Math.floor(Math.random() * eventColors.length)],
      timestamp: Date.now(),
    };

    const updatedEvents = [...events, event].sort((a, b) => a.timestamp - b.timestamp);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setNewEvent({ date: '', title: '', description: '' });
    setShowAddModal(false);
    Alert.alert('Saved', 'Timeline event added!');
  };

  const updateEvent = () => {
    if (!editingEvent || !newEvent.title.trim() || !newEvent.date.trim()) {
      Alert.alert('Required', 'Please add a date and title for this event.');
      return;
    }

    const updatedEvents = events.map(event =>
      event.id === editingEvent.id
        ? { ...event, date: newEvent.date.trim(), title: newEvent.title.trim(), description: newEvent.description.trim() }
        : event
    );

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setNewEvent({ date: '', title: '', description: '' });
    setEditingEvent(null);
    setShowAddModal(false);
    Alert.alert('Updated', 'Timeline event updated!');
  };

  const deleteEvent = (id: string) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const updatedEvents = events.filter(event => event.id !== id);
        setEvents(updatedEvents);
        saveEvents(updatedEvents);
      }},
    ]);
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setNewEvent({ date: event.date, title: event.title, description: event.description });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setNewEvent({ date: '', title: '', description: '' });
  };

  const renderEvent = (event: TimelineEvent, index: number) => (
    <View key={event.id} style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.iconContainer, { backgroundColor: event.color }]}>
          <Heart size={24} color="#FFFFFF" />
        </View>
        {index < events.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
      </View>
      
      <View style={styles.timelineContent}>
        <View style={[styles.eventCard, { backgroundColor: colors.surface }]}>
          <View style={styles.eventHeader}>
            <Text style={[styles.eventDate, { color: event.color }]}>{event.date}</Text>
            <View style={styles.eventActions}>
              <TouchableOpacity onPress={() => startEdit(event)} style={styles.actionBtn}>
                <Edit2 size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteEvent(event.id)} style={styles.actionBtn}>
                <Trash2 size={16} color="#ff4757" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">{event.title}</Text>
          {event.description && (
            <Text style={[styles.eventDescription, { color: colors.textSecondary }]} numberOfLines={3} ellipsizeMode="tail">{event.description}</Text>
          )}
        </View>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Our Timeline</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {events.length} {events.length === 1 ? 'moment' : 'moments'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {events.length === 0 && (
        <ScrollView 
          contentContainerStyle={styles.emptyStateContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
              <Clock size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Create Your Timeline ⏰</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Capture the special moments and milestones in your relationship journey!
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Add First Moment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Timeline List */}
      {events.length > 0 && (
        <ScrollView 
          contentContainerStyle={styles.timelineList}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event, index) => renderEvent(event, index))}
        </ScrollView>
      )}

      {/* Add/Edit Event Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingEvent ? 'Edit Moment' : 'New Moment'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Date *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., Feb 18, 2025"
              placeholderTextColor={colors.textSecondary}
              value={newEvent.date}
              onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="What happened on this day?"
              placeholderTextColor={colors.textSecondary}
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Add more details about this special moment..."
              placeholderTextColor={colors.textSecondary}
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={closeModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={editingEvent ? updateEvent : addEvent}
              >
                <Heart size={18} color="#FFFFFF" />
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {editingEvent ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timelineList: {
    padding: 20,
    paddingBottom: 140,
    flexGrow: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 24,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});