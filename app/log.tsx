import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Habit = {
  id: string;
  title: string;
  history: { [date: string]: boolean };
};

export default function LogScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const stored = await AsyncStorage.getItem('habits');
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  };

  const getMonthFromDate = (dateStr: string) => dateStr.slice(0, 7); // "YYYY-MM"

  const calculateStats = (habit: Habit) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-05"
    const entries = Object.entries(habit.history || {});
    const thisMonth = entries.filter(([date]) => getMonthFromDate(date) === currentMonth);

    const totalDays = thisMonth.length;
    const completedDays = thisMonth.filter(([, done]) => done).length;
    const consistency = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return { completedDays, totalDays, consistency };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Habit Log</Text>
      {habits.length === 0 && <Text>No habits found.</Text>}
      {habits.map(habit => {
        const { completedDays, totalDays, consistency } = calculateStats(habit);
        return (
          <View key={habit.id} style={styles.habitCard}>
            <Text style={styles.habitTitle}>{habit.title}</Text>
            <Text>Completed: {completedDays} / {totalDays} days this month</Text>
            <Text>Consistency: {consistency}%</Text>
          </View>
        );
      })}
      <Text style={styles.back} onPress={() => router.back()}>&larr; Back</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  habitCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  back: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline'
  }
});
