import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { ChevronLeft, X, Heart, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface LoveLetter {
  id: string;
  title: string;
  month: string;
  date: string;
  preview: string;
  content: string;
  locked?: boolean;
}

const OFFICIAL_DATE = new Date('2026-03-18');

function isUnlocked(dateStr: string) {
  const d = new Date(dateStr);
  return d <= new Date();
}

const loveLetters: LoveLetter[] = [
  {
    id: 'official',
    title: 'The Day We Became Official',
    month: 'March 18, 2026',
    date: '2026-03-18',
    preview: 'Out of all the random conversations, late replies, and laughs, somehow it turned into this — us.',
    content: `To My Princess,

March 18 will always be one of my favorite days because that was the day you officially became mine, and I became yours. Out of all the random conversations, teasing, late replies, laughs, and moments that slowly brought us closer since February 18, somehow it turned into this — us.

And honestly? I wouldn't trade it for anything.

You came into my life with your boss attitude, your beautiful face, your peak fashion sense, and somehow managed to make me completely obsessed with you. You're dramatic sometimes, stubborn too, but that's part of what makes you you, and I love every bit of it.

I still smile thinking about how natural everything felt with you. Like even before we officially dated, it already felt like you were my person. My Princess.

I love the little things about you:
the way you love spicy food,
your addiction to sleep,
how excited you get over food and boba spots,
your love for black roses and money 🤭,
and the way you somehow look good doing absolutely nothing.

And our first kiss on July 18? Yeah… that memory is permanently stuck in my head.

Thank you for choosing me. Thank you for loving me the way you do. I promise I'll keep making memories with you, annoying you, spoiling you, and reminding you every single day how beautiful and special you are to me.

March 18 wasn't just the day we started dating.
It was the day my favorite person became my girlfriend.

Forever your boy,
Eliah ❤️‍🔥`,
  },
  {
    id: 'month1',
    title: 'One Month',
    month: 'April 18, 2026',
    date: '2026-04-18',
    preview: 'One month of laughs, random conversations, and all the little things that became part of my daily life.',
    content: `To My Princess,

One month with you already, and somehow you still manage to make my heart race like it's day one.

It's crazy how much can happen in just a month. One month of laughs, random conversations, flirting, memories, overthinking together, soft moments, and all the little things that slowly became part of my daily life. You became part of my routine so naturally that I genuinely can't imagine my days without you now.

You make life feel lighter.

Even when you're being bossy or dramatic 🤭, I still find myself smiling because that's my girl. My beautiful Princess.

I love how we can go from sweet romantic moments to laughing at the dumbest things in seconds. I love how comfortable you make me feel. I love how every conversation with you somehow becomes my favorite part of the day.

And can we talk about how unfairly beautiful you are? Like seriously. You walk around looking perfect while I'm just trying to survive.

Thank you for one amazing month.
One month of love.
One month of memories.
One month of being yours.

I know this is only the beginning for us, and honestly, that makes me even happier because it means I still have so much more time to love you.

Happy one month, Princess ❤️‍🔥

Forever yours,
Your Baby`,
  },
  {
    id: 'month2',
    title: 'Two Months',
    month: 'May 18, 2026',
    date: '2026-05-18',
    preview: 'In just two months, you\'ve become one of the most important people in my life.',
    content: `To My Princess,

Two months with you, and somehow I still get excited every single time I see your name pop up on my phone.

What we have means so much to me. In just two months, you've become one of the most important people in my life. You're not just my girlfriend — you're my safe place, my happiness, my favorite distraction, and the person I want to tell everything to.

I love us.

I love our memories.
I love our jokes.
I love the little hidden meanings only we understand.
I love the way we annoy each other and still end up being soft five minutes later.

You genuinely make life better.

And even after two months, I still catch myself thinking:
"Damn… that's MY girlfriend."

My Princess with the black outfits, perfect taste, beautiful smile, love for pizza and spicy food, and that confident energy that makes everyone notice her the moment she walks in.

You're special in a way I can't fully explain.

Thank you for loving me.
Thank you for staying.
Thank you for making these past two months unforgettable.

No matter how much time passes, March 18 will always be the start of something beautiful for me.

Happy two months, Princess ❤️‍🔥

With all my love,
King`,
  },
  {
    id: 'month3',
    title: 'Three Months',
    month: 'June 18, 2026',
    date: '2026-06-18',
    preview: 'A quarter of a year of being yours and you being mine.',
    content: `My love,

Three months. A quarter of a year of being yours and you being mine.

I have learned so much about you in these months. The little things. The way you carry yourself, the things that light you up, the things that hurt you. I keep all of it carefully. None of it is small to me.

I find myself building a future in my head and you are in every part of it. That is not something I say lightly. You have become the center of the life I want to live. Not because I need you to survive but because everything is simply better with you in it.

Three months. The beginning of something that will last longer than I have words for.

I love you, Christabel.

Always,
Eliah`,
  },
  {
    id: 'month4',
    title: 'Four Months',
    month: 'July 18, 2026',
    date: '2026-07-18',
    preview: 'Four months and you still surprise me.',
    content: `My Princess,

Four months. And somehow you still surprise me.

That is the thing I did not expect. The more I know you, the more there is to know. Most things become familiar with time. You just become more interesting.

I notice new things about you every week. The way your mood shifts when you are thinking hard about something. The things you say when you think nobody is really listening. The quiet version of you that is just as beautiful as every other version.

Four months of choosing you every morning and meaning it more each time.

I love you in a way that is getting harder to put into words, which is saying something because I have a lot of words for you.

All of them,
Eliah`,
  },
  {
    id: 'month5',
    title: 'Five Months',
    month: 'August 18, 2026',
    date: '2026-08-18',
    preview: 'Five months of learning what it means to be loved by you.',
    content: `Christabel,

Five months of learning what it means to be loved by you.

You love quietly and you love loudly and somehow both feel exactly right. You have never made me feel like I have to earn it or prove it or fight for it. You just give it, generously and without condition, and I try every day to be worthy of that.

I think about where I was before you and where I am now and the difference is staggering. Not because you fixed me or changed me but because being loved by you made me want to be more. More present, more patient, more everything.

Five months. I am still learning you and I hope I never stop.

With everything I have,
Eliah`,
  },
  {
    id: 'month6',
    title: 'Six Months',
    month: 'September 18, 2026',
    date: '2026-09-18',
    preview: 'Half a year, and you already feel like home.',
    content: `My Princess,

Half a year. I keep saying that to myself because it is hard to believe. Six months of you, and somehow it already feels like you have always been here.

That is the thing about the right person. They do not feel new for long. They feel like home almost immediately.

I love who I am when I am with you. I love how much you have pushed me without trying, how much I have grown just by being near someone who carries themselves the way you do. You are magnetic, Christabel. The best kind.

Six months down. I plan to be here for every six months that follows. Every anniversary. Every milestone. Every quiet Tuesday that does not feel like anything special but is, because you are in it.

Thank you for choosing me. I choose you back, every single day.

With my whole heart,
Eliah`,
  },
  {
    id: 'month7',
    title: 'Seven Months',
    month: 'October 18, 2026',
    date: '2026-10-18',
    preview: 'Seven months and my feelings refuse to plateau.',
    content: `My love,

Seven months and my feelings refuse to plateau.

I thought at some point it would level off. That is what people say. The rush fades, the excitement settles, love becomes quieter. And it has become quieter, in the best way. But it has not faded. If anything it has just dug deeper roots.

I love you differently now than I did in month one. Not less. More. Differently because I know you better. I know what keeps you up at night. I know what makes you feel small and what makes you feel powerful. I know the things you carry quietly.

And knowing all of that only makes me love you more.

Seven months. Still falling.

Yours always,
Eliah`,
  },
  {
    id: 'month8',
    title: 'Eight Months',
    month: 'November 18, 2026',
    date: '2026-11-18',
    preview: 'Eight months of you being the reason every day is worth it.',
    content: `Christabel,

Eight months of you being the reason every day is worth it.

I want you to know that on the hard days, the days when things do not go right and I feel like I am running out of patience with the world, you are what gets me through. Not because you fix anything. Just because you exist and you are mine and that alone feels like enough.

You deserve to know that. You deserve to know how much weight you carry for someone just by being present.

Eight months. You have given me more than you realize and I am still trying to give it all back.

With love that does not know how to shrink,
Eliah`,
  },
  {
    id: 'month9',
    title: 'Nine Months',
    month: 'December 18, 2026',
    date: '2026-12-18',
    preview: 'Three-quarters of a year and I am still discovering you.',
    content: `My Princess,

Three-quarters of a year and I am still discovering you.

Nine months sounds like a long time until I think about how much of you there still is to know. There are stories you have not told me yet. Versions of you I have not met. Whole parts of your heart I am still learning.

I want all of it. The easy parts and the complicated ones. The things you show freely and the things you keep close. I am patient and I am not going anywhere.

Nine months of being grateful. Nine months of wondering what I did to deserve you and deciding I do not care about the answer as long as I get to keep you.

Forever learning you,
Eliah`,
  },
  {
    id: 'month10',
    title: 'Ten Months',
    month: 'January 18, 2027',
    date: '2027-01-18',
    preview: 'Two months from a whole year and I already know. This is it.',
    content: `My love,

Two months from a whole year and I already know. This is it.

I do not need a year to tell me what I have known for a while now. You are the person. Not just the person for now but the person. Full stop.

Ten months of certainty in a world full of uncertainty. Ten months of knowing that whatever else happens, at least I have this, at least I have you.

I want to give you everything this year. A new year with new reasons to feel loved, to feel seen, to feel chosen. You will never have to wonder where you stand with me. Not for a single day.

Ten months in. Still certain.

All my love,
Eliah`,
  },
  {
    id: 'month11',
    title: 'Eleven Months',
    month: 'February 18, 2027',
    date: '2027-02-18',
    preview: 'One month away from a year and I am already emotional.',
    content: `Christabel,

One month away from a year and I am already emotional about it.

Eleven months of you. Eleven months of proof that the best decisions are the ones that terrify you a little. Choosing you terrified me because I knew how much I had to lose if it did not work. And it worked. It is working. Every single day it is working.

I have been thinking about the version of me that existed before you and I genuinely cannot connect with him anymore. He did not know what this felt like. He did not know that love could be this steady and this exciting at the same time.

One more month and we hit a year. I cannot wait to celebrate it with you.

Yours for eleven months and counting,
Eliah`,
  },
  {
    id: 'month12',
    title: 'One Year',
    month: 'March 18, 2027',
    date: '2027-03-18',
    preview: 'One year. I have been thinking about how to write this for weeks.',
    content: `My dearest Christabel,

One year.

I have been thinking about how to write this for weeks and I still do not think words are enough. But I will try.

One year ago I became yours and you became mine, and I want you to know that not a single day of it has felt ordinary to me. You are not ordinary to me. You never will be.

This year you showed me what it means to be loved with patience, with kindness, with joy. You showed me that love does not have to be complicated or painful. It can just be warm. It can just be right.

I fell in love with you slowly and then all at once, and then I kept falling. I am still falling. I think that is what it is like when you find the right person. There is no bottom to it. There is just more.

A whole year of your laugh. A whole year of your voice. A whole year of getting to call you mine.

I am the luckiest man alive. And I plan to keep being yours for every year that comes after this one.

Happy first anniversary, my Princess. I love you more than I knew I was capable of.

Forever and completely yours,
Eliah`,
  },
];

export default function LoveLetterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);

  const openLetter = (letter: LoveLetter) => {
    if (!isUnlocked(letter.date)) return;
    setSelectedLetter(letter);
  };

  const closeLetter = () => setSelectedLetter(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#1a0030', '#09060F']} style={styles.headerGrad}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.headerIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Heart size={22} color="#fff" fill="#fff" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Love Letters</Text>
          <Text style={styles.headerSub}>From Eliah, with everything</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loveLetters.map((letter) => {
          const unlocked = isUnlocked(letter.date);
          return (
            <TouchableOpacity
              key={letter.id}
              activeOpacity={unlocked ? 0.75 : 1}
              onPress={() => openLetter(letter)}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: unlocked ? colors.cardBorder : colors.border, opacity: unlocked ? 1 : 0.55 }]}
            >
              <LinearGradient
                colors={unlocked ? ['#E91E8C22', '#9C27B011'] : ['#ffffff08', '#ffffff04']}
                style={styles.cardGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardLeft}>
                  <LinearGradient
                    colors={unlocked ? ['#E91E8C', '#9C27B0'] : ['#444', '#333']}
                    style={styles.cardDot}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  >
                    {unlocked
                      ? <Heart size={14} color="#fff" fill="#fff" />
                      : <Lock size={13} color="#fff" />}
                  </LinearGradient>
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardMonth, { color: unlocked ? colors.primary : colors.textSecondary }]}>{letter.month}</Text>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{letter.title}</Text>
                  {unlocked
                    ? <Text style={[styles.cardPreview, { color: colors.textSecondary }]} numberOfLines={2}>{letter.preview}</Text>
                    : <Text style={[styles.cardPreview, { color: colors.textSecondary }]}>Unlocks on {letter.month}</Text>}
                </View>
                {unlocked && (
                  <View style={[styles.readTag, { backgroundColor: colors.primary + '22' }]}>
                    <Text style={[styles.readTxt, { color: colors.primary }]}>Read</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}

        <View style={styles.footerRow}>
          <Heart size={14} color={colors.primary} fill={colors.primary} />
          <Text style={[styles.footerTxt, { color: colors.textSecondary }]}>
            {loveLetters.filter(l => isUnlocked(l.date)).length} of {loveLetters.length} letters unlocked
          </Text>
        </View>
      </ScrollView>

      {/* Full-screen letter reader */}
      <Modal visible={!!selectedLetter} animationType="slide" transparent={false} onRequestClose={closeLetter} statusBarTranslucent>
        <LinearGradient colors={['#0e0020', '#160B25', '#09060F']} style={{ flex: 1 }}>
          <View style={styles.readerHeader}>
            <TouchableOpacity onPress={closeLetter} style={styles.closeBtn}>
              <X size={22} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <View style={styles.readerHeaderCenter}>
              <Text style={styles.readerMonth}>{selectedLetter?.month}</Text>
              <Text style={styles.readerTitle}>{selectedLetter?.title}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.readerScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.letterPaper}>
              <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.paperAccent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              <Text style={styles.letterBody}>{selectedLetter?.content}</Text>
              <View style={styles.sealRow}>
                <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.seal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Heart size={18} color="#fff" fill="#fff" />
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerGrad: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 8 },
  headerIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },

  scroll: { padding: 16, paddingBottom: 100 },

  card: { borderRadius: 16, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  cardGrad: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  cardLeft: { alignItems: 'center' },
  cardDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, gap: 3 },
  cardMonth: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardPreview: { fontSize: 12, lineHeight: 18 },
  readTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  readTxt: { fontSize: 12, fontWeight: '700' },

  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 8 },
  footerTxt: { fontSize: 12 },

  // Reader
  readerHeader: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingTop: 62, paddingBottom: 16, paddingHorizontal: 16,
  },
  closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  readerHeaderCenter: { flex: 1, alignItems: 'center' },
  readerMonth: { fontSize: 11, color: '#E91E8C', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  readerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },

  readerScroll: { padding: 20, paddingBottom: 80 },
  letterPaper: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(233,30,140,0.2)',
    overflow: 'hidden',
  },
  paperAccent: { height: 4, width: '100%' },
  letterBody: {
    fontSize: 16,
    lineHeight: 30,
    color: 'rgba(255,255,255,0.88)',
    padding: 28,
    fontFamily: 'Georgia',
  },
  sealRow: { alignItems: 'center', paddingBottom: 28 },
  seal: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
