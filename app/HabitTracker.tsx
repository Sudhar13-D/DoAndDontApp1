import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Habit = {
  id: string;
  title: string;
  isDone: boolean;
  history: Record<string, boolean>;
};

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const router = useRouter();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const stored = await AsyncStorage.getItem("habits");
    const parsed: Habit[] = stored ? JSON.parse(stored) : [];

    const updated = parsed.map((habit) => {
      if (habit.history[today] === undefined) {
        habit.history[today] = false;
      }
      return {
        ...habit,
        isDone: habit.history[today],
      };
    });

    await AsyncStorage.setItem("habits", JSON.stringify(updated));
    setHabits(updated);
  };

  const saveHabits = async (updated: Habit[]) => {
    await AsyncStorage.setItem("habits", JSON.stringify(updated));
    setHabits(updated);
  };

  const toggleHabit = async (id: string) => {
    const updated = habits.map((habit) => {
      if (habit.id === id) {
        const newStatus = !habit.isDone;
        habit.isDone = newStatus;
        habit.history[today] = newStatus;
      }
      return habit;
    });
    saveHabits(updated);
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return Alert.alert("Please enter a habit");

    const newHabitObj: Habit = {
      id: Date.now().toString(),
      title: newHabit.trim(),
      isDone: false,
      history: { [today]: false },
    };

    const updated = [...habits, newHabitObj];
    await saveHabits(updated);
    setNewHabit("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <Button title="View Log" onPress={() => router.push("../log")} />
      </View>
      <Text style={styles.header}>Today's Habits</Text>
      <TextInput
        placeholder="Enter new habit"
        value={newHabit}
        onChangeText={setNewHabit}
        style={styles.input}
      />
      <Button title="Add Habit" onPress={addHabit} />

      {habits.map((habit) => (
        <View key={habit.id} style={styles.habitItem}>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <TouchableOpacity
            onPress={() => toggleHabit(habit.id)}
            style={[
              styles.toggleButton,
              { backgroundColor: habit.isDone ? "green" : "red" },
            ]}
          >
            <Text style={styles.buttonText}>
              {habit.isDone ? "Completed" : "Not Completed"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  topBar: { alignItems: "flex-end", marginBottom: 10 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
  habitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  habitTitle: { fontSize: 16, flex: 1 },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: { color: "#fff" },
});
