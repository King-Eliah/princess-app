import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

interface BorderedCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
  showGradientBorder?: boolean;
}

export default function BorderedCard({ 
  children, 
  title, 
  subtitle, 
  style,
  showGradientBorder = true 
}: BorderedCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Header Text */}
      {(title || subtitle) && (
        <View style={styles.headerContainer}>
          {title && (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      )}

      {/* Card with Border */}
      <View style={[styles.cardWrapper, { backgroundColor: colors.cardBorder }]}>
        <View style={[styles.cardInner, { backgroundColor: colors.surface }]}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardWrapper: {
    borderRadius: 28,
    padding: 4, // Border thickness
  },
  cardInner: {
    borderRadius: 24,
    padding: 24,
    minHeight: 200,
  },
});
