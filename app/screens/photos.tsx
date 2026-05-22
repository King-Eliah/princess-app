import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Dimensions, FlatList, Modal, Alert, Platform,
  ActivityIndicator,
} from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {
  ChevronLeft, Plus, Trash2, Video as VideoIcon, Lock, Delete,
  X, Heart, Play, Check, Camera,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMemories, upsertMemory, upsertMemories, removeMemory, removeMemories } from '@/lib/db';

const { width, height: SCREEN_H } = Dimensions.get('window');
const GAP = 2;
const COLS = 3;
const CELL = Math.floor((width - GAP * (COLS - 1)) / COLS);
const PICKER_CELL = Math.floor((width - 2) / 3);
const CLOUDINARY_CLOUD = 'dnd1v7qgp';
const CLOUDINARY_PRESET = 'princess';
const MAX_PHOTO_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_UPLOAD_BYTES = 250 * 1024 * 1024;

interface MemoryItem {
  id: string;
  type: 'photo' | 'video';
  uri: string;
  localUri?: string;
  thumbnailUri?: string;
  assetId?: string;
  date: string;
  timestamp: number;
  isFavorite?: boolean;
}

type Filter = 'all' | 'photos' | 'videos';
const CORRECT_PIN = '0522';

function fmtDur(s?: number) {
  if (!s) return '';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function normalizeFileUri(uri?: string | null) {
  if (!uri) return null;
  if (uri.startsWith('file://') || uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('content://')) {
    return uri;
  }
  return `file://${uri}`;
}

// ─── PIN Gate ────────────────────────────────────────────────────────────────

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKey = (k: string) => {
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) { onUnlock(); }
      else { setError(true); setTimeout(() => { setPin(''); setError(false); }, 700); }
    }
  };

  return (
    <LinearGradient colors={['#09060F', '#160B25', '#09060F']} style={pin$.wrap}>
      <TouchableOpacity onPress={() => router.back()} style={pin$.back}>
        <ChevronLeft size={24} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
      <LinearGradient colors={['#E91E8C', '#9C27B0']} style={pin$.icon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Lock size={32} color="#fff" />
      </LinearGradient>
      <Text style={pin$.title}>Enter PIN</Text>
      <Text style={pin$.sub}>Your memories are protected</Text>
      <View style={pin$.dots}>
        {[0,1,2,3].map(i => (
          <View key={i} style={[pin$.dot, { backgroundColor: error ? '#ff4757' : i < pin.length ? '#E91E8C' : 'rgba(255,255,255,0.12)' }]} />
        ))}
      </View>
      {error && <Text style={pin$.err}>Incorrect PIN</Text>}
      <View style={pin$.pad}>
        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, i) => (
          <TouchableOpacity key={i} disabled={k === ''} activeOpacity={0.6}
            style={[pin$.key, k === '' && { opacity: 0 }]}
            onPress={() => k === 'del' ? setPin(p => p.slice(0,-1)) : handleKey(k)}>
            {k === 'del'
              ? <Delete size={20} color="rgba(255,255,255,0.7)" />
              : <Text style={pin$.keyTxt}>{k}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

// ─── Viewer Video Item ────────────────────────────────────────────────────────

function VideoViewerItem({ uri, isVisible }: { uri: string; isVisible: boolean }) {
  return (
    <ExpoVideo
      source={{ uri }}
      style={{ width, height: SCREEN_H }}
      resizeMode={ResizeMode.CONTAIN}
      useNativeControls
      shouldPlay={isVisible}
      isLooping
    />
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function PhotosScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const memoriesRef = useRef<MemoryItem[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);

  // TikTok viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const viewerRef = useRef<FlatList>(null);
  const thumbnailGenRunning = useRef(false);

  const cacheRemotePhotos = useCallback(async (items: MemoryItem[]) => {
    const toCache = items.filter(m =>
      m.type === 'photo' && !m.localUri &&
      (m.uri.startsWith('http://') || m.uri.startsWith('https://'))
    );
    if (toCache.length === 0) return;
    const dir = `${FileSystem.documentDirectory}mem_photos/`;
    try { await FileSystem.makeDirectoryAsync(dir, { intermediates: true }); } catch {}
    for (const item of toCache) {
      try {
        const localPath = `${dir}cached_${item.id}.jpg`;
        const info = await FileSystem.getInfoAsync(localPath);
        if (!info.exists) {
          await FileSystem.downloadAsync(item.uri, localPath);
        }
        memoriesRef.current = memoriesRef.current.map(m =>
          m.id === item.id ? { ...m, localUri: localPath } : m
        );
        setMemories(prev => prev.map(m =>
          m.id === item.id ? { ...m, localUri: localPath } : m
        ));
      } catch {}
    }
    try { await AsyncStorage.setItem('userMemories', JSON.stringify(memoriesRef.current)); } catch {}
  }, []);

  const normalizeLegacyMemories = useCallback(async (items: MemoryItem[]) => {
    const needsFix = items.some(m => m.uri?.startsWith('ph://'));
    if (!needsFix) return items;

    try {
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (perm.status !== 'granted') return items;
    } catch {
      return items;
    }

    const normalized = await Promise.all(items.map(async (item) => {
      if (!item.uri?.startsWith('ph://')) return item;

      try {
        // PHAsset local identifiers are "{UUID}/L0/001" — strip ph:// prefix only, keep the rest.
        const legacyId = item.assetId ?? item.uri.replace('ph://', '');

        if (item.type === 'photo') {
          try {
            const directInfo = await MediaLibrary.getAssetInfoAsync(legacyId);
            const local = normalizeFileUri(directInfo.localUri ?? directInfo.uri);
            if (local) return { ...item, uri: local, localUri: local };
          } catch {
            // leave the legacy item untouched if the asset cannot be resolved
          }
          return item;
        }

        // Try direct asset lookup first, then fallback to a quick library search.
        try {
          const directInfo = await MediaLibrary.getAssetInfoAsync(legacyId);
          const local = normalizeFileUri(directInfo.localUri);
          if (local) return { ...item, uri: local };
        } catch {
          // ignore and continue
        }

        let after: string | undefined;
        for (let page = 0; page < 8; page++) {
          const result = await MediaLibrary.getAssetsAsync({
            mediaType: [MediaLibrary.MediaType.video],
            first: 250,
            after,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          });
          const match = result.assets.find(a => a.uri === item.uri);
          if (match) {
            const info = await MediaLibrary.getAssetInfoAsync(match);
            const local = normalizeFileUri(info.localUri);
            if (local) return { ...item, uri: local, assetId: match.id };
          }
          if (!result.hasNextPage) break;
          after = result.endCursor;
        }
      } catch {
        // keep legacy uri as-is if normalization fails
      }

      return item;
    }));

    return normalized;
  }, []);

  useEffect(() => {
    getMemories().then(raw => {
      normalizeLegacyMemories(raw).then(async (data) => {
        memoriesRef.current = data;
        setMemories(data);
        if (JSON.stringify(raw) !== JSON.stringify(data)) {
          try {
            await AsyncStorage.setItem('userMemories', JSON.stringify(data));
          } catch {}
        }
        cacheRemotePhotos(data);
      });
    }).catch(() => {});
  }, [normalizeLegacyMemories, cacheRemotePhotos]);

  // Generate thumbnails for any existing video memories that don't have one
  useEffect(() => {
    const generateMissing = async () => {
      if (thumbnailGenRunning.current) return;
      const videos = memories.filter(m =>
        m.type === 'video' &&
        !m.thumbnailUri &&
        !m.uri.startsWith('ph://')
      );
      if (videos.length === 0) return;
      thumbnailGenRunning.current = true;
      const updates: Record<string, string> = {};
      try {
        for (const video of videos) {
          try {
            const thumb = await VideoThumbnails.getThumbnailAsync(video.uri, { time: 1000 });
            // Save thumbnail locally in documents dir so it persists
            const destPath = `${FileSystem.documentDirectory}thumbs/${video.id}.jpg`;
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}thumbs/`, { intermediates: true });
            await FileSystem.moveAsync({ from: thumb.uri, to: destPath });
            updates[video.id] = destPath;
          } catch {
            // ignore — video just shows play icon
          }
        }
        if (Object.keys(updates).length === 0) return;
        const updated = memoriesRef.current.map(m =>
          updates[m.id] ? { ...m, thumbnailUri: updates[m.id] } : m
        );
        memoriesRef.current = updated;
        setMemories(updated);
        try { await AsyncStorage.setItem('userMemories', JSON.stringify(updated)); } catch {}
      } finally {
        thumbnailGenRunning.current = false;
      }
    };
    const t = setTimeout(() => {
      void generateMissing();
    }, 800);
    return () => clearTimeout(t);
  }, [memories]);

  const save = async (data: MemoryItem[]) => {
    memoriesRef.current = data;
    setMemories(data);
    try {
      await AsyncStorage.setItem('userMemories', JSON.stringify(data));
    } catch (e: any) {
      Alert.alert('Save error', e?.message ?? 'Could not save. Storage may be full.');
    }
  };

  const getPhotoFileUri = useCallback(async (
    asset: ImagePicker.ImagePickerAsset,
    tempFiles: string[]
  ): Promise<string> => {
    const result = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 1080 } }],
      { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG }
    );
    tempFiles.push(result.uri);
    return result.uri;
  }, []);

  const getVideoFileUri = useCallback(async (
    asset: ImagePicker.ImagePickerAsset,
    tempFiles: string[]
  ): Promise<string> => {
    let sourceUri = asset.uri;

    if (!sourceUri.startsWith('file://') && !sourceUri.startsWith('content://')) {
      await MediaLibrary.requestPermissionsAsync();
      const id = asset.assetId ?? sourceUri.replace('ph://', '');
      const info = await MediaLibrary.getAssetInfoAsync(id);
      const local = normalizeFileUri(info.localUri);
      if (!local?.startsWith('file://') && !local?.startsWith('content://')) {
        throw new Error('video-icloud');
      }
      sourceUri = local;
    }

    const ext = (sourceUri.split('.').pop() ?? 'mov').toLowerCase();
    const dest = `${FileSystem.cacheDirectory}upload_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    try {
      await FileSystem.copyAsync({ from: sourceUri, to: dest });
    } catch {
      throw new Error('video-icloud');
    }
    tempFiles.push(dest);
    return dest;
  }, []);

  const openPhotosPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 0,
        orderedSelection: true,
        shouldDownloadFromNetwork: true,
        exif: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        await handlePickerConfirm(result.assets);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not open gallery');
    }
  };

  const openVideoPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsMultipleSelection: true,
        selectionLimit: 0,
        shouldDownloadFromNetwork: true,
        exif: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        await handlePickerConfirm(result.assets);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not open gallery');
    }
  };

  const showAddOptions = () => {
    Alert.alert('Add Memory', '', [
      { text: 'Add Photos', onPress: () => void openPhotosPicker() },
      { text: 'Add Video', onPress: () => void openVideoPicker() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePickerConfirm = async (selectedAssets: ImagePicker.ImagePickerAsset[]) => {
    if (!selectedAssets.length) return;

    const now = Date.now();
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });

    setUploadProgress({ done: 0, total: selectedAssets.length });
    const newItems: MemoryItem[] = [];
    const failures: string[] = [];

    for (let i = 0; i < selectedAssets.length; i++) {
      const asset = selectedAssets[i];
      const tempFiles: string[] = [];
      try {
        // Skip Live Photos — they appear as type:'video' but have an image mimeType
        if (asset.type === 'video' && asset.mimeType?.startsWith('image/')) {
          throw new Error('live-photo');
        }

        const isVideo = asset.type === 'video';
        const mime = isVideo
          ? (asset.mimeType ?? (asset.uri.toLowerCase().includes('.mov') ? 'video/quicktime' : 'video/mp4'))
          : 'image/jpeg';

        const fileUri = isVideo
          ? await getVideoFileUri(asset, tempFiles)
          : await getPhotoFileUri(asset, tempFiles);

        const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
        const fileSize = (fileInfo as any).size ?? 0;
        const maxSize = isVideo ? MAX_VIDEO_UPLOAD_BYTES : MAX_PHOTO_UPLOAD_BYTES;
        if (fileSize > maxSize) {
          const maxMb = Math.round(maxSize / 1024 / 1024);
          throw new Error(`File too large (${Math.round(fileSize / 1024 / 1024)}MB). Max is ${maxMb}MB.`);
        }

        const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${isVideo ? 'video' : 'image'}/upload`;
        let uploadError: string | null = null;
        let cloudinaryData: any = null;

        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const uploadResult = await FileSystem.uploadAsync(endpoint, fileUri, {
              httpMethod: 'POST',
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: 'file',
              mimeType: mime,
              parameters: { upload_preset: CLOUDINARY_PRESET },
            });
            if (uploadResult.status >= 200 && uploadResult.status < 300) {
              cloudinaryData = JSON.parse(uploadResult.body);
              uploadError = null;
              break;
            }
            uploadError = uploadResult.body;
          } catch (e: any) {
            uploadError = e?.message ?? 'Network error';
          }
        }
        if (uploadError || !cloudinaryData) throw new Error(uploadError || 'Upload failed');

        const publicUrl: string = cloudinaryData.secure_url;
        let thumbnailUri: string | undefined;

        if (isVideo) {
          try {
            const thumb = await VideoThumbnails.getThumbnailAsync(fileUri, { time: 1000 });
            const thumbDir = `${FileSystem.documentDirectory}thumbs/`;
            await FileSystem.makeDirectoryAsync(thumbDir, { intermediates: true });
            const thumbPath = `${thumbDir}${now}_${i}.jpg`;
            await FileSystem.copyAsync({ from: thumb.uri, to: thumbPath });
            thumbnailUri = normalizeFileUri(thumbPath) ?? thumbPath;
            tempFiles.push(thumb.uri);
          } catch {
            thumbnailUri = undefined;
          }
        }

        let localUri: string | undefined;
        if (!isVideo) {
          try {
            const dir = `${FileSystem.documentDirectory}mem_photos/`;
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
            const localPath = `${dir}${now}_${i}.jpg`;
            await FileSystem.copyAsync({ from: fileUri, to: localPath });
            localUri = normalizeFileUri(localPath) ?? localPath;
          } catch {
            // local save failed — will load from remote URL
          }
        }

        newItems.push({
          id: (now + i).toString(),
          type: isVideo ? 'video' : 'photo',
          uri: publicUrl,
          localUri,
          thumbnailUri,
          date: dateStr,
          timestamp: now + i,
        });
      } catch (e: any) {
        const msg: string = e?.message ?? '';
        const label = asset.fileName ?? `item ${i + 1}`;
        if (msg === 'video-icloud') {
          failures.push(`${label}: Not downloaded from iCloud yet — open it in Photos first, then try again.`);
        } else if (msg !== 'live-photo') {
          failures.push(`${label}: ${msg || 'Unknown error'}`);
        }
      } finally {
        for (const tmp of tempFiles) {
          FileSystem.deleteAsync(tmp, { idempotent: true }).catch(() => {});
        }
      }
      setUploadProgress({ done: i + 1, total: selectedAssets.length });
    }

    setUploadProgress(null);

    if (newItems.length === 0) {
      Alert.alert('Upload failed', failures.slice(0, 2).join('\n') || 'No files uploaded.');
      return;
    }
    if (newItems.length < selectedAssets.length) {
      Alert.alert('Partial upload', `${newItems.length} of ${selectedAssets.length} uploaded.\n\n${failures.slice(0, 2).join('\n')}`);
    }
    await save([...newItems, ...memoriesRef.current]);
    upsertMemories(newItems);
  };

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const exitSelect = () => { setSelecting(false); setSelected([]); };

  const deleteSelected = () => {
    Alert.alert('Delete', `Remove ${selected.length} ${selected.length === 1 ? 'item' : 'items'}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const ids = [...selected];
        await save(memoriesRef.current.filter(m => !ids.includes(m.id)));
        removeMemories(ids);
        exitSelect();
      }},
    ]);
  };

  const favoriteSelected = async () => {
    const favved = memoriesRef.current
      .filter(m => selected.includes(m.id))
      .map(m => ({ ...m, isFavorite: true }));
    await save(memoriesRef.current.map(m => selected.includes(m.id) ? { ...m, isFavorite: true } : m));
    upsertMemories(favved);
    exitSelect();
  };

  const toggleFav = async (id: string) => {
    const updated = memoriesRef.current.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
    await save(updated);
    const changed = updated.find(m => m.id === id);
    if (changed) upsertMemory(changed);
  };

  const deleteSingle = (id: string) => {
    Alert.alert('Delete', 'Remove this memory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        removeMemory(id);
        save(memoriesRef.current.filter(m => m.id !== id));
        setViewerOpen(false);
      }},
    ]);
  };

  const filtered = memories.filter(m =>
    filter === 'all' ? true : filter === 'photos' ? m.type === 'photo' : m.type === 'video'
  );

  const openViewer = (item: MemoryItem) => {
    const idx = filtered.findIndex(m => m.id === item.id);
    if (idx === -1) return;
    setViewerIndex(idx);
    setVisibleIndex(idx);
    setShowOverlay(true);
    setViewerOpen(true);
  };

  // These MUST be stable refs — FlatList ignores updates to onViewableItemsChanged after mount
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 });
  const onViewableChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setVisibleIndex(viewableItems[0].index);
  });

  useEffect(() => {
    if (!viewerOpen || !viewerRef.current || viewerIndex === 0) return;
    const t = setTimeout(() => {
      viewerRef.current?.scrollToIndex({ index: viewerIndex, animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, [viewerOpen, viewerIndex]);

  // ─── Grid cell ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: MemoryItem }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.cell}
        activeOpacity={selecting ? 0.7 : 0.92}
        onPress={() => selecting ? toggleSelect(item.id) : openViewer(item)}
        onLongPress={() => { if (!selecting) { setSelecting(true); setSelected([item.id]); } }}
        delayLongPress={300}
      >
        {item.type === 'photo' ? (
          <Image
            source={{ uri: normalizeFileUri(item.localUri) ?? item.uri }}
            style={styles.cellImg}
            resizeMode="cover"
            onError={() => {
              if (item.localUri) {
                setMemories(prev => prev.map(m => m.id === item.id ? { ...m, localUri: undefined } : m));
              }
            }}
          />
        ) : item.thumbnailUri ? (
          <>
            <Image source={{ uri: normalizeFileUri(item.thumbnailUri) ?? item.thumbnailUri }} style={styles.cellImg} resizeMode="cover" />
            <View style={styles.videoPlayBtn}>
              <Play size={14} color="#fff" fill="#fff" />
            </View>
          </>
        ) : (
          <View style={[styles.cellImg, styles.videoCellBg]}>
            <ActivityIndicator color="rgba(255,255,255,0.9)" size="small" />
            <Play size={22} color="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.8)" />
          </View>
        )}
        {item.type === 'video' && !selecting && (
          <View style={styles.vidBadge}>
            <VideoIcon size={9} color="#fff" />
          </View>
        )}
        {item.isFavorite && !selecting && (
          <View style={styles.favBadge}>
            <Heart size={8} color="#fff" fill="#fff" />
          </View>
        )}
        {selecting && (
          <>
            {isSelected && <View style={styles.selOverlay} />}
            <View style={[styles.checkRing, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  // ─── Viewer item ───────────────────────────────────────────────────────────
  const renderViewerItem = ({ item, index }: { item: MemoryItem; index: number }) => {
    const isCurrent = index === visibleIndex;
    const isFav = item.isFavorite;
    return (
      <TouchableOpacity activeOpacity={1} style={viewer$.page} onPress={() => setShowOverlay(v => !v)}>
        {item.type === 'photo' ? (
          <Image source={{ uri: normalizeFileUri(item.localUri) ?? item.uri }} style={viewer$.media} resizeMode="contain" />
        ) : (
          <VideoViewerItem uri={item.uri} isVisible={isCurrent && viewerOpen} />
        )}
        {showOverlay && (
          <View style={viewer$.topBar}>
            <TouchableOpacity onPress={() => setViewerOpen(false)} style={viewer$.iconBtn}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={viewer$.counter}>{index + 1} / {filtered.length}</Text>
            <TouchableOpacity
              style={[viewer$.iconBtn, isFav && { backgroundColor: '#E91E8C' }]}
              onPress={() => {
                toggleFav(item.id);
                setMemories(prev => prev.map(m => m.id === item.id ? { ...m, isFavorite: !m.isFavorite } : m));
              }}
            >
              <Heart size={18} color="#fff" fill={isFav ? '#fff' : 'none'} />
            </TouchableOpacity>
          </View>
        )}
        {showOverlay && (
          <View style={viewer$.bottomBar}>
            <Text style={viewer$.dateText}>{item.date}</Text>
            <TouchableOpacity style={viewer$.deleteBtn} onPress={() => deleteSingle(item.id)}>
              <Trash2 size={16} color="#ff4757" />
              <Text style={viewer$.deleteTxt}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>

      {/* Header */}
      <View style={styles.header}>
        {selecting ? (
          <>
            <TouchableOpacity onPress={exitSelect} style={styles.hBtn}>
              <Text style={[styles.hBtnTxt, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.hTitle}>
              {selected.length === 0 ? 'Select Items' : `${selected.length} Selected`}
            </Text>
            <TouchableOpacity onPress={deleteSelected} disabled={selected.length === 0} style={styles.hBtn}>
              <Text style={[styles.hBtnTxt, { color: selected.length > 0 ? '#ff4757' : 'rgba(255,255,255,0.3)' }]}>Delete</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.back()} style={styles.hBtn}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.hTitle}>Our Memories</Text>
              <Text style={styles.hCount}>{memories.length} {memories.length === 1 ? 'memory' : 'memories'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              {memories.length > 0 && (
                <TouchableOpacity onPress={() => setSelecting(true)}>
                  <Text style={[styles.hBtnTxt, { color: colors.primary }]}>Select</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={showAddOptions} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                <Plus size={16} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Upload progress */}
      {uploadProgress && (
        <View style={styles.uploadBanner}>
          <ActivityIndicator color="#E91E8C" size="small" />
          <Text style={styles.uploadTxt}>
            Uploading {uploadProgress.done} / {uploadProgress.total}…
          </Text>
        </View>
      )}

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {(['all', 'photos', 'videos'] as Filter[]).map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[styles.chip, filter === f && { backgroundColor: colors.primary }]}>
            <Text style={[styles.chipTxt, { color: filter === f ? '#fff' : 'rgba(255,255,255,0.45)' }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <LinearGradient colors={['#E91E8C22','#9C27B022']} style={styles.emptyCircle}>
            <Heart size={38} color={colors.primary} />
          </LinearGradient>
          <Text style={styles.emptyTitle}>No memories yet</Text>
          <Text style={styles.emptySub}>Tap + to add photos or videos</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={COLS}
          contentContainerStyle={{ gap: GAP, paddingBottom: selecting ? 100 : 30 }}
          columnWrapperStyle={{ gap: GAP }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Selection action bar */}
      {selecting && (
        <View style={[styles.actionBar, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={[styles.actionBarBtn, selected.length === 0 && { opacity: 0.35 }]}
            onPress={favoriteSelected} disabled={selected.length === 0}>
            <Heart size={22} color={colors.primary} />
            <Text style={[styles.actionBarTxt, { color: colors.primary }]}>Favorite</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={[styles.actionBarBtn, selected.length === 0 && { opacity: 0.35 }]}
            onPress={deleteSelected} disabled={selected.length === 0}>
            <Trash2 size={22} color="#ff4757" />
            <Text style={[styles.actionBarTxt, { color: '#ff4757' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TikTok-style viewer */}
      <Modal visible={viewerOpen} transparent={false} animationType="fade"
        onRequestClose={() => setViewerOpen(false)} statusBarTranslucent>
        <View style={viewer$.container}>
          <FlatList
            ref={viewerRef}
            data={filtered}
            renderItem={renderViewerItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            snapToInterval={SCREEN_H}
            snapToAlignment="start"
            decelerationRate="fast"
            getItemLayout={(_, index) => ({ length: SCREEN_H, offset: SCREEN_H * index, index })}
            onViewableItemsChanged={onViewableChanged.current}
            viewabilityConfig={viewabilityConfig.current}
            removeClippedSubviews={false}
          />
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 58, paddingBottom: 10, backgroundColor: '#000',
  },
  hBtn: { minWidth: 60, alignItems: 'center', justifyContent: 'center', height: 36 },
  hBtnTxt: { fontSize: 15, fontWeight: '600' },
  hTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  hCount: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 },
  addBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#000' },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)' },
  chipTxt: { fontSize: 13, fontWeight: '600' },
  uploadBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(233,30,140,0.15)', paddingVertical: 10, paddingHorizontal: 16,
  },
  uploadTxt: { color: '#E91E8C', fontSize: 13, fontWeight: '600' },
  cell: { width: CELL, height: CELL, backgroundColor: '#1a0a2e' },
  cellImg: { width: '100%', height: '100%' },
  videoCellBg: { backgroundColor: '#160B25', alignItems: 'center', justifyContent: 'center' },
  videoPlayBtn: {
    position: 'absolute', top: '50%', left: '50%',
    width: 30, height: 30, borderRadius: 15, marginTop: -15, marginLeft: -15,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  vidBadge: {
    position: 'absolute', bottom: 5, left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  favBadge: {
    position: 'absolute', bottom: 5, right: 6,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 10, padding: 4,
  },
  selOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  checkRing: {
    position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  actionBarBtn: { flex: 1, alignItems: 'center', gap: 5 },
  actionBarTxt: { fontSize: 12, fontWeight: '600' },
  actionDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.08)' },
});

const pick$ = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 58 : 40,
    paddingBottom: 14,
    backgroundColor: '#111',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  hBtn: { minWidth: 64 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelTxt: { color: 'rgba(255,255,255,0.55)', fontSize: 15 },
  addTxt: { color: '#E91E8C', fontSize: 15, fontWeight: '700', textAlign: 'right' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadTxt: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  cell: { width: PICKER_CELL, height: PICKER_CELL },
  img: { width: '100%', height: '100%' },
  pendingCell: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  selOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  vidBadge: {
    position: 'absolute', bottom: 4, left: 4,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2,
  },
  vidDur: { color: '#fff', fontSize: 10, fontWeight: '600' },
  ring: {
    position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  ringFilled: { backgroundColor: '#E91E8C', borderColor: '#E91E8C' },
  num: { color: '#fff', fontSize: 11, fontWeight: '700' },
});

const viewer$ = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  page: { width, height: SCREEN_H, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  media: { width, height: SCREEN_H },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 58 : 40, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  counter: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '600' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 44 : 24, paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  dateText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteTxt: { color: '#ff4757', fontSize: 13, fontWeight: '600' },
});

const pin$ = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  back: { position: 'absolute', top: 58, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.07)', alignItems: 'center', justifyContent: 'center' },
  icon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 8 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 },
  dots: { flexDirection: 'row', gap: 18, marginBottom: 4 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  err: { fontSize: 13, color: '#ff4757', marginBottom: 12 },
  pad: { flexDirection: 'row', flexWrap: 'wrap', width: 270, gap: 16, justifyContent: 'center', marginTop: 16 },
  key: { width: 74, height: 74, borderRadius: 37, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  keyTxt: { fontSize: 26, fontWeight: '600', color: '#fff' },
});
