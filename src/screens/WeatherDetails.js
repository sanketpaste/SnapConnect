import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar,ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Header from '../components/header/Header';

const db = SQLite.openDatabase({ name: 'imagedatabase.db', location: 'default' });

const WeatherDetails = () => {
  const [weather, setWeather] = useState([]);
  const [daysRecorded, setDaysRecorded] = useState(0);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, month, day, day_string, year, temperature FROM images GROUP BY day, month, year ORDER BY id DESC LIMIT 5',
        [],
        (_, { rows }) => {
          const data = rows.raw();
          setWeather(data);
          setDaysRecorded(data.length);
        }
      );
    });
  };
  

  const renderWeatherDetails = () => {
    return weather.map((item, index) => (
      <View key={index} style={styles.dateView}>
        <Text style={styles.text}>Day {index + 1}</Text>
        <Text style={styles.date}>
          {item.day_string} {item.month} {item.day}, {item.year}
        </Text>
        <Text style={styles.description}>Temperature: {Math.floor(item.temperature - 273.15)}°C</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'} />
      <View style={{ height: 70,  }}>
        <Header />
      </View>
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.dateView}>
          <Text style={styles.text}>Days Recorded</Text>
          <Text style={styles.date}>{daysRecorded}</Text>
        </View>
        {renderWeatherDetails()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateView: {
    marginTop: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
  date: {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 10,
  },
});

export default WeatherDetails;
