import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, Image, TextInput, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import Header from '../components/header/Header';



const db = SQLite.openDatabase({ name: 'imagedatabase.db', location: 'default' });

const AddImage = ({ route, navigation }) => {


  const { imageUri, month, day, day_string, year, latitude, longitude } = route.params;

  const [caption, setCaption] = useState('');
  const [weatherData, setWeatherData] = useState();
  const [temperature, setTemperature] = useState()


  console.log('cheking', temperature, weatherData);



  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async () => {
    try {
      const apiKey = '5e03769355967707f1c82a250e394137'; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

      const response = await fetch(apiUrl);
      const data = await response.json();
      // console.log('check weather', data.name);


      setWeatherData(data)

      const temp = data.main.temp
      setTemperature(temp)
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  };

  const saveDataToDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, imageUri TEXT, month TEXT, day TEXT, day_string TEXT, year TEXT, latitude TEXT, longitude TEXT, weatherData TEXT, caption TEXT, temperature TEXT)',
        []
      );
      tx.executeSql(
        'INSERT INTO images (imageUri, month, day, day_string, year, latitude, longitude, weatherData, caption,temperature) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)',
        [imageUri, month, day, day_string, year, latitude.toString(), longitude.toString(), JSON.stringify(weatherData), caption, temperature]
      );
    });
    console.log('check data', [imageUri, month, day, day_string, year, latitude, longitude, weatherData, caption, temperature]);
  };

  const handleSaveCaption = () => {
    saveDataToDatabase();

    navigation.goBack();
  };

  const convertKelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };


  return (
    <View style={styles.container}>

      <Header />

      <View >

        <ImageBackground source={{ uri: imageUri }} style={styles.image} >
          <View style={styles.overlay}>
            <Text style={styles.dateText}>{month}</Text>
            <Text style={styles.dateText}>{day}</Text>
          </View>
          {weatherData && (
            <View style={{ flex: 1 }}>
              <View style={styles.locationView}>
                <Text style={styles.dateText}>{weatherData.name},{weatherData.sys.country}</Text>
              </View>
              <View style={styles.TemperatureView}>
                <Text style={styles.dateText}>{convertKelvinToCelsius(temperature).toFixed(0)}°</Text>
              </View>
            </View>
          )}
        </ImageBackground>

        <TextInput
          style={styles.captionInput}
          placeholder="Type your thoughts..."
          placeholderTextColor={'grey'}
          value={caption}
          onChangeText={setCaption}
          autoCapitalize="sentences"
          multiline
          color={'black'}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCaption}>
          <Text style={styles.saveText}>Save</Text>
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
    marginBottom: 20,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
  },
  captionInput: {
    height: 60,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 1
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
  saveButton: {
    backgroundColor: '#00E3BA',
    borderRadius: 5,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddImage;

