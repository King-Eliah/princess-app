import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Star, ChevronLeft, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StarMessage {
  id: string;
  message: string;
  date: string;
  timestamp: number;
}

const defaultMessages: StarMessage[] = [
  { id: '1', message: "You are my brightest star", date: new Date().toLocaleDateString(), timestamp: Date.now() - 10000 },
  { id: '2', message: "Your love lights up my universe", date: new Date().toLocaleDateString(), timestamp: Date.now() - 9000 },
  { id: '3', message: "Together we shine brighter", date: new Date().toLocaleDateString(), timestamp: Date.now() - 8000 },
  { id: '4', message: "You make my dreams come true", date: new Date().toLocaleDateString(), timestamp: Date.now() - 7000 },
  { id: '5', message: "Forever grateful for you", date: new Date().toLocaleDateString(), timestamp: Date.now() - 6000 },
  { id: '6', message: "You are my constellation of joy", date: new Date().toLocaleDateString(), timestamp: Date.now() - 5000 },
  { id: '7', message: "In your eyes, I see galaxies", date: new Date().toLocaleDateString(), timestamp: Date.now() - 4000 },
  { id: '8', message: "You are my North Star, guiding me home", date: new Date().toLocaleDateString(), timestamp: Date.now() - 3000 },
  { id: '9', message: "Every moment with you is magical", date: new Date().toLocaleDateString(), timestamp: Date.now() - 2000 },
  { id: '10', message: "You are the wish on every shooting star", date: new Date().toLocaleDateString(), timestamp: Date.now() - 1000 },
];

export default function StarryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [messages, setMessages] = useState<StarMessage[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<StarMessage | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const saved = await AsyncStorage.getItem('starryMessages');
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(defaultMessages);
        await AsyncStorage.setItem('starryMessages', JSON.stringify(defaultMessages));
      }
    } catch {
      setMessages(defaultMessages);
    }
  };

  const saveMessages = async (updatedMessages: StarMessage[]) => {
    try {
      await AsyncStorage.setItem('starryMessages', JSON.stringify(updatedMessages));
    } catch {}
  };

  const addMessage = () => {
    if (!newMessage.trim()) {
      Alert.alert('Required', 'Please enter a message.');
      return;
    }

    const message: StarMessage = {
      id: Date.now().toString(),
      message: newMessage.trim(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };

    const updated = [message, ...messages];
    setMessages(updated);
    saveMessages(updated);
    setNewMessage('');
    setShowAddModal(false);
    Alert.alert('Added', 'Star message added!');
  };

  const updateMessage = () => {
    if (!editingMessage || !newMessage.trim()) {
      Alert.alert('Required', 'Please enter a message.');
      return;
    }

    const updated = messages.map(msg =>
      msg.id === editingMessage.id
        ? { ...msg, message: newMessage.trim() }
        : msg
    );

    setMessages(updated);
    saveMessages(updated);
    setNewMessage('');
    setEditingMessage(null);
    setShowAddModal(false);
    Alert.alert('Updated', 'Message updated!');
  };

  const deleteMessage = (id: string) => {
    Alert.alert('Delete Message', 'Delete this star message?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const updated = messages.filter(msg => msg.id !== id);
        setMessages(updated);
        saveMessages(updated);
      }},
    ]);
  };

  const startEdit = (msg: StarMessage) => {
    setEditingMessage(msg);
    setNewMessage(msg.message);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingMessage(null);
    setNewMessage('');
  };

  const renderMessage = ({ item }: { item: StarMessage }) => (
    <View style={[styles.messageCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.messageHeader}>
        <Star size={20} color={colors.primary} fill={colors.primary} />
      </View>
      <Text style={[styles.messageText, { color: colors.text }]} numberOfLines={3} ellipsizeMode="tail">
        {item.message}
      </Text>
      <Text style={[styles.messageDate, { color: colors.textSecondary }]}>{item.date}</Text>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Starry Night</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {messages.length} star {messages.length === 1 ? 'message' : 'messages'}
          </Text>
        </View>

        <View style={styles.addButton} />
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
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
                {editingMessage ? 'Edit Star Message' : 'New Star Message'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Message *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Write your star message..."
              placeholderTextColor={colors.textSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              numberOfLines={4}
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
                onPress={editingMessage ? updateMessage : addMessage}
              >
                <Star size={18} color="#FFFFFF" />
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {editingMessage ? 'Update' : 'Add'}
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
  messagesList: {
    padding: 20,
    paddingBottom: 100,
  },
  messageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  messageDate: {
    fontSize: 12,
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
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