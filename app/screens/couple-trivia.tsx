import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  { q: "Where did we first meet?", options: ["Cafe","Park","Party","School"], correct: 0 },
  { q: "What's my favourite color?", options: ["Pink","Blue","Purple","Green"], correct: 2 },
  { q: "What's my favorite snack?", options: ["Pizza","Boba","Chips","Sushi"], correct: 1 },
  { q: "Where did we go on our first date?", options: ["Cinema","Restaurant","Beach","Museum"], correct: 1 },
  { q: "What's my favorite song?", options: ["Hope","Dance","Sun","Moon"], correct: 0 },
];

export default function CoupleTrivia() {
  const { colors } = useTheme();
  const router = useRouter();
  const [player, setPlayer] = useState(1);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (choice: number) => {
    const correct = questions[index].correct;
    if (choice === correct) {
      const next = [...scores];
      next[player - 1] += 1;
      setScores(next);
    }
    setSelected(choice);
    setTimeout(() => {
      setSelected(null);
      if (player === 1) {
        setPlayer(2);
      } else {
        setPlayer(1);
        const nextIndex = index + 1;
        if (nextIndex >= questions.length) {
          finishGame();
        } else {
          setIndex(nextIndex);
        }
      }
    }, 700);
  };

  const finishGame = async () => {
    let message = `Player 1: ${scores[0]} - Player 2: ${scores[1]}`;
    let award = 0;
    if (scores[0] > scores[1]) { message += '\nPlayer 1 wins!'; award = 5; }
    else if (scores[1] > scores[0]) { message += '\nPlayer 2 wins!'; award = 5; }
    else { message += "\nIt's a tie!"; award = 2; }

    try {
      const prevStr = await AsyncStorage.getItem('stars');
      const prev = Number(prevStr || '0');
      await AsyncStorage.setItem('stars', String(prev + award));
    } catch {}

    Alert.alert('Game Over', `${message}\n\nYou earned ${award} stars!`, [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
        <Text style={[styles.title, { color: colors.text }]}>Couple Trivia</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Player {player}'s turn • Question {index + 1} of {questions.length}</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.question, { color: colors.text }]}>{questions[index].q}</Text>
          {questions[index].options.map((opt, i) => (
            <TouchableOpacity key={i} onPress={() => handleAnswer(i)} style={[styles.option, { backgroundColor: colors.background, borderColor: colors.border }, selected === i && { opacity: 0.6 }]}>
              <Text style={{ color: colors.text }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scoreRow}>
          <Text style={{ color: colors.text }}>Scores:</Text>
          <Text style={{ color: colors.textSecondary }}>P1 {scores[0]}  •  P2 {scores[1]}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  card: { borderRadius: 16, padding: 20, marginBottom: 20 },
  question: { fontSize: 18, fontWeight: '700', marginBottom: 16, lineHeight: 26 },
  option: { borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
});
