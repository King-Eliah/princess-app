import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Volume2, Shuffle, Repeat, Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Audio } from 'expo-av'; // Keep using expo-av for now since expo-audio is still in development

const { width } = Dimensions.get('window');

// Simple songs array with your local music files
const songs = [
  {
    id: 1,
    title: 'hope You Smile',
    artist: 'King',
    duration: '3:45',
    description: 'Me when i think of you 💜',
    audioUrl: require('../../assets/media/songs/1.mp3'),
  },
  {
    id: 2,
    title: 'imma play this for you',
    artist: 'King',
    duration: '4:20',
    description: 'how i feel about you 🎵',
    audioUrl: require('../../assets/media/songs/2.mp3'),
  },
  {
    id: 3,
    title: 'Been waiting for you',
    artist: 'King ft friend',
    duration: '3:30',
    description: 'i would love to slow dance to this song with you💃',
    audioUrl: require('../../assets/media/songs/3.mp3'),
  },
  {
    id: 4,
    title: 'Me telling my friends about you',
    artist: 'Gangster King',
    duration: '4:15',
    description: 'Every note tells my intensions',
    audioUrl: require('../../assets/media/songs/4.mp3'),
  },
  {
    id: 5,
    title: 'Realllllll',
    artist: 'What he said',
    duration: '3:55',
    description: 'My heart beats only for you 💖',
    audioUrl: require('../../assets/media/songs/5.mp3'),
  },
  {
    id: 6,
    title: 'God don bless me',
    artist: 'King',
    duration: '4:00',
    description: 'How i feel about you 💕',
    audioUrl: require('../../assets/media/songs/6.mp3'),
  },
];

