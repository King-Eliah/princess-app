import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Calendar as CalendarIcon, Heart, Music, Sparkles, Gift, Cake, Star, ChevronLeft, Plus, X, Edit2, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconMap = {
  Heart, Music, Sparkles, Gift, Cake, Star
};

interface SpecialDate {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  timestamp: number;
}

const defaultDates: SpecialDate[] = [
  {
    id: '1',
    date: 'February 18',
    title: 'The Day I Texted You',
    description: 'The beginning of our beautiful story',
    icon: 'Heart',
    timestamp: Date.now() - 4000,
  },
  {
    id: '2',
    date: 'February 18',
    title: 'Our First Hug',
    description: 'A moment that changed everything',
    icon: 'Heart',
    timestamp: Date.now() - 3000,
  },
  {
    id: 'march-18-anniversary',
    date: 'March 18',
    title: 'The Day We Made It Official',
    description: 'The day we chose each other and everything changed.',
    icon: 'Heart',
    timestamp: new Date('2026-03-18').getTime(),
  },
  {
    id: '3',
    date: 'May 22',
    title: 'Her Birthday',
    description: 'The most special day of the year',
    icon: 'Gift',
    timestamp: Date.now() - 2000,
  },
  {
    id: '4',
    date: 'July 18',
    title: 'Our Secret',
    description: 'I\'m cherishing this moment',
    icon: 'Heart',
    timestamp: Date.now() - 1000,
  },
];

export default function CalendarScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [dates, setDates] = useState<SpecialDate[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDate, setEditingDate] = useState<SpecialDate | null>(null);
  const [newDate, setNewDate] = useState({ date: '', title: '', description: '', icon: 'Heart' });

  useEffect(() => {
    loadDates();
  }, []);

  const loadDates = async () => {
    try {
      const saved = await AsyncStorage.getItem('specialDates');
      let data: SpecialDate[] = saved ? JSON.parse(saved) : defaultDates;
      // Migration: ensure March 18 anniversary entry exists
      if (!data.some(d => d.id === 'march-18-anniversary')) {
        const entry: SpecialDate = {
          id: 'march-18-anniversary',
          date: 'March 18',
          title: 'The Day We Made It Official',
          description: 'The day we chose each other and everything changed.',
          icon: 'Heart',
          timestamp: new Date('2026-03-18').getTime(),
        };
        data = [entry, ...data];
        await AsyncStorage.setItem('specialDates', JSON.stringify(data));
      }
      setDates(data);
    } catch {
      setDates(defaultDates);
    }
  };

  const saveDates = async (updatedDates: SpecialDate[]) => {
    try {
      await AsyncStorage.setItem('specialDates', JSON.stringify(updatedDates));
    } catch {}
  };

  const addDate = () => {
    if (!newDate.date.trim() || !newDate.title.trim()) {
      Alert.alert('Required', 'Please fill in date and title.');
      return;
    }

    const dateItem: SpecialDate = {
      id: Date.now().toString(),
      date: newDate.date.trim(),
      title: newDate.title.trim(),
      description: newDate.description.trim(),
      icon: newDate.icon,
      timestamp: Date.now(),
    };

    const updated = [dateItem, ...dates];
    setDates(updated);
    saveDates(updated);
    setNewDate({ date: '', title: '', description: '', icon: 'Heart' });
    setShowAddModal(false);
    Alert.alert('Added', 'Date added!');
  };

  const updateDate = () => {
    if (!editingDate || !newDate.date.trim() || !newDate.title.trim()) {
      Alert.alert('Required', 'Please fill in date and title.');
      return;
    }

    const updated = dates.map(d =>
      d.id === editingDate.id
        ? { ...d, date: newDate.date.trim(), title: newDate.title.trim(), description: newDate.description.trim(), icon: newDate.icon }
        : d
    );

    setDates(updated);
    saveDates(updated);
    setNewDate({ date: '', title: '', description: '', icon: 'Heart' });
    setEditingDate(null);
    setShowAddModal(false);
    Alert.alert('Updated', 'Date updated!');
  };

  const deleteDate = (id: string) => {
    Alert.alert('Delete Date', 'Delete this special date?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const updated = dates.filter(d => d.id !== id);
        setDates(updated);
        saveDates(updated);
      }},
    ]);
  };

  const startEdit = (dateItem: SpecialDate) => {
    setEditingDate(dateItem);
    setNewDate({ date: dateItem.date, title: dateItem.title, description: dateItem.description, icon: dateItem.icon });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingDate(null);
    setNewDate({ date: '', title: '', description: '', icon: 'Heart' });
  };

  const renderDate = ({ item }: { item: SpecialDate }) => {
    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Heart;
    return (
      <View style={[styles.dateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.dateHeader}>
          <View style={[styles.dateIcon, { backgroundColor: colors.primary }]}>
            <IconComponent size={24} color="#FFFFFF" />
          </View>
          <View style={styles.dateInfo}>
            <Text style={[styles.dateTitle, { color: colors.primary }]} numberOfLines={1} ellipsizeMode="tail">{item.date}</Text>
            <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
            <Text style={[styles.eventDescription, { color: colors.textSecondary }]} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
          </View>
          <View style={styles.dateActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => startEdit(item)}
            >
              <Edit2 size={14} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ff4757' }]}
              onPress={() => deleteDate(item.id)}
            >
              <Trash2 size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Important Dates</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {dates.length} special {dates.length === 1 ? 'date' : 'dates'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Dates List */}
      <FlatList
        data={dates}
        renderItem={renderDate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.datesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Add/Edit Modal */}
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
                {editingDate ? 'Edit Special Date' : 'New Special Date'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Date *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g., February 18"
              placeholderTextColor={colors.textSecondary}
              value={newDate.date}
              onChangeText={(text) => setNewDate({ ...newDate, date: text })}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Event title"
              placeholderTextColor={colors.textSecondary}
              value={newDate.title}
              onChangeText={(text) => setNewDate({ ...newDate, title: text })}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Optional description"
              placeholderTextColor={colors.textSecondary}
              value={newDate.description}
              onChangeText={(text) => setNewDate({ ...newDate, description: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Icon</Text>
            <View style={styles.iconSelector}>
              {Object.keys(iconMap).map((iconName) => {
                const Icon = iconMap[iconName as keyof typeof iconMap];
                return (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.iconOption,
                      { backgroundColor: newDate.icon === iconName ? colors.primary : colors.background, borderColor: colors.border }
                    ]}
                    onPress={() => setNewDate({ ...newDate, icon: iconName })}
                  >
                    <Icon size={20} color={newDate.icon === iconName ? '#FFFFFF' : colors.text} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.border }]}
                onPress={closeModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={editingDate ? updateDate : addDate}
              >
                <CalendarIcon size={18} color="#FFFFFF" />
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {editingDate ? 'Update' : 'Add'}
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
  datesList: {
    padding: 20,
    paddingBottom: 100,
  },
  dateCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    flexShrink: 1,
  },
  eventDescription: {
    fontSize: 14,
    flexShrink: 1,
  },
  dateActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  iconSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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