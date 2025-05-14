import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Task({ title }: { title: string }) {
  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: '#E8E8E8',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 16,
  },
});
