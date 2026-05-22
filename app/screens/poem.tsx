import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { FileText, ChevronLeft, X, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

interface Poem {
  id: string;
  title: string;
  content: string;
  theme: string;
}

const poems: Poem[] = [
  {
    id: '1',
    title: 'My Princess',
    theme: 'Love & Light',
    content: `In a world of endless stars above,
You shine the brightest, my love.
Your laughter echoes through my days,
In countless beautiful ways.

Your kindness flows like gentle rain,
Washing away all my pain.
With every smile, with every glance,
You put my heart in a trance.

Princess, you're my guiding light,
Making everything feel right.
In your eyes I see my home,
Never again will I roam.

Forever grateful, forever true,
My heart belongs only to you.
My beautiful, wonderful Princess dear,
You're everything I hold near.`,
  },
  {
    id: '2',
    title: 'Queen of My Heart',
    theme: 'Devotion & Dreams',
    content: `You are the queen upon my throne,
With you, I'm never alone.
Your grace and beauty know no bounds,
In your love, my soul is found.

Like a melody soft and sweet,
Your voice makes my life complete.
Every moment by your side,
Fills my heart with joy and pride.

In dreams and in reality,
You're my perfect fantasy.
Your wisdom guides me through each day,
You chase all my fears away.

My Queen, my love, my everything,
You make my heart forever sing.
In this journey we call life,
I'm blessed to call you mine, my wife.`,
  },
  {
    id: '3',
    title: 'Forever Yours',
    theme: 'Eternal Promise',
    content: `Through seasons that change and years that pass,
Our love will forever last.
Like the moon that lights the night,
You fill my world with gentle light.

Your touch is magic on my skin,
A warmth that radiates within.
Your words are poetry to my ears,
They calm my worries, ease my fears.

I promise you my heart so true,
Everything I am belongs to you.
Through storms and sunshine, joy and pain,
Together, forever we'll remain.

My darling, my love, my soulmate divine,
I'm grateful that you are mine.
Until the stars fall from the sky,
It's you and me, you and I.`,
  },
];

export default function PoemScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openPoem = (poem: Poem) => {
    setSelectedPoem(poem);
    setShowModal(true);
  };

  const closePoem = () => {
    setShowModal(false);
    setTimeout(() => setSelectedPoem(null), 300);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Poetry Collection</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Verses from my heart
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Poems Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {poems.map((poem) => (
          <TouchableOpacity
            key={poem.id}
            style={[styles.poemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => openPoem(poem)}
            activeOpacity={0.7}
          >
            <View style={[styles.poemIcon, { backgroundColor: colors.primary }]}>
              <FileText size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.poemTitle, { color: colors.text }]} numberOfLines={2} ellipsizeMode="tail">
              {poem.title}
            </Text>
            <Text style={[styles.poemTheme, { color: colors.textSecondary }]}>
              {poem.theme}
            </Text>
            <View style={[styles.readButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.readButtonText}>Read Poem</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Heart size={20} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Each verse crafted with love
          </Text>
        </View>
      </ScrollView>

      {/* Poem Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closePoem}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
                <FileText size={24} color="#FFFFFF" />
              </View>
              <TouchableOpacity onPress={closePoem} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.poemContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedPoem && (
                <>
                  <Text style={[styles.modalTitle, { color: colors.primary }]}>
                    {selectedPoem.title}
                  </Text>
                  <Text style={[styles.modalTheme, { color: colors.textSecondary }]}>
                    {selectedPoem.theme}
                  </Text>
                  <Text style={[styles.modalText, { color: colors.text }]}>
                    {selectedPoem.content}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  poemCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  poemIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  poemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  poemTheme: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  readButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poemContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  modalTheme: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalText: {
    fontSize: 18,
    lineHeight: 32,
    fontFamily: 'serif',
    textAlign: 'center',
  },
});