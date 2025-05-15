import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Task({ task, onToggleComplete, onEdit, onDelete }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.taskContainer,
        task.completed && styles.completedTask,
      ]}
      onPress={onToggleComplete}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskText}>
          {task.taskName} ({task.taskRelated}) [{task.taskLevel}]
        </Text>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
  <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
    <Text style={styles.actionText}>Edit</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
    <Text style={styles.actionText}>Delete</Text>
  </TouchableOpacity>
</View>
      </View>
      <Text style={styles.subText}>
        Allocated: {task.taskAllocatedTime}, Scheduled: {task.taskScheduledTime}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    padding: 15,
    backgroundColor: '#e0f7fa',
    marginBottom: 10,
    borderRadius: 8,
  },
  completedTask: {
    backgroundColor: '#c8e6c9',
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  subText: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  actionButton: {
  backgroundColor: '#ddd',
  padding: 6,
  borderRadius: 5,
  marginHorizontal: 5,
},
actionText: {
  color: '#000',
  fontWeight: 'bold',
},
});