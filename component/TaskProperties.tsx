import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props ={
  onConfirm: (taskData: any, index: number | null) => void;
  editingTask?: any;
  editingIndex?: number | null;
};
export default function TaskProperties({ onConfirm, editingIndex = null, editingTask = null }:Props) {
  
  const [related, setRelated] = useState('');
  
  const [allocatedTime, setAllocatedTime] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [completed, setCompleted] = useState(false);
  const [taskName, setTaskName] = useState(editingTask?.name || '');
  const [category, setCategory] = useState(editingTask?.category || '');
  const [level, setLevel] = useState(editingTask?.level || '');

  const [unitOpen, setUnitOpen] = useState(false);
  const [unitValue, setUnitValue] = useState<string | null>('');
  const [unitItems, setUnitItems] = useState([
    { label: 'Hrs', value: 'Hrs' },
    { label: 'Mins', value: 'Mins' },
  ]);

  const [unitOpen1, setUnitOpen1] = useState(false);
  const [unitValue1, setUnitValue1] = useState<string | null>('');
  const [unitItems1, setUnitItems1] = useState([
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ]);

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.taskName || '');
      setRelated(editingTask.taskRelated || '');
      setLevel(editingTask.taskLevel || '');
      setAllocatedTime(editingTask.taskAllocatedTime?.split(' ')[0] || '');
      setUnitValue(editingTask.taskAllocatedTime?.split(' ')[1] || '');
      setScheduledTime(editingTask.taskScheduledTime?.split(' ')[0] || '');
      setUnitValue1(editingTask.taskScheduledTime?.split(' ')[1] || '');
      setCompleted(editingTask.completed || false);
    }
  }, [editingTask]);

  const handleSaveTask = async () => {
    if (!taskName.trim()) {
      alert('Please enter the task name.');
      return;
    }

    const taskData = {
      taskName: taskName.trim(),
      taskRelated: related,
      taskLevel: level,
      taskAllocatedTime: `${allocatedTime} ${unitValue}`,
      taskScheduledTime: `${scheduledTime} ${unitValue1}`,
      completed,
    };

    try {
      const existing = await AsyncStorage.getItem('task');
      const tasks = existing ? JSON.parse(existing) : [];

      if (editingIndex !== null) {
        tasks[editingIndex] = taskData;
      } else {
        tasks.push(taskData);
      }

      const sortedTasks = tasks.sort((a: any, b: any) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
      await AsyncStorage.setItem('task', JSON.stringify(sortedTasks));

      onConfirm({name: taskName,category: category,level:level,completed:editingTask?.completed || false ,}, editingIndex);

      setTaskName('');
      setRelated('');
      setLevel('');
      setAllocatedTime('');
      setScheduledTime('');
      setUnitValue('');
      setUnitValue1('');
      setCompleted(false);

      alert('Task saved');
    } catch (e) {
      console.error('Saving error:', e);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.head}>Task Name</Text>
        <TextInput
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Enter task name"
          style={styles.task}
        />

        <Text style={styles.head}>Task Related to</Text>
        <View style={styles.relatedRow}>
          {['Education', 'Relationship', 'Work', 'Health', 'Self improvement'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.related, related === item && { backgroundColor: 'orange' }]}
              onPress={() => setRelated(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.head}>Task Level</Text>
        <View style={styles.levelRow}>
          {['Hard', 'Medium', 'Easy'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.level, level === item && { backgroundColor: 'lightgreen' }]}
              onPress={() => setLevel(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.head}>Allocated Time</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={allocatedTime}
            onChangeText={setAllocatedTime}
            placeholder="00"
          />
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={unitOpen}
              value={unitValue}
              items={unitItems}
              setOpen={setUnitOpen}
              setValue={setUnitValue}
              setItems={setUnitItems}
              placeholder="Hrs/Mins"
              zIndex={1000}
              style={{ height: 40 }}
            />
          </View>
        </View>

        <Text style={styles.head}>Scheduled Time</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={scheduledTime}
            onChangeText={setScheduledTime}
            placeholder="00"
          />
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={unitOpen1}
              value={unitValue1}
              items={unitItems1}
              setOpen={setUnitOpen1}
              setValue={setUnitValue1}
              setItems={setUnitItems1}
              placeholder="AM/PM"
              zIndex={500}
              style={{ height: 40 }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.completedButton, completed && { backgroundColor: '#90EE90' }]}
          onPress={() => setCompleted(!completed)}
        >
          <Text style={styles.text}>{completed ? 'Mark as Incomplete' : 'Mark as Completed'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
          <Text style={styles.buttonText}>{editingIndex !== null ? 'Update Task' : 'Add Task'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  head: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  task: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
  related: {
    minWidth: 120,
    height: 45,
    justifyContent: 'center',
    margin: 5,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  level: {
    width: 100,
    height: 45,
    justifyContent: 'center',
    margin: 5,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  relatedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  levelRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 5,
  },
  input: {
    width: 100,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F8F8FF',
    borderColor: 'black',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    width: 100,
    marginLeft: 10,
    zIndex: 1000,
  },
  button: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  completedButton: {
    width: 180,
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
  },
});
