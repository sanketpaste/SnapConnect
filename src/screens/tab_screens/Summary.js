import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Header from '../../components/header/Header';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase({ name: 'imagedatabase.db', location: 'default' });

const Summary = () => {
  const [imageCounts, setImageCounts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchImageCounts();
  }, [imageCounts]);

  const fetchImageCounts = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) AS count, day, month, year FROM images GROUP BY day, month, year ORDER BY year DESC, month DESC, day DESC',
        [],
        (_, { rows }) => {
          const counts = rows.raw();
          // Reversing the order of fetched data to show the latest day's record at the top
          counts.reverse();
          setImageCounts(counts);
        }
      );
    });
  };

  const renderCountItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleDayPress(item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.text}>{item.day}/{item.month}/{item.year}</Text>
          <Text style={styles.text}>{item.count} Images</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDayPress = (item) => {
    navigation.navigate('Day Images', { day: item.day, month: item.month, year: item.year });
  };

  const goToWeatherDetails = () => {
    navigation.navigate('WeatherDetails');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'} />
      <Header />
      <FlatList
        data={imageCounts}
        renderItem={renderCountItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.button} onPress={goToWeatherDetails}>
        <Text style={styles.buttonText}>Weather Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: '#00E3BA',
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 5,
    backgroundColor: '#00E',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'green',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
});

export default Summary;
