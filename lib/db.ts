import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
}

export interface MemoryItem {
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

// ── helpers ───────────────────────────────────────────────────────────────────

const toMemoryRow = (m: MemoryItem) => ({
  id: m.id,
  type: m.type,
  uri: m.uri,
  local_uri: m.localUri ?? null,
  thumbnail_uri: m.thumbnailUri ?? null,
  asset_id: m.assetId ?? null,
  date: m.date,
  timestamp: m.timestamp,
  is_favorite: m.isFavorite ?? false,
});

const fromMemoryRow = (r: any): MemoryItem => ({
  id: r.id,
  type: r.type,
  uri: r.uri,
  localUri: r.local_uri ?? undefined,
  thumbnailUri: r.thumbnail_uri ?? undefined,
  assetId: r.asset_id ?? undefined,
  date: r.date,
  timestamp: r.timestamp,
  isFavorite: r.is_favorite ?? false,
});

// ── Notes ─────────────────────────────────────────────────────────────────────

export const getNotes = async (): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error || !data) throw error;
    const notes: Note[] = data.map(r => ({
      id: r.id, title: r.title, content: r.content, date: r.date, timestamp: r.timestamp,
    }));
    // Only overwrite cache when Supabase has data — don't wipe local-only notes
    if (notes.length > 0) {
      await AsyncStorage.setItem('userNotes', JSON.stringify(notes));
      return notes;
    }
    // Supabase empty → fall through to local cache (tables may be freshly created)
    const cached = await AsyncStorage.getItem('userNotes');
    return cached ? JSON.parse(cached) : [];
  } catch {
    const cached = await AsyncStorage.getItem('userNotes');
    return cached ? JSON.parse(cached) : [];
  }
};

// Fire-and-forget — never blocks the UI
export const upsertNote = (note: Note): void => {
  supabase.from('notes').upsert({
    id: note.id, title: note.title, content: note.content,
    date: note.date, timestamp: note.timestamp,
  }).then(() => {}).catch(() => {});
};

export const removeNote = (id: string): void => {
  supabase.from('notes').delete().eq('id', id).then(() => {}).catch(() => {});
};

// ── Memories ──────────────────────────────────────────────────────────────────

export const getMemories = async (): Promise<MemoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error || !data) throw error;
    const items = data.map(fromMemoryRow);
    // Only overwrite cache when Supabase has data — don't wipe local-only memories
    if (items.length > 0) {
      await AsyncStorage.setItem('userMemories', JSON.stringify(items));
      return items;
    }
    // Supabase empty → fall through to local cache (tables may be freshly created)
    const cached = await AsyncStorage.getItem('userMemories');
    return cached ? JSON.parse(cached) : [];
  } catch {
    const cached = await AsyncStorage.getItem('userMemories');
    return cached ? JSON.parse(cached) : [];
  }
};

export const upsertMemory = (item: MemoryItem): void => {
  supabase.from('memories').upsert(toMemoryRow(item)).then(() => {}).catch(() => {});
};

export const upsertMemories = (items: MemoryItem[]): void => {
  if (!items.length) return;
  supabase.from('memories').upsert(items.map(toMemoryRow)).then(() => {}).catch(() => {});
};

export const removeMemory = (id: string): void => {
  supabase.from('memories').delete().eq('id', id).then(() => {}).catch(() => {});
};

export const removeMemories = (ids: string[]): void => {
  if (!ids.length) return;
  supabase.from('memories').delete().in('id', ids).then(() => {}).catch(() => {});
};
