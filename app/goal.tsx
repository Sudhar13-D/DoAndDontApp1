import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Image } from 'react-native';

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
      <Text style={styles.label}>Enter Your Goal</Text>
      <TextInput
        value={goal}
        onChangeText={setGoal}
        placeholder="e.g., Learn Guitar"
        style={styles.input}
        placeholderTextColor="#6699CC"
      />
      <Text style={styles.label}>In how many days?</Text>
      <TextInput
        value={days}
        onChangeText={setDays}
        placeholder="e.g., 30"
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#6699CC"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateGoal}>
        <Text style={styles.buttonText}>Start Goal</Text>
      </TouchableOpacity>

      {goals.length > 0 && (
        <>
          <Text style={styles.label}>Your Goals</Text>
          <FlatList
            data={goals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.goalItem, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <TouchableOpacity onPress={() => router.push(`/milestone/${item.id}`)}>
                  <Text style={styles.goalItemText}>
                    {item.title} ({item.duration} days)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.deleteButton}>
                  <Image
                   source={require('../assets/images/dustbin.png')}
                   style={{ width: 24, height: 24, tintColor: 'grey' }}
                   />
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    marginTop: 40, 
    backgroundColor: '#F0F8FF',  // very light blue background
    flex: 1,
  },
  label: { 
    fontSize: 18, 
    marginBottom: 5, 
    color: '#003366',  // dark blue text
    fontWeight: '600',
  },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 15, 
    borderRadius: 5, 
    borderColor: '#3399FF', 
    backgroundColor: '#FFFFFF',
    color: '#003366',
  },
  button: { 
    backgroundColor: '#007AFF',  // bright blue button
    padding: 15, 
    borderRadius: 5, 
    marginBottom: 20,
  },
  buttonText: { 
    color: '#FFFFFF', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  goalItem: { 
    padding: 10, 
    backgroundColor: '#CCE5FF',  // lighter blue box for goals
    marginBottom: 10, 
    borderRadius: 5,
  },
  goalItemText: {
    color: '#003366',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30', // red delete button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
