import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMemories } from './db';

export interface SlideshowImage {
  id: string;
  uri: string;
  uploadedAt: string;
}

const STORAGE_KEY = 'slideshowImages';
export const MAX_SLIDESHOW = 10;

export const defaultSlides: string[] = [];

const isRenderableImageUri = (uri: string): boolean => {
  return (
    uri.startsWith('http://') ||
    uri.startsWith('https://') ||
    uri.startsWith('file://') ||
    uri.startsWith('content://')
  );
};

export const getSlideshowImages = async (): Promise<string[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const explicit: SlideshowImage[] = saved ? JSON.parse(saved) : [];
    const explicitImages = explicit
      .slice(0, MAX_SLIDESHOW)
      .map(img => img.uri)
      .filter(isRenderableImageUri);

    if (explicitImages.length > 0) {
      return explicitImages;
    }

    // Fallback: first 10 photos from memories (tries Supabase, falls back to local cache)
    const memories = await getMemories();
    const fromMemories = memories
      .filter(m => m.type === 'photo')
      .slice(0, MAX_SLIDESHOW)
      .map(m => m.uri)
      .filter(isRenderableImageUri);

    if (fromMemories.length > 0) {
      return fromMemories;
    }

    return defaultSlides;
  } catch {
    return defaultSlides;
  }
};

export const addSlideshowImage = async (uri: string): Promise<boolean> => {
  try {
    if (!isRenderableImageUri(uri)) {
      return false;
    }
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const images: SlideshowImage[] = saved ? JSON.parse(saved) : [];
    if (images.length >= MAX_SLIDESHOW) return false;
    images.push({ id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, uri, uploadedAt: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    return true;
  } catch {
    return false;
  }
};

export const removeSlideshowImage = async (id: string): Promise<void> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const images: SlideshowImage[] = JSON.parse(saved);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images.filter(img => img.id !== id)));
    }
  } catch (error) {
    console.error('Error removing slideshow image:', error);
  }
};

export const getAllSlideshowImages = async (): Promise<SlideshowImage[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error('Error loading slideshow images:', error);
  }
  return [];
};
