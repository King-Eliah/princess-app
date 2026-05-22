import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    if (username.toLowerCase() === 'princess' && password === 'i love you') {
      setLoading(true);
      setTimeout(() => router.replace('/(tabs)'), 600);
    } else {
      shake();
      Alert.alert('Try again', 'Those credentials are not quite right.');
    }
  };

  return (
    <LinearGradient colors={['#09060F', '#160B25', '#09060F']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.content}>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.logoGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Heart size={44} color="#fff" fill="#fff" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>A private sanctuary made just for you</Text>

          {/* Form */}
          <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
            <View style={styles.inputWrap}>
              <User size={18} color="rgba(233,30,140,0.7)" />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputWrap}>
              <Lock size={18} color="rgba(233,30,140,0.7)" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                {showPassword
                  ? <EyeOff size={18} color="rgba(255,255,255,0.4)" />
                  : <Eye size={18} color="rgba(255,255,255,0.4)" />
                }
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} disabled={loading} style={styles.btnWrap}>
              <LinearGradient colors={['#E91E8C', '#9C27B0']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>{loading ? 'Opening...' : 'Enter'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.hint}>Hint: you know who you are to me</Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  kav: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logoWrap: { alignSelf: 'center', marginBottom: 32 },
  logoGrad: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E8C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
  title: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 8, letterSpacing: 0.3 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: 48, fontStyle: 'italic' },
  form: { gap: 16, marginBottom: 32 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(233,30,140,0.25)',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 56,
    gap: 12,
  },
  input: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  eyeBtn: { padding: 4 },
  btnWrap: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  btn: { height: 56, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  hint: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', fontStyle: 'italic' },
});
