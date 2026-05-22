import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const emojiPool = ['🍕','🍔','🍟','🌮','🍣','🍝','🍜','🍩','🍰','🍪','🍨'];

export default function EmojiMatch() {
  const { colors } = useTheme();
  const router = useRouter();
  const rounds = 5;
  const [round, setRound] = useState(0);
  const [player, setPlayer] = useState(1);
  const [scores, setScores] = useState([0, 0]);
  const [target, setTarget] = useState(emojiPool[Math.floor(Math.random() * emojiPool.length)]);

  const genOptions = (t: string) => {
    const opts = new Set<string>([t]);
    while (opts.size < 4) opts.add(emojiPool[Math.floor(Math.random() * emojiPool.length)]);
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  const [options, setOptions] = useState<string[]>(() => genOptions(target));

  const handlePick = async (choice: string) => {
    const newScores = [...scores];
    if (choice === target) { newScores[player - 1] += 1; setScores(newScores); }

    if (player === 1) {
      setPlayer(2);
    } else {
      const nextRound = round + 1;
      if (nextRound >= rounds) {
        await finishGame(newScores);
      } else {
        const nextTarget = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        setTarget(nextTarget);
        setOptions(genOptions(nextTarget));
        setRound(nextRound);
        setPlayer(1);
      }
    }
  };

  const finishGame = async (finalScores: number[]) => {
    let message = `Player 1: ${finalScores[0]} - Player 2: ${finalScores[1]}`;
    const award = 1;
    if (finalScores[0] > finalScores[1]) { message += '\nPlayer 1 wins!'; }
    else if (finalScores[1] > finalScores[0]) { message += '\nPlayer 2 wins!'; }
    else { message += "\nIt's a tie!"; }

    try {
      const prevStr = await AsyncStorage.getItem('stars');
      await AsyncStorage.setItem('stars', String(Number(prevStr || '0') + award));
    } catch {}

    Alert.alert('Round Over', `${message}\n\nYou earned ${award} stars!`, [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} bounces={false} overScrollMode="never">
        <Text style={[styles.title, { color: colors.text }]}>Emoji Match</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Player {player}'s turn • Round {round + 1} of {rounds}</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.target, { color: colors.text }]}>{target}</Text>
          <Text style={[styles.prompt, { color: colors.textSecondary }]}>Find this emoji!</Text>
          <View style={styles.optsRow}>
            {options.map((o, i) => (
              <TouchableOpacity key={i} style={[styles.opt, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => handlePick(o)}>
                <Text style={{ fontSize: 32 }}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  card: { borderRadius: 16, padding: 24, marginBottom: 20, alignItems: 'center' },
  target: { fontSize: 64, marginBottom: 8 },
  prompt: { fontSize: 14, marginBottom: 20 },
  optsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  opt: { width: 72, height: 72, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
});
