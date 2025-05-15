import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const JOURNAL_FOLDER = FileSystem.documentDirectory + 'JournalEntries/';

export default function JournalScreen() {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const filePath = `${JOURNAL_FOLDER}${today}.json`;

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      const folderInfo = await FileSystem.getInfoAsync(JOURNAL_FOLDER);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(JOURNAL_FOLDER, { intermediates: true });
      }
      const checkAndExportPreviousDay = async () => {
  const lastDate = await AsyncStorage.getItem('lastSavedDate');
  const today = new Date().toISOString().split('T')[0];

  if (lastDate && lastDate !== today) {
    const previousFilePath = `${JOURNAL_FOLDER}${lastDate}.json`;
    const destinationPath = FileSystem.documentDirectory + `../Download/${lastDate}.json`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(previousFilePath);
      if (fileInfo.exists) {
        await FileSystem.copyAsync({
          from: previousFilePath,
          to: destinationPath,
        });
        console.log(`Exported ${lastDate}.json to Downloads`);
      }
    } catch (err) {
      console.log('Export error:', err);
    }
  }

  // Save today's date as last saved
  await AsyncStorage.setItem('lastSavedDate', today);
};

checkAndExportPreviousDay();
      loadTodayEntries();
    })();
  }, []);

  const loadTodayEntries = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(filePath);
        const parsed = JSON.parse(content);
        setEntries(Array.isArray(parsed) ? parsed : []);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.log('Error loading entries:', err);
      setEntries([]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addJournalItem = async () => {
    if (!text && !imageUri) {
      Alert.alert('Empty', 'Please enter text or pick an image.');
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry = { time, text, image: imageUri };

    const updatedEntries = [...entries, newEntry];

    try {
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedEntries), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setEntries(updatedEntries);
      setText('');
      setImageUri(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to save journal.');
    }
  };

 /* const downloadImage = async (uri: string) => {
    try {
      const fileName = uri.split('/').pop();
      const newPath = FileSystem.cacheDirectory + fileName;
      await FileSystem.copyAsync({ from: uri, to: newPath });

      const asset = await MediaLibrary.createAssetAsync(newPath);
      await MediaLibrary.createAlbumAsync('Journal Images', asset, false);
      Alert.alert('Saved', 'Image saved to gallery.');
    } catch (err) {
      console.log('Download error:', err);
      Alert.alert('Error', 'Could not download image.');
    }
  };*/

  const deleteEntry = async (indexToDelete: number) => {
    const updatedEntries = entries.filter((_, index) => index !== indexToDelete);
    try {
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedEntries), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setEntries(updatedEntries);
    } catch (err) {
      console.log('Delete error:', err);
      Alert.alert('Error', 'Failed to delete entry.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Daily Journal - {today}</Text>

      <TextInput
        style={styles.textInput}
        multiline
        placeholder="What's on your mind?"
        value={text}
        onChangeText={setText}
      />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      )}

      <Button title="Pick Image" onPress={pickImage} />
      <View style={{ height: 10 }} />
      <Button title="Add to Journal" onPress={addJournalItem} />

      <Text style={styles.subHeading}>Today's Entries:</Text>

      {entries.map((item, index) => (
        <View key={index} style={styles.entry}>
          <Text style={styles.time}>{item.time}</Text>
          {item.text ? <Text style={styles.entryText}>{item.text}</Text> : null}
          {item.image ? (
            <>
              <Image source={{ uri: item.image }} style={styles.entryImage} resizeMode="cover" />
              <View style={styles.buttonRow}>

                <View style ={{alignItems:'center',}} >
                <TouchableOpacity
                  style={[styles.entryButton, { backgroundColor: '#e74c3c' }]}
                  onPress={() => deleteEntry(index)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    minHeight: 100,
    marginBottom: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  entry: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
  },
  time: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 6,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal:10,
    borderRadius:10,
    marginHorizontal: 160,
    
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});