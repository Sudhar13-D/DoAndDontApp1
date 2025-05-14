import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/component/Task'; // Your task UI component
import TaskProperties from '@/component/TaskProperties'; // Your form for properties

export default function DoList() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Save to AsyncStorage
  const setStringValue = async (value: string) => {
    try {
      await AsyncStorage.setItem('task', value);
    } catch (e) {
      alert(e);
    }
    console.log('Saved to AsyncStorage');
  };

  // Load from AsyncStorage
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('task');
    if (value !== null) {
      setTaskList(JSON.parse(value));
    }
  } catch (e) {
    console.log('Error loading data:', e);
  }
};

  useEffect(() => {
    getData();
  }, []);

  // Handle task confirmation (e.g., after properties are selected)
  const handleTaskPropertiesConfirm = (taskData: any) => {
  const updatedList = [...taskList, taskData];
  setTaskList(updatedList);
  setStringValue(JSON.stringify(updatedList));
  setShowForm(false);
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View>
        <Text style={styles.header}>Today Task</Text>
      </View>

     <FlatList
       data={taskList}
       renderItem={({ item }) => <Task task={item} />}
       keyExtractor={(_, index) => index.toString()}
      />


      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your Task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (task.trim().length > 0) {
              setShowForm(true);
            } else {
              alert('Please enter a task');
            }
          }}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Show task + properties when form is triggered */}
     {showForm && (
  <View style={styles.taskPropertyContainer}>
    <TaskProperties onConfirm={handleTaskPropertiesConfirm} />
  </View>
)}

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  textInput: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#F8F8FF',
    paddingHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  plus: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskPropertyContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
