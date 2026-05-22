import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ChevronLeft, Check, Eye, Delete } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

// 10-row x 8-col crossword
// null = blocked cell
const SOLUTION: (string | null)[][] = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, 'B', 'W', 'Q', null],
  [null, null, null, 'H', 'L', 'I', 'U', null],
  [null, 'G', 'M', 'O', 'A', 'F', 'E', null],
  ['P',  'R', 'I', 'N', 'C', 'E', 'S', 'S'],
  ['I',  'E', 'N', 'E', 'K', 'Y', 'T', 'L'],
  ['Z',  'M', 'E', 'Y', null, null, null, 'E'],
  ['Z',  'L', null, null, null, null, null, 'E'],
  ['A',  'I', null, null, null, null, null, 'P'],
  [null, 'N', null, null, null, null, null, null],
];

const CELL_NUM: (number | null)[][] = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, 2,    3,    4,    null],
  [null, null, null, 5,    null, null, null, null],
  [null, 6,    7,    null, null, null, null, null],
  [1,    null, null, null, null, null, null, 8],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];

interface WordDef {
  num: number;
  dir: 'across' | 'down';
  row: number;
  col: number;
  len: number;
  clue: string;
}

const WORDS: WordDef[] = [
  { num: 1, dir: 'across', row: 4, col: 0, len: 8, clue: 'What he calls her' },
  { num: 1, dir: 'down',   row: 4, col: 0, len: 5, clue: 'One food you\'d probably fight for' },
  { num: 2, dir: 'down',   row: 1, col: 4, len: 5, clue: 'The color that owns your wardrobe' },
  { num: 3, dir: 'down',   row: 1, col: 5, len: 5, clue: 'Your unofficial government name' },
  { num: 4, dir: 'down',   row: 1, col: 6, len: 5, clue: 'What the Princess must complete today' },
  { num: 5, dir: 'down',   row: 2, col: 3, len: 5, clue: 'A sweet nickname (also what he calls you)' },
  { num: 6, dir: 'down',   row: 3, col: 1, len: 7, clue: 'What you transform into when causing problems' },
  { num: 7, dir: 'down',   row: 3, col: 2, len: 4, clue: 'The correct answer, always' },
  { num: 8, dir: 'down',   row: 4, col: 7, len: 5, clue: 'Your favorite activity besides bothering me' },
];

const KEYS = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];

function getCellsForWord(word: WordDef): [number, number][] {
  return Array.from({ length: word.len }, (_, i) =>
    word.dir === 'across' ? [word.row, word.col + i] : [word.row + i, word.col] as [number, number]
  );
}

function getWordFor(row: number, col: number, dir: 'across' | 'down'): WordDef | undefined {
  return WORDS.find(w => {
    if (w.dir !== dir) return false;
    if (dir === 'across') return w.row === row && col >= w.col && col < w.col + w.len;
    return w.col === col && row >= w.row && row < w.row + w.len;
  });
}

