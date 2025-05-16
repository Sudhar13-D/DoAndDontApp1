import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from '@/component/Task';
import TaskProperties from '@/component/TaskProperties';

export default function DoList() {
  const [taskList, setTaskList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Save to AsyncStorage
  const setStringValue = async (value: string) => {
    try {
      await AsyncStorage.setItem('task', value);
    } catch (e) {
      alert(e);
    }
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

  const saveTaskList = (updatedList: any[]) => {
    setTaskList(updatedList);
    setStringValue(JSON.stringify(updatedList));
  };

  const handleTaskPropertiesConfirm = (taskData: any) => {
    let updatedList = [...taskList];
    if (editIndex !== null) {
      updatedList[editIndex] = { ...taskData, completed: updatedList[editIndex].completed || false };
      setEditIndex(null);
    } else {
      updatedList.push({ ...taskData, completed: false });
    }
    saveTaskList(updatedList);
    setShowForm(false);
  };

  const deleteTask = (index: number) => {
    const updatedList = [...taskList];
    updatedList.splice(index, 1);
    saveTaskList(updatedList);
  };

  const editTask = (index: number) => {
    setEditIndex(index);
    setShowForm(true);
  };

  const toggleComplete = (index: number) => {
    const updatedList = [...taskList];
    updatedList[index].completed = !updatedList[index].completed;

    // Move completed tasks to bottom
    updatedList.sort((a, b) => a.completed - b.completed);
    saveTaskList(updatedList);
  };

  const completedCount = taskList.filter((task) => task.completed).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View>
        <Text style={styles.header}>Today Task</Text>
        <Text style={styles.counter}>
          {completedCount} / {taskList.length} completed
        </Text>
      </View>

{showForm ? (
  <View style={{ flex: 1 }}>
    <TouchableOpacity
      onPress={() => {
        setShowForm(false);
        setEditIndex(null);
      }}
      style={styles.backButton}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>

    <View style={styles.taskPropertyContainer}>
      <TaskProperties
        onConfirm={handleTaskPropertiesConfirm}
        initialData={editIndex !== null ? taskList[editIndex] : null}
      />
    </View>
  </View>
) : (

        <>
          <FlatList
            data={taskList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Task
                taskData={item}
                onToggleComplete={() => toggleComplete(index)}
                onDelete={() => deleteTask(index)}
                onEdit={() => editTask(index)}
              />
            )}
          />

          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditIndex(null);
                setShowForm(true);
              }}
            >
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
        </>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  counter: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 350,
  },
  plus: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskPropertyContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  backButton: {
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginTop: 20,
},
  backButtonText: {
  fontSize: 18,
  color: 'blue',
},
  
});
