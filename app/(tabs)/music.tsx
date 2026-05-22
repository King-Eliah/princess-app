import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, Alert, Animated, Image, Easing } from 'react-native';
import { Shuffle, Repeat, Play, Pause, SkipBack, SkipForward, Heart, Plus, Trash2, X, List, Camera } from 'lucide-react-native';
import { setMusicState, registerControls } from '@/lib/musicStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const songs = [
  { id: 1, title: 'hope You Smile', artist: 'King', duration: '3:45', description: 'Me when I think of you', lyrics: '', audioUrl: require('../../assets/media/songs/1.mp3') },
  { id: 2, title: 'imma play this for you', artist: 'King', duration: '4:20', description: 'How I feel about you', lyrics: '', audioUrl: require('../../assets/media/songs/2.mp3') },
  { id: 3, title: 'Been waiting for you', artist: 'King ft friend', duration: '3:30', description: 'I would love to slow dance to this song with you', lyrics: '', audioUrl: require('../../assets/media/songs/3.mp3') },
  { id: 4, title: 'Me telling my friends about you', artist: 'Gangster King', duration: '4:15', description: 'Every note tells my intentions', lyrics: '', audioUrl: require('../../assets/media/songs/4.mp3') },
  { id: 5, title: 'Realllllll', artist: 'What he said', duration: '3:55', description: 'My heart beats only for you', lyrics: '', audioUrl: require('../../assets/media/songs/5.mp3') },
  { id: 6, title: 'God don bless me', artist: 'King', duration: '4:00', description: 'How I feel about you', lyrics: '', audioUrl: require('../../assets/media/songs/6.mp3') },
];

