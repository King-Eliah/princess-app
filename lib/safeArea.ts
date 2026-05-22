import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + 16;
}

export function useBottomInset() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}
