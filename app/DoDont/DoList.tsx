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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    getData();
  }, []);

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

  const saveTasks = async (tasks: any[]) => {
    try {
      await AsyncStorage.setItem('task', JSON.stringify(tasks));
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  const sortTasks = (tasks: any[]) => {
    const completed = tasks.filter(t => t.completed);
    const notCompleted = tasks.filter(t => !t.completed);
    return [...notCompleted, ...completed];
  };

  const toggleComplete = (index: number) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    const sorted = sortTasks(updatedTasks);
    setTaskList(sorted);
    saveTasks(sorted);
  };

  const handleDelete = (index: number) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
    saveTasks(updatedTasks);
  };

  const editTask = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleTaskPropertiesConfirm = (taskData: any) => {
    const updatedList = [...taskList];
    if (editingIndex !== null) {
      updatedList[editingIndex] = { ...taskData, completed: taskList[editingIndex].completed };
    } else {
      updatedList.push({ ...taskData, completed: false });
    }
    const sorted = sortTasks(updatedList);
    setTaskList(sorted);
    saveTasks(sorted);
    setEditingIndex(null);
    setShowForm(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Text style={styles.header}>Today Task</Text>

      {showForm ? (
        <View style={styles.taskPropertyContainer}>
          <TaskProperties
            onConfirm={handleTaskPropertiesConfirm}
            editingTask={editingIndex !== null ? taskList[editingIndex] : null}
            editingIndex={editingIndex}
          />
        </View>
      ) : (
        <>
          <FlatList
            nestedScrollEnabled
            data={taskList}
            renderItem={({ item, index }) => (
              <Task
                task={item}
                onToggleComplete={() => toggleComplete(index)}
                onEdit={() => editTask(index)}
                onDelete={() => handleDelete(index)}
              />
            )}
            keyExtractor={(_, index) => index.toString()}
          />

          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setShowForm(true);
                setEditingIndex(null);
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
});