import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';


const generateId = () => Math.random().toString(36).substr(2, 9);

type Goal = {
  id: string;
  title: string;
};

export default function GoalPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    const loadGoals = async () => {
      const stored = await AsyncStorage.getItem('goals');
      if (stored) setGoals(JSON.parse(stored));
    };
    loadGoals();
  }, []);

  const saveGoals = async (updatedGoals: Goal[]) => {
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const handleAddGoal = () => {
    if (newGoal.trim() === '') return;
    const updatedGoals = [...goals, { id: generateId(), title: newGoal.trim() }];
    saveGoals(updatedGoals);
    setNewGoal('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Your Goals</Text>

      <TextInput
        placeholder="New Goal"
        value={newGoal}
        onChangeText={setNewGoal}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddGoal}>
        <Text style={styles.buttonText}>Add Goal</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/milestone/[id]', params: { id: item.id } } as never} asChild>
            <TouchableOpacity style={styles.goalBox}>
              <Text style={styles.goalText}>{item.title}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No goals added yet.</Text>}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 10, padding: 10, fontSize: 16 },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  goalBox: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  goalText: { fontSize: 18 },
});
