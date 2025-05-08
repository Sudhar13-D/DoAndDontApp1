import { Image, StyleSheet, Platform , Button, Alert ,TextInput,View, TouchableOpacity,Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {RootStackParamList} from '@/app/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Link } from 'expo-router';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DoDont() {
    const navigation = useNavigation<NavigationProp>();
return(
    
    <View style ={{flex: 1,backgroundColor: 'white'}} >
    <Text style = {{textAlign:'center',marginTop:50}}> 
        Hi Sudhar!!
    </Text>
    <Text style = {{textAlign:'center',marginTop:8}}>Welcome to Do's &Dont 
        </Text>
    <TextInput style = {styles.motivQouteContainer} 
    placeholder="Today's Motivational Quotes!!"/>
    <View style = {styles.doButton} >
      <Link href ="../DoDont/DoList" asChild>
    <TouchableOpacity 
  style={styles.containerButton}>
  <Text style={{ textAlign: 'center' }}>Do</Text>
</TouchableOpacity>
</Link>

    </View>
    <View style = {styles.dontButton}>
      <Link href ="../DoDont/DontList" asChild>
    <TouchableOpacity 
        style = {styles.containerButton2}>
     <Text style ={{textAlign:'center'}} >Don't</Text>
    </TouchableOpacity>
    </Link>
   </View>
   <View style = {styles.Nooftaskcompleted}>
     <Text>No of task completed</Text>
   </View>

  </View>
  );
}

const styles = StyleSheet.create({
  motivQouteContainer: {
    margin: 16,
    padding: 80,
    borderRadius: 20,
    textAlign: 'center',
    fontSize:16,
    backgroundColor: 'orange',
  },
  containerButton: {
    width: 200,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 50,
    fontWeight: 'bold',
  },
  containerButton2: {
    width: 200,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 50,
    fontWeight: 'bold',
  },
  containerButton3: {
    width: 50,
    height: 50,
    borderRadius: 999,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 25,
    fontWeight: '300',
  },
  doButton: {
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  dontButton: {
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  Nooftaskcompleted:{
    marginTop:50,
    margin:17.5,
    width:400,
    height:200,
    borderRadius:20,
    backgroundColor:"grey",
    textAlign:"center",
    alignItems:"center",
    justifyContent:"center"
    
  }
});
