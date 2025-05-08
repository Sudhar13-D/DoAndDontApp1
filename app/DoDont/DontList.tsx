import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet,KeyboardAvoidingView,Platform,FlatList} from "react-native";
import { useState } from 'react';
import DontTask from '@/component/DontTask';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DontList(){
    const [task,setTask] = useState('');
        const [taskList,setTaskList] = useState<string[]>([]);

        const handleAddTask = () => {
            if(task.trim().length>0){
                const updatedList = [...taskList,task]
                setTaskList(updatedList);
                storeData(JSON.stringify(updatedList))
                setTask('');
            }
        }
        const storeData = async (value:string) => {
            try {
              await AsyncStorage.setItem('DontTask', value);
            } catch (e) {
              // saving error
            }
          };
          
          const getData = async () => {
            try {
              const value = await AsyncStorage.getItem('DontTask');
              if (value !== null) {
                setTaskList(JSON.parse(value))
              }
            } catch (e) {
              // error reading value
            }
          };
          useEffect(()=> {
            getData()
          },[])
        return (
            <KeyboardAvoidingView
            style = {styles.container} 
            behavior = {Platform.OS === 'ios' ? 'padding':'height'}
            keyboardVerticalOffset={100}
            ><View>
                 <Text style = {{textAlign:'center',marginTop:10,marginBottom:20,fontSize:24}}>Today Task</Text>
            </View>
            
            <FlatList 
             data = {taskList}
             renderItem={({ item }) => <DontTask title = {item} />}
             keyExtractor={(item,index)=>index.toString()}
            />
                {/* Container for TextInput and Button in a row */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your Task"
                        value = {task}
                        onChangeText={setTask}  
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                        <Text style={styles.plus}>+</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
    
    const styles = StyleSheet.create({
        container:{
            flex :1
        },
        inputRow: {
            flexDirection: "row",         // Make them sit side by side
            alignItems: "center",
            marginBottom: 20,
        },
        textInput: {
            width: 300,
            height: 50,
            borderRadius: 20,
            backgroundColor: "#F8F8FF",
            paddingHorizontal:5,
            fontSize: 16,
            textAlign:"center",
            marginLeft:30
        },
        addButton: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor:"#F8F8FF",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
        },
        plus: {
            fontSize: 24,
            fontWeight: "bold",
        }
    });