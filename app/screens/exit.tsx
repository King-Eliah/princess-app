import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Heart, Star, Sparkles, ArrowLeft, Home, LogOut } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ExitScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Create floating hearts
    const hearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: height + 50,
      delay: Math.random() * 3000,
    }));
    setFloatingHearts(hearts);
  }, []);

  const messages = [
    "Whenever you feel down, come back here. 💜",
    "You're never alone, my love. 💕",
    "I'm always here for you. 💜",
    "You make my world complete. ✨",
    "Together forever. 💜",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating Hearts Background */}
      {floatingHearts.map((heart) => (
        <View
          key={heart.id}
          style={[
            styles.floatingHeart,
            {
              left: heart.x,
              top: heart.y,
              animationDelay: `${heart.delay}ms`,
            },
          ]}
        >
          <Heart size={20} color={colors.primary} fill={colors.primary} />
        </View>
      ))}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.heartContainer, { backgroundColor: colors.primary }]}>
            <Heart size={80} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Don't Go 💜</Text>
        </View>

        {/* Message */}
        <View style={[styles.messageContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.message, { color: colors.text }]}>
            {messages[currentMessageIndex]}
          </Text>
        </View>

        {/* Comforting Words */}
        <View style={styles.comfortSection}>
          <Text style={[styles.comfortTitle, { color: colors.primary }]}>
            Remember These Things:
          </Text>
          <View style={styles.comfortList}>
            <View style={styles.comfortItem}>
              <Star size={20} color={colors.secondary} />
              <Text style={[styles.comfortText, { color: colors.text }]}>
                You are loved beyond measure
              </Text>
            </View>
            <View style={styles.comfortItem}>
              <Sparkles size={20} color={colors.secondary} />
              <Text style={[styles.comfortText, { color: colors.text }]}>
                You are my princess
              </Text>
            </View>
            <View style={styles.comfortItem}>
              <Heart size={20} color={colors.secondary} />
              <Text style={[styles.comfortText, { color: colors.text }]}>
                You are absolutely beautiful
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Home size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Stay Here</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => {
              Alert.alert(
                'See you soon, Princess! 👑',
                'Logging you out...',
                [
                  {
                    text: 'OK',
                    style: 'default',
                    onPress: () => {
                      router.replace('/screens/login');
                    },
                  },
                ]
              );
            }}
          >
            <LogOut size={24} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            I'll always be here waiting for you 💜
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeart: {
    position: 'absolute',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heartContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  messageContainer: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  comfortSection: {
    marginBottom: 40,
  },
  comfortTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  comfortList: {
    gap: 15,
  },
  comfortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  comfortText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 