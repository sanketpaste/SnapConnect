import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Alert, TextInput } from 'react-native';
import Header from '../components/header/Header';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'imagedatabase.db', location: 'default' });

const ImageInfo = ({ route, navigation }) => {
  const { imageUri, month, day, caption, location, temperature } = route.params;
  const [newCaption, setNewCaption] = useState(caption);

  const convertKelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const handleUpdateCaption = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE images SET caption = ? WHERE imageUri = ?',
        [newCaption, imageUri],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('Caption updated successfully');
            // Navigate back or perform any other action upon successful update
          } else {
            console.log('No image found to update caption');
          }
        },
        (_, error) => {
          console.error('Error updating caption:', error);
        }
      );
    });
  };

  const handleDeleteImage = () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteImageFromDatabase();
            navigation.goBack();
          },
          style: 'destructive'
        }
      ]
    );
  };

  const deleteImageFromDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM images WHERE imageUri = ?',
        [imageUri],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('Image deleted successfully');
          } else {
            console.log('No image found to delete');
          }
        },
        (_, error) => {
          console.error('Error deleting image:', error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'} />
      <Header />
      <TouchableOpacity >
        <ImageBackground source={{ uri: imageUri }} style={styles.image}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{month}</Text>
            <Text style={styles.dateText}>{day}</Text>
          </View>
          <View style={styles.locationView}>
            <Text style={{ color: 'white' }}>{location}</Text>
          </View>
          <View style={styles.TemperatureView}>
            <Text style={{ color: 'white' }}>{convertKelvinToCelsius(temperature).toFixed(0)}°</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.captionView}>
        <TextInput
          style={styles.captionText}
          value={newCaption}
          onChangeText={setNewCaption}
        />
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCaption}>
          <Text style={styles.updateButtonText}>Update Caption</Text>
        </TouchableOpacity>
      
      <View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  dateContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  dateText: {
    fontSize: 16,
    marginRight: 5,
    color: 'white',
    paddingHorizontal: 5,
  },
  locationView: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    paddingHorizontal: 5,
  },
  TemperatureView: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    paddingHorizontal: 5,
  },
  captionView: {
    padding: 20,
  },
  captionText: {
    fontSize: 18,
    marginBottom: 10,
    color:'#000'
  },
  updateButton: {
    backgroundColor: '#00E3BA',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderColor:'#000000',
    borderWidth:1,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderColor:'#000000',
    borderWidth:1
  },
  deleteText: {
    color: 'white',
    fontSize: 20,
  },
});

export default ImageInfo;
