import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Task({ task }: { task: any }) {
  return (
    <View style={{ padding: 10, backgroundColor: 'white', margin: 5, borderRadius: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{task.taskName}</Text>
      <Text>Category: {task.taskRelated}</Text>
      <Text>Level: {task.taskLevel}</Text>
      <Text>Allocated: {task.taskAllocatedTime}</Text>
      <Text>Scheduled: {task.taskScheduledTime}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: 'green',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 16,
  },
});
