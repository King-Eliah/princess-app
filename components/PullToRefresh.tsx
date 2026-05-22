import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, RefreshControl } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface PullToRefreshScrollProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  style?: any;
  contentContainerStyle?: any;
}

export default function PullToRefreshScroll({
  children,
  onRefresh,
  style,
  contentContainerStyle,
}: PullToRefreshScrollProps) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const rotateValue = useRef(new Animated.Value(0)).current;

  const handleRefresh = async () => {
    setRefreshing(true);

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    try {
      await onRefresh();
    } finally {
      rotateValue.setValue(0);
      setRefreshing(false);
    }
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      }
      bounces={true}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

// Custom pull indicator for web (since RefreshControl is better on native)
export function CustomPullIndicator({ visible }: { visible: boolean }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.pullIndicator,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity,
        },
      ]}
    >
      <RefreshCw size={20} color={colors.primary} />
      <Text style={[styles.pullText, { color: colors.text }]}>Release to refresh</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pullIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
    gap: 12,
    marginTop: 20,
  },
  pullText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
