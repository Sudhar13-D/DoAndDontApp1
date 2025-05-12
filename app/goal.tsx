import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const categories = ['Health', 'Career', 'Learning', 'Custom'];

const Goal = () => {
  const handleCategoryPress = (category: string) => {
    // You can navigate or store the selection
    console.log('Selected Category:', category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Your Goal Category</Text>
      <View style={styles.circleContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.circle}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.circleText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  circleText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});