export default function MusicScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [playlists, setPlaylists] = useState<Array<{ id: string; name: string; songIds: number[] }>>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedSongToAdd, setSelectedSongToAdd] = useState<number | null>(null);
  const [couplePhoto, setCouplePhoto] = useState<string | null>(null);

  // Vinyl spin animation
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentRotation = useRef(0);

  const currentSong = songs[currentSongIndex];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Stable refs so the mini player always calls the latest functions
  const togglePlayRef = useRef<() => void>(() => {});
  const handleNextRef = useRef<() => void>(() => {});
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  // Stable status callback — always calls through ref so it never captures stale state
  const onStatusRef = useRef<(s: AVPlaybackStatus) => void>(() => {});
  const stableOnStatus = useCallback((s: AVPlaybackStatus) => { onStatusRef.current(s); }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const startSpin = useCallback(() => {
    spinAnim.setValue(currentRotation.current / 360);
    spinAnimRef.current = Animated.loop(
      Animated.timing(spinAnim, { toValue: currentRotation.current / 360 + 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    );
    spinAnimRef.current.start();
  }, [spinAnim]);

  const stopSpin = useCallback(() => {
    spinAnimRef.current?.stop();
    spinAnim.stopAnimation(v => { currentRotation.current = (v % 1) * 360; });
  }, [spinAnim]);

  useEffect(() => {
    if (isPlaying) startSpin();
    else stopSpin();
  }, [isPlaying, startSpin, stopSpin]);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
    const load = async () => {
      try {
        const fav = await AsyncStorage.getItem('musicFavorites');
        if (fav) setFavorites(JSON.parse(fav));
        const pl = await AsyncStorage.getItem('musicPlaylists');
        if (pl) setPlaylists(JSON.parse(pl));
        const photo = await AsyncStorage.getItem('coupleDiscPhoto');
        if (photo) setCouplePhoto(photo);
      } catch {}
    };
    load();
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const pickCouplePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setCouplePhoto(uri);
      await AsyncStorage.setItem('coupleDiscPhoto', uri);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentSongIndex(prev => {
      if (isShuffled) { let r; do { r = Math.floor(Math.random() * songs.length); } while (r === prev && songs.length > 1); return r; }
      return repeatMode === 1 ? (prev + 1) % songs.length : Math.min(prev + 1, songs.length - 1);
    });
  }, [isShuffled, repeatMode]);

  // Update the ref every render so stableOnStatus always uses fresh state
  onStatusRef.current = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setCurrentTime((status.positionMillis ?? 0) / 1000);
    setDuration((status.durationMillis ?? 0) / 1000);
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      if (repeatMode === 2) soundRef.current?.replayAsync();
      else handleNext();
    }
  };

  const loadAndPlay = async (index: number) => {
    try {
      if (soundRef.current) { await soundRef.current.unloadAsync(); soundRef.current = null; }
      const { sound } = await Audio.Sound.createAsync(songs[index].audioUrl, { shouldPlay: true }, stableOnStatus);
      soundRef.current = sound;
      setIsPlaying(true);
    } catch {
      Alert.alert('Playback Error', `Unable to play: ${songs[index].title}`);
    }
  };

  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) { hasInitialized.current = true; return; }
    loadAndPlay(currentSongIndex);
  // loadAndPlay is intentionally not in deps — it uses stable refs/constants
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex]);

  const togglePlay = async () => {
    if (!soundRef.current) { await loadAndPlay(currentSongIndex); return; }
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch {
      await loadAndPlay(currentSongIndex);
    }
  };

  // Keep refs current so mini player always calls latest functions
  togglePlayRef.current = togglePlay;
  handleNextRef.current = handleNext;

  // Register controls once; refs ensure latest functions are always used
  useEffect(() => {
    registerControls(
      () => togglePlayRef.current(),
      () => handleNextRef.current(),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Broadcast state to the global mini player
  useEffect(() => {
    setMusicState({ isPlaying, title: currentSong.title, artist: currentSong.artist, currentIndex: currentSongIndex });
  }, [isPlaying, currentSongIndex]);

  const handlePrev = () => {
    setCurrentSongIndex(prev => {
      if (isShuffled) { let r; do { r = Math.floor(Math.random() * songs.length); } while (r === prev && songs.length > 1); return r; }
      return repeatMode === 1 ? (prev - 1 + songs.length) % songs.length : Math.max(prev - 1, 0);
    });
  };

  const seekTo = async (position: number) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(position * 1000);
  };

  // Tap a song from the list — restart if same song, change index otherwise (useEffect handles loading)
  const playSong = async (i: number) => {
    if (i === currentSongIndex) {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      } else {
        await loadAndPlay(i);
      }
      return;
    }
    setCurrentSongIndex(i);
  };

  const toggleFav = async (id: number) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem('musicFavorites', JSON.stringify(updated));
  };

  const savePlaylists = async (updated: typeof playlists) => {
    setPlaylists(updated);
    await AsyncStorage.setItem('musicPlaylists', JSON.stringify(updated));
  };

  const isFav = favorites.includes(currentSong.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.textSecondary }]}>Our Sanctuary</Text>
          <TouchableOpacity onPress={() => setShowPlaylistModal(true)}>
            <List size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Vinyl Disc */}
        <View style={styles.discWrap}>
          {/* Outer glow ring */}
          <View style={[styles.discGlowRing, { borderColor: colors.primary + '40' }]} />
          <Animated.View style={[styles.discOuter, { transform: [{ rotate: spin }] }]}>
            {/* Vinyl grooves */}
            <View style={[styles.groove, styles.groove1, { borderColor: 'rgba(255,255,255,0.04)' }]} />
            <View style={[styles.groove, styles.groove2, { borderColor: 'rgba(255,255,255,0.04)' }]} />
            <View style={[styles.groove, styles.groove3, { borderColor: 'rgba(255,255,255,0.04)' }]} />
            <View style={[styles.groove, styles.groove4, { borderColor: 'rgba(255,255,255,0.04)' }]} />
            {/* Center label */}
            <TouchableOpacity style={styles.discCenter} onPress={pickCouplePhoto} activeOpacity={0.8}>
              {couplePhoto ? (
                <Image source={{ uri: couplePhoto }} style={styles.couplePhoto} />
              ) : (
                <LinearGradient colors={['#E91E8C', '#7B1FA2']} style={styles.discCenterGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Camera size={28} color="#fff" />
                  <Text style={styles.discCenterText}>Add Photo</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
            {/* Center hole */}
            <View style={styles.discHole} />
          </Animated.View>
          {/* Tone arm hint */}
          <View style={[styles.toneArm, { backgroundColor: colors.border }]} />
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <View style={styles.songInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>{currentSong.title}</Text>
              <Text style={[styles.songArtist, { color: colors.primary }]}>{currentSong.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFav(currentSong.id)}>
              <Heart size={24} color={isFav ? colors.primary : colors.textSecondary} fill={isFav ? colors.primary : 'none'} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.songDesc, { color: colors.textSecondary }]}>{currentSong.description}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <TouchableOpacity
            style={styles.progressTouchArea}
            onPress={e => seekTo((e.nativeEvent.locationX / (width - 48)) * duration)}
          >
            <View style={[styles.progressBg, { backgroundColor: colors.surface }]}>
              <LinearGradient
                colors={['#E91E8C', '#9C27B0']}
                style={[styles.progressFill, { width: `${progress}%` }]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <View style={styles.progressThumb} />
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(currentTime)}</Text>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setIsShuffled(s => !s)} style={styles.ctrlBtn}>
            <Shuffle size={22} color={isShuffled ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrev} style={styles.ctrlBtn}>
            <SkipBack size={30} color={colors.text} fill={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
            <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.playBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              {isPlaying
                ? <Pause size={36} color="#fff" fill="#fff" />
                : <Play size={36} color="#fff" fill="#fff" />
              }
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.ctrlBtn}>
            <SkipForward size={30} color={colors.text} fill={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRepeatMode(m => (m + 1) % 3)} style={styles.ctrlBtn}>
            <Repeat size={22} color={repeatMode > 0 ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Up Next */}
        <View style={styles.songList}>
          {songs.map((song, i) => (
            <View key={song.id} style={[styles.songRow, { backgroundColor: colors.surface, borderColor: i === currentSongIndex ? colors.primary : colors.border }]}>
              <TouchableOpacity onPress={() => playSong(i)} activeOpacity={0.7} style={styles.songRowPlay}>
                <LinearGradient colors={i === currentSongIndex ? ['#E91E8C', '#9C27B0'] : ['#2A1040', '#1A0A2E']} style={styles.songRowThumb} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Heart size={16} color="#fff" fill={i === currentSongIndex ? '#fff' : 'none'} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.songRowTitle, { color: i === currentSongIndex ? colors.primary : colors.text }]} numberOfLines={1}>{song.title}</Text>
                  <Text style={[styles.songRowArtist, { color: colors.textSecondary }]} numberOfLines={1}>{song.artist}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFav(song.id)} style={styles.songRowBtn}>
                <Heart size={18} color={favorites.includes(song.id) ? colors.primary : colors.textSecondary} fill={favorites.includes(song.id) ? colors.primary : 'none'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSelectedSongToAdd(song.id); setShowAddModal(true); }} style={styles.songRowBtn}>
                <Plus size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={[styles.songRowDur, { color: colors.textSecondary }]}>{song.duration}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Playlists Modal */}
      <Modal visible={showPlaylistModal} transparent animationType="slide" onRequestClose={() => setShowPlaylistModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: '#160B25' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Playlists</Text>
              <TouchableOpacity onPress={() => setShowPlaylistModal(false)}><X size={22} color={colors.text} /></TouchableOpacity>
            </View>
            <TextInput style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]} placeholder="New playlist name" placeholderTextColor={colors.textSecondary} value={newPlaylistName} onChangeText={setNewPlaylistName} />
            <TouchableOpacity onPress={() => { if (newPlaylistName.trim()) { savePlaylists([...playlists, { id: Date.now().toString(), name: newPlaylistName.trim(), songIds: [] }]); setNewPlaylistName(''); } }} style={styles.createBtn}>
              <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.createBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.createBtnText}>Create Playlist</Text>
              </LinearGradient>
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 260 }}>
              {playlists.map(pl => (
                <View key={pl.id} style={[styles.plRow, { borderColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>{pl.name}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{pl.songIds.length} songs</Text>
                  </View>
                  <TouchableOpacity onPress={() => Alert.alert('Delete', 'Delete this playlist?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => savePlaylists(playlists.filter(p => p.id !== pl.id)) }])} style={styles.deleteBtn}>
                    <Trash2 size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add to Playlist Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => { setShowAddModal(false); setSelectedSongToAdd(null); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: '#160B25' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add to Playlist</Text>
              <TouchableOpacity onPress={() => { setShowAddModal(false); setSelectedSongToAdd(null); }}><X size={22} color={colors.text} /></TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {playlists.length === 0
                ? <Text style={{ color: colors.textSecondary, padding: 20 }}>No playlists yet. Create one first!</Text>
                : playlists.map(pl => (
                  <View key={pl.id} style={[styles.plRow, { borderColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>{pl.name}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{pl.songIds.length} songs</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      if (selectedSongToAdd) {
                        const updated = playlists.map(p => p.id === pl.id && !p.songIds.includes(selectedSongToAdd) ? { ...p, songIds: [...p.songIds, selectedSongToAdd] } : p);
                        savePlaylists(updated);
                        setShowAddModal(false);
                        setSelectedSongToAdd(null);
                      }
                    }} style={[styles.deleteBtn, { backgroundColor: colors.primary }]}>
                      <Plus size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              }
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const DISC_SIZE = Math.min(width - 80, 260);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  appName: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },

  // Vinyl disc
  discWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 32, height: DISC_SIZE + 20 },
  discGlowRing: { position: 'absolute', width: DISC_SIZE + 20, height: DISC_SIZE + 20, borderRadius: (DISC_SIZE + 20) / 2, borderWidth: 1 },
  discOuter: {
    width: DISC_SIZE,
    height: DISC_SIZE,
    borderRadius: DISC_SIZE / 2,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  groove: { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  groove1: { width: DISC_SIZE * 0.92, height: DISC_SIZE * 0.92 },
  groove2: { width: DISC_SIZE * 0.80, height: DISC_SIZE * 0.80 },
  groove3: { width: DISC_SIZE * 0.68, height: DISC_SIZE * 0.68 },
  groove4: { width: DISC_SIZE * 0.56, height: DISC_SIZE * 0.56 },
  discCenter: {
    width: DISC_SIZE * 0.42,
    height: DISC_SIZE * 0.42,
    borderRadius: (DISC_SIZE * 0.42) / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couplePhoto: { width: '100%', height: '100%' },
  discCenterGrad: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 4 },
  discCenterText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  discHole: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#09060F' },
  toneArm: {
    position: 'absolute',
    right: 0,
    top: 4,
    width: 3,
    height: DISC_SIZE * 0.55,
    borderRadius: 2,
    opacity: 0.3,
    transform: [{ rotate: '-20deg' }, { translateX: -20 }],
  },

  songInfo: { marginBottom: 24 },
  songInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  songTitle: { fontSize: 22, fontWeight: '800', letterSpacing: 0.2 },
  songArtist: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  songDesc: { fontSize: 13, fontStyle: 'italic' },
  progressWrap: { marginBottom: 24 },
  progressTouchArea: { height: 36, justifyContent: 'center', marginBottom: 6 },
  progressBg: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2, position: 'relative' },
  progressThumb: { position: 'absolute', right: -6, top: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: '#E91E8C' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingHorizontal: 8 },
  ctrlBtn: { padding: 10 },
  playBtn: { width: 68, height: 68, borderRadius: 34, overflow: 'hidden', shadowColor: '#E91E8C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 12 },
  playBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  songList: { gap: 10 },
  songRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, gap: 8 },
  songRowPlay: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  songRowBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  songRowThumb: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  songRowTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  songRowArtist: { fontSize: 12 },
  songRowDur: { fontSize: 12, marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 15 },
  createBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  createBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  plRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  deleteBtn: { backgroundColor: '#EF4444', padding: 8, borderRadius: 8 },
});
