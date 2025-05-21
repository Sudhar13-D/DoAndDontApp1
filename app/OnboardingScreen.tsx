import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from 'expo-router/build/global-state/routing';

export default function OnboardingScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const handleStart = async () => {
    if (name && goal) {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('biggestGoal', goal);
      await AsyncStorage.setItem('firstLaunchDone', 'true');
      navigation.navigate('HomeScreen');
      navigation.replace('Goal'); // Replace with your goal screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Enter your biggest goal:</Text>
      <TextInput style={styles.input} value={goal} onChangeText={setGoal} />

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 18, marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
