import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';

const generateId = () => Math.random().toString(36).substring(2, 9);

type Goal = {
  id: string;
  title: string;
  duration: number;
  createdAt: string;
};

export default function GoalPage() {
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const loadGoals = async () => {
        const stored = await AsyncStorage.getItem('goals');
        setGoals(stored ? JSON.parse(stored) : []);
      };
      loadGoals();
    }, [])
  );

  const handleCreateGoal = async () => {
    if (!goal.trim() || !days.trim()) {
      Alert.alert('Missing input', 'Please enter both goal and number of days');
      return;
    }

    const newGoal = {
      id: generateId(),
      title: goal.trim(),
      duration: parseInt(days),
      createdAt: new Date().toISOString()
    };
    const updatedGoals = [...goals, newGoal];

    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    setGoal('');
    setDays('');
    setGoals(updatedGoals);
    router.push(`/milestone/${newGoal.id}`);
  };

  const handleDeleteGoal = async (id: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const filteredGoals = goals.filter(goal => goal.id !== id);
            setGoals(filteredGoals);
            await AsyncStorage.setItem('goals', JSON.stringify(filteredGoals));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Goals</Text>
      <View style={styles.processBanner}>
     <Text style={styles.processText}>
      "Success doesn't come from what you do occasionally, it comes from what you do consistently."
— Marie Forleo
      </Text>
      </View> 

      <View style={styles.card}>
        <TextInput
          value={goal}
          onChangeText={setGoal}
          placeholder="What's your goal?"
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          value={days}
          onChangeText={setDays}
          placeholder="Duration (in days)"
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleCreateGoal}>
          <Text style={styles.buttonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/milestone/${item.id}`)}
            style={styles.habitCard}
          >
            <View style={styles.habitInfo}>
              <Text style={styles.habitTitle}>{item.title}</Text>
              <Text style={styles.habitDuration}>{item.duration} day goal</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.trash}>
              <Image
                source={require('../assets/images/dustbin.png')}
                style={{ width: 18, height: 18, tintColor: '#fff' }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  processBanner: {
    backgroundColor: '#E0F7FA',
    borderLeftWidth: 6,
    borderLeftColor: '#00BCD4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  processText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#00796B',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: '#F1F3F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  habitDuration: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  trash: {
    backgroundColor: '#FF6B6B',
    padding: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
});
