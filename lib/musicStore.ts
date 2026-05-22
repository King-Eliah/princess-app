type Listener = () => void;

export interface MusicState {
  isPlaying: boolean;
  title: string;
  artist: string;
  currentIndex: number;
}

let _state: MusicState = { isPlaying: false, title: '', artist: '', currentIndex: 0 };
const _listeners = new Set<Listener>();
const _toggleRef = { current: null as (() => void) | null };
const _nextRef = { current: null as (() => void) | null };

export function getMusicState(): MusicState {
  return { ..._state };
}

export function setMusicState(patch: Partial<MusicState>): void {
  _state = { ..._state, ...patch };
  _listeners.forEach(fn => fn());
}

export function subscribe(fn: Listener): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function registerControls(toggle: () => void, next: () => void): void {
  _toggleRef.current = toggle;
  _nextRef.current = next;
}

export function miniTogglePlay(): void { _toggleRef.current?.(); }
export function miniSkipNext(): void { _nextRef.current?.(); }
