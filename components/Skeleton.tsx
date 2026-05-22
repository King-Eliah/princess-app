import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width: w = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: w,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.cardHeader}>
        <Skeleton width={60} height={60} borderRadius={30} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
        </View>
      </View>
      <Skeleton width="100%" height={120} style={{ marginTop: 16 }} />
      <View style={styles.cardFooter}>
        <Skeleton width="30%" height={16} />
        <Skeleton width="20%" height={16} />
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.listSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <Skeleton width={56} height={56} borderRadius={16} />
          <View style={styles.listItemContent}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
          </View>
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
      ))}
    </View>
  );
}

export function GridSkeleton({ columns = 2, count = 6 }: { columns?: number; count?: number }) {
  return (
    <View style={styles.gridSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.gridItem,
            { width: (width - 60 - (columns - 1) * 12) / columns },
          ]}
        >
          <Skeleton width="100%" height={120} borderRadius={16} />
          <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
          <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  cardSkeleton: {
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  listSkeleton: {
    padding: 20,
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  listItemContent: {
    flex: 1,
  },
  gridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  gridItem: {
    marginBottom: 16,
  },
});
