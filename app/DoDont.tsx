import {
  Image,
  StyleSheet,
  Platform,
  Button,
  Alert,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const { width, height } = Dimensions.get('window');

export default function DoDont() {
  const navigation = useNavigation<NavigationProp>();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setUserName(storedName);
    };
    loadName();
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hi {userName || 'there'}!!</Text>
        <Text style={styles.subGreeting}>Welcome to Do's & Don'ts</Text>

        <TextInput
          style={styles.motivQouteContainer}
          placeholder="Today's Motivational Quotes!!"
          multiline
        />

        <View style={styles.doButton}>
          <Link href="../DoDont/DoList" asChild>
            <TouchableOpacity style={styles.containerButton}>
              <Text style={styles.buttonText}>Do</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.dontButton}>
          <Link href="../DoDont/DontList" asChild>
            <TouchableOpacity style={styles.containerButton2}>
              <Text style={styles.buttonText}>Don't</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.Nooftaskcompleted}>
          <Text style={styles.completedText}>No of task completed</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 40,
  },
  greeting: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: '600',
  },
  subGreeting: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
  motivQouteContainer: {
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 20,
    padding: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: 'orange',
    marginTop: 20,
  },
  containerButton: {
    width: width * 0.6,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton2: {
    width: width * 0.6,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  doButton: {
    marginTop: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  dontButton: {
    marginTop: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  Nooftaskcompleted: {
    marginTop: 50,
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 20,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
