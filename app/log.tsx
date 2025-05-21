import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Habit = {
  id: string;
  title: string;
  isDone: boolean;
  history: Record<string, boolean>;
};

export default function LogScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allDates, setAllDates] = useState<string[]>([]);

  useEffect(() => {
    const loadLog = async () => {
      const stored = await AsyncStorage.getItem('habits');
      if (!stored) return;

      const parsed: Habit[] = JSON.parse(stored);
      setHabits(parsed);

      const dateSet = new Set<string>();
      parsed.forEach(habit => {
        Object.keys(habit.history).forEach(date => dateSet.add(date));
      });

      const sortedDates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
      setAllDates(sortedDates);
    };

    loadLog();
  }, []);

  const getHabitConsistency = (habit: Habit) => {
    const total = allDates.length;
    const completed = allDates.filter(date => habit.history[date]).length;
    return total === 0 ? '0%' : `${Math.round((completed / total) * 100)}%`;
  };

  const getDateConsistency = (date: string) => {
    const total = habits.length;
    const completed = habits.filter(habit => habit.history[date]).length;
    return total === 0 ? '0%' : `${Math.round((completed / total) * 100)}%`;
  };

  return (
    <ScrollView style={styles.container} horizontal>
      <View>
        {/* Header Row */}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.headerCell]}>Date</Text>
          {habits.map(habit => (
            <Text key={habit.id} style={[styles.cell, styles.headerCell]}>
              {habit.title}
            </Text>
          ))}
          <Text style={[styles.cell, styles.headerCell]}>Daily Consistency</Text>
        </View>

        {/* Data Rows */}
        {allDates.map(date => (
          <View key={date} style={styles.row}>
            <Text style={styles.cell}>{date}</Text>
            {habits.map(habit => {
              const status = habit.history[date];
              return (
                <Text
                  key={habit.id + date}
                  style={[
                    styles.cell,
                    { color: status ? 'green' : 'red' },
                  ]}
                >
                  {status ? 'Completed' : 'Not Completed'}
                </Text>
              );
            })}
            <Text style={[styles.cell, { fontWeight: 'bold' }]}>
              {getDateConsistency(date)}
            </Text>
          </View>
        ))}

        {/* Final Row: Per-Habit Consistency */}
        <View style={[styles.row, { backgroundColor: '#f0f0f0' }]}>
          <Text style={[styles.cell, styles.headerCell]}>Habit Consistency</Text>
          {habits.map(habit => (
            <Text key={habit.id + '-consistency'} style={[styles.cell, styles.headerCell]}>
              {getHabitConsistency(habit)}
            </Text>
          ))}
          <Text style={styles.cell}></Text> {/* Empty cell to align */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
  },
  cell: {
    width: 130,
    textAlign: 'center',
    fontSize: 14,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});