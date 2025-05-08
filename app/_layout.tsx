import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
  <Stack.Screen name = "index" options={{title:"HomeScreen"}}/>
  <Stack.Screen name = "DoDont" options={{title:"Do's and Dont"}}/>
  <Stack.Screen name = "DoList" options={{title:"Do List"}}/>
  <Stack.Screen name = "DontList" options={{title:"Dont List"}}/>
  <Stack.Screen name = "goal" options={{title:"Goal"}}/>
  <Stack.Screen name = "journal" options={{title:"Journal"}}/>

  </Stack>;
}
