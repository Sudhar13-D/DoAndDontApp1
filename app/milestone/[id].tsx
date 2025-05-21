import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

export default function DailyTaskScreen() {
  const { id } = useLocalSearchParams();
  const [goal, setGoal] = useState<any>(null);
  const [todayTask, setTodayTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [dayIndex, setDayIndex] = useState(1);

  const TASK_KEY = `tasks-${id}`;

  useEffect(() => {
    const fetchGoalAndTasks = async () => {
      try {
        const goalsData = await AsyncStorage.getItem('goals');
        const goals = goalsData ? JSON.parse(goalsData) : [];
        const foundGoal = goals.find((g: any) => g.id === id);
        setGoal(foundGoal);

        const tasksData = await AsyncStorage.getItem(TASK_KEY);
        const allTasks = tasksData ? JSON.parse(tasksData) : [];
        setTasks(allTasks);

        if (foundGoal) {
          const created = new Date(foundGoal.createdAt);
          const today = new Date();
          const diffTime = today.getTime() - created.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          setDayIndex(diffDays + 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGoalAndTasks();
  }, []);

  const handleSaveTodayTask = async () => {
    if (!todayTask.trim()) {
      Alert.alert('Input Required', 'Please enter a task for today.');
      return;
    }

    const existingTaskIndex = tasks.findIndex((t) => t.day === dayIndex);
    if (existingTaskIndex !== -1) {
      Alert.alert('Task Exists', 'You have already added a task for today.');
      return;
    }

    const newTask = {
      day: dayIndex,
      text: todayTask.trim(),
      completed: false,
      date: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTodayTask('');
    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(updatedTasks));
  };

  const markComplete = async (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(updatedTasks));
  };

  return (
    <View style={styles.container}>
      {goal && (
        <>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.subtitle}>Day {dayIndex} of {goal.duration}</Text>

          <Text style={styles.label}>What will you do today?</Text>
          <TextInput
            value={todayTask}
            onChangeText={setTodayTask}
            placeholder="e.g., Practice chords for 30 min"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveTodayTask}>
            <Text style={styles.buttonText}>Save Task</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Progress:</Text>
          <FlatList
            data={tasks.sort((a, b) => a.day - b.day)}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.taskItem}>
                <Text>Day {item.day}: {item.text}</Text>
                {!item.completed ? (
                  <Button title="Mark Done" onPress={() => markComplete(index)} />
                ) : (
                  <Text style={{ color: 'green' }}>✅ Completed</Text>
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 30 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { marginBottom: 10, color: 'gray' },
  label: { marginTop: 20, fontSize: 16 },
  input: { borderWidth: 1, padding: 10, marginTop: 5, borderRadius: 5 },
  button: { backgroundColor: '#000', marginTop: 10, padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  taskItem: { marginTop: 10, borderBottomWidth: 1, paddingBottom: 10 },
});
