import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'imagedatabase.db', location: 'default' });

const PerDayImages = ({ route }) => {
  const { day, month, year } = route.params;
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM images WHERE day = ? AND month = ? AND year = ?',
        [day, month, year],
        (_, { rows }) => {
          const imageList = rows.raw();
          setImages(imageList);
        }
      );
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{day}/{month}/{year}</Text>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  dateText: {
    fontSize: 20,
    marginBottom: 10,
    color:'black'
  },
  flatListContent: {
    alignItems: 'center',
  },
  imageContainer: {
    margin: 5,
  },
  image: {
    width: Dimensions.get('window').width / 3 - 10,
    height: Dimensions.get('window').width / 3 - 10,
    resizeMode: 'cover',
  },
});

export default PerDayImages;