import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Habit = {
  id: string;
  title: string;
  isDone: boolean;
  history: { [date: string]: boolean }; // e.g., "2025-05-14": true/false
};

export default function HabitTrackerScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const router = useRouter();

  useEffect(() => {
    initializeHabits();
  }, []);

  const initializeHabits = async () => {
    await checkDailyUpdate();
    const stored = await AsyncStorage.getItem('habits');
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  };

  const getToday = () => new Date().toISOString().split('T')[0];

  const checkDailyUpdate = async () => {
    const lastDate = await AsyncStorage.getItem('lastDate');
    const today = getToday();
    if (lastDate !== today) {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) {
        const habitArray: Habit[] = JSON.parse(stored).map((habit: Habit) => {
          if (!(habit.history && habit.history[today])) {
            habit.history = habit.history || {};
            habit.history[today] = false; // default to not completed
          }
          habit.isDone = false;
          return habit;
        });
        await AsyncStorage.setItem('habits', JSON.stringify(habitArray));
      }
      await AsyncStorage.setItem('lastDate', today);
    }
  };

  const toggleHabit = async (id: string) => {
    const today = getToday();
    const updated = habits.map(habit => {
      if (habit.id === id) {
        const isNowDone = !habit.isDone;
        habit.isDone = isNowDone;
        habit.history = habit.history || {};
        habit.history[today] = isNowDone;
      }
      return habit;
    });
    setHabits(updated);
    await AsyncStorage.setItem('habits', JSON.stringify(updated));
  };

  const addHabit = async () => {
    if (!newHabitTitle.trim()) return Alert.alert('Please enter a habit title');
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle.trim(),
      isDone: false,
      history: {},
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    await AsyncStorage.setItem('habits', JSON.stringify(updated));
    setNewHabitTitle('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <Button title="View Log" onPress={() => router.push('/log')} />
      </View>

      <Text style={styles.header}>Today's Habits</Text>
      {habits.map(habit => (
        <View key={habit.id} style={styles.habitItem}>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <Switch value={habit.isDone} onValueChange={() => toggleHabit(habit.id)} />
        </View>
      ))}

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Add new habit..."
          value={newHabitTitle}
          onChangeText={setNewHabitTitle}
        />
        <Button title="Add" onPress={addHabit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  topBar: {
    alignItems: 'flex-end'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  habitTitle: {
    fontSize: 16
  },
  inputSection: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingVertical: 4
  }
});
