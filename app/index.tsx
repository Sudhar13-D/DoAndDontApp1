import React,{useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert,TextInput,ImageBackground,Button } from "react-native";
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import {RootStackParamList} from '@/app/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Index() {
  const navigation = useNavigation<NavigationProp>();
  const [quote,setQuote]=useState('')
  const handleQuote = () =>{
    const newQuote = quote
    setQuote(quote?.toString())
  }
  const setQoute = async (value:string)=>{
    try{
      await AsyncStorage.setItem('quotekey', value)
    }
    catch(e){

    }
}
const getQoute = async ()=>{
 try{
    const value = await AsyncStorage.getItem('quotekey')
    if(value!=null){
      
      
    }
 }
 catch(e){

 }
}
useEffect(()=>{
  getQoute()
},[])
  
  return (
    <ImageBackground 
    source = {require('@/assets/images/logo.png')}
    style = {styles.background}
    resizeMode="cover"
     > 
    <View style={styles.container}>
      <Text style={styles.header}>Do's & Dont App</Text>
      <TextInput style = {styles.motivQouteContainer} 
      placeholder="Important Note of the day !"
      value = {quote}
      onChangeText={setQuote}
      />
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button1} onPress={() =>navigation.navigate("DoDont")}>
          <Text style={styles.buttonText}> Do & Dont </Text>
        </TouchableOpacity>
        <Link href="../journal" asChild>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.buttonText}>Journal</Text>
        </TouchableOpacity>
        </Link>
        <Link href="../goal" asChild>
        <TouchableOpacity style={styles.button3} >
          <Text style={styles.buttonText}>Goal</Text>
        </TouchableOpacity>
        </Link>
        
        <TouchableOpacity style={styles.button4}>
          <Text style={styles.buttonText}>Habit Tracker</Text>
        </TouchableOpacity>
        
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  motivQouteContainer: {
    marginTop:30,
    width:375,
    height:100,
    borderRadius: 20,
    color:'black',
    textAlign: 'center',
    backgroundColor: 'orange',
  },
  background:{
   flex:1,
   resizeMode:'cover',
  },
  header: {
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 10,
  },
  buttonGrid: {
    paddingTop:100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10, // use margin if `gap` is not supported in your React Native version
  },
  button1: {
    backgroundColor: 'green',
    width: 175,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, // spacing between buttons
    borderRadius: 20,
  },
  button2: {
    backgroundColor: 'red',
    width: 175,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, // spacing between buttons
    borderRadius: 20,
  },
  button3: {
    backgroundColor: 'skyblue',
    width: 175,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, // spacing between buttons
    borderRadius: 20,
  },
  button4: {
    backgroundColor: 'orange',
    width: 175,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, // spacing between buttons
    borderRadius: 20,
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});