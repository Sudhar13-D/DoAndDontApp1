import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function MilestoneScreen() {
  const { id } = useLocalSearchParams(); // goal ID
  const [milestones, setMilestones] = useState<any[]>([]);
  const [milestoneText, setMilestoneText] = useState('');
  const [timePeriod, setTimePeriod] = useState('');

  const STORAGE_KEY = `milestones-${id}`;

  useEffect(() => {
    const loadMilestones = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setMilestones(JSON.parse(data));
    };
    loadMilestones();
  }, []);

  const saveMilestones = async (newList: any[]) => {
    setMilestones(newList);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addMilestone = () => {
    if (milestoneText.trim() === '') return;
    const newMilestone = {
      id: uuidv4(),
      text: milestoneText,
      timePeriod,
      completed: false,
    };
    const updated = [...milestones, newMilestone];
    saveMilestones(updated);
    setMilestoneText('');
    setTimePeriod('');
  };

  const toggleCompleted = (index: number) => {
    const updated = [...milestones];
    updated[index].completed = !updated[index].completed;
    saveMilestones(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milestones for Goal: {id}</Text>

      <TextInput
        placeholder="Enter milestone"
        value={milestoneText}
        onChangeText={setMilestoneText}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter time period (e.g. 2 weeks)"
        value={timePeriod}
        onChangeText={setTimePeriod}
        style={styles.input}
      />
      <Button title="Add Milestone" onPress={addMilestone} />

      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => toggleCompleted(index)}
            style={[styles.milestoneItem, item.completed && styles.completed]}
          >
            <Text>{item.text} ({item.timePeriod})</Text>
            <Text>{item.completed ? '✅' : '❌'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
    padding: 10, marginBottom: 10,
  },
  milestoneItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 15, borderBottomWidth: 1, borderColor: '#ddd',
  },
  completed: { backgroundColor: '#d3ffd3' },
});
