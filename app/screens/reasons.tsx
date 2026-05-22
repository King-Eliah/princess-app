import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { Heart, X, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reason {
  id: string;
  text: string;
  timestamp: number;
}

const defaultReasons: Reason[] = [
  { id: '1', text: 'Your smile lights up my entire world', timestamp: Date.now() },
  { id: '2', text: 'The way you laugh at my silly jokes', timestamp: Date.now() },
  { id: '3', text: 'Your kindness to everyone you meet', timestamp: Date.now() },
  { id: '4', text: 'How you make me feel like the luckiest person alive', timestamp: Date.now() },
  { id: '5', text: 'Your beautiful eyes that I could get lost in forever', timestamp: Date.now() },
  { id: '6', text: 'The way you care so deeply about the people you love', timestamp: Date.now() },
  { id: '7', text: 'Your incredible strength and resilience', timestamp: Date.now() },
  { id: '8', text: 'How you understand me better than anyone else', timestamp: Date.now() },
  { id: '9', text: 'Your gentle touch that makes everything better', timestamp: Date.now() },
  { id: '10', text: 'The way you support my dreams and encourage me', timestamp: Date.now() },
  { id: '11', text: 'Your playful spirit and sense of adventure', timestamp: Date.now() },
  { id: '12', text: 'How you make ordinary moments extraordinary', timestamp: Date.now() },
  { id: '13', text: 'Your compassion and empathy for others', timestamp: Date.now() },
  { id: '14', text: 'The way you always know how to comfort me', timestamp: Date.now() },
  { id: '15', text: 'Your beautiful soul that shines from within', timestamp: Date.now() },
];

export default function ReasonsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReason, setEditingReason] = useState<Reason | null>(null);
  const [reasonText, setReasonText] = useState('');

  useEffect(() => {
    loadReasons();
  }, []);

  const loadReasons = async () => {
    try {
      const stored = await AsyncStorage.getItem('loveReasons');
      if (stored) {
        setReasons(JSON.parse(stored));
      } else {
        setReasons(defaultReasons);
        await AsyncStorage.setItem('loveReasons', JSON.stringify(defaultReasons));
      }
    } catch {
      setReasons(defaultReasons);
    }
  };

  const saveReasons = async (updatedReasons: Reason[]) => {
    try {
      await AsyncStorage.setItem('loveReasons', JSON.stringify(updatedReasons));
      setReasons(updatedReasons);
    } catch {}
  };

  const addReason = () => {
    if (reasonText.trim()) {
      const newReason: Reason = {
        id: Date.now().toString(),
        text: reasonText.trim(),
        timestamp: Date.now(),
      };
      saveReasons([newReason, ...reasons]);
      closeModal();
    }
  };

  const updateReason = () => {
    if (editingReason && reasonText.trim()) {
      const updatedReasons = reasons.map((reason) =>
        reason.id === editingReason.id
          ? { ...reason, text: reasonText.trim() }
          : reason
      );
      saveReasons(updatedReasons);
      closeModal();
    }
  };

  const deleteReason = (id: string) => {
    saveReasons(reasons.filter((reason) => reason.id !== id));
  };

  const startEdit = (reason: Reason) => {
    setEditingReason(reason);
    setReasonText(reason.text);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReason(null);
    setReasonText('');
  };

  const renderReason = ({ item }: { item: Reason }) => (
    <View style={[styles.reasonCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.reasonContent}>
        <Heart size={20} color={colors.primary} fill={colors.primary} />
        <Text style={[styles.reasonText, { color: colors.text }]} numberOfLines={3} ellipsizeMode="tail">
          {item.text}
        </Text>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Reasons I Love You</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {reasons.length} reasons and counting
          </Text>
        </View>

        <View style={styles.addButton} />
      </View>

      {/* Reasons List */}
      <FlatList
        data={reasons}
        renderItem={renderReason}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingReason ? 'Edit Reason' : 'New Reason'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.textInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="I love you because..."
              placeholderTextColor={colors.textSecondary}
              value={reasonText}
              onChangeText={setReasonText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeModal} style={[styles.modalButton, { backgroundColor: colors.background }]}>
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={editingReason ? updateReason : addReason}
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {editingReason ? 'Update' : 'Add'}
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  reasonCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reasonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
