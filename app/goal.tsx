import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['Health', 'Career', 'Learning', 'Custom'];

const STORAGE_KEY = '@user_goals';

const Goal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [goals, setGoals] = useState([]);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGoals();
  }, []);

  // Load goals from AsyncStorage
  const loadGoals = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setGoals(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load goals.', e);
    }
  };

  // Save goals array to AsyncStorage
  const saveGoals = async (newGoals) => {
    try {
      const jsonValue = JSON.stringify(newGoals);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save goals.', e);
    }
  };

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    toggleMenu();
  };

  const handleSaveGoal = () => {
    if (!goalText.trim()) {
      Alert.alert('Please enter a goal.');
      return;
    }

    const newGoal = { category: selectedCategory, goal: goalText.trim(), id: Date.now().toString() };
    const updatedGoals = [...goals, newGoal];

    setGoals(updatedGoals);
    saveGoals(updatedGoals);

    setGoalText('');
    setSelectedCategory(null);
    setModalVisible(false);
    Alert.alert('Goal saved!', `Category: ${selectedCategory}\nGoal: ${goalText}`);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Your Goal Category</Text>

      {/* Display saved goals */}
      <ScrollView style={styles.goalsList} contentContainerStyle={{ paddingBottom: 100 }}>
        {goals.length === 0 ? (
          <Text style={styles.noGoalsText}>No goals added yet. Click "+" to add one.</Text>
        ) : (
          goals.map(({ id, category, goal }) => (
            <View key={id} style={styles.goalItem}>
              <Text style={styles.goalCategory}>{category}</Text>
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.fabContainer}>
        {categories.map((category, index) => {
          const radius = 120;
          const totalArc = (150 * Math.PI) / 180;
          const startAngle = (15 * Math.PI) / 180;
          const angle = startAngle + (index * totalArc) / (categories.length + 1);

          const translateX = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.cos(angle)],
          });

          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.sin(angle)],
          });

          const scale = animation.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 1.2, 1],
          });

          const opacity = animation.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [0, 0.7, 1],
          });

          return (
            <Animated.View
              key={category}
              style={[
                styles.categoryButtonContainer,
                {
                  transform: [{ translateX }, { translateY }, { scale }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Text style={styles.fabIcon}>+</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Modal for entering goal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setGoalText('');
          setSelectedCategory(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add a Goal in "{selectedCategory}" category
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your goal..."
              value={goalText}
              onChangeText={setGoalText}
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setGoalText('');
                  setSelectedCategory(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveGoal}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Goal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  goalsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noGoalsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  goalItem: {
    backgroundColor: '#e0f2f1',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  goalCategory: {
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 16,
    color: '#004d40',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
  },
  fabIcon: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 60,
    textAlign: 'center',
  },
  categoryButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 3,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    minHeight: 60,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#bbb',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
