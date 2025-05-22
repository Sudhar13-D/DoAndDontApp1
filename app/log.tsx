import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Habit {
  id: string;
  title: string;
  history: { [date: string]: boolean };
}

const LogScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          const parsedHabits: Habit[] = JSON.parse(storedHabits);
          setHabits(parsedHabits);

          const allDates = new Set<string>();
          parsedHabits.forEach(habit =>
            Object.keys(habit.history).forEach(date => allDates.add(date))
          );
          setDates(Array.from(allDates).sort((a, b) => b.localeCompare(a)));
        }
      };

      loadData();
    }, [])
  );

  const renderStatusBadge = (status: boolean) => (
    <View style={[styles.badge, { backgroundColor: status ? '#4CAF50' : '#F44336' }]}>
      <Text style={styles.badgeText}>{status ? 'Completed' : 'Not Completed'}</Text>
    </View>
  );

  const renderCell = (
    content: string | JSX.Element,
    isHeader = false,
    style: any = {},
    key?: string
  ) => (
    <View
      key={key}
      style={[
        {
          padding: 10,
          borderWidth: isHeader ? 0 : 1,
          borderColor: '#ddd',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
        isHeader && styles.headerCell,
      ]}
    >
      {typeof content === 'string' ? (
        <Text style={[styles.cellText, isHeader && styles.headerText]}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );

  return (
    <ScrollView horizontal>
      <ScrollView style={{ flex: 1 }}>
        {/* Header Row */}
        <View style={[styles.row, styles.shadow]}>
          {renderCell('Date', true, { width: 100 }, 'header-date')}
          {habits.map(habit =>
            renderCell(habit.title, true, { width: 150 }, `header-habit-${habit.id}`)
          )}
          {renderCell('Daily %', true, { width: 90 }, 'header-percent')}
        </View>

        {/* Data Rows */}
        {dates.map((date, index) => {
          const total = habits.length;
          const completed = habits.filter(h => h.history[date]).length;
          const percent = total ? Math.round((completed / total) * 100) : 0;

          return (
            <View
              key={`row-${date}`}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' },
              ]}
            >
              {renderCell(date, false, { width: 100 }, `date-${date}`)}
              {habits.map(habit =>
                renderCell(
                  renderStatusBadge(habit.history[date] ?? false),
                  false,
                  { width: 150 },
                  `cell-${habit.id}-${date}`
                )
              )}
              {renderCell(`${percent}%`, false, { width: 90 }, `percent-${date}`)}
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    backgroundColor: '#4A90E2',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  cellText: {
    textAlign: 'center',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default LogScreen;
