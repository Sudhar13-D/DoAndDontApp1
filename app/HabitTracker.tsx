import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HabitListScreen from './screens/HabitListScreen';
import AddHabitScreen from './screens/AddHabitScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HabitList">
        <Stack.Screen name="HabitList" component={HabitListScreen} options={{ title: 'DoAndDontApp' }} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ title: 'Add Habit' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
