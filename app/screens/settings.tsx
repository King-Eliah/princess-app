import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Alert } from 'react-native';
import { Palette, Bell, Globe, Lock, User, Moon, Sun, Smartphone, Share2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'galaxy' ? Moon : Sun,
          label: 'Theme',
          value: theme === 'galaxy' ? 'Dark Purple' : 'Pink Light',
          onPress: toggleTheme,
          type: 'action',
        },
        {
          icon: Palette,
          label: 'Customize Colors',
          subtitle: 'Coming soon!',
          onPress: () => Alert.alert('','Custom color picker coming soon! 🎨'),
          type: 'action',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          value: notifications,
          onToggle: setNotifications,
          type: 'toggle',
        },
        {
          icon: Smartphone,
          label: 'Haptic Feedback',
          value: haptics,
          onToggle: setHaptics,
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          subtitle: 'my baby',
          onPress: () => Alert.alert('','Profile settings coming soon! 👑'),
          type: 'action',
        },
        {
          icon: Lock,
          label: 'Privacy & Security',
          onPress: () => Alert.alert('','Privacy settings coming soon! 🔒'),
          type: 'action',
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          icon: Share2,
          label: 'Share App',
          onPress: () => Alert.alert('','Share with loved ones! 💜'),
          type: 'action',
        },
        {
          icon: Globe,
          label: 'About',
          onPress: () => Alert.alert('','Made with 💜 for the most amazing person!'),
          type: 'action',
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.profileIcon, { backgroundColor: colors.primary }]}>
            <User size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>
        {settingsGroups.map((group, index) => (
          <View key={index} style={styles.settingsGroup}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
            <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {group.items.map((item: any, itemIndex) => {
                const Icon = item.icon;
                const isLast = itemIndex === group.items.length - 1;

                return (
                  <View key={itemIndex}>
                    <TouchableOpacity
                      style={[styles.settingItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                      onPress={item.type === 'action' ? item.onPress : undefined}
                      activeOpacity={item.type === 'action' ? 0.7 : 1}
                    >
                      <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                          <Icon size={22} color={colors.primary} />
                        </View>
                        <View style={styles.settingText}>
                          <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                          {item.subtitle && (
                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                              {item.subtitle}
                            </Text>
                          )}
                        </View>
                      </View>

                      {item.type === 'toggle' && (
                        <Switch
                          value={item.value as boolean}
                          onValueChange={item.onToggle}
                          trackColor={{ false: colors.border, true: colors.primary + '40' }}
                          thumbColor={item.value ? colors.primary : colors.textSecondary}
                        />
                      )}

                      {item.type === 'action' && item.value && (
                        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                          {item.value}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Version 1.0.0 • Made with 💜
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 100,
  },
  settingsGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  groupCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 72,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  settingValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
});
