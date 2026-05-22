import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Heart, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TouchMessage {
  id: string;
  message: string;
  date: string;
  timestamp: number;
}

const defaultMessages: TouchMessage[] = [
  { id: '1',  message: "You make my heart skip a beat", date: new Date().toLocaleDateString(), timestamp: Date.now() - 15000 },
  { id: '2',  message: "Your smile is my favorite view", date: new Date().toLocaleDateString(), timestamp: Date.now() - 14000 },
  { id: '3',  message: "Every day with you is a gift", date: new Date().toLocaleDateString(), timestamp: Date.now() - 13000 },
  { id: '4',  message: "You are my happy place", date: new Date().toLocaleDateString(), timestamp: Date.now() - 12000 },
  { id: '5',  message: "Your laugh is pure magic", date: new Date().toLocaleDateString(), timestamp: Date.now() - 11000 },
  { id: '6',  message: "You light up my world", date: new Date().toLocaleDateString(), timestamp: Date.now() - 10000 },
  { id: '7',  message: "You are absolutely amazing", date: new Date().toLocaleDateString(), timestamp: Date.now() - 9000 },
  { id: '8',  message: "My heart belongs to you", date: new Date().toLocaleDateString(), timestamp: Date.now() - 8000 },
  { id: '9',  message: "You are my everything", date: new Date().toLocaleDateString(), timestamp: Date.now() - 7000 },
  { id: '10', message: "Forever grateful for you", date: new Date().toLocaleDateString(), timestamp: Date.now() - 6000 },
  { id: '11', message: "You make me a better person", date: new Date().toLocaleDateString(), timestamp: Date.now() - 5000 },
  { id: '12', message: "My heart sings when you are near", date: new Date().toLocaleDateString(), timestamp: Date.now() - 4000 },
  { id: '13', message: "You are my dream come true", date: new Date().toLocaleDateString(), timestamp: Date.now() - 3000 },
  { id: '14', message: "Thank you for being you", date: new Date().toLocaleDateString(), timestamp: Date.now() - 2000 },
  { id: '15', message: "You complete me", date: new Date().toLocaleDateString(), timestamp: Date.now() - 1000 },
];

function MessageCard({ item, colors }: { item: TouchMessage; colors: any }) {
  const [pressed, setPressed] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <Animated.View style={[
      styles.cardWrap,
      { transform: [{ scale: scaleAnim }] },
    ]}>
      <Animated.View style={[styles.messageCard, { backgroundColor: colors.surface, borderColor }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardInner}
        >
          {pressed ? (
            <>
              <Heart size={14} color={colors.primary} fill={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.messageText, { color: colors.text }]}>{item.message}</Text>
            </>
          ) : (
            <View style={styles.hiddenState}>
              <LinearGradient colors={['#E91E8C33', '#9C27B033']} style={styles.heartCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Heart size={22} color={colors.primary} fill={colors.primary} />
              </LinearGradient>
              <Text style={[styles.touchHint, { color: colors.textSecondary }]}>Hold to reveal</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default function TouchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<TouchMessage[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const saved = await AsyncStorage.getItem('touchMessages');
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(defaultMessages);
        await AsyncStorage.setItem('touchMessages', JSON.stringify(defaultMessages));
      }
    } catch {
      setMessages(defaultMessages);
    }
  };

  const saveMessages = async (updated: TouchMessage[]) => {
    setMessages(updated);
    try { await AsyncStorage.setItem('touchMessages', JSON.stringify(updated)); } catch {}
  };

  const renderMessage = ({ item }: { item: TouchMessage }) => (
    <MessageCard item={item} colors={colors} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Touch Messages</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Tap and hold to reveal</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 2 },
  list: { padding: 12, paddingBottom: 80, gap: 0 },
  cardWrap: { width: '50%', padding: 6 },
  messageCard: {
    borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', minHeight: 130,
  },
  cardInner: { padding: 16, minHeight: 130, justifyContent: 'center' },
  hiddenState: { alignItems: 'center', gap: 10 },
  heartCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  touchHint: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  messageText: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
});
