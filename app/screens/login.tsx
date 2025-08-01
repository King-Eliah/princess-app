import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Lock, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username.toLowerCase() === 'princess' && password === 'i love you') {
      // Simple success - no complex animations
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } else {
      Alert.alert(
        "Oops! 💜", 
        "That's not quite right, Princess. Try again! 😊",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  return (
    <LinearGradient colors={['#000000', '#1a0033', '#000000']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Heart size={80} color="#A020F0" fill="#A020F0" />
          <Text style={styles.title}>To My Princess</Text>
          <Text style={styles.subtitle}>A special place made just for you 💜</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color="#A020F0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#A020F0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#A020F0', '#FF69B4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Enter ✨</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>Hint: You know who you are to me 💫</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(160, 32, 240, 0.3)',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    alignItems: 'center',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});