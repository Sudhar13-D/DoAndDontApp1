import { View, Text ,TouchableOpacity,TextInput,StyleSheet,KeyboardAvoidingView} from 'react-native'
import React ,{useState}from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Label } from '@react-navigation/elements'

export default function TaskProperties() {
 const [task,setTask] = useState('')
 const [Related,setRelated] = useState('')
 const [Level,setLevel] = useState('')
 const [AllocatedTime,setAllocatedTime] = useState('')
 const [SheduledTime,setSheduledTime] = useState('')

 const [UnitOpen,setUnitOpen] = useState(false);//drop down box open or close
 const [unitValue,setUnitValue] = useState<string|null>('')//initially dropdown box has hours
 const [UnitItems,setUnitItems] = useState<{label:string; value:string}[]>([ 
    {label:"Hrs",value:"Hrs"},
    {label:'Mins',value:'Mins'},
 ]);//dropdown box containing value

 const [UnitOpen1,setUnitOpen1] = useState(false);//drop down box open or close
 const [unitValue1,setUnitValue1] = useState<string|null>('')//initially dropdown box is null
 const [UnitItems1,setUnitItems1] = useState<{label:string; value:string}[]>([ 
    {label:"AM",value:"AM"},
    {label:'PM',value:'PM'},
 ]);//dropdown1 box containing value
 const handleProperty = async() =>{
     const taskproperty ={
        taskRelated:Related,
        taskLevel:Level,
        taskAllocatedTime: `${AllocatedTime} ${unitValue}`,
        taskSheduledTime: `${SheduledTime} ${unitValue1}`
     };
     try{
      const existingTask = await AsyncStorage.getItem('task');
      const tasks = existingTask ? JSON.parse(existingTask):[];
      tasks.push(taskproperty);
      await AsyncStorage.setItem('task',JSON.stringify(tasks));
      alert("Task saved");
    }
     catch(e){
       console.error("Saving error:",e)
     }
     console.log(taskproperty);
     

 }
  return(
              <KeyboardAvoidingView style = {{flex:1}}>
                  <Text  style ={styles.header}>Task Related to</Text>
                  <View style = {{alignItems:'center',flexDirection:'row',flexWrap:'wrap',}}>
                       <TouchableOpacity //when we click the eductaion button we will update (related) as education initially it was ('') so related is education === education it will apply orange
                       style= {[styles.option, Related === 'Education'&&{ backgroundColor:'orange'}]}
                       onPress = {() => setRelated('Education')}>
                       <Text style ={styles.text}>Education</Text></TouchableOpacity>
                       <TouchableOpacity style = {[styles.option, Related ==='Relationship'&&{ backgroundColor: 'red'}]}
                        onPress = {() => setRelated('Relationship')}>
                        <Text style ={styles.text}>Relationship</Text></TouchableOpacity>
                       <TouchableOpacity style = {[styles.option, Related ==='Work'&&{ backgroundColor: 'skyblue'}]} 
                       onPress = {() => setRelated('Work')}>
                        <Text style ={styles.text}>Work</Text></TouchableOpacity>
                       <TouchableOpacity style = {[styles.option, Related ==='Health'&&{ backgroundColor: 'pink'}]} 
                       onPress = {() => setRelated('Health')}>
                        <Text style ={styles.text}>Health</Text></TouchableOpacity>
                       <TouchableOpacity style ={[styles.option, Related ==='self Improvement'&&{ backgroundColor: 'yellow'}]} 
                       onPress = {() => setRelated('self Improvement')}>
                        <Text style ={styles.text}>Self improvement</Text></TouchableOpacity>
                    </View>
                  <Text style ={styles.header}>Task Level(select any one)</Text>
                  <View style = {{flexDirection:'row',flexWrap:'wrap'}}>
                       <TouchableOpacity 
                       style = {[styles.Level, Level === 'Hard'&& {backgroundColor:'red'}]}
                       onPress={() =>setLevel('Hard') }>
                       <Text style ={styles.text} >Hard</Text></TouchableOpacity>
                       <TouchableOpacity style = {[styles.Level, Level === 'Medium'&& {backgroundColor:'yellow'}]}
                       onPress={() =>setLevel('Medium') }><Text style ={styles.text}>Medium</Text></TouchableOpacity>
                       <TouchableOpacity style = {[styles.Level, Level === 'Easy'&& {backgroundColor:'green'}]}
                       onPress={() =>setLevel('Easy') }><Text style ={styles.text}>Easy</Text></TouchableOpacity>
                    </View>
                    <View style  ={{flexDirection:'row'}} >
                      <Text style ={styles.header}>Allocated Hours : </Text>
                      <TextInput
                      style={styles.allocatedTime}
                      keyboardType = "numeric"
                      value={AllocatedTime}
                      onChangeText={setAllocatedTime}
                     />
                     <View style = {styles.DropDown}>
                     <DropDownPicker
                     open= {UnitOpen}
                     value= {unitValue}
                     items={UnitItems}
                     setOpen={setUnitOpen}
                     setValue={setUnitValue}
                     setItems={setUnitItems}
                     placeholder='hrs/min'
                     style = {{zIndex:1000}}
                     multiple = {false}

                     />
                     </View>

                    </View>
                    <View style  ={{flexDirection:'row'}}>
                     <Text style ={styles.header}>Sheduled Time : </Text>
                     <TextInput
                     style={styles.sheduledTime}
                     keyboardType = "numeric"
                     value={SheduledTime}
                     onChangeText={setSheduledTime}
                     />
                     <View style ={styles.DropDown2} >
                     <DropDownPicker
                     open= {UnitOpen1}
                     value= {unitValue1}
                     items={UnitItems1}
                     setOpen={setUnitOpen1}
                     setValue={setUnitValue1}
                     setItems={setUnitItems1}
                     placeholder='Am/Pm'
                     style = {{zIndex:1000}}
                     multiple = {false}

                     />
                     </View>
                    </View>
                     <TouchableOpacity  style = {{
                        width:125,
                        height:50,
                        justifyContent:'center',
                        marginTop:20,
                        marginLeft:150,
                        borderRadius:999,
                        backgroundColor:'skyblue',
                        
                     }} onPress={handleProperty}>
                        <Text style ={{textAlign:'center'}}>Add Task</Text>
                     </TouchableOpacity>
                </KeyboardAvoidingView> 
  )
                  
                  
}
const styles = StyleSheet.create({
   header:{
    margin:15,
    fontSize:16
   },
    text:{
   textAlign:'center'
},

allocatedTime: {
    width:100,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#F8F8FF",
    borderColor:"black",
    paddingHorizontal:5,
    fontSize: 16,
    textAlign:"center",
    marginTop:5, 
    marginLeft:0
},
sheduledTime:{
    width:100,
    height: 50,
    borderRadius: 20,
    backgroundColor:"#F8F8FF",
    paddingHorizontal:5,
    fontSize: 16,
    textAlign:"center",
    marginTop:5, 
    marginLeft:9

},
option:{
    width:125,
    height:50,
    justifyContent:'center',
    marginTop:5,
    marginLeft:10,
    borderRadius:999,
    backgroundColor:'white',
    color:'black',
    textAlign:'center'
},

Level:{
    width:125,
    height:50,
    justifyContent:'center',
    marginTop:5,
    marginLeft:10,
    borderRadius:999,
    backgroundColor:'white',
    color:'black',
    textAlign:'center'
},
DropDown:{
     width:90,
    //height: 0,
    borderRadius: 20,
    //backgroundColor: "grey",
    paddingHorizontal:5,
    fontSize: 16,
    textAlign:"center",
    marginTop:5, 
    marginLeft:10
},
DropDown2:{
    width:90,
    //height: 0,
    borderRadius: 20,
    //backgroundColor: "grey",
    paddingHorizontal:5,
    fontSize: 16,
    textAlign:"center",
    marginTop:5, 
    marginLeft:10
}
}
)