import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import * as Notifications from 'expo-notifications';

const screenWidth = Dimensions.get('window').width;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function DailyTaskScreen() {
  const { id } = useLocalSearchParams();
  const [goal, setGoal] = useState<any>(null);
  const [todayTask, setTodayTask] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [dayIndex, setDayIndex] = useState(1);
  const [showGraph, setShowGraph] = useState(false);
  const notificationIdRef = useRef<string | null>(null);

  const TASK_KEY = `tasks-${id}`;

  useEffect(() => {
    fetchGoalAndTasks();
  }, []);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    scheduleOrCancelNotification();
  }, [tasks, dayIndex]);

  const requestNotificationPermissions = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications to receive reminders.');
        return false;
      }
    }
    return true;
  }, []);

  const fetchGoalAndTasks = useCallback(async () => {
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
  }, [id, TASK_KEY]);

  const handleSaveTodayTask = useCallback(async () => {
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
    Keyboard.dismiss();

    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(updatedTasks));
  }, [todayTask, tasks, dayIndex, TASK_KEY]);

  const markComplete = useCallback(
    async (index: number) => {
      const updatedTasks = [...tasks];
      updatedTasks[index].completed = true;
      setTasks(updatedTasks);
      await AsyncStorage.setItem(TASK_KEY, JSON.stringify(updatedTasks));
    },
    [tasks, TASK_KEY]
  );

  // Schedule or cancel notification based on today's task completion
  const scheduleOrCancelNotification = useCallback(async () => {
    const todayTaskObj = tasks.find((t) => t.day === dayIndex);

    if (!todayTaskObj || (todayTaskObj && !todayTaskObj.completed)) {
      if (notificationIdRef.current) {
        await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
        notificationIdRef.current = null;
      }
      const idScheduled = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder',
          body: "You didn't complete today's task!",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: 10, // For testing, adjust as needed
          repeats: false,
        },
      });
      notificationIdRef.current = idScheduled;
    } else {
      if (notificationIdRef.current) {
        await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
        notificationIdRef.current = null;
      }
    }
  }, [tasks, dayIndex]);

  // Memoize sorted tasks to avoid re-sorting on each render
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.day - b.day);
  }, [tasks]);

  const generateLabels = useCallback((duration: number) => {
    return Array.from({ length: duration }, (_, i) => `Day ${i + 1}`);
  }, []);

  const prepareGoalChartData = useCallback(
    (duration: number) => {
      const dayMap = Array.from({ length: duration }, () => 0);

      tasks.forEach((task) => {
        if (task.completed && task.day <= duration) {
          dayMap[task.day - 1]++;
        }
      });

      return dayMap;
    },
    [tasks]
  );

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
  };

  const ListHeader = () => (
    <>
      {goal && (
        <>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.subtitle}>
            Day {dayIndex} of {goal.duration}
          </Text>

          <Text style={styles.label}>Today's Task</Text>
          <TextInput
            value={todayTask}
            onChangeText={setTodayTask}
            placeholder="e.g., Practice chords for 30 min"
            style={styles.input}
            placeholderTextColor="#6699CC"
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveTodayTask}>
            <Text style={styles.buttonText}>Save Task</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Progress</Text>

          <TouchableOpacity
            style={[styles.button, { marginTop: 10, marginBottom: 20 }]}
            onPress={() => setShowGraph((prev) => !prev)}
          >
            <Text style={styles.buttonText}>{showGraph ? 'Hide Graph' : 'Show Graph'}</Text>
          </TouchableOpacity>

          {showGraph && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ paddingBottom: 40 }}>
                <Text style={styles.axisLabelX}>Day</Text>
                <BarChart
                  data={{
                    labels: generateLabels(goal.duration),
                    datasets: [{ data: prepareGoalChartData(goal.duration) }],
                  }}
                  width={Math.max(screenWidth, goal.duration * 60)}
                  height={260}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  verticalLabelRotation={30}
                  fromZero
                  style={{ borderRadius: 16 }}
                />

                <Text style={styles.axisLabelY}>Completed Tasks</Text>
              </View>
            </ScrollView>
          )}
        </>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTasks}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>
              Day {item.day}: {item.text}
            </Text>
            {!item.completed ? (
              <TouchableOpacity style={styles.completeButton} onPress={() => markComplete(index)}>
                <Text style={styles.completeButtonText}>Mark Done</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.completedText}>✅ Completed</Text>
            )}
          </View>
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef', padding: 15 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 18, marginBottom: 20 },
  label: { fontSize: 16, marginVertical: 6, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#6699CC',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#6699CC',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  taskItem: {
    backgroundColor: '#d0e7ff',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: { fontSize: 16, flex: 1 },
  completeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  completeButtonText: { color: 'white', fontWeight: 'bold' },
  completedText: { color: '#388e3c', fontWeight: 'bold', marginLeft: 10 },
  axisLabelX: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    fontSize: 14,
    color: '#555',
  },
  axisLabelY: {
    position: 'absolute',
    top: 0,
    right: 10,
    fontSize: 14,
    color: '#555',
  },
});