export default function MusicScreen() {
  const { colors } = useTheme();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State for Expo Audio sound object
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // Initial duration is 0
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [volume, setVolume] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false); // Loading state for play/pause

  const currentSong = songs[currentSongIndex];

  // Setup audio session for volume control
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Error setting up audio mode:', error);
      }
    };

    setupAudio();
  }, []);

  // Monitor device volume changes
  useEffect(() => {
    const updateVolumeFromDevice = async () => {
      try {
        if (sound) {
          // Get the current system volume (this is a simplified approach)
          // In a real app, you might want to use a native module for precise volume control
          await sound.setVolumeAsync(volume);
        }
      } catch (error) {
        console.log('Error updating volume:', error);
      }
    };

    updateVolumeFromDevice();
  }, [volume, sound]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const loadAndPlaySong = async (songIndex: number) => {
    try {
      setIsLoading(true);
      
      // Stop and unload current sound first
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        songs[songIndex].audioUrl,
        { 
          shouldPlay: true,
          volume: volume, // Set the current volume
        },
        onPlaybackStatusUpdate // Callback for status updates
      );
      
      setSound(newSound);
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    } catch (error) {
      console.log('Error loading song:', error);
      Alert.alert(
        'Audio Error',
        `Unable to play: ${songs[songIndex].title}\n\nThis might be because:\n• The audio file isn't in assets/media/songs/\n• File format isn't supported (use MP4)\n• File name doesn't match (1.mp3, 2.mp3, etc.)\n\nPlease check that your music files are in the right location! 🎵`,
        [
          { text: 'OK' },
          { 
            text: 'Try Again', 
            onPress: () => loadAndPlaySong(songIndex) 
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      // Update playing state
      if (status.isPlaying !== isPlaying) {
        setIsPlaying(status.isPlaying);
      }
      
      // Update time and duration
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      
      // Auto-advance to next song when current song ends
      if (status.didJustFinish) {
        if (repeatMode === 2) {
          // Repeat one song
          loadAndPlaySong(currentSongIndex);
        } else {
          // Play next song
          playNext();
        }
      }
    }
  };

  const togglePlayPause = async () => {
    try {
      setIsLoading(true);
      
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
          // Sync volume when resuming
          await syncWithDeviceVolume();
        }
      } else {
        // Load and play current song if no sound is loaded
        await loadAndPlaySong(currentSongIndex);
      }
    } catch (error) {
      console.log('Error toggling play/pause:', error);
      Alert.alert(
        'Playback Error',
        'Unable to pause/play the song. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const playNext = () => {
    let nextIndex = currentSongIndex + 1;
    if (isShuffled) {
      // Generate a random index different from current
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex && songs.length > 1);
      nextIndex = randomIndex;
    } else if (nextIndex >= songs.length) {
      nextIndex = repeatMode === 1 ? 0 : currentSongIndex; // Loop all or stay
    }
    setIsPlaying(false); // Reset play state first
    loadAndPlaySong(nextIndex);
  };

  const playPrevious = () => {
    let prevIndex = currentSongIndex - 1;
    if (isShuffled) {
      // Generate a random index different from current
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex && songs.length > 1);
      prevIndex = randomIndex;
    } else if (prevIndex < 0) {
      prevIndex = repeatMode === 1 ? songs.length - 1 : currentSongIndex; // Loop all or stay
    }
    setIsPlaying(false); // Reset play state first
    loadAndPlaySong(prevIndex);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3);
  };

  const adjustVolume = async (newVolume: number) => {
    try {
      setVolume(newVolume);
      if (sound) {
        await sound.setVolumeAsync(newVolume);
      }
    } catch (error) {
      console.log('Error adjusting volume:', error);
    }
  };

  // Function to sync with device volume buttons
  const syncWithDeviceVolume = async () => {
    try {
      if (sound) {
        // This will make the app respond to device volume buttons
        await sound.setVolumeAsync(volume);
      }
    } catch (error) {
      console.log('Error syncing with device volume:', error);
    }
  };

  const seekTo = async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position * 1000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Music size={50} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Music Player</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Songs that tell my feelings for you 💜
          </Text>
        </View>

        {/* Current Song Display */}
        <View style={[styles.currentSongCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.albumCover}>
            <Music size={40} color={colors.primary} />
          </View>
          <View style={styles.songInfo}>
            <Text style={[styles.songTitle, { color: colors.text }]}>{currentSong.title}</Text>
            <Text style={[styles.songArtist, { color: colors.textSecondary }]}>{currentSong.artist}</Text>
            <Text style={[styles.songDescription, { color: colors.textSecondary }]}>{currentSong.description}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(currentTime)}
          </Text>
          <TouchableOpacity
            style={styles.progressBar}
            onPress={(event) => {
              const { locationX } = event.nativeEvent;
              const progress = locationX / (width - 80);
              const newPosition = progress * duration;
              seekTo(newPosition);
            }}
          >
            <View style={[styles.progressBackground, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(currentTime / duration) * 100}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
          </TouchableOpacity>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={toggleShuffle}
          >
            <Shuffle size={24} color={isShuffled ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={playPrevious}
          >
            <SkipBack size={32} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            onPress={togglePlayPause}
          >
            {isLoading ? (
              <Play size={40} color="#FFFFFF" />
            ) : (
              isPlaying ? (
                <Pause size={40} color="#FFFFFF" />
              ) : (
                <Play size={40} color="#FFFFFF" />
              )
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={playNext}
          >
            <SkipForward size={32} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={toggleRepeat}
          >
            <Repeat size={24} color={repeatMode > 0 ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <Volume2 size={20} color={colors.textSecondary} />
          <TouchableOpacity
            style={styles.volumeBar}
            onPress={(event) => {
              const { locationX } = event.nativeEvent;
              const newVolume = locationX / (width - 120);
              adjustVolume(Math.max(0, Math.min(1, newVolume)));
            }}
          >
            <View style={[styles.volumeBackground, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.volumeFill, 
                  { 
                    width: `${volume * 100}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
          </TouchableOpacity>
          <Text style={[styles.volumeText, { color: colors.textSecondary }]}>
            {Math.round(volume * 100)}%
          </Text>
        </View>

        {/* Playlist */}
        <View style={styles.playlistSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Playlist</Text>
          <View style={styles.playlist}>
            {songs.map((song, index) => (
              <TouchableOpacity
                key={song.id}
                style={[
                  styles.playlistItem,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  currentSongIndex === index && { borderColor: colors.primary }
                ]}
                onPress={() => {
                  // Stop current song and play the selected one
                  if (currentSongIndex !== index) {
                    setIsPlaying(false); // Reset play state first
                    loadAndPlaySong(index);
                  }
                }}
              >
                <View style={[styles.playlistCover, { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }]}>
                  <Music size={24} color="#FFFFFF" />
                </View>
                <View style={styles.playlistInfo}>
                  <Text style={[styles.playlistTitle, { color: colors.text }]}>{song.title}</Text>
                  <Text style={[styles.playlistArtist, { color: colors.textSecondary }]}>{song.artist}</Text>
                </View>
                <Text style={[styles.playlistDuration, { color: colors.textSecondary }]}>
                  {song.duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  currentSongCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  albumCover: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  timeText: {
    fontSize: 12,
    minWidth: 35,
  },
  progressBar: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  progressBackground: {
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  volumeBar: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  volumeBackground: {
    height: 4,
    borderRadius: 2,
  },
  volumeFill: {
    height: 4,
    borderRadius: 2,
  },
  volumeText: {
    fontSize: 12,
  },
  playlistSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playlist: {
    gap: 10,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  playlistCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  playlistArtist: {
    fontSize: 14,
  },
  songDescription: {
    fontSize: 12,
    color: '#666',
  },
  playlistDuration: {
    fontSize: 12,
  },
});