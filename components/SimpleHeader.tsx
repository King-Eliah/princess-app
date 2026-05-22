import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

interface SimpleHeaderProps {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
  onProfilePress?: () => void;
}

export default function SimpleHeader({
  title,
  showBack = false,
  showProfile = true,
  onProfilePress,
}: SimpleHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity 
          style={[styles.profileIcon, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        showProfile && (
          <TouchableOpacity 
            style={[styles.profileIcon, { backgroundColor: colors.primary }]}
            onPress={onProfilePress || (() => {})}
          >
            <User size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )
      )}
      {!showBack && !showProfile && <View style={styles.profileIcon} />}
      
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.profileIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
});