export default function CrosswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [answers, setAnswers] = useState<string[][]>(
    () => SOLUTION.map(row => row.map(() => ''))
  );
  const [selRow, setSelRow] = useState<number | null>(null);
  const [selCol, setSelCol] = useState<number | null>(null);
  const [dir, setDir] = useState<'across' | 'down'>('across');
  const [checked, setChecked] = useState(false);

  const activeWord = selRow !== null && selCol !== null ? getWordFor(selRow, selCol, dir) : undefined;

  const isInActive = (r: number, c: number) => {
    if (!activeWord) return false;
    return getCellsForWord(activeWord).some(([cr, cc]) => cr === r && cc === c);
  };

  const handleCellPress = (r: number, c: number) => {
    if (SOLUTION[r][c] === null) return;
    if (r === selRow && c === selCol) {
      const next = dir === 'across' ? 'down' : 'across';
      if (getWordFor(r, c, next)) setDir(next);
    } else {
      setSelRow(r);
      setSelCol(c);
      if (getWordFor(r, c, 'across')) setDir('across');
      else setDir('down');
    }
    setChecked(false);
  };

  const advanceCursor = (r: number, c: number) => {
    const word = getWordFor(r, c, dir);
    if (!word) return;
    const cells = getCellsForWord(word);
    const idx = cells.findIndex(([cr, cc]) => cr === r && cc === c);
    if (idx < cells.length - 1) {
      setSelRow(cells[idx + 1][0]);
      setSelCol(cells[idx + 1][1]);
    }
  };

  const handleKey = (letter: string) => {
    if (selRow === null || selCol === null) return;
    const next = answers.map(row => [...row]);
    next[selRow][selCol] = letter;
    setAnswers(next);
    advanceCursor(selRow, selCol);
    setChecked(false);
  };

  const handleDelete = () => {
    if (selRow === null || selCol === null) return;
    const next = answers.map(row => [...row]);
    if (next[selRow][selCol]) {
      next[selRow][selCol] = '';
      setAnswers(next);
    } else {
      const word = getWordFor(selRow, selCol, dir);
      if (word) {
        const cells = getCellsForWord(word);
        const idx = cells.findIndex(([r, c]) => r === selRow && c === selCol);
        if (idx > 0) {
          const [pr, pc] = cells[idx - 1];
          next[pr][pc] = '';
          setAnswers(next);
          setSelRow(pr);
          setSelCol(pc);
        }
      }
    }
  };

  const handleCheck = () => {
    setChecked(true);
    const allCorrect = SOLUTION.every((row, r) =>
      row.every((cell, c) => cell === null || answers[r][c] === cell)
    );
    if (allCorrect) Alert.alert('You got it, Princess!', 'Every answer is correct.');
    else Alert.alert('Not quite', 'Some answers need fixing. Incorrect cells are highlighted in red.');
  };

  const handleReveal = () => {
    Alert.alert('Reveal answers?', 'This will show all correct answers.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reveal', onPress: () => setAnswers(SOLUTION.map(row => row.map(c => c ?? ''))) },
    ]);
  };

  const getCellState = (r: number, c: number): 'blocked' | 'active-word' | 'selected' | 'normal' => {
    if (SOLUTION[r][c] === null) return 'blocked';
    if (r === selRow && c === selCol) return 'selected';
    if (isInActive(r, c)) return 'active-word';
    return 'normal';
  };

  const getCellBg = (state: string): string => {
    if (state === 'blocked') return colors.background;
    if (state === 'selected') return colors.primary;
    if (state === 'active-word') return colors.primary + '30';
    return colors.surface;
  };

  const getLetterColor = (r: number, c: number, state: string): string => {
    if (checked && SOLUTION[r][c] !== null) {
      if (answers[r][c] && answers[r][c] !== SOLUTION[r][c]) return '#EF4444';
    }
    if (state === 'selected') return '#fff';
    return colors.text;
  };

  const acrossClues = WORDS.filter(w => w.dir === 'across');
  const downClues = WORDS.filter(w => w.dir === 'down');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.text }]}>Crossword</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>About us</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={handleCheck} style={[styles.headerBtn, { backgroundColor: colors.primary }]}>
            <Check size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReveal} style={[styles.headerBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
            <Eye size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Active clue banner */}
        {activeWord && (
          <View style={[styles.clueBanner, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '50' }]}>
            <Text style={[styles.clueNum, { color: colors.primary }]}>{activeWord.num} {activeWord.dir === 'across' ? 'Across' : 'Down'}</Text>
            <Text style={[styles.clueText, { color: colors.text }]}>{activeWord.clue}</Text>
          </View>
        )}

        {/* Grid */}
        <View style={styles.gridWrap}>
          {SOLUTION.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell, c) => {
                const state = getCellState(r, c);
                const num = CELL_NUM[r][c];
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.cell, { backgroundColor: getCellBg(state), borderColor: state === 'blocked' ? 'transparent' : colors.border }]}
                    onPress={() => handleCellPress(r, c)}
                    disabled={state === 'blocked'}
                    activeOpacity={0.7}
                  >
                    {state !== 'blocked' && (
                      <>
                        {num !== null && <Text style={[styles.cellNum, { color: state === 'selected' ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]}>{num}</Text>}
                        <Text style={[styles.cellLetter, { color: getLetterColor(r, c, state) }]}>
                          {answers[r][c]}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Clues */}
        <View style={styles.cluesSection}>
          <Text style={[styles.clueHeader, { color: colors.primary }]}>Across</Text>
          {acrossClues.map(w => (
            <TouchableOpacity key={`${w.num}a`} onPress={() => { setSelRow(w.row); setSelCol(w.col); setDir('across'); }} style={[styles.clueRow, { borderColor: colors.border }]}>
              <Text style={[styles.clueNumInList, { color: colors.primary }]}>{w.num}</Text>
              <Text style={[styles.clueInList, { color: colors.text }]}>{w.clue}</Text>
            </TouchableOpacity>
          ))}
          <Text style={[styles.clueHeader, { color: colors.primary, marginTop: 16 }]}>Down</Text>
          {downClues.map(w => (
            <TouchableOpacity key={`${w.num}d`} onPress={() => { setSelRow(w.row); setSelCol(w.col); setDir('down'); }} style={[styles.clueRow, { borderColor: colors.border }]}>
              <Text style={[styles.clueNumInList, { color: colors.primary }]}>{w.num}</Text>
              <Text style={[styles.clueInList, { color: colors.text }]}>{w.clue}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Keyboard */}
      <View style={[styles.keyboard, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.keyRow}>
          {KEYS.slice(0, 10).map(k => (
            <TouchableOpacity key={k} style={[styles.key, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => handleKey(k)}>
              <Text style={[styles.keyText, { color: colors.text }]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keyRow}>
          {KEYS.slice(10, 19).map(k => (
            <TouchableOpacity key={k} style={[styles.key, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => handleKey(k)}>
              <Text style={[styles.keyText, { color: colors.text }]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keyRow}>
          {KEYS.slice(19).map(k => (
            <TouchableOpacity key={k} style={[styles.key, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => handleKey(k)}>
              <Text style={[styles.keyText, { color: colors.text }]}>{k}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.key, styles.delKey, { backgroundColor: colors.primary }]} onPress={handleDelete}>
            <Delete size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const CELL = 36;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 62, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, paddingBottom: 24 },
  clueBanner: { borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 20, gap: 4 },
  clueNum: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  clueText: { fontSize: 15, fontWeight: '500' },
  gridWrap: { alignSelf: 'center', marginBottom: 28 },
  row: { flexDirection: 'row' },
  cell: { width: CELL, height: CELL, borderWidth: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cellNum: { position: 'absolute', top: 1, left: 2, fontSize: 8, fontWeight: '700' },
  cellLetter: { fontSize: 16, fontWeight: '700' },
  cluesSection: { gap: 4 },
  clueHeader: { fontSize: 14, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  clueRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, alignItems: 'flex-start' },
  clueNumInList: { fontSize: 14, fontWeight: '700', width: 20 },
  clueInList: { flex: 1, fontSize: 14, lineHeight: 20 },
  keyboard: { borderTopWidth: 1, paddingVertical: 8, paddingHorizontal: 4, gap: 4 },
  keyRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  key: { width: 32, height: 40, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  delKey: { width: 48 },
  keyText: { fontSize: 14, fontWeight: '600' },
});
