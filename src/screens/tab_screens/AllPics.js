import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Header from '../../components/header/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';


const db = SQLite.openDatabase({ name: 'imagedatabase.db' });

const AllPics = ({ navigation }) => {
  const [imageData, setImageData] = useState();
  

  useEffect(() => {
    fetchImageData();
  }, [imageData]);

  // console.log('check imagedata',imageData);

  const fetchImageData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, imageUri, month, day, caption, weatherData FROM images ORDER BY id DESC',
        [],
        (_, { rows }) => {
          const data = rows.raw();
          setImageData(data);
             

        }
      );
    });
  };
  const convertKelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

 

  const renderImageItem = ({ item }) => {

    const { weatherData,imageUri,month,day,caption  } = item;
    // console.log('check Item', item);
    const parsedWeatherData = JSON.parse(weatherData);
    const temperature = parsedWeatherData?.main?.temp.toFixed();
    const location = parsedWeatherData?.name;

    // console.log('check weather', imageUri);

    const handleImagePress = (item) => {
      navigation.navigate('ImageInfo', {
        imageUri:imageUri,
        month: month,
        day: day,
        caption: caption,
        temperature:temperature,
        location:location, // Make sure this property exists and has the correct value
      });
      
    };


    return (
      <TouchableOpacity onPress={handleImagePress}>

        <ImageBackground source={{ uri: item.imageUri }} style={styles.image}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.month}</Text>
            <Text style={styles.dateText}>{item.day}</Text>
          </View>
          <View style={styles.locationView}>
            <Text style={{ color: 'white' }} >{location}</Text>
          </View>
          <View style={styles.TemperatureView}>
            <Text style={{ color: 'white' }}>{convertKelvinToCelsius(temperature).toFixed(0) }°</Text>
          </View>
        </ImageBackground>

      </TouchableOpacity>
    );
  }


  return (
    <View style={styles.container}>

      <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'} />
      
        <Header />
      

      <FlatList
        data={imageData}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      {/* <TouchableOpacity style={styles.button} >
      <Ionicons name="folder-open" size={30} color="#00E3BA" />
      </TouchableOpacity> */}
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
  text: {
    fontSize: 16,
    marginTop: 10,
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
  button: {
    position: 'absolute',
    bottom: 20,
    right: 5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    
    
   
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AllPics;

// capture only one picture a day and can retake the picture but it will remove the previous one and also the TextInput text


