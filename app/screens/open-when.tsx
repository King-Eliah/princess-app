import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { ChevronLeft, Heart, Moon, Star, Zap, Smile, Coffee, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

interface Card {
  id: string;
  label: string;
  icon: 'heart' | 'moon' | 'star' | 'zap' | 'smile' | 'coffee';
  color: string;
  title: string;
  message: string;
}

const CARDS: Card[] = [
  {
    id: 'miss',
    label: 'Open when you miss me',
    icon: 'heart',
    color: '#E91E8C',
    title: 'You miss me?',
    message: `Good. That means it's real.\n\nI want you to know that whenever we're apart, a part of me is always with you — in the songs you hear, in the random thoughts that catch you off guard, in the moments that are too good not to share.\n\nI miss you too. More than I probably say. But missing each other just means we have something worth coming back to.\n\nI'll always come back to you, Princess.`,
  },
  {
    id: 'sad',
    label: 'Open when you\'re sad',
    icon: 'moon',
    color: '#7B1FA2',
    title: 'Hey. Look at me.',
    message: `Whatever it is — it's allowed to hurt.\n\nYou don't have to perform being okay. Not with me. Not ever.\n\nI want you to know that your sadness doesn't scare me. Your mess doesn't scare me. The version of you that's struggling is still the version of you I choose, every single day.\n\nYou're not too much. You're not a burden. You're the person I want to sit next to in the hard moments, not just the good ones.\n\nI'm here. Whenever you're ready to talk, or not talk — I'm here.`,
  },
  {
    id: 'attention',
    label: 'Open when you want attention',
    icon: 'star',
    color: '#F59E0B',
    title: 'You have it. All of it.',
    message: `Come here. Seriously.\n\nYou never have to earn my attention. You never have to compete for it or wait to deserve it. You already have it — you've had it since day one.\n\nYou are the most interesting, ridiculous, beautiful person I know. I want to hear whatever you want to tell me. I want to see your face. I want to know what's in your head right now.\n\nSo yes. You have my full attention.\n\nNow tell me something. Anything. I'm listening.`,
  },
  {
    id: 'sleep',
    label: 'Open when you can\'t sleep',
    icon: 'moon',
    color: '#3B82F6',
    title: '2am mode activated.',
    message: `Still awake? Same.\n\n(Not really, but I'm with you in spirit.)\n\nHere's what I want you to do: put your phone down after this. I mean it.\n\nBut first — think about something good. Something small that made you smile recently. A moment that felt warm. Hold onto that.\n\nYou're safe. You're loved. Tomorrow is going to happen and it will be okay.\n\nNow put the phone down. The memes will still be there in the morning.\n\nGoodnight, Princess. I love you.`,
  },
  {
    id: 'reassurance',
    label: 'Open when you need reassurance',
    icon: 'heart',
    color: '#10B981',
    title: 'You\'re not overthinking. You\'re loved.',
    message: `Let me be very clear about something.\n\nI choose you. Fully. Not the edited version, not the version that has everything figured out — you, as you are right now, with all the uncertainty and all the feelings you're trying to make sense of.\n\nYou are not too needy. You are not difficult. You are someone who feels deeply and loves hard and I think that's one of the most beautiful things about you.\n\nWhatever the worry is — I'm not going anywhere. I'm not tired of you. I'm not looking elsewhere. I'm right here.\n\nYou are my person. That doesn't change.`,
  },
  {
    id: 'motivation',
    label: 'Open when you need a push',
    icon: 'zap',
    color: '#F97316',
    title: 'Get up, Princess.',
    message: `I know it feels heavy right now.\n\nBut I've watched you. I've seen what you can do when you decide to move. You're not someone who stays down — you're someone who gets up, adjusts her crown, and keeps going.\n\nThe thing you're facing right now? You're bigger than it. Even if it doesn't feel like it.\n\nI believe in you on the days you can't believe in yourself. That's what I'm here for.\n\nNow go do the thing. I'll be proud of you when you do.\n\nYou've got this.`,
  },
];

const IconMap = {
  heart: Heart,
  moon: Moon,
  star: Star,
  zap: Zap,
  smile: Smile,
  coffee: Coffee,
};

export default function OpenWhenScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [openCard, setOpenCard] = useState<Card | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.text }]}>Open When</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Letters just for you</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Pick a card that matches how you're feeling right now.
        </Text>

        <View style={styles.grid}>
          {CARDS.map(card => {
            const Icon = IconMap[card.icon];
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setOpenCard(card)}
                activeOpacity={0.8}
              >
                <View style={[styles.cardIcon, { backgroundColor: card.color + '22' }]}>
                  <Icon size={28} color={card.color} />
                </View>
                <Text style={[styles.cardLabel, { color: colors.text }]}>{card.label}</Text>
                <View style={[styles.sealDot, { backgroundColor: card.color }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Message Modal */}
      <Modal visible={openCard !== null} transparent animationType="slide" onRequestClose={() => setOpenCard(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />

            <View style={styles.modalTop}>
              {openCard && (
                <View style={[styles.modalIcon, { backgroundColor: openCard.color + '22' }]}>
                  {(() => { const I = IconMap[openCard.icon]; return <I size={32} color={openCard.color} />; })()}
                </View>
              )}
              <TouchableOpacity onPress={() => setOpenCard(null)} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>{openCard?.title}</Text>
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>{openCard?.label}</Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalMessage, { color: colors.text }]}>{openCard?.message}</Text>
              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                <Heart size={16} color={openCard?.color ?? colors.primary} fill={openCard?.color ?? colors.primary} />
                <Text style={[styles.modalFooterText, { color: colors.textSecondary }]}>From Eliah, with everything.</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 62, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  scroll: { padding: 20, paddingBottom: 40 },
  intro: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24, fontStyle: 'italic' },
  grid: { gap: 12 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 16 },
  cardIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { flex: 1, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  sealDot: { width: 10, height: 10, borderRadius: 5 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '82%' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginBottom: 20 },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  modalLabel: { fontSize: 13, fontStyle: 'italic', marginBottom: 20 },
  modalScroll: { flexGrow: 0 },
  modalMessage: { fontSize: 16, lineHeight: 28, marginBottom: 24 },
  modalFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, paddingTop: 16, paddingBottom: 8 },
  modalFooterText: { fontSize: 14, fontStyle: 'italic' },
});
