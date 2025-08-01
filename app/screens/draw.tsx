import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Palette, RotateCcw, Save, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');
const canvasWidth = width - 40;
const canvasHeight = height * 0.6;

const colors = ['#A020F0', '#FF69B4', '#FFFFFF', '#FFD700', '#00FFFF', '#FF6B6B'];

export default function DrawScreen() {
  const { colors: themeColors } = useTheme();
  const [currentColor, setCurrentColor] = useState('#A020F0');
  const [drawingPaths, setDrawingPaths] = useState([]);

  const clearCanvas = () => {
    setDrawingPaths([]);
  };

  const saveDrawing = () => {
    // In a real app, you would save the drawing
    alert('Drawing saved! 💜');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Palette size={40} color={themeColors.primary} />
        <Text style={[styles.title, { color: themeColors.text }]}>Draw Together</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Create something beautiful 💜</Text>
      </View>

      {/* Color Palette */}
      <View style={styles.colorPalette}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              currentColor === color && styles.selectedColor
            ]}
            onPress={() => setCurrentColor(color)}
          />
        ))}
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={[styles.canvas, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.canvasPlaceholder, { color: themeColors.text }]}>Drawing canvas coming soon! ✨</Text>
          <Text style={[styles.canvasSubtext, { color: themeColors.textSecondary }]}>This feature will be available in the next update</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: themeColors.surface }]} onPress={clearCanvas}>
          <RotateCcw size={20} color={themeColors.text} />
          <Text style={[styles.controlText, { color: themeColors.text }]}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: themeColors.surface }]} onPress={saveDrawing}>
          <Save size={20} color={themeColors.text} />
          <Text style={[styles.controlText, { color: themeColors.text }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Heart size={20} color={themeColors.primary} />
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>Draw with love 💜</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  canvasContainer: {
    flex: 1,
    marginBottom: 20,
  },
  canvas: {
    width: canvasWidth,
    height: canvasHeight,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasPlaceholder: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  canvasSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  controlText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
});