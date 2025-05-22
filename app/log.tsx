import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

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

  const getOverallConsistency = () => {
    const total = habits.length * allDates.length;
    if (total === 0) return 0;

    const completed = habits.reduce((sum, habit) => {
      return sum + allDates.filter(date => habit.history[date]).length;
    }, 0);

    return completed / total;
  };

  const getDailyConsistency = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => habit.history[today]).length;
    return habits.length === 0 ? 0 : completedToday / habits.length;
  };

  const getConsistency = (habit: Habit) => {
    const total = allDates.length;
    const completed = allDates.filter(date => habit.history[date]).length;
    return total === 0 ? '0%' : `${Math.round((completed / total) * 100)}%`;
  };

  return (
    <ScrollView style={styles.container} horizontal={false}>
      {/* Consistency Summary */}
      <View style={styles.consistencyContainer}>
        <View style={styles.progressSection}>
          <Progress.Circle
            size={100}
            progress={getOverallConsistency()}
            showsText
            formatText={() => `${Math.round(getOverallConsistency() * 100)}%`}
            color="#007AFF"
          />
          <Text style={styles.label}>Overall Consistency</Text>
        </View>
        <View style={styles.progressSection}>
          <Progress.Circle
            size={100}
            progress={getDailyConsistency()}
            showsText
            formatText={() => `${Math.round(getDailyConsistency() * 100)}%`}
            color="#34C759"
          />
          <Text style={styles.label}>Today's Consistency</Text>
        </View>
      </View>

      {/* Log Table */}
      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell]}>Date</Text>
            {habits.map(habit => (
              <Text key={habit.id} style={[styles.cell, styles.headerCell]}>
                {habit.title}
              </Text>
            ))}
          </View>

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
            </View>
          ))}

          <View style={[styles.row, { backgroundColor: '#f0f0f0' }]}>
            <Text style={[styles.cell, styles.headerCell]}>Consistency</Text>
            {habits.map(habit => (
              <Text key={habit.id + '-consistency'} style={[styles.cell, styles.headerCell]}>
                {getConsistency(habit)}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  consistencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressSection: {
    alignItems: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
  },
  cell: {
    width: 120,
    textAlign: 'center',
    fontSize: 14,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});