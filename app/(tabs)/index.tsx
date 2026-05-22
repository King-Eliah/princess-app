import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated, Modal, Alert } from 'react-native';
import { Heart, Calendar, Camera, Sparkles, Gamepad2, MessageCircleHeart, ShoppingBag, Plus, Pencil, X, HelpCircle } from 'lucide-react-native';
import AppGuide from '@/components/AppGuide';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, useFocusEffect } from 'expo-router';
import { getSlideshowImages, getAllSlideshowImages, addSlideshowImage, removeSlideshowImage, MAX_SLIDESHOW, SlideshowImage } from '@/lib/slideshowStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMemories } from '@/lib/db';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const dailyQuotes = [
  "You are absolutely amazing, and every second with you feels like a dream.",
  "Every day with you in my life is a blessing, Princess.",
  "You're stronger than you think, braver than you believe, loved more than you know.",
  "Good morning, beautiful. May your day be filled with joy and endless possibilities.",
  "You light up my world. Go out there and shine bright today.",
];

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
}

const features = [
  { id: 7, title: 'Surprise', icon: Sparkles, color: '#E91E8C', route: '/screens/surprise' },
  { id: 1, title: 'Notes', icon: MessageCircleHeart, color: '#C2185B', route: '/screens/notes' },
  { id: 2, title: 'Games', icon: Gamepad2, color: '#AB47BC', route: '/screens/games' },
  { id: 3, title: 'Our Story', icon: Heart, color: '#9C27B0', route: '/screens/reasons' },
  { id: 4, title: 'Shop', icon: ShoppingBag, color: '#8E24AA', route: '/screens/gifts' },
  { id: 5, title: 'Photos', icon: Camera, color: '#D81B60', route: '/screens/photos' },
  { id: 6, title: 'Timeline', icon: Calendar, color: '#7B1FA2', route: '/screens/timeline' },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [guideVisible, setGuideVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(0);
  const [photoSlides, setPhotoSlides] = useState<string[]>([]);
  const nextOpacity = useRef(new Animated.Value(0)).current;
  const currentSlideRef = useRef(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [slideshowModal, setSlideshowModal] = useState(false);
  const [managedSlides, setManagedSlides] = useState<SlideshowImage[]>([]);
  const currentQuote = dailyQuotes[new Date().getDate() % dailyQuotes.length];

  const loadRecentNotes = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('userNotes');
      if (saved) {
        const all: Note[] = JSON.parse(saved);
        setRecentNotes(all.slice(0, 3));
      } else {
        setRecentNotes([]);
      }
    } catch {
      setRecentNotes([]);
    }
  }, []);

  const loadImages = useCallback(async () => {
    const images = await getSlideshowImages();
    setPhotoSlides(images);
  }, []);

  const loadManaged = useCallback(async () => {
    const all = await getAllSlideshowImages();
    setManagedSlides(all);
  }, []);

  const removeSlide = async (id: string) => {
    await removeSlideshowImage(id);
    await loadManaged();
    await loadImages();
  };

  const clearAllSlides = async () => {
    Alert.alert('Clear Slideshow', 'Remove all slideshow photos? The app will auto-show your memories instead.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: async () => {
        for (const slide of managedSlides) {
          await removeSlideshowImage(slide.id);
        }
        await loadManaged();
        await loadImages();
      }},
    ]);
  };

  const [memoryPickerOpen, setMemoryPickerOpen] = useState(false);
  const [memoryPicker, setMemoryPicker] = useState<string[]>([]);
  const [pickerSelected, setPickerSelected] = useState<string[]>([]);

  const openMemoryPicker = async () => {
    const all = await getMemories();
    const photos = all
      .filter(m => m.type === 'photo' && m.uri.startsWith('http'))
      .map(m => m.uri);
    const alreadyAdded = new Set(managedSlides.map(s => s.uri));
    setMemoryPicker(photos.filter(u => !alreadyAdded.has(u)));
    setPickerSelected([]);
    setMemoryPickerOpen(true);
  };

  const closeMemoryPicker = () => {
    setMemoryPickerOpen(false);
    setPickerSelected([]);
  };

  const confirmMemoryPicker = async () => {
    const remaining = MAX_SLIDESHOW - managedSlides.length;
    const toAdd = pickerSelected.slice(0, remaining);
    for (const uri of toAdd) {
      await addSlideshowImage(uri);
    }
    setMemoryPickerOpen(false);
    setMemoryPicker([]);
    setPickerSelected([]);
    await loadManaged();
    await loadImages();
  };

  useFocusEffect(useCallback(() => {
    loadRecentNotes();
    loadImages();
  }, [loadRecentNotes, loadImages]));

  useEffect(() => {
    currentSlideRef.current = 0;
    setCurrentSlide(0);
    setNextSlide(photoSlides.length > 1 ? 1 : 0);
    nextOpacity.setValue(0);
  }, [photoSlides.length, nextOpacity]);

  useEffect(() => {
    if (photoSlides.length < 2) return;
    const interval = setInterval(() => {
      const next = (currentSlideRef.current + 1) % photoSlides.length;
      setNextSlide(next);
      nextOpacity.setValue(0);
      Animated.timing(nextOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start(({ finished }) => {
        if (!finished) return;
        currentSlideRef.current = next;
        setCurrentSlide(next);
        // nextOpacity stays at 1 — base image updates underneath the overlay
        // seamlessly. Resetting to 0 here causes the flash the user sees.
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [photoSlides.length, nextOpacity]);

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppGuide visible={guideVisible} onClose={() => setGuideVisible(false)} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.textSecondary }]}>Our Sanctuary</Text>
          <TouchableOpacity onPress={() => setGuideVisible(true)} style={styles.helpBtn} activeOpacity={0.7}>
            <HelpCircle size={20} color={colors.textSecondary} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        {/* Slideshow */}
        <View style={styles.slideshowWrap}>
          {photoSlides.length > 0 ? (
            <>
              <Image source={{ uri: photoSlides[currentSlide] }} style={[styles.slideImage, StyleSheet.absoluteFill]} resizeMode="cover" />
              <Animated.Image source={{ uri: photoSlides[nextSlide] }} style={[styles.slideImage, StyleSheet.absoluteFill, { opacity: nextOpacity }]} resizeMode="cover" />
              <LinearGradient colors={['transparent', 'rgba(9,6,15,0.85)']} style={styles.slideGradient}>
                <Text style={styles.slideLabel}>Our Beautiful Memories</Text>
                <View style={styles.dots}>
                  {photoSlides.map((_, i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: i === currentSlide ? '#E91E8C' : 'rgba(255,255,255,0.3)' }]} />
                  ))}
                </View>
              </LinearGradient>
              <TouchableOpacity style={styles.slideEditBtn} onPress={() => { loadManaged(); setSlideshowModal(true); }}>
                <View style={styles.slideEditInner}>
                  <Pencil size={12} color="#fff" />
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.emptySlide, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => { loadManaged(); setSlideshowModal(true); }}>
              <Camera size={40} color={colors.textSecondary} />
              <Text style={[styles.emptySlideText, { color: colors.textSecondary }]}>Tap to set slideshow media</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Birthday Banner */}
        <TouchableOpacity onPress={() => router.push('/screens/surprise' as any)} activeOpacity={0.85} style={styles.birthdayBanner}>
          <LinearGradient colors={['#E91E8C', '#9C27B0', '#7B1FA2']} style={styles.birthdayBannerGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.birthdayBannerLeft}>
              <Text style={styles.birthdayBannerTitle}>Happy Birthday, Princess!</Text>
              <Text style={styles.birthdayBannerSub}>Your special day is here. Tap to open your surprise.</Text>
            </View>
            <Sparkles size={32} color="rgba(255,255,255,0.9)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Daily Quote */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Sparkles size={16} color={colors.primary} />
          <Text style={[styles.quoteText, { color: colors.text }]}>"{currentQuote}"</Text>
        </View>

        {/* Explore */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Explore Our World</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureRow} bounces={false} overScrollMode="never">
            {features.map(f => (
              <TouchableOpacity key={f.id} style={styles.featureItem} onPress={() => router.push(f.route as any)} activeOpacity={0.7}>
                <View style={[styles.featureCircle, { backgroundColor: f.color + '22' }]}>
                  <f.icon size={30} color={f.color} />
                </View>
                <Text style={[styles.featureName, { color: colors.text }]}>{f.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Notes */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Recent Notes</Text>
            <TouchableOpacity onPress={() => router.push('/screens/notes' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentNotes.length > 0 ? recentNotes.map(note => (
            <TouchableOpacity key={note.id} style={[styles.noteCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/screens/notes' as any)} activeOpacity={0.7}>
              <View style={[styles.noteAvatar, { backgroundColor: colors.primary + '22' }]}>
                <MessageCircleHeart size={16} color={colors.primary} />
              </View>
              <View style={styles.noteBody}>
                <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>{note.title}</Text>
                <Text style={[styles.notePreview, { color: colors.textSecondary }]} numberOfLines={1}>{note.content || 'No content'}</Text>
              </View>
              <Text style={[styles.noteTime, { color: colors.textSecondary }]}>{getTimeAgo(note.timestamp)}</Text>
            </TouchableOpacity>
          )) : (
            <View style={[styles.emptyNotes, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyNotesText, { color: colors.textSecondary }]}>No notes yet. Start writing!</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.addNote, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/screens/notes' as any)} activeOpacity={0.7}>
            <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.addNoteIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Plus size={18} color="#fff" />
            </LinearGradient>
            <Text style={[styles.addNoteText, { color: colors.text }]}>Write New Note</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Made with 💜 for the most amazing person</Text>
        </View>
      </ScrollView>

      {/* Slideshow Manager Modal */}
      <Modal visible={slideshowModal} transparent animationType="slide" onRequestClose={() => setSlideshowModal(false)}>
        <View style={modal$.overlay}>
          <View style={[modal$.sheet, { backgroundColor: colors.surface }]}>
            <View style={modal$.header}>
              <Text style={[modal$.title, { color: colors.text }]}>Slideshow Media ({managedSlides.length}/{MAX_SLIDESHOW})</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {managedSlides.length > 0 && (
                  <TouchableOpacity onPress={clearAllSlides}>
                    <Text style={{ color: '#ff4757', fontSize: 13, fontWeight: '600' }}>Clear All</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setSlideshowModal(false)} style={modal$.closeBtn}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {managedSlides.length === 0 ? (
              <Text style={[modal$.emptyText, { color: colors.textSecondary }]}>
                 No media selected yet.{'\n'}Auto-showing your most recent memories.{'\n'}Add photos or videos below to choose exactly what shows.
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 240 }}>
                <View style={modal$.grid}>
                  {managedSlides.map(slide => (
                    <View key={slide.id} style={modal$.cell}>
                      <Image source={{ uri: slide.uri }} style={modal$.cellImg} resizeMode="cover" />
                      <TouchableOpacity style={modal$.cellRemove} onPress={() => removeSlide(slide.id)}>
                        <X size={11} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}

            {managedSlides.length < MAX_SLIDESHOW && (
              <TouchableOpacity style={[modal$.addBtn, { borderColor: colors.primary }]} onPress={openMemoryPicker}>
                <Plus size={17} color={colors.primary} />
                <Text style={[modal$.addBtnText, { color: colors.primary }]}>
                  Add from Memories{managedSlides.length > 0 ? ` (${MAX_SLIDESHOW - managedSlides.length} left)` : ''}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={modal$.doneBtn} onPress={() => setSlideshowModal(false)}>
              <LinearGradient colors={['#E91E8C', '#9C27B0']} style={modal$.doneBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={modal$.doneBtnText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Memory Picker Modal */}
      <Modal visible={memoryPickerOpen} transparent animationType="slide" onRequestClose={closeMemoryPicker}>
        <View style={modal$.overlay}>
          <View style={[modal$.sheet, { backgroundColor: colors.surface }]}>
            <View style={modal$.header}>
              <Text style={[modal$.title, { color: colors.text }]}>
                Pick Photos ({pickerSelected.length} selected)
              </Text>
              <TouchableOpacity onPress={closeMemoryPicker} style={modal$.closeBtn}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {memoryPicker.length === 0 ? (
              <Text style={[modal$.emptyText, { color: colors.textSecondary }]}>
                No photos available yet.{'\n'}Upload photos in the Memories screen first, then come back here to add them to the slideshow.
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
                <View style={modal$.grid}>
                  {memoryPicker.map(uri => {
                    const sel = pickerSelected.includes(uri);
                    return (
                      <TouchableOpacity key={uri} style={modal$.cell} onPress={() =>
                        setPickerSelected(prev => sel ? prev.filter(u => u !== uri) : [...prev, uri])
                      }>
                        <Image source={{ uri }} style={modal$.cellImg} resizeMode="cover" />
                        {sel && (
                          <View style={[modal$.cellRemove, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
            <TouchableOpacity
              style={[modal$.doneBtn, pickerSelected.length === 0 && { opacity: 0.45 }]}
              disabled={pickerSelected.length === 0}
              onPress={confirmMemoryPicker}
            >
              <LinearGradient colors={['#E91E8C', '#9C27B0']} style={modal$.doneBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={modal$.doneBtnText}>Add {pickerSelected.length > 0 ? pickerSelected.length : ''} Photo{pickerSelected.length !== 1 ? 's' : ''}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  appName: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  helpBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
slideshowWrap: { width: width - 40, height: 210, borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  slideImage: { width: '100%', height: '100%' },
  slideGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 14, paddingTop: 40 },
  slideLabel: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  emptySlide: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderRadius: 18 },
  emptySlideText: { fontSize: 14, fontWeight: '500' },
  quoteCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 24 },
  quoteText: { flex: 1, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  section: { marginBottom: 28 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionLabel: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  featureRow: { gap: 18, paddingRight: 4 },
  featureItem: { alignItems: 'center', width: 68 },
  featureCircle: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  featureName: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  noteCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8, gap: 12 },
  noteAvatar: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  noteBody: { flex: 1 },
  noteTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  notePreview: { fontSize: 12 },
  noteTime: { fontSize: 11 },
  emptyNotes: { padding: 20, borderRadius: 14, borderWidth: 1, alignItems: 'center', marginBottom: 8 },
  emptyNotesText: { fontSize: 13 },
  addNote: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  addNoteIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  addNoteText: { fontSize: 14, fontWeight: '600' },
  footer: { alignItems: 'center', paddingVertical: 8 },
  footerText: { fontSize: 12, fontStyle: 'italic' },
  slideEditBtn: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  slideEditInner: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16, padding: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  birthdayBanner: { borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  birthdayBannerGrad: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 12 },
  birthdayBannerLeft: { flex: 1 },
  birthdayBannerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  birthdayBannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
});

const MODAL_CELL = Math.floor((width - 48 - 24) / 3);

const modal$ = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 17, fontWeight: '700' },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, lineHeight: 22, textAlign: 'center', marginBottom: 20, paddingHorizontal: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  cell: { width: MODAL_CELL, height: MODAL_CELL, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  cellImg: { width: '100%', height: '100%' },
  cellRemove: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', marginBottom: 14, marginTop: 8 },
  addBtnText: { fontSize: 15, fontWeight: '600' },
  doneBtn: { borderRadius: 14, overflow: 'hidden' },
  doneBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
