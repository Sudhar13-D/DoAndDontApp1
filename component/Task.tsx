import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Task({ taskData }: { taskData: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.titleContainer}>
        <Text style={styles.taskName}>{taskData.taskName}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>Related To: {taskData.taskRelated}</Text>
          <Text style={styles.detail}>Level: {taskData.taskLevel}</Text>
          <Text style={styles.detail}>Allocated Time: {taskData.taskAllocatedTime}</Text>
          <Text style={styles.detail}>Scheduled Time: {taskData.taskScheduledTime}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ccc',
    backgroundColor: 'white',
    elevation: 2,
  },
  titleContainer: {
    padding: 15,
    backgroundColor: 'grey',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderRadius:5
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
});