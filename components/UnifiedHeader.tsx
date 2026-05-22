import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { ChevronLeft, Share2, Settings, Search } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

interface UnifiedHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showShare?: boolean;
  showSearch?: boolean;
  onSearch?: (text: string) => void;
  customAction?: {
    icon: React.ComponentType<any>;
    onPress: () => void;
  };
}

export default function UnifiedHeader({
  title,
  subtitle,
  showBack = true,
  showSettings = false,
  showShare = false,
  showSearch = false,
  onSearch,
  customAction,
}: UnifiedHeaderProps) {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Gradient Background */}
      <View style={styles.gradientWrapper}>
        <View style={[styles.gradientBackground, { 
          backgroundColor: theme === 'purple' ? colors.primary : colors.surface 
        }]} />
      </View>

      {/* Header Content */}
      <View style={styles.headerContent}>
        <View style={styles.topRow}>
          {/* Left Action */}
          {showBack && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface + '80' }]}
              onPress={() => router.back()}
            >
              <ChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Spacer if no back button */}
          {!showBack && <View style={styles.actionButton} />}

          {/* Title Area */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right Actions */}
          <View style={styles.rightActions}>
            {showShare && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.surface + '80' }]}
                onPress={() => alert('Share feature coming soon!')}
              >
                <Share2 size={20} color={colors.text} />
              </TouchableOpacity>
            )}
            {showSettings && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.surface + '80' }]}
                onPress={() => router.push('/settings' as any)}
              >
                <Settings size={20} color={colors.text} />
              </TouchableOpacity>
            )}
            {customAction && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.surface + '80' }]}
                onPress={customAction.onPress}
              >
                <customAction.icon size={20} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    zIndex: 10,
  },
  gradientWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: 'hidden',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  headerContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
  },
});
