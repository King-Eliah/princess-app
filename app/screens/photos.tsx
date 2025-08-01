import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { Camera, Heart, ArrowLeft, Video, Plus, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Note: MediaTypeOptions deprecation warnings are safe to ignore
// The functionality works correctly with the current API
// These warnings will be resolved when expo-image-picker updates

const { width, height } = Dimensions.get('window');

interface MemoryItem {
  id: string;
  type: 'photo' | 'video';
  uri: string;
  title: string;
  date: string;
  description: string;
}

export default function PhotosScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    uri: '',
    type: 'photo' as 'photo' | 'video',
  });

  // Load saved memories on component mount
  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const savedMemories = await AsyncStorage.getItem('userMemories');
      if (savedMemories) {
        setMemories(JSON.parse(savedMemories));
      }
    } catch (error) {
      console.log('Error loading memories:', error);
    }
  };

  const saveMemories = async (newMemories: MemoryItem[]) => {
    try {
      await AsyncStorage.setItem('userMemories', JSON.stringify(newMemories));
    } catch (error) {
      console.log('Error saving memories:', error);
    }
  };

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setNewMemory({
          title: '',
          description: '',
          uri: asset.uri,
          type: 'photo',
        });
        setShowUploadModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setNewMemory({
          title: '',
          description: '',
          uri: asset.uri,
          type: 'video',
        });
        setShowUploadModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  };

  const addMemory = async () => {
    if (!newMemory.title.trim()) {
      Alert.alert('Title Required', 'Please add a title for this memory.');
      return;
    }

    if (!newMemory.uri) {
      Alert.alert('Error', 'No media selected. Please try again.');
      return;
    }

    try {
      const newMemoryItem: MemoryItem = {
        id: Date.now().toString(),
        type: newMemory.type,
        uri: newMemory.uri,
        title: newMemory.title.trim(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        description: newMemory.description.trim(),
      };

      const updatedMemories = [newMemoryItem, ...memories];
      setMemories(updatedMemories);
      await saveMemories(updatedMemories);

      setShowUploadModal(false);
      setNewMemory({ title: '', description: '', uri: '', type: 'photo' });

      Alert.alert('Success! 💜', 'Your memory has been saved.');
    } catch (error) {
      console.log('Error adding memory:', error);
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    }
  };

  const deleteMemory = async (id: string) => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedMemories = memories.filter(memory => memory.id !== id);
            setMemories(updatedMemories);
            await saveMemories(updatedMemories);
            Alert.alert('Deleted', 'Memory has been removed.');
          },
        },
      ]
    );
  };

  const renderMemory = ({ item }: { item: MemoryItem }) => (
    <View style={[styles.memoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.memoryHeader}>
        <View style={styles.memoryInfo}>
          <Text style={[styles.memoryTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.memoryDate, { color: colors.textSecondary }]}>{item.date}</Text>
        </View>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: '#ff4757' }]}
          onPress={() => deleteMemory(item.id)}
        >
          <Trash2 size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.memoryMedia}>
        {item.type === 'photo' ? (
          <TouchableOpacity onPress={() => viewFullScreen(item)}>
            <Image source={{ uri: item.uri }} style={styles.memoryImage} resizeMode="cover" />
          </TouchableOpacity>
        ) : (
          <View style={styles.videoContainer}>
            <ExpoVideo
              source={{ uri: item.uri }}
              style={styles.memoryVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              shouldPlay={false}
              onError={(error) => {
                console.log('Video error:', error);
                Alert.alert('Video Error', 'Unable to play this video.');
              }}
            />
          </View>
        )}
      </View>
      
      {item.description && (
        <Text style={[styles.memoryDescription, { color: colors.textSecondary }]}>
          {item.description}
        </Text>
      )}
    </View>
  );

  const viewFullScreen = (item: MemoryItem) => {
    if (item.type === 'photo') {
      Alert.alert(
        'View Photo',
        'Full screen photo viewing will be implemented here.',
        [{ text: 'OK' }]
      );
    }
  };



  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Photo & Video Moments</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Capture and cherish your memories</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={pickPhoto} style={styles.headerButton}>
            <ImageIcon size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={pickVideo} style={styles.headerButton}>
            <Video size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Empty State */}
      {memories.length === 0 && (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Camera size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Memories Yet 📸</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Start creating beautiful memories together! Capture photos and videos of your special moments.
          </Text>

        </View>
      )}

      {/* Memories List */}
      {memories.length > 0 && (
        <FlatList
          data={memories}
          renderItem={renderMemory}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memoriesList}
        />
      )}



      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.uploadModal, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.uploadModalHeader}>
              <Text style={[styles.uploadModalTitle, { color: colors.text }]}>Add Memory Details</Text>
                              <TouchableOpacity 
                  style={[styles.closeButton, { marginRight: -50 }]}
                  onPress={() => setShowUploadModal(false)}
                >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Preview */}
            {newMemory.uri && (
              <View style={styles.previewContainer}>
                {newMemory.type === 'photo' ? (
                  <Image source={{ uri: newMemory.uri }} style={styles.preview} resizeMode="cover" />
                ) : (
                  <View style={styles.videoPreview}>
                    <Video size={32} color={colors.primary} />
                    <Text style={[styles.videoPreviewText, { color: colors.text }]}>Video Selected</Text>
                  </View>
                )}
              </View>
            )}
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Give this memory a title..."
              placeholderTextColor={colors.textSecondary}
              value={newMemory.title}
              onChangeText={(text) => setNewMemory({ ...newMemory, title: text })}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textInputMultiline, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Add a description..."
              placeholderTextColor={colors.textSecondary}
              value={newMemory.description}
              onChangeText={(text) => setNewMemory({ ...newMemory, description: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <View style={styles.uploadModalButtons}>
              <TouchableOpacity
                style={[styles.uploadModalButton, { backgroundColor: colors.border }]}
                onPress={() => setShowUploadModal(false)}
              >
                <Text style={[styles.uploadModalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.uploadModalButton, { backgroundColor: colors.primary }]}
                onPress={addMemory}
              >
                <Heart size={18} color="#FFFFFF" />
                <Text style={styles.uploadModalButtonText}>Save Memory</Text>
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
    paddingVertical: 15,
    paddingTop: 60,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 8,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memoriesList: {
    padding: 20,
    paddingBottom: 100,
  },
  memoryCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  memoryInfo: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  memoryDate: {
    fontSize: 14,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryMedia: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  memoryImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  memoryVideo: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  memoryDescription: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  actionSheet: {
    width: '90%',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  actionSheetHandle: {
    width: 50,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginBottom: 20,
  },
  actionSheetTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    gap: 12,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    width: '100%',
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadModal: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  uploadModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  uploadModalTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  videoPreviewText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '100%',
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  textInputMultiline: {
    height: 80,
    paddingTop: 12,
  },
  uploadModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
    gap: 15,
  },
  uploadModalButton: {
    flex: 1,
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});