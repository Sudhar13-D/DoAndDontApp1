import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Index() {
  const navigation = useNavigation<NavigationProp>();
  const [quote, setQuote] = useState('');

  const handleQuote = () => {
    const newQuote = quote;
    setQuote(quote?.toString());
  };

  const storeQuote = async (value: string) => {
    try {
      await AsyncStorage.setItem('quotekey', value);
    } catch (e) {
      // handle error
    }
  };

  const getQuote = async () => {
    try {
      const value = await AsyncStorage.getItem('quotekey');
      if (value != null) {
        setQuote(value);
      }
    } catch (e) {
      // handle error
    }
  };

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <View style={{ width: wp('90%'), height: hp('10%') }}>
      <ImageBackground
        source={require('@/assets/images/logo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.header}>Do's & Dont App</Text>
          <TextInput
            style={styles.motivQuoteContainer}
            placeholder="Important Note of the day !"
            value={quote}
            onChangeText={setQuote}
          />
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate("DoDont")}>
              <Text style={styles.buttonText}>Do & Dont</Text>
            </TouchableOpacity>
            <Link href="../journal" asChild>
              <TouchableOpacity style={styles.button2}>
                <Text style={styles.buttonText}>Journal</Text>
              </TouchableOpacity>
            </Link>
            <Link href="../Goal" asChild>
              <TouchableOpacity style={styles.button3}>
                <Text style={styles.buttonText}>Goal</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.button4}>
              <Text style={styles.buttonText}>Habit Tracker</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp('2%'),
    backgroundColor: 'white',
    alignItems: 'center',
  },
  motivQuoteContainer: {
    marginTop: hp('3%'),
    width: wp('90%'),
    height: hp('13%'),
    borderRadius: wp('5%'),
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'orange',
    paddingHorizontal: wp('3%'),
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    fontSize: wp('6%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
  },
  buttonGrid: {
    paddingTop: hp('10%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: wp('3%'),
  },
  button1: {
    backgroundColor: 'green',
    width: wp('42%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp('2%'),
    borderRadius: wp('5%'),
  },
  button2: {
    backgroundColor: 'red',
    width: wp('42%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp('2%'),
    borderRadius: wp('5%'),
  },
  button3: {
    backgroundColor: 'skyblue',
    width: wp('42%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp('2%'),
    borderRadius: wp('5%'),
  },
  button4: {
    backgroundColor: 'orange',
    width: wp('42%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp('2%'),
    borderRadius: wp('5%'),
  },
  buttonText: {
    color: 'white',
    fontSize: wp('4%'),
  },
});
