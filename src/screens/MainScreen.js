import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import AllPics from './tab_screens/AllPics';
import CenterTab from './tab_screens/CenterTab';
import Summary from './tab_screens/Summary';
import CustomTabButton from '../components/CustomTabButton';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  const navigation = useNavigation();

  const handleCaptureImage = async () => {
    try {
      const cameraPermissionStatus = await check(PERMISSIONS.ANDROID.CAMERA);
      if (cameraPermissionStatus !== RESULTS.GRANTED) {
        const permissionRequestResult = await request(PERMISSIONS.ANDROID.CAMERA);
        if (permissionRequestResult !== RESULTS.GRANTED) {
          console.log('Camera permission not granted');
          return;
        }
      }
      const locationPermissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (locationPermissionStatus !== RESULTS.GRANTED) {
        const permissionRequestResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (permissionRequestResult !== RESULTS.GRANTED) {
          console.log('Location permission not granted');
          return;
        }
      }

      launchCamera({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
          console.log('Image capture cancelled');
        } else if (response.error) {
          console.log('Image capture error:', response.error);
        } else {
          console.log('Captured image:', response.assets[0].uri);

          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude, } = position.coords;

              const currentDate = new Date();
              const currentMonth = currentDate.getMonth() + 1;
              const currentDay = currentDate.getDate();
              const currentDayString = currentDate.getDay();
              const currentYear = currentDate.getFullYear();

              navigation.navigate('AddImage', {
                imageUri: response.assets[0].uri,
                month: getMonthString(currentMonth),
                day: currentDay,
                latitude,
                longitude,
                day_string: getDayString(currentDayString),
                year: currentYear,

              });

            },
            (error) => {
              if (error.code === 3) {
                console.log('Geolocation error: Timeout');
              } else {
                console.log('Geolocation error:', error);
              }
            },
          );
        }
      });
    } catch (err) {
      console.warn('Camera permission error:', err);
    }
  };
  const handleSelectImage = async () => {
    try {
      const galleryPermissionStatus = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (galleryPermissionStatus !== RESULTS.GRANTED) {
        const permissionRequestResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (permissionRequestResult !== RESULTS.GRANTED) {
          console.log('Gallery permission not granted');
          return;
        }
      }
      launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
          console.log('Image selection cancelled');
        } else if (response.error) {
          console.log('Image selection error:', response.error);
        } else {
          console.log('Selected image:', response.assets[0].uri);

          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              const currentDate = new Date();
              const currentMonth = currentDate.getMonth() + 1;
              const currentDay = currentDate.getDate();
              const currentDayString = currentDate.getDay();
              const currentYear = currentDate.getFullYear();

              navigation.navigate('AddImage', {
                imageUri: response.assets[0].uri,
                month: getMonthString(currentMonth),
                day: currentDay,
                latitude,
                longitude,
                day_string: getDayString(currentDayString),
                year: currentYear,
              });
            },
            (error) => {
              if (error.code === 3) {
                console.log('Geolocation error: Timeout');
              } else {
                console.log('Geolocation error:', error);
              }
            },
          );
        }
      });
    } catch (err) {
      console.warn('Gallery permission error:', err);
    }
  };


  const getDayString = (dayNumber) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayNumber];
  };

  const getMonthString = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1];
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'AllPics') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Summary') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00E3BA'
        })}
      >
        <Tab.Screen
          name="AllPics"
          component={AllPics}
          options={{
            tabBarShowLabel: false,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="CenterTab"
          component={CenterTab}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => (
              <CustomTabButton {...props} onPress={handleCaptureImage}>
                <Ionicons name="aperture-outline" size={30} color="#00E3BA" />
              </CustomTabButton>
            )
          }}
        />
        <Tab.Screen
          name="Summary"
          component={Summary}
          options={{
            tabBarShowLabel: false,
            headerShown: false
          }}
        />
      </Tab.Navigator>
      <View style={{ position: 'absolute', top: 20, right: 20, }}>
        <TouchableOpacity style={styles.galleryButtton} onPress={handleSelectImage} >
          <Ionicons name="folder-open" size={30} color="#00E3BA" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreen;


const styles = StyleSheet.create({
  galleryButtton:{
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
