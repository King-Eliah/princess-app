import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  // Simple redirect to login
  return <Redirect href="/screens/login" />;
}