import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import React from 'react';

type props = {
  title: string;
}

export default function Task({ title }: props) {
  return (
    <View style={styles.viewStyle}>
      
      <View style={styles.taskContainer}>
      <TouchableOpacity >
        <Text style={styles.textStyle}>{title}</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    alignItems: 'center',
  },
  taskContainer: {
    width: 400,
    height: 75,
    borderRadius: 20,
    backgroundColor: 'green',
    justifyContent: 'center',   // vertical centering
     
    marginBottom:5      // horizontal centering
  },
  textStyle: {
    paddingHorizontal:30,
    fontSize: 20,
    color: 'white',
  },
});