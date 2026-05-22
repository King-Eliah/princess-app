import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Calendar, Clock, Camera, ChevronRight, Gift, Plus, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 40 - 8) / 3;

const OFFICIAL_DATE = new Date('2026-03-18');

const calculateDaysTogether = () => {
  const diff = Math.abs(new Date().getTime() - OFFICIAL_DATE.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const calculateMonthsTogether = () => {
  const now = new Date();
  let months = (now.getFullYear() - OFFICIAL_DATE.getFullYear()) * 12 + (now.getMonth() - OFFICIAL_DATE.getMonth());
  if (now.getDate() < OFFICIAL_DATE.getDate()) months -= 1;
  return Math.max(0, months);
};

interface Anniversary {
  month: number;
  date: Date;
  isPast: boolean;
  isToday: boolean;
  isYearly: boolean;
}

function getAnniversaries(): Anniversary[] {
  const now = new Date();
  const monthsCompleted = calculateMonthsTogether();
  const result: Anniversary[] = [];
  for (let m = 1; m <= monthsCompleted + 2; m++) {
    const d = new Date(2026, 2, 18);
    d.setMonth(d.getMonth() + m);
    const isToday = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    result.push({ month: m, date: d, isPast: d < now && !isToday, isToday, isYearly: m % 12 === 0 });
  }
  return result;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MemoryItem {
  id: string;
  type: 'photo' | 'video';
  uri: string;
  localUri?: string;
  thumbnailUri?: string;
  date: string;
  timestamp: number;
  isFavorite?: boolean;
}

export default function MemoriesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [days, setDays] = React.useState(calculateDaysTogether);
  const [months, setMonths] = React.useState(calculateMonthsTogether);
  const [recentMemories, setRecentMemories] = React.useState<MemoryItem[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => {
      setDays(calculateDaysTogether());
      setMonths(calculateMonthsTogether());
    }, 60000);
    return () => clearInterval(t);
  }, []);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('userMemories').then(s => {
      if (s) {
        const all: MemoryItem[] = JSON.parse(s);
        const sorted = [...all].sort((a, b) => b.timestamp - a.timestamp);
        setTotalCount(sorted.length);
        setRecentMemories(sorted.slice(0, 9));
      } else {
        setTotalCount(0);
        setRecentMemories([]);
      }
    }).catch(() => {});
  }, []));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.textSecondary }]}>Our Sanctuary</Text>
          <Text style={[styles.screenTitle, { color: colors.text }]}>Our Memories</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{months}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Months Together</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{days}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Together</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{totalCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Memories</Text>
          </View>
        </View>

        {/* Photo memories section */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Photo Memories</Text>
            <TouchableOpacity onPress={() => router.push('/screens/photos' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentMemories.length > 0 ? (
            <>
              <View style={styles.photoGrid}>
                {recentMemories.map((item, i) => {
                  const thumbUri = item.type === 'photo' ? (item.localUri ?? item.uri) : item.thumbnailUri;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.photoCell}
                      onPress={() => router.push('/screens/photos' as any)}
                      activeOpacity={0.85}
                    >
                      {thumbUri ? (
                        <Image source={{ uri: thumbUri }} style={styles.photoImg} resizeMode="cover" />
                      ) : (
                        <View style={[styles.photoImg, styles.videoPlaceholder]}>
                          <Text style={styles.videoIcon}>▶</Text>
                        </View>
                      )}
                      {item.isFavorite && (
                        <View style={styles.favDot}>
                          <Heart size={8} color="#fff" fill="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                style={[styles.addMemoryBtn, { borderColor: colors.primary }]}
                onPress={() => router.push('/screens/photos' as any)}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.primary} />
                <Text style={[styles.addMemoryText, { color: colors.primary }]}>Add a Memory</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.emptyPhotos, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/screens/photos' as any)}
              activeOpacity={0.7}
            >
              <LinearGradient colors={['#E91E8C22', '#9C27B022']} style={styles.emptyIcon}>
                <Camera size={30} color={colors.primary} />
              </LinearGradient>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Capture your first memory</Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Add photos and videos of your moments together</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Monthly milestones */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Milestones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.annScroll}>
            {getAnniversaries().map(({ month, date, isPast, isToday, isYearly }) => (
              <View
                key={month}
                style={[
                  styles.annCard,
                  {
                    backgroundColor: isToday ? colors.primary : isYearly ? colors.primary + '22' : colors.surface,
                    borderColor: isToday ? colors.primary : isYearly ? colors.primary : colors.border,
                  },
                ]}
              >
                {isYearly && <Gift size={13} color={isToday ? '#fff' : colors.primary} style={{ marginBottom: 2 }} />}
                <Text style={[styles.annMonth, { color: isToday ? '#fff' : isPast ? colors.primary : colors.textSecondary }]}>
                  {month % 12 === 0 ? `${month / 12}yr` : `${month}mo`}
                </Text>
                <Text style={[styles.annDate, { color: isToday ? 'rgba(255,255,255,0.85)' : colors.text }]}>
                  {MONTH_NAMES[date.getMonth()]} {date.getDate()}
                </Text>
                {isToday && <Text style={styles.annToday}>Today!</Text>}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>More</Text>
          {[
            { title: 'Important Dates', desc: 'Special days to remember', icon: Calendar, grad: ['#E91E8C', '#C2185B'] as const, route: '/screens/calendar' },
            { title: 'Our Timeline', desc: 'Every moment we have shared', icon: Clock, grad: ['#AB47BC', '#7B1FA2'] as const, route: '/screens/timeline' },
          ].map(item => (
            <TouchableOpacity
              key={item.title}
              style={[styles.linkCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <LinearGradient colors={item.grad} style={styles.linkIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <item.icon size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.linkText}>
                <Text style={[styles.linkTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.linkDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Every memory with you is a gift</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },

  header: { alignItems: 'center', marginBottom: 20 },
  appName: { fontSize: 12, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  screenTitle: { fontSize: 30, fontWeight: '800' },

  statRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 28, overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statDivider: { width: 1 },
  statNum: { fontSize: 24, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center' },

  section: { marginBottom: 28 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  seeAll: { fontSize: 13, fontWeight: '600' },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 12 },
  photoCell: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  photoImg: { width: '100%', height: '100%' },
  videoPlaceholder: { backgroundColor: '#160B25', alignItems: 'center', justifyContent: 'center' },
  videoIcon: { fontSize: 20, color: 'rgba(255,255,255,0.6)' },
  favDot: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: '#E91E8C', borderRadius: 8, padding: 3,
  },

  addMemoryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed',
  },
  addMemoryText: { fontSize: 14, fontWeight: '600' },

  emptyPhotos: {
    alignItems: 'center', padding: 32, borderRadius: 16, borderWidth: 1, gap: 10,
  },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },

  annScroll: { paddingBottom: 4, gap: 10 },
  annCard: { width: 70, borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 1, gap: 2 },
  annMonth: { fontSize: 13, fontWeight: '800' },
  annDate: { fontSize: 11, fontWeight: '600' },
  annToday: { fontSize: 9, fontWeight: '700', color: '#fff', marginTop: 2, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },

  linkCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, gap: 14 },
  linkIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  linkText: { flex: 1 },
  linkTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  linkDesc: { fontSize: 12 },

  footer: { alignItems: 'center', paddingVertical: 16 },
  footerText: { fontSize: 13, fontStyle: 'italic' },
});
